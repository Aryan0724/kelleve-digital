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
     * Get the user's professional profile based on their role.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->role;

        $profile = null;
        $type = null;

        if (in_array($role, ['interior_designer', 'interior_company', 'contractor', 'architect', 'business'])) {
            $profile = Listing::where('user_id', $user->id)->with(['category', 'gallery'])->first();
            $type = 'listing';
        } elseif (in_array($role, ['worker', 'skilled_worker'])) {
            $profile = Worker::where('user_id', $user->id)->with(['reviews'])->first();
            $type = 'worker';
        } elseif (in_array($role, ['supplier', 'material_supplier'])) {
            $profile = Supplier::where('user_id', $user->id)->with(['reviews', 'catalog'])->first();
            $type = 'supplier';
        } elseif ($role === 'builder') {
            $profile = Builder::where('user_id', $user->id)->with(['reviews', 'projects'])->first();
            $type = 'builder';
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
        $type = null;

        if (in_array($role, ['interior_designer', 'interior_company', 'contractor', 'architect', 'business'])) {
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
                
                if (empty($profile->category_id)) {
                    $categorySlug = match ($role) {
                        'architect' => 'architects',
                        'contractor' => 'civil-contractors',
                        'interior_designer', 'interior_company', 'business' => 'interior-designers',
                        default => 'interior-designers',
                    };
                    $category = \App\Models\Category::where('slug', $categorySlug)->first();
                    $profile->category_id = $category ? $category->id : 1;
                }
            }
            $profile->save();
            $type = 'listing';

        } elseif (in_array($role, ['worker', 'skilled_worker'])) {
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

        } elseif (in_array($role, ['supplier', 'material_supplier'])) {
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

        } elseif ($role === 'builder') {
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
