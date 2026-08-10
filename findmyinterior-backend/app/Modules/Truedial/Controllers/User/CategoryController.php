<?php

namespace App\Modules\Truedial\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    /**
     * Update the user's selected categories for TrueDial.
     */
    public function updateCategories(Request $request)
    {
        $request->validate([
            'categories' => 'required|array',
            'categories.*' => 'string'
        ]);

        $user = $request->user();
        $categories = $request->input('categories');
        $tenantId = 2; // TrueDial tenant ID

        DB::beginTransaction();
        try {
            // Remove existing categories for this tenant
            DB::table('user_categories')
                ->where('user_id', $user->id)
                ->where('tenant_id', $tenantId)
                ->delete();

            // Insert new categories
            $inserts = [];
            foreach ($categories as $slug) {
                $inserts[] = [
                    'user_id' => $user->id,
                    'category_slug' => $slug,
                    'tenant_id' => $tenantId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            
            if (!empty($inserts)) {
                DB::table('user_categories')->insert($inserts);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Categories updated successfully',
                'categories' => $categories
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update categories: ' . $e->getMessage()
            ], 500);
        }
    }
}
