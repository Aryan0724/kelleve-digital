<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Auth\AuthController;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Venture Controller — supports multi-GST businesses
 *
 * One user can own multiple ventures (company profiles).
 * Each venture has its own listing visible on the public directory.
 */
class VentureController extends Controller
{
    /**
     * GET /api/v1/user/ventures
     * List all ventures for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $ventures = \Illuminate\Support\Facades\DB::table('ventures')
            ->where('user_id', $request->user()->id)
            ->where('deleted_at', null)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $ventures,
        ]);
    }

    /**
     * POST /api/v1/user/ventures
     * Create a new venture for the authenticated user.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'              => ['required', 'string', 'max:255'],
            'professional_type' => ['required', 'string', 'max:100',
                'in:' . implode(',', AuthController::getAllowedTypes())],
            'gst_number'        => ['nullable', 'string', 'max:20'],
            'pan_number'        => ['nullable', 'string', 'max:20'],
            'phone'             => ['nullable', 'string', 'regex:/^[6-9]\d{9}$/'],
            'city'              => ['required', 'string', 'max:100'],
            'district'          => ['nullable', 'string', 'max:100'],
            'address'           => ['nullable', 'string'],
        ]);

        $user      = $request->user();
        $broadRole = AuthController::mapTypeToBroadRole($data['professional_type']);

        $ventureId = \Illuminate\Support\Facades\DB::table('ventures')->insertGetId([
            'user_id'           => $user->id,
            'name'              => $data['name'],
            'professional_type' => $data['professional_type'],
            'broad_role'        => $broadRole,
            'gst_number'        => $data['gst_number'] ?? null,
            'pan_number'        => $data['pan_number'] ?? null,
            'phone'             => $data['phone'] ?? $user->phone,
            'city'              => $data['city'],
            'district'          => $data['district'] ?? null,
            'address'           => $data['address'] ?? null,
            'status'            => 'active',
            'created_at'        => now(),
            'updated_at'        => now(),
        ]);

        // Auto-create a listing for this venture
        try {
            $categorySlug = match (true) {
                in_array($data['professional_type'], ['architect', 'structural_engineer', 'civil_engineer']) => 'architects',
                in_array($data['professional_type'], ['civil_contractor', 'interior_contractor', 'turnkey_contractor']) => 'civil-contractors',
                in_array($data['professional_type'], ['builder', 'real_estate_developer']) => 'builders',
                default => 'interior-designers',
            };
            $category = \App\Models\Category::where('slug', $categorySlug)->first();

            $listing = Listing::create([
                'user_id'           => $user->id,
                'title'             => $data['name'],
                'slug'              => Str::slug($data['name']) . '-' . Str::random(6),
                'description'       => $data['name'] . ' — ' . ucwords(str_replace('_', ' ', $data['professional_type'])),
                'city'              => $data['city'],
                'district'          => $data['district'] ?? null,
                'state'             => 'Bihar',
                'phone'             => $data['phone'] ?? $user->phone,
                'gst_number'        => $data['gst_number'] ?? null,
                'status'            => 'active',
                'category_id'       => $category?->id ?? 1,
                'tenant_id'         => $this->getTenantId(),
            ]);

            // Link listing to venture
            \Illuminate\Support\Facades\DB::table('ventures')
                ->where('id', $ventureId)
                ->update(['listing_id' => $listing->id, 'updated_at' => now()]);

        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("VentureController::store - listing creation failed: " . $e->getMessage());
        }

        $venture = \Illuminate\Support\Facades\DB::table('ventures')->find($ventureId);

        return response()->json([
            'success' => true,
            'message' => 'Venture created successfully.',
            'data'    => $venture,
        ], 201);
    }

    /**
     * DELETE /api/v1/user/ventures/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $venture = \Illuminate\Support\Facades\DB::table('ventures')
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$venture) {
            return response()->json(['success' => false, 'message' => 'Venture not found.'], 404);
        }

        \Illuminate\Support\Facades\DB::table('ventures')
            ->where('id', $id)
            ->update(['deleted_at' => now(), 'status' => 'inactive']);

        return response()->json(['success' => true, 'message' => 'Venture removed.']);
    }

    private function getTenantId(): ?int
    {
        try {
            return app(\App\Core\Tenancy\TenantContext::class)->getTenantId();
        } catch (\Throwable $e) {
            return null;
        }
    }
}
