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
        'location', // e.g., hero_banner, right_sidebar, mid_page
        'banner_url',
        'media_type', // image, video, html
        'custom_code',
        'link',
        'target_city',
        'target_category_id',
        'priority',
        'starts_at',
        'ends_at',
        'is_active',
        'created_by'
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function stats(): HasMany
    {
        return $this->hasMany(AdvertisementStat::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'target_category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
