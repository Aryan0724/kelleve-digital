<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkerJob extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'worker_jobs';

    protected $fillable = [
        'user_id', 'title', 'description', 'city', 'district',
        'opportunity_type', 'requirement_type', 'creator_role', 'target_roles',
        'status', 'daily_rate', 'duration', 'skills_required', 'location',
        'worker_id', 'winning_application_id', 'image'
    ];

    protected $casts = [
        'target_roles' => 'array',
        'skills_required' => 'array',
    ];

    protected $appends = ['formatted_budget', 'unlock_price_display'];

    public function getFormattedBudgetAttribute()
    {
        if ($this->daily_rate) {
            return '₹' . number_format($this->daily_rate) . '/day';
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class, 'requirement_id')
            ->where('requirement_type', 'WorkerJob');
    }

    public function contactUnlocks(): HasMany
    {
        return $this->hasMany(ContactUnlock::class, 'requirement_id')
            ->whereIn('requirement_type', ['WorkerJob', 'App\Models\WorkerJob']);
    }

    public function isUnlockedBy(User $user): bool
    {
        return $this->contactUnlocks()->where('user_id', $user->id)->exists();
    }
}
