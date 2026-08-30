<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Builder;
use App\Models\Listing;
use App\Models\Supplier;
use App\Models\Worker;
use App\Services\TrustScoreService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProfessionalProfileController extends Controller
{
    /**
     * Helper to determine the broad profile type for a given role slug.
     */
    protected function getProfileType(string $role): string
    {
        // All roles that map to the "listing" profile (business/professional types)
        $listingRoles = [
            'interior_designer', 'interior_company', 'interior_contractor',
            'modular_kitchen_designer', 'wardrobe_designer', '2d_3d_designer', 'space_planner',
            'architect', 'structural_engineer', 'civil_engineer', 'mep_consultant',
            'landscape_designer', 'vastu_consultant',
            'contractor', 'civil_contractor', 'turnkey_contractor',
            'renovation_contractor', 'demolition_contractor',
            'home_renovation', 'waterproofing', 'pest_control', 'deep_cleaning',
            'cctv_security', 'home_automation', 'solar_installation', 'ac_installation',
            'packers_movers', 'interior_material_transport', 'equipment_rental',
            'interior_project_consultant',
            'business', // legacy
        ];

        // Roles that map to the "worker" profile
        $workerRoles = [
            'worker', 'skilled_worker',
            'carpenter', 'electrician', 'plumber', 'painter',
            'pop_false_ceiling_worker', 'tile_marble_fitter', 'granite_installer',
            'fabricator', 'aluminium_fabricator', 'glass_installer',
            'welder', 'polish_worker', 'wallpaper_installer',
        ];

        // Roles that map to the "supplier" profile
        $supplierRoles = [
            'supplier', 'material_supplier',
            'plywood_dealer', 'laminate_dealer', 'tile_dealer',
            'marble_granite_dealer', 'paint_dealer', 'hardware_supplier',
            'lighting_supplier', 'electrical_supplier', 'sanitary_bathroom_supplier',
            'modular_kitchen_material_supplier', 'glass_supplier',
            'acp_aluminium_supplier', 'furniture_supplier', 'door_window_supplier',
        ];

        // Roles that map to the "builder" profile
        $builderRoles = [
            'builder', 'real_estate_developer',
            'apartment_project', 'commercial_project', 'villa_project',
        ];

        if (in_array($role, $listingRoles) || $role === 'admin') return 'listing';
        if (in_array($role, $workerRoles)) return 'worker';
        if (in_array($role, $supplierRoles)) return 'supplier';
        if (in_array($role, $builderRoles)) return 'builder';

        return 'none';
    }

    /**
     * Get the user's professional profile based on their role.
     */
    public function show(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            // BUG FIX: Use roles relationship (many-to-many), not $user->role column (doesn't exist)
            $userRoles = $user->roles->pluck('slug')->toArray();
            $role = $userRoles[0] ?? 'customer';

            $profile = null;
            $type = $this->getProfileType($role);

            if ($type === 'listing') {
                $tenantId = null;
                try {
                    $tenantId = app(\App\Core\Tenancy\TenantContext::class)->getTenantId();
                } catch (\Throwable $e) {}

                // Try tenant-scoped first, then fall back to user's any listing
                $profile = Listing::where('user_id', $user->id)
                    ->when($tenantId, fn($q, $tid) => $q->where('tenant_id', $tid))
                    ->with(['category', 'gallery'])
                    ->first()
                    ?? Listing::where('user_id', $user->id)
                    ->with(['category', 'gallery'])
                    ->first();

                // If user is a professional and has no listing record yet, auto-create one so their profile is immediately live
                if (!$profile && $role !== 'customer') {
                    $catId = \App\Models\Category::where('slug', 'interior-designers')->value('id') ?? \App\Models\Category::value('id') ?? 1;
                    $profile = Listing::create([
                        'tenant_id'   => $tenantId ?? 1,
                        'user_id'     => $user->id,
                        'category_id' => $catId,
                        'title'       => $user->name,
                        'slug'        => Str::slug($user->name) . '-' . Str::random(6),
                        'description' => 'Professional interior design and architectural services.',
                        'phone'       => $user->phone ?? '0000000000',
                        'city'        => $user->city ?? 'Patna',
                        'district'    => $user->district ?? 'Patna',
                        'state'       => 'Bihar',
                        'status'      => 'active',
                    ]);
                    $profile->load(['category', 'gallery']);
                }
            } elseif (in_array($type, ['worker', 'supplier', 'builder'])) {
                if ($type === 'worker') {
                    $profile = Worker::where('user_id', $user->id)->first();
                } elseif ($type === 'supplier') {
                    $profile = Supplier::where('user_id', $user->id)->first();
                } else {
                    $profile = Builder::where('user_id', $user->id)->first();
                }

                $listing = Listing::where('user_id', $user->id)->with(['category', 'gallery'])->first();
                if (!$listing) {
                    $catSlug = $type === 'worker' ? 'skilled-workers' : ($type === 'supplier' ? 'material-suppliers' : 'builders');
                    $catId = \App\Models\Category::where('slug', $catSlug)->value('id') ?? 1;
                    $sharedSlug = $profile?->slug ?: (Str::slug($user->name) . '-' . Str::random(6));
                    $listing = Listing::create([
                        'tenant_id'   => 1,
                        'user_id'     => $user->id,
                        'category_id' => $catId,
                        'title'       => $profile?->name ?? $profile?->company_name ?? $user->name,
                        'slug'        => $sharedSlug,
                        'description' => 'Professional ' . $type . ' services.',
                        'phone'       => $profile?->phone ?? $user->phone ?? '0000000000',
                        'city'        => $profile?->city ?? $user->city ?? 'Patna',
                        'district'    => $profile?->district ?? $user->district ?? 'Patna',
                        'state'       => 'Bihar',
                        'status'      => 'active',
                    ]);
                    $listing->load(['category', 'gallery']);
                }

                if ($profile && $listing) {
                    $profile->address = $listing->address;
                    $profile->description = $listing->description;
                    // Ensure profile slug matches listing slug for public routing
                    if ($listing->slug) {
                        $profile->slug = $listing->slug;
                    }
                } else {
                    $profile = $listing;
                }
            } else {
                $profile = Listing::where('user_id', $user->id)->with(['category', 'gallery'])->first();
                if ($profile) $type = 'listing';
            }

            return response()->json([
                'success' => true,
                'type'    => $type,
                'data'    => $profile
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('ProfessionalProfileController::show failed: ' . $e->getMessage(), [
                'user_id' => $request->user()?->id,
                'exception' => $e,
            ]);
            return response()->json([
                'success' => true,
                'type'    => 'none',
                'data'    => null,
            ]);
        }
    }

    /**
     * Update or create the professional profile based on user's role.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        // BUG FIX: Use roles relationship (many-to-many), not $user->role column (doesn't exist)
        $userRoles = $user->roles->pluck('slug')->toArray();
        $role = $userRoles[0] ?? 'interior_designer';
        $profile = null;
        $type = $this->getProfileType($role);

        if ($request->filled('website')) {
            $rawWebsite = trim($request->input('website'));
            if (!empty($rawWebsite) && !preg_match('#^https?://#i', $rawWebsite)) {
                $request->merge(['website' => 'https://' . $rawWebsite]);
            }
        }

        if ($type === 'listing' || $type === 'none') {
            $data = $request->validate([
                'title'            => ['nullable', 'string', 'max:255'],
                'tagline'          => ['nullable', 'string', 'max:255'],
                'description'      => ['nullable', 'string', 'max:5000'],
                'phone'            => ['nullable', 'string', 'max:20'],
                'city'             => ['nullable', 'string', 'max:100'],
                'district'         => ['nullable', 'string', 'max:100'],
                'address'          => ['nullable', 'string'],
                'website'          => ['nullable', 'url'],
                'years_experience' => ['nullable', 'integer'],
                'team_size'        => ['nullable', 'integer'],
                'gst_number'       => ['nullable', 'string', 'max:50'],
                'pan_number'       => ['nullable', 'string', 'max:50'],
                'category_id'      => ['nullable', 'exists:categories,id'],
                'services'         => ['nullable'],
                'keywords'         => ['nullable'],
                'achievements'     => ['nullable'],
                'availability'     => ['nullable', 'string', 'max:255'],
                'response_time'    => ['nullable', 'string', 'max:255'],
                'languages'        => ['nullable'],
                'social_links'     => ['nullable'],
                'avatar'           => ['nullable', 'string'],
                'cover_image'      => ['nullable', 'string'],
            ]);

            if (!empty($data['avatar'])) {
                $user->update(['avatar' => $data['avatar']]);
            }
            if (!empty($data['cover_image'])) {
                $user->update(['cover_image' => $data['cover_image']]);
            }

            // Ensure title & description are fallback-populated if missing
            $data['title'] = $data['title'] ?? $request->input('name') ?? $request->input('company_name') ?? $user->name;
            $data['description'] = $data['description'] ?? $request->input('bio') ?? $request->input('tagline') ?? 'Professional interior design and architectural services.';
            $data['phone'] = $data['phone'] ?? $user->phone;
            $data['city'] = $data['city'] ?? $user->city ?? 'Patna';
            $data['district'] = $data['district'] ?? $user->district ?? 'Patna';

            $listing = Listing::firstOrNew(['user_id' => $user->id]);
            $listing->fill(array_filter($data, fn($v) => !is_null($v)));
            if (!empty($data['cover_image'])) {
                $listing->cover_image = $data['cover_image'];
            }
            $listing->title = $data['title'];
            $listing->slug = $listing->slug ?: (Str::slug($data['title']) . '-' . Str::random(6));
            if (!$listing->exists) {
                $listing->state = 'Bihar';
                $listing->status = 'active';
                $listing->tenant_id = app(\App\Core\Tenancy\TenantContext::class)->getTenantId() ?? 1;
                // BUG FIX: Don't hardcode category_id=1; resolve from user role
                $listing->category_id = \App\Models\Category::where('slug', 'interior-designers')->value('id')
                    ?? \App\Models\Category::value('id');
            }
            $listing->save();
            $profile = $listing;
            $type = 'listing';

        } elseif ($type === 'worker') {
            $data = $request->validate([
                'name'             => ['nullable', 'string', 'max:255'],
                'skill'            => ['nullable', 'string', 'max:255'],
                'experience_years' => ['nullable', 'integer'],
                'daily_rate'       => ['nullable', 'numeric'],
                'bio'              => ['nullable', 'string'],
                'phone'            => ['nullable', 'string', 'max:20'],
                'city'             => ['nullable', 'string', 'max:100'],
                'district'         => ['nullable', 'string', 'max:100'],
                'address'          => ['nullable', 'string'],
                'services'         => ['nullable'],
                'achievements'     => ['nullable'],
                'availability'     => ['nullable', 'string', 'max:255'],
                'response_time'    => ['nullable', 'string', 'max:255'],
                'languages'        => ['nullable'],
                'social_links'     => ['nullable'],
            ]);

            $existingListing = Listing::withoutGlobalScopes()->where('user_id', $user->id)->first();
            $worker = Worker::firstOrNew(['user_id' => $user->id]);
            $worker->fill(array_filter($data, fn($v) => !is_null($v)));
            
            // Provide defaults for required fields to prevent PDO exceptions
            $worker->name = $data['name'] ?? $worker->name ?? $user->name ?? 'Professional Worker';
            $worker->phone = $data['phone'] ?? $worker->phone ?? $user->phone ?? '0000000000';
            $worker->city = $data['city'] ?? $worker->city ?? $user->city ?? 'Patna';
            $worker->district = $data['district'] ?? $worker->district ?? $user->district ?? 'Patna';
            $worker->skill = $data['skill'] ?? $worker->skill ?? 'Unspecified';
            
            $sharedSlug = $worker->slug ?: ($existingListing?->slug ?: (Str::slug($worker->name) . '-' . Str::random(6)));
            $worker->slug = $sharedSlug;
            $worker->status = 'active';
            $worker->save();
            $profile = $worker;

            // Sync to Listing model for public profile visibility
            $listing = $existingListing ?? Listing::firstOrNew(['user_id' => $user->id]);
            $listing->title = $worker->name;
            $listing->description = $data['bio'] ?? 'Skilled worker profile.';
            $listing->phone = $worker->phone;
            $listing->city = $worker->city;
            $listing->district = $worker->district;
            $listing->address = $data['address'] ?? $user->address;
            $listing->services = $data['services'] ?? (!empty($data['skill']) ? [$data['skill']] : []);
            $listing->status = 'active';
            $listing->slug = $sharedSlug;
            if (!$listing->exists) {
                $listing->tenant_id = app(\App\Core\Tenancy\TenantContext::class)->getTenantId() ?? 1;
                // BUG FIX: Don't hardcode category_id=1
                $listing->category_id = \App\Models\Category::where('slug', 'skilled-workers')->value('id')
                    ?? \App\Models\Category::value('id');
                $listing->state = 'Bihar';
            }
            $listing->save();

        } elseif ($type === 'supplier') {
            $data = $request->validate([
                'company_name'     => ['nullable', 'string', 'max:255'],
                'tagline'          => ['nullable', 'string', 'max:255'],
                'description'      => ['nullable', 'string', 'max:5000'],
                'phone'            => ['nullable', 'string', 'max:20'],
                'city'             => ['nullable', 'string', 'max:100'],
                'district'         => ['nullable', 'string', 'max:100'],
                'address'          => ['nullable', 'string'],
                'gst_number'       => ['nullable', 'string'],
                'pan_number'       => ['nullable', 'string'],
                'services'         => ['nullable'],
                'achievements'     => ['nullable'],
                'availability'     => ['nullable', 'string', 'max:255'],
                'response_time'    => ['nullable', 'string', 'max:255'],
                'languages'        => ['nullable'],
                'social_links'     => ['nullable'],
            ]);

            $existingListing = Listing::withoutGlobalScopes()->where('user_id', $user->id)->first();
            $supplier = Supplier::firstOrNew(['user_id' => $user->id]);
            $supplier->fill(array_filter($data, fn($v) => !is_null($v)));
            $sharedSlug = $supplier->slug ?: ($existingListing?->slug ?: (Str::slug($data['company_name'] ?? $user->name) . '-' . Str::random(6)));
            $supplier->slug = $sharedSlug;
            $supplier->status = 'active';
            $supplier->email = $user->email;
            $supplier->save();
            $profile = $supplier;

            // Sync to Listing model for public profile visibility
            $listing = $existingListing ?? Listing::firstOrNew(['user_id' => $user->id]);
            $listing->title = $data['company_name'] ?? $user->name;
            $listing->description = $data['description'] ?? $data['tagline'] ?? 'Material supplier.';
            $listing->phone = $data['phone'] ?? $user->phone;
            $listing->city = $data['city'] ?? $user->city ?? 'Patna';
            $listing->district = $data['district'] ?? $user->district ?? 'Patna';
            $listing->address = $data['address'] ?? $user->address;
            $listing->services = $data['services'] ?? [];
            $listing->status = 'active';
            $listing->slug = $sharedSlug;
            if (!$listing->exists) {
                $listing->tenant_id = app(\App\Core\Tenancy\TenantContext::class)->getTenantId() ?? 1;
                // BUG FIX: Don't hardcode category_id=1
                $listing->category_id = \App\Models\Category::where('slug', 'material-suppliers')->value('id')
                    ?? \App\Models\Category::value('id');
                $listing->state = 'Bihar';
            }
            $listing->save();

        } elseif ($type === 'builder') {
            $data = $request->validate([
                'company_name'     => ['nullable', 'string', 'max:255'],
                'tagline'          => ['nullable', 'string', 'max:255'],
                'description'      => ['nullable', 'string', 'max:5000'],
                'phone'            => ['nullable', 'string', 'max:20'],
                'city'             => ['nullable', 'string', 'max:100'],
                'district'         => ['nullable', 'string', 'max:100'],
                'address'          => ['nullable', 'string'],
                'gst_number'       => ['nullable', 'string'],
                'pan_number'       => ['nullable', 'string'],
                'total_projects'   => ['nullable', 'integer'],
                'services'         => ['nullable'],
                'achievements'     => ['nullable'],
                'availability'     => ['nullable', 'string', 'max:255'],
                'response_time'    => ['nullable', 'string', 'max:255'],
                'languages'        => ['nullable'],
                'social_links'     => ['nullable'],
            ]);

            $existingListing = Listing::withoutGlobalScopes()->where('user_id', $user->id)->first();
            $builder = Builder::firstOrNew(['user_id' => $user->id]);
            $builder->fill(array_filter($data, fn($v) => !is_null($v)));
            $sharedSlug = $builder->slug ?: ($existingListing?->slug ?: (Str::slug($data['company_name'] ?? $user->name) . '-' . Str::random(6)));
            $builder->slug = $sharedSlug;
            $builder->status = 'active';
            $builder->email = $user->email;
            $builder->save();
            $profile = $builder;

            // Sync to Listing model for public profile visibility
            $listing = $existingListing ?? Listing::firstOrNew(['user_id' => $user->id]);
            $listing->title = $data['company_name'] ?? $user->name;
            $listing->description = $data['description'] ?? $data['tagline'] ?? 'Real estate developer.';
            $listing->phone = $data['phone'] ?? $user->phone;
            $listing->city = $data['city'] ?? $user->city ?? 'Patna';
            $listing->district = $data['district'] ?? $user->district ?? 'Patna';
            $listing->address = $data['address'] ?? $user->address;
            $listing->services = $data['services'] ?? [];
            $listing->status = 'active';
            $listing->slug = $sharedSlug;
            if (!$listing->exists) {
                $listing->tenant_id = app(\App\Core\Tenancy\TenantContext::class)->getTenantId() ?? 1;
                // BUG FIX: Don't hardcode category_id=1
                $listing->category_id = \App\Models\Category::where('slug', 'builders')->value('id')
                    ?? \App\Models\Category::value('id');
                $listing->state = 'Bihar';
            }
            $listing->save();
        }

        // Recalculate trust score after profile update
        app(TrustScoreService::class)->recalculateForUser($user);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'type'    => $type,
            'data'    => $profile,
        ]);
    }
}
