<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\WorkerResource;
use App\Models\Worker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkerController extends Controller
{
    /**
     * GET /api/v1/workers
     */
    public function index(Request $request): JsonResponse
    {
        $query = Worker::active();

        if ($request->filled('skill')) {
            $query->bySkill($request->skill);
        }
        if ($request->filled('district')) {
            $query->byDistrict($request->district);
        }
        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }
        if ($request->boolean('available')) {
            $query->available();
        }
        if ($request->boolean('featured')) {
            $query->featured();
        }
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $workers = $query
            ->orderByDesc('is_verified')
            ->orderByDesc('is_featured')
            ->orderByDesc('is_available')
            ->orderByDesc('avg_rating')
            ->paginate($request->get('per_page', 12));

        return response()->json([
            'success' => true,
            'data'    => WorkerResource::collection($workers),
            'meta'    => [
                'current_page' => $workers->currentPage(),
                'per_page'     => $workers->perPage(),
                'total'        => $workers->total(),
                'last_page'    => $workers->lastPage(),
            ],
        ]);
    }

    /**
     * GET /api/v1/workers/{slug}
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $worker = Worker::active()
            ->where('slug', $slug)
            ->with(['approvedReviews.reviewer'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => new WorkerResource($worker),
        ]);
    }
}
