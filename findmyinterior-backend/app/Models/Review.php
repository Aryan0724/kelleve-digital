<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, \App\Traits\TenantAwareTrait, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'project_id',
        'reviewer_id',
        'reviewed_user_id',
        'listing_id',
        'rating',
        'title',
        'body',
        'role_of_reviewer',
        'status',
        'user_id',
    ];

    protected $casts = [];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function reviewedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_user_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function replies(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ReviewReply::class);
    }

    public function helpfulVotes(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ReviewHelpfulVote::class);
    }

    public function media(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Media::class, 'model');
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    // ─── Boot ─────────────────────────────────────────────────────────────────

    protected static function booted(): void
    {
        // After a review is approved/created, recalculate the parent's rating
        static::saved(function (Review $review) {
            if ($review->status === 'approved' && $review->listing_id) {
                if ($review->listing) {
                    $review->listing->recalculateRating();
                }
            }
        });

        static::deleted(function (Review $review) {
            if ($review->listing_id && $review->listing) {
                $review->listing->recalculateRating();
            }
        });
    }
}
