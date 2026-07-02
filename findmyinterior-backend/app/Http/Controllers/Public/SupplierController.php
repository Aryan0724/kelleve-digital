<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    /**
     * GET /api/v1/suppliers
     */
    public function index(Request $request): JsonResponse
    {
        $query = Supplier::active()
            ->with(['activeProducts' => fn($q) => $q->take(3)]);

        if ($request->filled('district')) {
            $query->where('district', $request->district);
        }
        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }
        if ($request->boolean('verified')) {
            $query->verified();
        }
        if ($request->boolean('featured')) {
            $query->featured();
        }

        $suppliers = $query
            ->orderByDesc('is_verified')
            ->orderByDesc('is_featured')
            ->orderByDesc('avg_rating')
            ->paginate($request->get('per_page', 12));

        return response()->json([
            'success' => true,
            'data'    => SupplierResource::collection($suppliers),
            'meta'    => [
                'current_page' => $suppliers->currentPage(),
                'per_page'     => $suppliers->perPage(),
                'total'        => $suppliers->total(),
                'last_page'    => $suppliers->lastPage(),
            ],
        ]);
    }

    /**
     * GET /api/v1/suppliers/{slug}
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $supplier = Supplier::active()
            ->where('slug', $slug)
            ->with(['activeProducts.images', 'approvedReviews.reviewer'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => new SupplierResource($supplier),
        ]);
    }
}
