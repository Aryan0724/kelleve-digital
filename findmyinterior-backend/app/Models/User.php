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

    protected $connection = 'fmi_mysql';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'professional_type',
        'avatar',
        'verification_level',
        'is_active',
        'is_mock',
        'is_verified',
        'profile_completion_score',
        'trust_score',
        'is_verified_business',
        'daily_notification_limit',
        'primary_role_id',
        'city',
        'district',
        'address',
        'cover_image',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [];

    protected $appends = ['role'];

    public function getRoleAttribute()
    {
        return $this->roles->first()?->slug ?? 'customer';
    }

    // ─── Relationships ────────────────────────────────────────────────────────
    public function documents(): HasMany
    {
        return $this->hasMany(UserDocument::class);
    }

    public function primaryRole(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'primary_role_id');
    }

    public function tenants(): BelongsToMany
    {
        return $this->belongsToMany(Tenant::class, 'tenant_user')
            ->withPivot('role_id', 'status')
            ->withTimestamps();
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }

    public function listing(): HasOne
    {
        $relation = $this->hasOne(Listing::class);
        try {
            $tenantId = app(\App\Core\Tenancy\TenantContext::class)->getTenantId();
            if ($tenantId) {
                $relation->where('tenant_id', $tenantId);
            }
        } catch (\Throwable $e) {}
        return $relation;
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

    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class);
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

    public function hasAnyRole(array $roleSlugs): bool
    {
        return $this->roles()->whereIn('slug', $roleSlugs)->exists();
    }

    public function assignRole($role)
    {
        if (is_string($role)) {
            $roleModel = \App\Models\Role::where('slug', $role)->orWhere('name', $role)->first();
            if ($roleModel) {
                $this->roles()->syncWithoutDetaching([$roleModel->id]);
            }
        } elseif ($role instanceof \App\Models\Role) {
            $this->roles()->syncWithoutDetaching([$role->id]);
        }
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isBuilder(): bool
    {
        return $this->hasAnyRole(['builder', 'real_estate_developer']);
    }

    public function isSupplier(): bool
    {
        return $this->hasAnyRole([
            'supplier', 'material_supplier', 'plywood_dealer', 'hardware_supplier',
            'lighting_supplier', 'sanitary_bathroom_supplier', 'electrical_supplier'
        ]);
    }

    public function isWorker(): bool
    {
        return $this->hasAnyRole([
            'worker', 'skilled_worker', 'carpenter', 'electrician', 'plumber',
            'painter', 'fabricator', 'tile_marble_fitter', 'welder'
        ]);
    }

    public function isBusiness(): bool
    {
        return $this->hasAnyRole([
            'business', 'interior_designer', 'interior_company', 'contractor',
            'architect', 'builder', 'supplier', 'material_supplier', 'worker', 'skilled_worker', 'professional'
        ]);
    }

    public function hasPremiumSubscription(): bool
    {
        $sub = $this->activeSubscription;
        if (!$sub || $sub->status !== 'active' || $sub->expires_at <= now()) {
            return false;
        }
        $plan = $sub->plan;
        if (!$plan) {
            return false;
        }
        return $plan->slug !== 'starter';
    }

    public function canSeeAllLeads(): bool
    {
        return app(\App\Services\EntitlementService::class)->hasFeature($this, 'can_see_all_leads');
    }

    public function hasUnlockedRequirement(int $requirementId): bool
    {
        return $this->contactUnlocks()
            ->where('requirement_id', $requirementId)
            ->exists();
    }
}
