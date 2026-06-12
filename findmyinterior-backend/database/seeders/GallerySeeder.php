<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Listing;
use App\Models\BuilderProject;
use App\Models\SupplierProduct;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        // Listing Galleries
        $listings = Listing::all();
        $listingGalleryData = [];
        foreach ($listings as $listing) {
            for ($i = 1; $i <= rand(3, 5); $i++) {
                $listingGalleryData[] = [
                    'listing_id' => $listing->id,
                    'image_url' => "https://picsum.photos/seed/listing_{$listing->id}_{$i}/800/600",
                    'caption' => "Gallery image {$i} for {$listing->title}",
                    'sort_order' => $i,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        $chunks = array_chunk($listingGalleryData, 500);
        foreach ($chunks as $chunk) {
            DB::table('listing_galleries')->insert($chunk);
        }

        // Builder Project Images
        $projects = BuilderProject::all();
        $projectImageData = [];
        foreach ($projects as $project) {
            for ($i = 1; $i <= rand(3, 5); $i++) {
                $projectImageData[] = [
                    'builder_project_id' => $project->id,
                    'image_url' => "https://picsum.photos/seed/project_{$project->id}_{$i}/800/600",
                    'caption' => "Project image {$i}",
                    'sort_order' => $i,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        $chunks = array_chunk($projectImageData, 500);
        foreach ($chunks as $chunk) {
            DB::table('builder_project_images')->insert($chunk);
        }

        // Supplier Product Images
        $products = SupplierProduct::all();
        $productImageData = [];
        foreach ($products as $product) {
            for ($i = 1; $i <= rand(2, 4); $i++) {
                $productImageData[] = [
                    'supplier_product_id' => $product->id,
                    'image_url' => "https://picsum.photos/seed/product_{$product->id}_{$i}/800/600",
                    'sort_order' => $i,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        $chunks = array_chunk($productImageData, 500);
        foreach ($chunks as $chunk) {
            DB::table('supplier_product_images')->insert($chunk);
        }
    }
}
