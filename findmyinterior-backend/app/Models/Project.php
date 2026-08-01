<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @deprecated This model is duplicate concept of Requirement model pointing to same 'projects' table.
 * Use App\Models\Requirement instead.
 */
class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'projects';

    protected $fillable = [
        'user_id', 'category_id', 'city_id', 'district_id',
        'title', 'description', 'project_type',
        'budget_min', 'budget_max', 'status',
        'city', 'district',
        'name', 'phone', 'email',
        'opportunity_type', 'requirement_type', 'creator_role',
        'target_roles', 'project_category', 'budget_tier',
        'professional_id', 'winning_bid_id', 'started_at', 'completed_at'
    ];

    protected $casts = [
        'target_roles' => 'array',
    ];

    protected $appends = ['formatted_budget', 'unlock_price_display', 'timeline'];

    public function getFormattedBudgetAttribute()
    {
        if ($this->budget_max) {
            return '₹' . number_format($this->budget_max);
        }
        return 'Not specified';
    }

    public function getUnlockPriceDisplayAttribute()
    {
        return '₹' . number_format(config('marketplace.unlock_fee', 49.00));
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

    protected static function booted()
    {
        static::saving(function ($project) {
            $budget = $project->budget_max ?: $project->budget_min ?: 0;
            if ($budget >= 5000000) {
                $project->budget_tier = 'Diamond';
            } elseif ($budget >= 2000000) {
                $project->budget_tier = 'Platinum';
            } elseif ($budget >= 1000000) {
                $project->budget_tier = 'Gold';
            } elseif ($budget >= 500000) {
                $project->budget_tier = 'Silver';
            } else {
                $project->budget_tier = 'Standard';
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class, 'requirement_id'); // Bids still map to requirement_id for now
    }

    public function contactUnlocks(): HasMany
    {
        return $this->hasMany(ContactUnlock::class, 'requirement_id'); // ContactUnlock still maps to requirement_id for now
    }
}
