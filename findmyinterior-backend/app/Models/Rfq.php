<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rfq extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'rfqs';

    protected $fillable = [
        'user_id', 'title', 'description', 'city', 'district',
        'opportunity_type', 'requirement_type', 'creator_role', 'target_roles',
        'status', 'budget_min', 'budget_max', 'quantity', 'material_type', 'delivery_location', 'timeline',
        'supplier_id', 'winning_quote_id'
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class, 'requirement_id'); // Temporary until bids table migrates to polymorphic
    }
}
