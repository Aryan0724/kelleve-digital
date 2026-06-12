<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\RequirementResource;
use App\Models\Requirement;
use App\Models\RequirementImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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
        $requirement = Requirement::open()
            ->with(['category', 'images'])
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
            'title'        => ['required', 'string', 'max:255'],
            'description'  => ['required', 'string', 'max:2000'],
            'category_id'  => ['required', 'exists:categories,id'],
            'project_type' => ['nullable', 'string', 'max:100'],
            'budget_min'   => ['nullable', 'numeric', 'min:0'],
            'budget_max'   => ['nullable', 'numeric', 'min:0'],
            'city'         => ['required', 'string', 'max:100'],
            'district'     => ['required', 'string', 'max:100'],
            'name'         => ['required', 'string', 'max:255'],
            'phone'        => ['required', 'string', 'max:20'],
            'email'        => ['nullable', 'email'],
            'images'       => ['nullable', 'array', 'max:5'],
            'images.*'     => ['url'],
        ]);

        $requirement = Requirement::create([
            ...$data,
            'project_type' => $data['project_type'] ?? 'general',
            'user_id' => $request->user()?->id,
            'status'  => 'open',
        ]);

        if (!empty($data['images'])) {
            foreach ($data['images'] as $url) {
                RequirementImage::create([
                    'requirement_id' => $requirement->id,
                    'image_url'      => $url,
                ]);
            }
        }

        Log::info("New requirement posted: ID {$requirement->id} by user " . ($request->user()?->id ?? 'guest'));

        return response()->json([
            'success' => true,
            'message' => 'Your project requirement has been posted successfully.',
            'data'    => new RequirementResource($requirement->load('category', 'images')),
        ], 201);
    }
}
