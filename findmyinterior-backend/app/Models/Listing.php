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
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'category_id', 'city_id', 'district_id',
        'title', 'slug', 'description', 'tagline', 'cover_image',
        'phone', 'whatsapp', 'email', 'website',
        'city', 'district', 'state', 'address', 'lat', 'lng',
        'years_experience', 'team_size', 'status', 'is_premium', 'is_featured', 'is_verified',
        'gst_number', 'pan_number', 'budget_tier',
        'phone_clicks', 'whatsapp_clicks', 'website_clicks',
    ];

    protected $casts = [];

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

    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function approvedReviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable')->where('is_approved', true);
    }

    public function inquiries(): MorphMany
    {
        return $this->morphMany(Inquiry::class, 'inquirable');
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
        return $query->whereFullText(['title', 'description'], $term);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    public function recalculateRating(): void
    {
        $stats = $this->approvedReviews()->selectRaw('AVG(rating) as avg, COUNT(*) as cnt')->first();
        $this->update(['avg_rating' => round($stats->avg ?? 0, 2), 'review_count' => $stats->cnt ?? 0,
        ]);
    }
}
