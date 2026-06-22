<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'project_id',
        'reviewer_id',
        'reviewed_user_id',
        'rating',
        'title',
        'body',
        'role_of_reviewer',
        'is_approved',
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

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    // ─── Boot ─────────────────────────────────────────────────────────────────

    protected static function booted(): void
    {
        // After a review is approved/created, recalculate the parent's rating
        static::saved(function (Review $review) {
            if ($review->is_approved) {
                $parent = $review->reviewable;
                if (method_exists($parent, 'recalculateRating')) {
                    $parent->recalculateRating();
                }
            }
        });

        static::deleted(function (Review $review) {
            $parent = $review->reviewable;
            if ($parent && method_exists($parent, 'recalculateRating')) {
                $parent->recalculateRating();
            }
        });
    }
}
