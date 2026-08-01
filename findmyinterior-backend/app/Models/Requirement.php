<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Requirement extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'projects';

    protected $fillable = [
        'user_id', 'category_id', 'sub_category_id', 'title', 'description', 
        'budget_min', 'budget_max', 'timeline_days', 'status', 'city_id',
        'professional_id', 'winning_bid_id', 'started_at', 'completed_at',
        'city', 'district',
        'name', 'phone', 'email',
        'opportunity_type', 'requirement_type', 'creator_role',
        'target_roles', 'project_category', 'budget_tier',
        'project_type', 'image', 'district_id', 'awarded_vendor_id',
        'awarded_bid_id', 'award_value', 'awarded_at', 'unlock_price'
    ];

    protected $casts = [
        'target_roles' => 'array',
    ];

    protected $appends = ['formatted_budget', 'unlock_price_display'];

    protected static function booted()
    {
        static::saving(function ($requirement) {
            $budget = $requirement->budget_max ?: $requirement->budget_min ?: 0;
            if ($budget >= 5000000) {
                $requirement->budget_tier = 'Diamond';
            } elseif ($budget >= 2000000) {
                $requirement->budget_tier = 'Platinum';
            } elseif ($budget >= 1000000) {
                $requirement->budget_tier = 'Gold';
            } elseif ($budget >= 500000) {
                $requirement->budget_tier = 'Silver';
            } else {
                $requirement->budget_tier = 'Standard';
            }
        });
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function unlock_pricing()
    {
        return $this->morphOne(PricingContext::class, 'reference');
    }

    public function conversations()
    {
        return $this->morphMany(Conversation::class, 'conversationable');
    }

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

    public function images(): HasMany
    {
        return $this->hasMany(RequirementImage::class);
    }

    public function contactUnlocks(): HasMany
    {
        return $this->hasMany(ContactUnlock::class, 'requirement_id')
            ->whereIn('requirement_type', ['Project', 'Requirement', 'App\Models\Requirement', 'App\Models\Project']);
    }

    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class, 'requirement_id')
            ->whereIn('requirement_type', ['Project', 'Requirement', 'App\Models\Requirement', 'App\Models\Project']);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeByCategory($query, int $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByDistrict($query, string $district)
    {
        return $query->where('district', $district);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    public function isUnlockedBy(User $user): bool
    {
        return $this->contactUnlocks()->where('user_id', $user->id)->exists();
    }

    public function getFormattedBudgetAttribute()
    {
        if ($this->budget_max) {
            return '₹' . number_format($this->budget_max);
        }
        return 'Not specified';
    }

    public function getUnlockPriceDisplayAttribute()
    {
        return '₹' . number_format($this->unlock_price ?? config('marketplace.unlock_fee', 49.00));
    }

    public function activityLogs()
    {
        return $this->morphMany(\App\Models\ActivityLog::class, 'subject');
    }

    public function getTimelineAttribute()
    {
        return $this->activityLogs()->orderBy('created_at', 'desc')->get()->map(function($log) {
            return [
                'title' => $log->event_type,
                'description' => $log->description,
                'date' => $log->created_at->format('Y-m-d H:i:s'),
                'icon' => 'Clock', // Default icon
                'color' => 'text-slate-500' // Default color
            ];
        });
    }
}
