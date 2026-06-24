<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'avatar',
        'verification_level',
        'is_active',
        'is_verified',
        'profile_completion_score',
        'trust_score',
        'is_verified_business',
        'daily_notification_limit',
        'primary_role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [];

    // ─── Relationships ────────────────────────────────────────────────────────
    public function documents(): HasMany
    {
        return $this->hasMany(UserDocument::class);
    }

    public function primaryRole(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'primary_role_id');
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }

    public function listing(): HasOne
    {
        return $this->hasOne(Listing::class);
    }

    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);
    }

    public function builder(): HasOne
    {
        return $this->hasOne(Builder::class);
    }

    public function supplier(): HasOne
    {
        return $this->hasOne(Supplier::class);
    }

    public function worker(): HasOne
    {
        return $this->hasOne(Worker::class);
    }

    public function notifications()
    {
        return $this->morphMany(\Illuminate\Notifications\DatabaseNotification::class, 'notifiable')->orderBy('created_at', 'desc');
    }

    public function conversationsAsCustomer()
    {
        return $this->hasMany(Conversation::class, 'customer_id');
    }

    public function conversationsAsVendor()
    {
        return $this->hasMany(Conversation::class, 'vendor_id');
    }

    public function requirements(): HasMany
    {
        return $this->hasMany(Requirement::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(UserSubscription::class);
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(UserSubscription::class)
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->latestOfMany();
    }

    public function contactUnlocks(): HasMany
    {
        return $this->hasMany(ContactUnlock::class);
    }

    public function submittedBids(): HasMany
    {
        return $this->hasMany(Bid::class, 'professional_id');
    }


    public function vendorMetrics(): HasOne
    {
        return $this->hasOne(VendorMetric::class, 'vendor_id');
    }

    // Alias for eager-loading with with('vendorMetric')
    public function vendorMetric(): HasOne
    {
        return $this->hasOne(VendorMetric::class, 'vendor_id');
    }

    public function hasRole(string $roleSlug): bool
    {
        return $this->roles()->where('slug', $roleSlug)->exists();
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isBuilder(): bool
    {
        return $this->hasRole('builder');
    }

    public function isSupplier(): bool
    {
        return $this->hasRole('supplier');
    }

    public function isWorker(): bool
    {
        return $this->hasRole('worker');
    }

    public function isBusiness(): bool
    {
        return $this->hasRole('business');
    }

    public function hasPremiumSubscription(): bool
    {
        return $this->activeSubscription?->plan?->can_see_all_leads ?? false;
    }

    public function hasUnlockedRequirement(int $requirementId): bool
    {
        return $this->contactUnlocks()
            ->where('requirement_id', $requirementId)
            ->exists();
    }
}
