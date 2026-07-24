<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Builder;
use App\Models\Listing;
use App\Models\Supplier;
use App\Models\Worker;
use App\Services\TrustScoreService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProfessionalProfileController extends Controller
{
    /**
     * Helper to determine the broad profile type for a given role slug.
     */
    protected function getProfileType(string $role): string
    {
        // All roles that map to the "listing" profile (business/professional types)
        $listingRoles = [
            'interior_designer', 'interior_company', 'interior_contractor',
            'modular_kitchen_designer', 'wardrobe_designer', '2d_3d_designer', 'space_planner',
            'architect', 'structural_engineer', 'civil_engineer', 'mep_consultant',
            'landscape_designer', 'vastu_consultant',
            'contractor', 'civil_contractor', 'turnkey_contractor',
            'renovation_contractor', 'demolition_contractor',
            'home_renovation', 'waterproofing', 'pest_control', 'deep_cleaning',
            'cctv_security', 'home_automation', 'solar_installation', 'ac_installation',
            'packers_movers', 'interior_material_transport', 'equipment_rental',
            'interior_project_consultant',
            'business', // legacy
        ];

        // Roles that map to the "worker" profile
        $workerRoles = [
            'worker', 'skilled_worker',
            'carpenter', 'electrician', 'plumber', 'painter',
            'pop_false_ceiling_worker', 'tile_marble_fitter', 'granite_installer',
            'fabricator', 'aluminium_fabricator', 'glass_installer',
            'welder', 'polish_worker', 'wallpaper_installer',
        ];

        // Roles that map to the "supplier" profile
        $supplierRoles = [
            'supplier', 'material_supplier',
            'plywood_dealer', 'laminate_dealer', 'tile_dealer',
            'marble_granite_dealer', 'paint_dealer', 'hardware_supplier',
            'lighting_supplier', 'electrical_supplier', 'sanitary_bathroom_supplier',
            'modular_kitchen_material_supplier', 'glass_supplier',
            'acp_aluminium_supplier', 'furniture_supplier', 'door_window_supplier',
        ];

        // Roles that map to the "builder" profile
        $builderRoles = [
            'builder', 'real_estate_developer',
            'apartment_project', 'commercial_project', 'villa_project',
        ];

        if (in_array($role, $listingRoles)) return 'listing';
        if (in_array($role, $workerRoles)) return 'worker';
        if (in_array($role, $supplierRoles)) return 'supplier';
        if (in_array($role, $builderRoles)) return 'builder';

        return 'none';
    }

    /**
     * Get the user's professional profile based on their role.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->role;

        $profile = null;
        $type = $this->getProfileType($role);

        if ($type === 'listing') {
            $profile = Listing::where('user_id', $user->id)->with(['category', 'gallery'])->first();
        } elseif ($type === 'worker') {
            $profile = Worker::where('user_id', $user->id)->with(['reviews'])->first();
        } elseif ($type === 'supplier') {
            $profile = Supplier::where('user_id', $user->id)->with(['reviews', 'catalog'])->first();
        } elseif ($type === 'builder') {
            $profile = Builder::where('user_id', $user->id)->with(['reviews', 'projects'])->first();
        } else {
            $type = 'none'; // Homeowner, Customer, Admin
        }

        return response()->json([
            'success' => true,
            'type'    => $type,
            'data'    => $profile
        ]);
    }

    /**
     * Update or create the professional profile based on user's role.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->role;
        $profile = null;
        $type = $this->getProfileType($role);

        if ($type === 'listing') {
            $data = $request->validate([
                'title'            => ['required', 'string', 'max:255'],
                'tagline'          => ['nullable', 'string', 'max:255'],
                'description'      => ['required', 'string'],
                'phone'            => ['nullable', 'string', 'max:20'],
                'city'             => ['required', 'string', 'max:100'],
                'district'         => ['required', 'string', 'max:100'],
                'address'          => ['nullable', 'string'],
                'website'          => ['nullable', 'url'],
                'years_experience' => ['nullable', 'integer'],
                'team_size'        => ['nullable', 'integer'],
                'gst_number'       => ['nullable', 'string', 'max:50'],
                'pan_number'       => ['nullable', 'string', 'max:50'],
                'category_id'      => ['nullable', 'exists:categories,id'],
                'services'         => ['nullable', 'array'],
                'achievements'     => ['nullable', 'array'],
                'availability'     => ['nullable', 'string', 'max:255'],
                'response_time'    => ['nullable', 'string', 'max:255'],
                'languages'        => ['nullable', 'array'],
                'social_links'     => ['nullable', 'array'],
            ]);

            $profile = Listing::firstOrNew(['user_id' => $user->id]);
            $profile->fill($data);
            if (!$profile->exists) {
                $profile->slug = Str::slug($data['title']) . '-' . Str::random(6);
                $profile->state = 'Bihar';
                $profile->status = 'active';
                // Set tenant_id so listing appears in public browse
                try {
                    $profile->tenant_id = app(\App\Core\Tenancy\TenantContext::class)->getTenantId();
                } catch (\Throwable $e) {
                    // If tenant context unavailable, leave null; scopeForCurrentTenant will handle
                }
                if (empty($profile->category_id)) {
                    $categorySlug = match (true) {
                        in_array($role, ['architect', 'structural_engineer', 'civil_engineer']) => 'architects',
                        in_array($role, ['contractor', 'civil_contractor', 'interior_contractor', 'turnkey_contractor', 'renovation_contractor', 'demolition_contractor']) => 'civil-contractors',
                        default => 'interior-designers',
                    };
                    $category = \App\Models\Category::where('slug', $categorySlug)->first();
                    $profile->category_id = $category ? $category->id : 1;
                }
            }
            $profile->save();

        } elseif ($type === 'worker') {
            $data = $request->validate([
                'name'             => ['required', 'string', 'max:255'],
                'skill'            => ['required', 'string', 'max:255'],
                'experience_years' => ['nullable', 'integer'],
                'daily_rate'       => ['nullable', 'numeric'],
                'bio'              => ['nullable', 'string'],
                'phone'            => ['nullable', 'string', 'max:20'],
                'city'             => ['required', 'string', 'max:100'],
                'district'         => ['required', 'string', 'max:100'],
                'address'          => ['nullable', 'string'],
                'services'         => ['nullable', 'array'],
                'achievements'     => ['nullable', 'array'],
                'availability'     => ['nullable', 'string', 'max:255'],
                'response_time'    => ['nullable', 'string', 'max:255'],
                'languages'        => ['nullable', 'array'],
                'social_links'     => ['nullable', 'array'],
            ]);

            $profile = Worker::firstOrNew(['user_id' => $user->id]);
            $profile->fill($data);
            if (!$profile->exists) {
                $profile->slug = Str::slug($data['name']) . '-' . Str::random(6);
                $profile->status = 'active';
            }
            $profile->save();
            $type = 'worker';

        } elseif ($type === 'supplier') {
            $data = $request->validate([
                'company_name'     => ['required', 'string', 'max:255'],
                'tagline'          => ['nullable', 'string', 'max:255'],
                'phone'            => ['nullable', 'string', 'max:20'],
                'city'             => ['required', 'string', 'max:100'],
                'district'         => ['required', 'string', 'max:100'],
                'address'          => ['nullable', 'string'],
                'gst_number'       => ['nullable', 'string', 'regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i'],
                'pan_number'       => ['nullable', 'string', 'regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i'],
                'services'         => ['nullable', 'array'],
                'achievements'     => ['nullable', 'array'],
                'availability'     => ['nullable', 'string', 'max:255'],
                'response_time'    => ['nullable', 'string', 'max:255'],
                'languages'        => ['nullable', 'array'],
                'social_links'     => ['nullable', 'array'],
            ]);

            $profile = Supplier::firstOrNew(['user_id' => $user->id]);
            $profile->fill($data);
            if (!$profile->exists) {
                $profile->slug = Str::slug($data['company_name']) . '-' . Str::random(6);
                $profile->status = 'active';
                $profile->email = $user->email;
            }
            $profile->save();
            $type = 'supplier';

        } elseif ($type === 'builder') {
            $data = $request->validate([
                'company_name'     => ['required', 'string', 'max:255'],
                'tagline'          => ['nullable', 'string', 'max:255'],
                'phone'            => ['nullable', 'string', 'max:20'],
                'city'             => ['required', 'string', 'max:100'],
                'district'         => ['required', 'string', 'max:100'],
                'address'          => ['nullable', 'string'],
                'gst_number'       => ['nullable', 'string', 'regex:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i'],
                'pan_number'       => ['nullable', 'string', 'regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i'],
                'total_projects'   => ['nullable', 'integer'],
                'services'         => ['nullable', 'array'],
                'achievements'     => ['nullable', 'array'],
                'availability'     => ['nullable', 'string', 'max:255'],
                'response_time'    => ['nullable', 'string', 'max:255'],
                'languages'        => ['nullable', 'array'],
                'social_links'     => ['nullable', 'array'],
            ]);

            $profile = Builder::firstOrNew(['user_id' => $user->id]);
            $profile->fill($data);
            if (!$profile->exists) {
                $profile->slug = Str::slug($data['company_name']) . '-' . Str::random(6);
                $profile->status = 'active';
                $profile->email = $user->email;
            }
            $profile->save();
            $type = 'builder';
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Role not supported for professional profile.'
            ], 403);
        }

        // Recalculate trust score after profile update
        app(TrustScoreService::class)->recalculateForUser($user);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'type'    => $type,
            'data'    => $profile,
        ]);
    }
}
