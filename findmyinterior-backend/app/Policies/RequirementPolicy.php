<?php

namespace App\Policies;

use App\Models\Requirement;
use App\Models\User;

class RequirementPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     * Professionals can view if it matches their roles/skills (this is handled by visibility engine, so we allow true here if authenticated).
     */
    public function view(?User $user, Requirement $model): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     * Only Homeowners (customers) or admins can create requirements.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('customer') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Requirement $model): bool
    {
        return $user->hasRole('admin') || $user->id === $model->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Requirement $model): bool
    {
        return $user->hasRole('admin') || $user->id === $model->user_id;
    }

    /**
     * Determine whether the user can award the project.
     */
    public function award(User $user, Requirement $model): bool
    {
        return $user->hasRole('admin') || $user->id === $model->user_id;
    }

    /**
     * Determine whether the user can complete the project.
     */
    public function complete(User $user, Requirement $model): bool
    {
        return $user->hasRole('admin') || $user->id === $model->user_id;
    }
}