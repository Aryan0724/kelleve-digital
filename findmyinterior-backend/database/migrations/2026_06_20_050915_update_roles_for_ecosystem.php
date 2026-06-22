<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $roles = [
            ['name' => 'Homeowner', 'slug' => 'homeowner'],
            ['name' => 'Interior Designer', 'slug' => 'interior_designer'],
            ['name' => 'Interior Company', 'slug' => 'interior_company'],
            ['name' => 'Architect', 'slug' => 'architect'],
            ['name' => 'Contractor', 'slug' => 'contractor'],
            ['name' => 'Builder', 'slug' => 'builder'],
            ['name' => 'Material Supplier', 'slug' => 'material_supplier'],
            ['name' => 'Skilled Worker', 'slug' => 'skilled_worker'],
            ['name' => 'Admin', 'slug' => 'admin'],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['slug' => $role['slug']],
                ['name' => $role['name'], 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    public function down(): void
    {
        // Don't drop roles in down(), as they might be tied to users.
    }
};
