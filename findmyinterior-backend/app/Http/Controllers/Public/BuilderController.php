<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\BuilderProjectResource;
use App\Http\Resources\BuilderResource;
use App\Models\Builder;
use App\Models\BuilderProject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BuilderController extends Controller
{
    /**
     * GET /api/v1/builders
     */
    public function index(Request $request): JsonResponse
    {
        $query = Builder::active()->with(['projects' => fn($q) => $q->take(1)]);

        if ($request->filled('district')) {
            $query->byDistrict($request->district);
        }
        if ($request->boolean('verified')) {
            $query->verified();
        }
        if ($request->boolean('featured')) {
            $query->featured();
        }

        $builders = $query
            ->orderByDesc('is_verified')
            ->orderByDesc('is_featured')
            ->orderByDesc('avg_rating')
            ->paginate($request->get('per_page', 12));

        return response()->json([
            'success' => true,
            'data'    => BuilderResource::collection($builders),
            'meta'    => [
                'current_page' => $builders->currentPage(),
                'per_page'     => $builders->perPage(),
                'total'        => $builders->total(),
                'last_page'    => $builders->lastPage(),
            ],
        ]);
    }

    /**
     * GET /api/v1/builders/{slug}
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $builder = Builder::active()
            ->where('slug', $slug)
            ->with(['projects.images', 'possessionProjects.images', 'approvedReviews.reviewer'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => new BuilderResource($builder),
        ]);
    }

    /**
     * GET /api/v1/builder-projects
     */
    public function projects(Request $request): JsonResponse
    {
        $query = BuilderProject::with(['builder', 'images' => fn($q) => $q->take(1)]);

        if ($request->filled('type')) {
            $query->where('project_type', $request->type);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->boolean('possession_ready')) {
            $query->possessionReady();
        }
        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }

        $projects = $query
            ->orderByDesc('is_featured')
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page', 12));

        return response()->json([
            'success' => true,
            'data'    => BuilderProjectResource::collection($projects),
            'meta'    => [
                'current_page' => $projects->currentPage(),
                'per_page'     => $projects->perPage(),
                'total'        => $projects->total(),
                'last_page'    => $projects->lastPage(),
            ],
        ]);
    }

    /**
     * GET /api/v1/builder-projects/{slug}
     */
    public function projectShow(string $slug): JsonResponse
    {
        $project = BuilderProject::where('slug', $slug)
            ->with(['builder', 'images'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => new BuilderProjectResource($project),
        ]);
    }
}
