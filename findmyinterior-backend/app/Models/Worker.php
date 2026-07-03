<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Worker extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'city_id', 'district_id',
        'name', 'slug', 'avatar', 'phone', 'city', 'district',
        'skill', 'skills_tags', 'experience_years', 'daily_rate',
        'is_available', 'bio',
        'services', 'achievements', 'availability', 'response_time', 'languages', 'social_links',
    ];

    protected $casts = [
        'skills_tags' => 'array',
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

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewed_user_id', 'user_id');
    }

    public function approvedReviews(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewed_user_id', 'user_id')->where('is_approved', true);
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

    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeBySkill($query, string $skill)
    {
        return $query->where('skill', $skill);
    }

    public function scopeByDistrict($query, string $district)
    {
        return $query->where('district', $district);
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('skill', 'like', "%{$term}%")
              ->orWhere('bio', 'like', "%{$term}%");
        });
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    public function recalculateRating(): void
    {
        $stats = $this->approvedReviews()->selectRaw('AVG(rating) as avg, COUNT(*) as cnt')->first();
        $this->update(['avg_rating' => round($stats->avg ?? 0, 2), 'review_count' => $stats->cnt ?? 0,
        ]);
    }

    public function getDailyRateFormattedAttribute(): string
    {
        return $this->daily_rate ? '₹' . number_format($this->daily_rate) . '/day' : 'Negotiable';
    }
}
