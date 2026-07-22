<?php

namespace App\Services;

use App\Models\Listing;
use App\Models\ListingProduct;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProductService
{
    /**
     * Synchronizes a listing's products with the provided array of product data.
     * Replaces existing products that are not in the new array.
     */
    public function syncProducts(Listing $listing, array $productsData)
    {
        return DB::transaction(function () use ($listing, $productsData) {
            $existingProductIds = $listing->listingProducts()->pluck('id')->toArray();
            $updatedOrCreatedIds = [];
            $sortOrder = 0;

            foreach ($productsData as $productData) {
                // Determine uniqueness by ID if provided, otherwise by name
                $id = $productData['id'] ?? null;
                $name = $productData['name'];

                $product = null;
                if ($id) {
                    $product = $listing->listingProducts()->find($id);
                }

                if (!$product) {
                    $product = new ListingProduct();
                    $product->listing_id = $listing->id;
                    $product->tenant_id = $listing->tenant_id;
                    $product->slug = Str::slug($name) . '-' . uniqid();
                }

                $product->name = $name;
                $product->description = $productData['description'] ?? null;
                $product->price = isset($productData['price']) ? (float)$productData['price'] : null;
                $product->sort_order = $sortOrder++;
                $product->status = 'active';

                $product->save();
                $updatedOrCreatedIds[] = $product->id;

                // Handle Media if provided (Base64)
                if (!empty($productData['image']) && preg_match('/^data:image/', $productData['image'])) {
                    // Remove old cover image if replacing
                    $product->primaryMedia()->delete();
                    
                    app(MediaService::class)->attach($product, $productData['image'], 'cover');
                }
            }

            // Delete products that were removed in the UI
            $idsToDelete = array_diff($existingProductIds, $updatedOrCreatedIds);
            if (!empty($idsToDelete)) {
                $listing->listingProducts()->whereIn('id', $idsToDelete)->delete();
            }

            return $listing->listingProducts()->withMedia()->get();
        });
    }
}
