<?php

namespace App\Policies;

use App\Models\Media;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MediaPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Media $media): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    private function checkOwnership(User $user, Media $media): bool
    {
        // Must belong to user's tenant
        if (!$user->tenants()->where('tenants.id', $media->tenant_id)->exists()) {
            return false;
        }

        $model = $media->model;
        if (!$model) {
            return false;
        }

        $listing = null;
        if ($media->model_type === \App\Models\Listing::class) {
            $listing = $model;
        } elseif (method_exists($model, 'listing')) {
            $listing = $model->listing;
        }

        return $listing && $listing->user_id === $user->id;
    }

    public function update(User $user, Media $media): bool
    {
        return $this->checkOwnership($user, $media);
    }

    public function delete(User $user, Media $media): bool
    {
        return $this->checkOwnership($user, $media);
    }
}
