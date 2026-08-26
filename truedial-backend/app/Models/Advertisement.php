<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Advertisement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'location',
        'banner_url',
        'media_type',
        'custom_code',
        'link',
        'target_city',
        'target_category_id',
        'priority',
        'starts_at',
        'ends_at',
        'is_active',
        'user_id',
        'budget',
        'max_impressions',
        'max_clicks',
        'target_role'
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
        'budget' => 'decimal:2',
        'max_impressions' => 'integer',
        'max_clicks' => 'integer',
    ];

    public function stats(): HasMany
    {
        return $this->hasMany(AdvertisementStat::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'target_category_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
