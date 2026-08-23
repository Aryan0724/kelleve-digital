<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Listing;
use Illuminate\Support\Str;
use App\Core\Tenancy\TenantContext;

class MigrateLegacyProfessionals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fmi:migrate-legacy-professionals';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate legacy professional users to the modern partitioned listings table.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Starting legacy professional migration...");

        // Ensure Tenant 1 is active, if using Tenancy
        try {
            $tenantId = app(TenantContext::class)->getTenantId();
            if (!$tenantId) {
                app(TenantContext::class)->setTenant(\App\Models\Tenant::find(1));
            }
        } catch (\Throwable $e) {
            $this->warn("Could not set tenant context: " . $e->getMessage());
        }

        // We target users who have ANY role that isn't 'homeowner' or 'customer'
        // For FindMyInterior, professional roles are interior_designer, business, worker, supplier, builder etc.
        $professionals = User::whereHas('roles', function ($q) {
            $q->whereNotIn('slug', ['homeowner', 'customer']);
        })->get();

        $this->info("Found " . $professionals->count() . " legacy professionals to migrate.");

        $count = 0;
        foreach ($professionals as $user) {
            // Check if they already have a listing
            $existing = Listing::where('user_id', $user->id)->first();
            if ($existing) {
                continue;
            }

            $title = $user->name ?? 'Professional';
            Listing::create([
                'tenant_id'   => 1, // Default FMI tenant
                'user_id'     => $user->id,
                'category_id' => 1, // Default Professional category
                'title'       => $title,
                'slug'        => Str::slug($title . '-' . Str::random(6)),
                'description' => 'Professional services.',
                'phone'       => $user->phone ?? '9876543210',
                'city'        => $user->city ?? 'Patna',
                'district'    => $user->district ?? 'Patna',
                'state'       => 'Bihar',
                'status'      => 'active',
            ]);

            $count++;
        }

        $this->info("Successfully migrated {$count} users into the listings table.");
        return 0;
    }
}
