<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Builder extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'city_id', 'district_id',
        'company_name', 'slug', 'tagline', 'logo', 'cover_image',
        'phone', 'email', 'website', 'city', 'district',
        'rera_number', 'established_year',
        'total_projects', 'delivered_projects',
        'services', 'achievements', 'availability', 'response_time', 'languages', 'social_links',
    ];

    protected $casts = [
        'services' => 'array',
        'achievements' => 'array',
        'languages' => 'array',
        'social_links' => 'array',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(BuilderProject::class);
    }

    public function featuredProjects(): HasMany
    {
        return $this->hasMany(BuilderProject::class)->where('is_featured', true);
    }

    public function possessionProjects(): HasMany
    {
        return $this->hasMany(BuilderProject::class)->where('is_possession_ready', true);
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

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeByDistrict($query, string $district)
    {
        return $query->where('district', $district);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    public function recalculateRating(): void
    {
        $stats = $this->approvedReviews()->selectRaw('AVG(rating) as avg, COUNT(*) as cnt')->first();
        $this->update([
            'avg_rating' => round($stats->avg ?? 0, 2),
            'review_count' => $stats->cnt ?? 0,
        ]);
    }
}
