<?php

namespace App\Http\Resources\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

trait HasContactPrivacy
{
    /**
     * Determine if the contact info (phone/email/whatsapp) should be visible to the user.
     * 
     * Centralized privacy rule:
     * - Owner always sees their own contact
     * - Admins always see contacts
     * - Premium subscribers always see contacts
     * - Users who explicitly unlocked this contact via `contact_unlocks` can see it
     */
    protected function shouldShowContact(Request $request): bool
    {
        $user = $request->user();
        
        if (!$user) {
            return false;
        }

        // Owner always sees contact
        if (isset($this->user_id) && $user->id === $this->user_id) {
            return true;
        }

        // Admin always sees
        if ($user->isAdmin()) {
            return true;
        }

        // Premium subscriber sees
        if (method_exists($user, 'hasPremiumSubscription') && $user->hasPremiumSubscription()) {
            return true;
        }

        // Check if unlocked explicitly
        $unlocked = DB::table('contact_unlocks')
            ->where('user_id', $user->id)
            ->where('requirement_id', $this->id)
            ->where('requirement_type', get_class($this->resource))
            ->exists();

        return $unlocked;
    }

    /**
     * Determine if the current user is the owner of the resource.
     */
    protected function isOwner(Request $request): bool
    {
        $user = $request->user();
        return $user && isset($this->user_id) && $user->id === $this->user_id;
    }
}
