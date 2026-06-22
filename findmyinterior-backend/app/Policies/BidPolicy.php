<?php

namespace App\Policies;

use App\Models\Bid;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BidPolicy
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
     */
    public function view(User $user, Bid $bid): bool
    {
        return $user->id === $bid->professional_id || $user->id === $bid->requirement->user_id || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('business') || $user->hasRole('builder') || $user->hasRole('supplier') || $user->hasRole('worker');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Bid $bid): bool
    {
        return $user->id === $bid->professional_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Bid $bid): bool
    {
        return $user->id === $bid->professional_id;
    }

    /**
     * Determine whether the user can accept/award the bid.
     */
    public function award(User $user, Bid $bid): bool
    {
        return $user->id === $bid->requirement->user_id || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can withdraw the bid.
     */
    public function withdraw(User $user, Bid $bid): bool
    {
        return $user->id === $bid->professional_id && in_array($bid->status, ['draft', 'submitted', 'shortlisted']);
    }
}
