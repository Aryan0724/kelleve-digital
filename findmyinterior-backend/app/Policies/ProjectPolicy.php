<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     * Restrict visibility entirely to the involved Client and Professional.
     */
    public function view(User $user, Project $project): bool
    {
        return $user->id === $project->client_id || $user->id === $project->professional_id || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false; // Projects are automatically created by the system upon award
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        return $user->id === $project->client_id || $user->id === $project->professional_id || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can mark progress on the project.
     */
    public function markProgress(User $user, Project $project): bool
    {
        return $user->id === $project->professional_id || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can complete the project.
     */
    public function complete(User $user, Project $project): bool
    {
        return $user->id === $project->client_id || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->hasRole('admin');
    }
}
