<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Insert all 80+ expanded professional role types.
     */
    public function up(): void
    {
        $roles = [
            // Basic
            ['name' => 'Homeowner', 'slug' => 'homeowner'],
            ['name' => 'Customer', 'slug' => 'customer'],
            // Interior & Design
            ['name' => 'Interior Designer', 'slug' => 'interior_designer'],
            ['name' => 'Interior Design Company', 'slug' => 'interior_company'],
            ['name' => 'Modular Kitchen Designer', 'slug' => 'modular_kitchen_designer'],
            ['name' => 'Wardrobe Designer', 'slug' => 'wardrobe_designer'],
            ['name' => '2D/3D Designer', 'slug' => '2d_3d_designer'],
            ['name' => 'Space Planner', 'slug' => 'space_planner'],
            // Architecture & Engineering
            ['name' => 'Architect', 'slug' => 'architect'],
            ['name' => 'Structural Engineer', 'slug' => 'structural_engineer'],
            ['name' => 'Civil Engineer', 'slug' => 'civil_engineer'],
            ['name' => 'MEP Consultant', 'slug' => 'mep_consultant'],
            ['name' => 'Landscape Designer', 'slug' => 'landscape_designer'],
            ['name' => 'Vastu Consultant', 'slug' => 'vastu_consultant'],
            // Contractors
            ['name' => 'Interior Contractor', 'slug' => 'interior_contractor'],
            ['name' => 'Civil Contractor', 'slug' => 'civil_contractor'],
            ['name' => 'Turnkey Contractor', 'slug' => 'turnkey_contractor'],
            ['name' => 'Renovation Contractor', 'slug' => 'renovation_contractor'],
            ['name' => 'Demolition Contractor', 'slug' => 'demolition_contractor'],
            // Skilled Workforce
            ['name' => 'Carpenter', 'slug' => 'carpenter'],
            ['name' => 'Electrician', 'slug' => 'electrician'],
            ['name' => 'Plumber', 'slug' => 'plumber'],
            ['name' => 'Painter', 'slug' => 'painter'],
            ['name' => 'POP / False Ceiling Worker', 'slug' => 'pop_false_ceiling_worker'],
            ['name' => 'Tile & Marble Fitter', 'slug' => 'tile_marble_fitter'],
            ['name' => 'Granite Installer', 'slug' => 'granite_installer'],
            ['name' => 'Fabricator', 'slug' => 'fabricator'],
            ['name' => 'Aluminium Fabricator', 'slug' => 'aluminium_fabricator'],
            ['name' => 'Glass Installer', 'slug' => 'glass_installer'],
            ['name' => 'Welder', 'slug' => 'welder'],
            ['name' => 'Polish Worker', 'slug' => 'polish_worker'],
            ['name' => 'Wallpaper Installer', 'slug' => 'wallpaper_installer'],
            // Material Suppliers
            ['name' => 'Plywood Dealer', 'slug' => 'plywood_dealer'],
            ['name' => 'Laminate Dealer', 'slug' => 'laminate_dealer'],
            ['name' => 'Tile Dealer', 'slug' => 'tile_dealer'],
            ['name' => 'Marble & Granite Dealer', 'slug' => 'marble_granite_dealer'],
            ['name' => 'Paint Dealer', 'slug' => 'paint_dealer'],
            ['name' => 'Hardware Supplier', 'slug' => 'hardware_supplier'],
            ['name' => 'Lighting Supplier', 'slug' => 'lighting_supplier'],
            ['name' => 'Electrical Supplier', 'slug' => 'electrical_supplier'],
            ['name' => 'Sanitary & Bathroom Supplier', 'slug' => 'sanitary_bathroom_supplier'],
            ['name' => 'Modular Kitchen Material Supplier', 'slug' => 'modular_kitchen_material_supplier'],
            ['name' => 'Glass Supplier', 'slug' => 'glass_supplier'],
            ['name' => 'ACP & Aluminium Supplier', 'slug' => 'acp_aluminium_supplier'],
            ['name' => 'Furniture Supplier', 'slug' => 'furniture_supplier'],
            ['name' => 'Door & Window Supplier', 'slug' => 'door_window_supplier'],
            // Builders & Developers
            ['name' => 'Builder', 'slug' => 'builder'],
            ['name' => 'Real Estate Developer', 'slug' => 'real_estate_developer'],
            ['name' => 'Apartment Project', 'slug' => 'apartment_project'],
            ['name' => 'Commercial Project', 'slug' => 'commercial_project'],
            ['name' => 'Villa Project', 'slug' => 'villa_project'],
            // Home Improvement Services
            ['name' => 'Home Renovation', 'slug' => 'home_renovation'],
            ['name' => 'Waterproofing', 'slug' => 'waterproofing'],
            ['name' => 'Pest Control', 'slug' => 'pest_control'],
            ['name' => 'Deep Cleaning', 'slug' => 'deep_cleaning'],
            ['name' => 'CCTV & Security Systems', 'slug' => 'cctv_security'],
            ['name' => 'Home Automation', 'slug' => 'home_automation'],
            ['name' => 'Solar Installation', 'slug' => 'solar_installation'],
            ['name' => 'AC Installation & Service', 'slug' => 'ac_installation'],
            // Support Services
            ['name' => 'Packers & Movers', 'slug' => 'packers_movers'],
            ['name' => 'Interior Material Transport', 'slug' => 'interior_material_transport'],
            ['name' => 'Equipment Rental', 'slug' => 'equipment_rental'],
            ['name' => 'Interior Project Consultant', 'slug' => 'interior_project_consultant'],
            // Legacy roles (backward compat)
            ['name' => 'Business', 'slug' => 'business'],
            ['name' => 'Worker', 'slug' => 'worker'],
            ['name' => 'Skilled Worker', 'slug' => 'skilled_worker'],
            ['name' => 'Supplier', 'slug' => 'supplier'],
            ['name' => 'Material Supplier', 'slug' => 'material_supplier'],
            ['name' => 'Contractor', 'slug' => 'contractor'],
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
        // Don't drop roles in down()
    }
};
