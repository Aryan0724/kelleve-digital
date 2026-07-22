<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Listing extends Model
{
    use HasFactory, SoftDeletes, \App\Traits\TenantAwareTrait, \App\Traits\HasMedia;

    protected $fillable = [
        'user_id', 'category_id', 'city_id', 'district_id',
        'title', 'slug', 'description', 'tagline', 'cover_image',
        'phone', 'whatsapp', 'email', 'website',
        'city', 'district', 'state', 'address', 'lat', 'lng',
        'years_experience', 'team_size', 'status', 'is_premium', 'is_featured', 'is_verified',
        'gst_number', 'pan_number', 'budget_tier',
        'phone_clicks', 'whatsapp_clicks', 'website_clicks',
        'services', 'products', 'achievements', 'availability', 'response_time', 'languages', 'social_links',
        'tenant_id',
        'subscription_plan', 'subscription_status', 'verified_at', 'featured_until', 'premium_until',
    ];

    protected $casts = [
        'services' => 'array',
        'products' => 'array',
        'achievements' => 'array',
        'languages' => 'array',
        'social_links' => 'array',
        'verified_at' => 'datetime',
        'featured_until' => 'datetime',
        'premium_until' => 'datetime',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function gallery(): HasMany
    {
        return $this->hasMany(ListingGallery::class)->orderBy('sort_order');
    }

    public function listingProducts(): HasMany
    {
        return $this->hasMany(ListingProduct::class);
    }

    public function listingServices(): HasMany
    {
        return $this->hasMany(ListingService::class);
    }

    public function analyticsEvents(): MorphMany
    {
        return $this->morphMany(AnalyticsEvent::class, 'entity');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'listing_id');
    }

    public function approvedReviews(): HasMany
    {
        return $this->hasMany(Review::class, 'listing_id')->where('status', 'approved');
    }

    public function inquiries(): MorphMany
    {
        return $this->morphMany(Inquiry::class, 'inquirable');
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopePremium($query)
    {
        return $query->where('is_premium', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeByCategory($query, int $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByCity($query, string $city)
    {
        return $query->where('city', $city);
    }

    public function scopeByDistrict($query, string $district)
    {
        return $query->where('district', $district);
    }

    public function scopeSearch($query, string $term)
    {
        $term = strtolower($term);
        $words = array_filter(explode(' ', $term));
        
        if (empty($words)) {
            return $query;
        }

        return $query->where(function ($q) use ($words) {
            foreach ($words as $word) {
                $singularWord = rtrim($word, 's');
                $q->orWhere(function ($subQ) use ($word, $singularWord) {
                    $subQ->whereRaw('LOWER(title) LIKE ?', ["%{$word}%"])
                         ->orWhereRaw('LOWER(title) LIKE ?', ["%{$singularWord}%"])
                         ->orWhereRaw('LOWER(description) LIKE ?', ["%{$word}%"])
                         ->orWhereRaw('LOWER(description) LIKE ?', ["%{$singularWord}%"])
                         ->orWhereHas('category', function ($catQ) use ($word, $singularWord) {
                             $catQ->whereRaw('LOWER(name) LIKE ?', ["%{$word}%"])
                                  ->orWhereRaw('LOWER(name) LIKE ?', ["%{$singularWord}%"]);
                         });
                });
            }
        });
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    public function recalculateRating(): void
    {
        $stats = $this->approvedReviews()
            ->selectRaw('
                AVG(rating) as avg, 
                COUNT(*) as cnt,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
            ')->first();
            
        $this->update([
            'avg_rating' => round($stats->avg ?? 0, 2), 
            'review_count' => $stats->cnt ?? 0,
            'five_star' => $stats->five_star ?? 0,
            'four_star' => $stats->four_star ?? 0,
            'three_star' => $stats->three_star ?? 0,
            'two_star' => $stats->two_star ?? 0,
            'one_star' => $stats->one_star ?? 0,
        ]);
    }
}
