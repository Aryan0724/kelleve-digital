<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class SubscriptionPlan extends Model
{
    protected $fillable = [
        'name', 'slug', 'price_monthly', 'price_yearly',
        'features', 'max_listings', 'max_gallery_images',
        'lead_unlocks_per_month', 'can_see_all_leads',
        'can_add_website', 'can_add_whatsapp', 'is_gold_verified',
        'is_featured_listing', 'is_active',
        'monthly_wallet_credit', 'search_ranking_boost',
        'recommendation_score_boost', 'contact_unlock_discount_percent',
        'early_lead_access_hours', 'lead_notification_type', 'badge_type',
    ];

    protected $casts = [
        'features'          => 'array',
        'price_monthly'     => 'decimal:2',
        'price_yearly'      => 'decimal:2',
        'can_see_all_leads' => 'boolean',
        'can_add_website'   => 'boolean',
        'can_add_whatsapp'  => 'boolean',
        'is_gold_verified'  => 'boolean',
        'is_featured_listing'=> 'boolean',
        'is_active'         => 'boolean',
        'monthly_wallet_credit' => 'integer',
        'search_ranking_boost' => 'integer',
        'recommendation_score_boost' => 'integer',
        'contact_unlock_discount_percent' => 'integer',
        'early_lead_access_hours' => 'integer',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function userSubscriptions(): HasMany
    {
        return $this->hasMany(UserSubscription::class);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
