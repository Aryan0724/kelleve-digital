<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Requirement;
use App\Models\OpportunityType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OpportunityProjectController extends Controller
{
    use \App\Traits\ApiResponse, \App\Traits\ParsesBudget;

    public function index(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        $isAdmin = $user && in_array('admin', $user->roles->pluck('slug')->toArray());

        $earlyAccessHours = null; // null = standard delay (no early access)
        if ($user && !$isAdmin) {
            $plan = app(\App\Services\EntitlementService::class)->getActivePlan($user);
            $earlyAccessHours = $plan?->early_lead_access_hours; // null/0/N
        }

        // Delay semantics:
        //   early_lead_access_hours = null  → no early access; show leads after full system delay
        //   early_lead_access_hours = 0     → immediate access; show leads with zero delay (Elite)
        //   early_lead_access_hours = N     → N hours of early access; delay = systemMax - N
        // Admin sees everything immediately.
        $maxSystemEarlyAccess = \Illuminate\Support\Facades\Cache::remember('max_early_access', 3600, function () {
            // Max among Professional-tier plans (excluding 0/null which represent special semantics)
            return \App\Models\SubscriptionPlan::where('is_active', true)
                ->where('is_archived', false)
                ->whereNotNull('early_lead_access_hours')
                ->where('early_lead_access_hours', '>', 0)
                ->max('early_lead_access_hours') ?? 2;
        });

        if ($isAdmin || $earlyAccessHours === 0) {
            // Admin or Elite (explicit immediate): zero delay
            $delayHours = 0;
        } elseif ($earlyAccessHours === null) {
            // Starter/Growth: standard delay = max system early access
            $delayHours = $maxSystemEarlyAccess;
        } else {
            // Professional (N hours early): delay = systemMax - N
            $delayHours = max(0, $maxSystemEarlyAccess - $earlyAccessHours);
        }

        $projects = Requirement::where(function($q) {
                $q->whereNull('opportunity_type')
                  ->orWhereNotIn('opportunity_type', ['JOB', 'WORKER_JOB', 'RFQ']);
            })
            ->whereDoesntHave('category', function($q) {
                $q->where('slug', 'workers');
            })
            ->when(!$isAdmin && $delayHours > 0, function($q) use ($delayHours) {
                $q->where('created_at', '<=', now()->subHours($delayHours));
            })
            ->latest()
            ->paginate($request->get('per_page', 20));

        $user = Auth::guard('sanctum')->user();
        $isAdmin = $user && in_array('admin', $user->roles->pluck('slug')->toArray());

        $unlockedProjectIds = [];
        if ($user && !$isAdmin) {
            $unlockedProjectIds = \App\Models\ContactUnlock::where('user_id', $user->id)
                ->whereIn('requirement_type', ['Project', 'Requirement', 'App\Models\Requirement', 'App\Models\Project'])
                ->pluck('requirement_id')
                ->toArray();
        }

        $projects->getCollection()->transform(function ($req) use ($user, $isAdmin, $unlockedProjectIds) {
            $req->is_unlocked = false;
            
            if ($user && in_array($req->id, $unlockedProjectIds)) {
                $req->is_unlocked = true;
            }
            if ($user && $user->id === $req->user_id) {
                $req->is_unlocked = true;
            }
            if ($isAdmin) {
                $req->is_unlocked = true;
            }

            if (!$req->is_unlocked) {
                $req->phone = $req->phone ? substr($req->phone, 0, 2) . '********' : null;
                $req->email = '********';
                $req->name = '***';
            }
            return $req;
        });
            
        return response()->json([
            'success' => true,
            'data' => $projects->items(),
            'meta' => [
                'current_page' => $projects->currentPage(),
                'per_page'     => $projects->perPage(),
                'total'        => $projects->total(),
                'last_page'    => $projects->lastPage(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'description'      => 'required|string',
            'city'             => 'required|string',
            'district'         => 'required|string',
            'opportunity_type' => 'required|string',
            'requirement_type' => 'required|string',
            'project_category' => 'nullable|string',
            'budget_min'       => 'nullable|numeric',
            'budget_max'       => 'nullable|numeric',
            'budget'           => 'nullable|string',
            'image'            => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'images'           => 'nullable|array|max:5',
            'images.*'         => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $user = Auth::user();
        if (!$user) {
            return $this->error('Unauthenticated', 401);
        }

        // Parse budget string if budget_min/max are not provided
        $budgetMin = $validated['budget_min'] ?? null;
        $budgetMax = $validated['budget_max'] ?? null;
        $this->parseBudget($validated['budget'] ?? null, $budgetMin, $budgetMax);

        // Resolve target roles from OpportunityType config
        $oppType = OpportunityType::where('type', $validated['requirement_type'])->first();

        $creatorRole = 'homeowner';
        if ($user->roles()->exists()) {
            $firstRole = $user->roles()->first();
            if ($firstRole) {
                $creatorRole = $firstRole->slug;
            }
        }

        $requirement = \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $user, $budgetMin, $budgetMax, $creatorRole, $oppType, $request) {
            // Resolve category_id dynamically from requirement_type
            $reqTypeSlugMap = [
                'INTERIOR_DESIGN' => 'interior-designers',
                'RENOVATION'      => 'interior-designers',
                'ARCHITECT'       => 'architects',
                'ARCHITECTURE'    => 'architects',
                'CONSTRUCTION'    => 'contractors',
                'FURNITURE'       => 'furniture',
                'BUILDER_PROJECT' => 'builders',
                'MATERIALS'       => 'material-suppliers',
                'RFQ'             => 'material-suppliers',
                'JOB'             => 'skilled-workers',
                'WORKER_JOB'      => 'skilled-workers',
            ];
            $reqTypeUpper = strtoupper($validated['requirement_type'] ?? '');
            $targetSlug   = $reqTypeSlugMap[$reqTypeUpper] ?? null;
            $categoryId   = null;
            if ($targetSlug) {
                $categoryId = \App\Models\Category::where('slug', $targetSlug)->value('id');
            }
            // Fallback: first available category
            if (!$categoryId) {
                $categoryId = \App\Models\Category::value('id');
            }

            $req = Requirement::create([
                'user_id'          => $user->id,
                'category_id'      => $categoryId, // Dynamically resolved from requirement_type
                'title'            => $validated['title'],
                'description'      => $validated['description'],
                'city'             => $validated['city'],
                'district'         => $validated['district'],
                'project_type'     => $validated['project_category'] ?? 'general',
                'name'             => $user->name,
                'phone'            => $user->phone ?? '0000000000',
                'email'            => $user->email,
                'opportunity_type' => $validated['opportunity_type'],
                'requirement_type' => $validated['requirement_type'],
                'project_category' => $validated['project_category'] ?? null,
                'budget_min'       => $budgetMin,
                'budget_max'       => $budgetMax,
                'creator_role'     => $creatorRole,
                'target_roles'     => $oppType ? $oppType->target_roles : ['interior_designer', 'contractor', 'builder'],
                'status'           => 'open',
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $file) {
                    $path = \App\Helpers\ImageHelper::toStoragePath($file, 'requirements');
                    
                    if ($index === 0) {
                        $req->image = $path;
                        $req->save();
                    }
                    
                    \App\Models\RequirementImage::create([
                        'requirement_id' => $req->id,
                        'image_url' => $path,
                    ]);
                }
            } elseif ($request->hasFile('image')) {
                $file = $request->file('image');
                $path = \App\Helpers\ImageHelper::toStoragePath($file, 'requirements');
                $req->image = $path;
                $req->save();

                \App\Models\RequirementImage::create([
                    'requirement_id' => $req->id,
                    'image_url' => $path,
                ]);
            }

            return $req;
        });

        // Dispatch instant lead notifications to active subscription holders
        try {
            $subscribers = \App\Models\User::where('id', '!=', $user->id)
                ->whereHas('activeSubscription.plan', function($q) {
                    $q->where('lead_notification_type', 'instant')
                      ->orWhere('slug', '!=', 'starter');
                })
                ->get();

            foreach ($subscribers as $subscriber) {
                $subscriber->notify(new \App\Notifications\NewLeadNotification([
                    'title' => $requirement->title,
                    'city'  => $requirement->city ?? 'your area',
                    'id'    => $requirement->id,
                    'type'  => $requirement->opportunity_type ?? 'PROJECT',
                ]));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Could not dispatch new lead notifications: " . $e->getMessage());
        }

        return $this->success($requirement, 'Requirement created successfully', 201);
    }

    public function show(string $id)
    {
        $requirement = Requirement::with(['user', 'bids.professional'])->findOrFail($id);

        $user = Auth::guard('sanctum')->user();
        
        // Unauthenticated users get a basic public view
        if (!$user) {
            $requirement->increment('views_count');
            $requirement->views_count = $requirement->views_count + 1;
            return $this->success($requirement);
        }

        $userRoles = $user->roles->pluck('slug')->toArray();
        $isCreator = $requirement->user_id === $user->id;
        $isAdmin   = in_array('admin', $userRoles);

        if (!$isAdmin) {
            $requirement->increment('views_count');
            $requirement->views_count = $requirement->views_count + 1;
        }

        // Creator can always see their own requirement
        if ($isCreator || $isAdmin) {
            $requirement->is_unlocked = true;
            return $this->success($requirement);
        }

        $isTarget = false;
        if ($requirement->target_roles) {
            foreach ($userRoles as $role) {
                if (in_array($role, $requirement->target_roles)) {
                    $isTarget = true;
                    break;
                }
            }
        } else {
            $isTarget = true;
        }

        if (!$isTarget) {
            return $this->error('Forbidden. This opportunity is not available for your role.', 403);
        }

        $requirement->is_unlocked = $requirement->isUnlockedBy($user);
        $requirement->has_bid = $requirement->bids()->where('professional_id', $user->id)->exists();

        if (!$requirement->is_unlocked) {
            $requirement->phone = substr($requirement->phone, 0, 2) . '********';
            $requirement->email = '********';
            $requirement->name = '***';
        }

        return $this->success($requirement);
    }

    public function update(Request $request, string $id)
    {
        $requirement = Requirement::findOrFail($id);
        
        $user = Auth::user();
        $isAdmin = in_array('admin', $user->roles->pluck('slug')->toArray());
        if ($user->id !== $requirement->user_id && !$isAdmin) {
            return $this->error('Unauthorized', 403);
        }

        if ($requirement->status !== 'open') {
            return $this->error('Cannot edit an awarded or closed project', 409);
        }

        $requirement->update($request->only([
            'title', 'description', 'city', 'district', 'category_id', 'sub_category_id',
            'budget_min', 'budget_max', 'timeline_days'
        ]));
        return $this->success($requirement, 'Requirement updated successfully');
    }

    public function updateProgress(Request $request, string $id)
    {
        $requirement = Requirement::findOrFail($id);
        $user        = Auth::user();

        $isAdmin = in_array('admin', $user->roles->pluck('slug')->toArray());
        $isProfessional = ($user->id === $requirement->professional_id) || ($user->id === $requirement->awarded_vendor_id);

        if (!$isAdmin && !$isProfessional) {
            return $this->error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:open,awarded,in_progress,completed,expired',
        ]);

        $requirement->status = $validated['status'];
        $requirement->save();

        return $this->success($requirement, 'Progress updated successfully');
    }

    public function complete(Request $request, string $id)
    {
        $requirement = Requirement::findOrFail($id);
        $user        = Auth::user();

        if ($user->id !== $requirement->user_id) {
            return $this->error('Only the client can complete the project', 403);
        }

        $requirement->status       = 'completed';
        $requirement->completed_at = now();
        $requirement->save();

        return $this->success($requirement, 'Project completed');
    }

    public function destroy(string $id)
    {
        $requirement = Requirement::findOrFail($id);
        
        $user = Auth::user();
        $isAdmin = in_array('admin', $user->roles->pluck('slug')->toArray());
        if ($user->id !== $requirement->user_id && !$isAdmin) {
            return $this->error('Unauthorized', 403);
        }

        $requirement->delete();
        return $this->success(null, 'Requirement deleted');
    }
}
