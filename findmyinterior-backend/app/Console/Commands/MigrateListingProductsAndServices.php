<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Listing;
use App\Models\ListingProduct;
use App\Models\ListingService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class MigrateListingProductsAndServices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'truedial:migrate-json-catalog';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrates existing products and services from JSON columns to normalized tables.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Starting migration of products and services...");

        $listings = Listing::all();
        
        $totalProducts = 0;
        $totalServices = 0;
        $failedProducts = 0;
        $failedServices = 0;

        foreach ($listings as $listing) {
            $this->info("Processing Listing ID: {$listing->id}");

            // Migrate Products
            if (!empty($listing->products) && is_array($listing->products)) {
                $sortOrder = 0;
                foreach ($listing->products as $product) {
                    try {
                        $name = $product['title'] ?? $product['name'] ?? 'Unnamed Product';
                        ListingProduct::updateOrCreate(
                            [
                                'listing_id' => $listing->id,
                                'slug' => Str::slug($name) . '-' . uniqid(),
                            ],
                            [
                                'tenant_id' => $listing->tenant_id,
                                'name' => $name,
                                'description' => $product['description'] ?? null,
                                'price' => isset($product['price']) ? (float)$product['price'] : null,
                                'sort_order' => $sortOrder++,
                                'status' => 'active',
                            ]
                        );
                        $totalProducts++;
                    } catch (\Exception $e) {
                        $this->error("Failed to migrate product for Listing {$listing->id}: " . $e->getMessage());
                        Log::error("Product Migration Error", ['listing_id' => $listing->id, 'product' => $product, 'error' => $e->getMessage()]);
                        $failedProducts++;
                    }
                }
            }

            // Migrate Services
            if (!empty($listing->services) && is_array($listing->services)) {
                $sortOrder = 0;
                foreach ($listing->services as $service) {
                    try {
                        $name = $service['title'] ?? $service['name'] ?? 'Unnamed Service';
                        ListingService::updateOrCreate(
                            [
                                'listing_id' => $listing->id,
                                'slug' => Str::slug($name) . '-' . uniqid(),
                            ],
                            [
                                'tenant_id' => $listing->tenant_id,
                                'name' => $name,
                                'description' => $service['description'] ?? null,
                                'price_starting_at' => isset($service['price']) ? (float)$service['price'] : null,
                                'sort_order' => $sortOrder++,
                                'status' => 'active',
                            ]
                        );
                        $totalServices++;
                    } catch (\Exception $e) {
                        $this->error("Failed to migrate service for Listing {$listing->id}: " . $e->getMessage());
                        Log::error("Service Migration Error", ['listing_id' => $listing->id, 'service' => $service, 'error' => $e->getMessage()]);
                        $failedServices++;
                    }
                }
            }
        }

        $this->info("Migration completed.");
        $this->info("Total Products Migrated: {$totalProducts}");
        $this->info("Total Services Migrated: {$totalServices}");
        
        if ($failedProducts > 0 || $failedServices > 0) {
            $this->error("Failures encountered. Products: {$failedProducts}, Services: {$failedServices}. Check logs.");
        } else {
            $this->info("No failures encountered.");
        }
    }
}
