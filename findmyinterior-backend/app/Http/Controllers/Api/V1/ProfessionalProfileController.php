<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Builder;
use App\Models\Listing;
use App\Models\Supplier;
use App\Models\Worker;
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

        if (in_array($role, ['interior_designer', 'contractor', 'architect'])) {
            $profile = Listing::where('user_id', $user->id)->with(['category', 'gallery'])->first();
            $type = 'listing';
        } elseif ($role === 'worker') {
            $profile = Worker::where('user_id', $user->id)->with(['reviews', 'jobs'])->first();
            $type = 'worker';
        } elseif ($role === 'supplier') {
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

        if (in_array($role, ['interior_designer', 'contractor', 'architect'])) {
            $data = $request->validate([
                'title'            => ['required', 'string', 'max:255'],
                'tagline'          => ['nullable', 'string', 'max:255'],
                'description'      => ['required', 'string'],
                'phone'            => ['required', 'string', 'max:20'],
                'city'             => ['required', 'string', 'max:100'],
                'district'         => ['required', 'string', 'max:100'],
                'address'          => ['nullable', 'string'],
                'website'          => ['nullable', 'url'],
                'years_experience' => ['nullable', 'integer'],
                'team_size'        => ['nullable', 'integer'],
                'gst_number'       => ['nullable', 'string', 'max:50'],
                'pan_number'       => ['nullable', 'string', 'max:50'],
                'category_id'      => ['nullable', 'exists:categories,id'],
            ]);

            $profile = Listing::firstOrNew(['user_id' => $user->id]);
            $profile->fill($data);
            if (!$profile->exists) {
                $profile->slug = Str::slug($data['title']) . '-' . Str::random(6);
                $profile->state = 'Bihar';
                $profile->status = 'active';
            }
            $profile->save();
            $type = 'listing';

        } elseif ($role === 'worker') {
            $data = $request->validate([
                'name'             => ['required', 'string', 'max:255'],
                'skill'            => ['required', 'string', 'max:255'],
                'experience_years' => ['required', 'integer'],
                'daily_rate'       => ['required', 'numeric'],
                'bio'              => ['nullable', 'string'],
                'phone'            => ['required', 'string', 'max:20'],
                'city'             => ['required', 'string', 'max:100'],
                'district'         => ['required', 'string', 'max:100'],
            ]);

            $profile = Worker::firstOrNew(['user_id' => $user->id]);
            $profile->fill($data);
            if (!$profile->exists) {
                $profile->slug = Str::slug($data['name']) . '-' . Str::random(6);
                $profile->status = 'active';
            }
            $profile->save();
            $type = 'worker';

        } elseif ($role === 'supplier') {
            $data = $request->validate([
                'company_name'     => ['required', 'string', 'max:255'],
                'tagline'          => ['nullable', 'string', 'max:255'],
                'phone'            => ['required', 'string', 'max:20'],
                'city'             => ['required', 'string', 'max:100'],
                'district'         => ['required', 'string', 'max:100'],
                'address'          => ['nullable', 'string'],
                'gst_number'       => ['nullable', 'string', 'max:50'],
                'pan_number'       => ['nullable', 'string', 'max:50'],
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
                'phone'            => ['required', 'string', 'max:20'],
                'city'             => ['required', 'string', 'max:100'],
                'district'         => ['required', 'string', 'max:100'],
                'address'          => ['nullable', 'string'],
                'gst_number'       => ['nullable', 'string', 'max:50'],
                'pan_number'       => ['nullable', 'string', 'max:50'],
                'total_projects'   => ['nullable', 'integer'],
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
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile updated.',
            'type'    => $type,
            'data'    => $profile,
        ]);
    }
}
