<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\RequirementResource;
use App\Models\Requirement;
use App\Models\RequirementImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use App\Models\User;
use App\Notifications\NewLeadNotification;

class RequirementController extends Controller
{
    /**
     * GET /api/v1/requirements
     * Shows leads — contact details masked for non-premium users.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Requirement::open()
            ->with(['category', 'images'])
            ->withCount('bids')
            ->latest();

        if ($request->filled('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }
        if ($request->filled('district')) {
            $query->byDistrict($request->district);
        }

        $requirements = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data'    => RequirementResource::collection($requirements),
            'meta'    => [
                'current_page' => $requirements->currentPage(),
                'per_page'     => $requirements->perPage(),
                'total'        => $requirements->total(),
                'last_page'    => $requirements->lastPage(),
            ],
        ]);
    }

    /**
     * GET /api/v1/requirements/{id}
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $requirement = Requirement::query()
            ->with(['category', 'images'])
            ->withCount('bids')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => new RequirementResource($requirement),
        ]);
    }

    /**
     * POST /api/v1/requirements
     * Authenticated homeowners can post requirements.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'            => ['required', 'string', 'max:255'],
            'description'      => ['required', 'string', 'max:2000'],
            'category_id'      => ['required', 'exists:categories,id'],
            'opportunity_type' => ['nullable', 'string', 'max:50'],
            'requirement_type' => ['nullable', 'string', 'max:50'],
            'project_category' => ['nullable', 'string', 'max:50'],
            'project_type'     => ['nullable', 'string', 'max:100'],
            'budget_min'       => ['nullable', 'numeric', 'min:0'],
            'budget_max'       => ['nullable', 'numeric', 'min:0'],
            'city'             => ['required', 'string', 'max:100'],
            'district'         => ['required', 'string', 'max:100'],
            'name'             => ['required', 'string', 'max:255'],
            'phone'            => ['required', 'string', 'max:20'],
            'email'            => ['nullable', 'email'],
            'images'           => ['nullable', 'array', 'max:5'],
            'images.*'         => ['url'],
            'target_roles'     => ['nullable', 'array'],
        ]);

        // Basic Rule-based Spam Detection: Block URLs in the description
        if (preg_match('/(http|https|www\.)/i', $data['description'])) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => [
                    'description' => ['Descriptions cannot contain links or URLs for security reasons.']
                ]
            ], 422);
        }

        // Auto-assign creator role if logged in
        $creatorRole = null;
        if ($request->user() && $request->user()->roles()->exists()) {
            $creatorRole = $request->user()->roles()->first()->slug;
        }

        $requirement = Requirement::create([
            ...$data,
            'creator_role' => $creatorRole,
            'user_id' => $request->user()?->id,
            'status'  => 'pending',
        ]);

        if (!empty($data['images'])) {
            foreach ($data['images'] as $url) {
                RequirementImage::create([
                    'requirement_id' => $requirement->id,
                    'image_url'      => $url,
                ]);
            }
        }

        Log::info("New requirement posted (Pending Verification): ID {$requirement->id} by user " . ($request->user()?->id ?? 'guest'));

        return response()->json([
            'success' => true,
            'message' => 'Your project requirement has been posted successfully.',
            'data'    => new RequirementResource($requirement->load('category', 'images')),
        ], 201);
    }

    /**
     * PUT/PATCH /api/v1/requirements/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $requirement = Requirement::findOrFail($id);
        if ($request->user()->id !== $requirement->user_id && $request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $data = $request->validate([
            'title'            => ['sometimes', 'string', 'max:255'],
            'description'      => ['sometimes', 'string', 'max:2000'],
            'opportunity_type' => ['sometimes', 'string', 'max:50'],
            'requirement_type' => ['sometimes', 'string', 'max:50'],
            'project_category' => ['sometimes', 'string', 'max:50'],
            'project_type'     => ['sometimes', 'string', 'max:100'],
            'budget_min'       => ['sometimes', 'numeric', 'min:0'],
            'budget_max'       => ['sometimes', 'numeric', 'min:0'],
            'target_roles'     => ['sometimes', 'array'],
        ]);

        $requirement->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Requirement updated successfully.',
            'data'    => new RequirementResource($requirement),
        ]);
    }

    /**
     * PATCH /api/v1/requirements/{id}/status
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $requirement = Requirement::findOrFail($id);
        if ($request->user()->id !== $requirement->user_id && $request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $data = $request->validate([
            'status' => ['required', 'in:open,closed,fulfilled'],
        ]);

        $requirement->update(['status' => $data['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Requirement status updated.',
            'data'    => new RequirementResource($requirement),
        ]);
    }
}
