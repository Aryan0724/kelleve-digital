<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Review $model): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Review $model): bool
    {
        return $user->role === 'admin' || ($user->id === $model->user_id);
    }

    public function reply(User $user, Review $model): bool
    {
        // Must own the listing the review is for
        return $model->listing && $model->listing->user_id === $user->id;
    }

    public function report(User $user, Review $model): bool
    {
        // For vendor reporting reviews on their own listing
        return $model->listing && $model->listing->user_id === $user->id;
    }

    public function delete(User $user, Review $model): bool
    {
        return $user->role === 'admin' || ($user->id === $model->user_id);
    }

    public function restore(User $user, Review $model): bool
    {
        return $user->role === 'admin';
    }

    public function forceDelete(User $user, Review $model): bool
    {
        return $user->role === 'admin';
    }
}