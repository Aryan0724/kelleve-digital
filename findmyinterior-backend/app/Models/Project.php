<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

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
    ];

    protected $casts = [
        'target_roles' => 'array',
    ];

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
