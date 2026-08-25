<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Advertisement extends Model
{
    use HasFactory;
    protected $connection = 'fmi_mysql';

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
        'created_by',
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

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getBannerUrlAttribute($value)
    {
        if (empty($value)) {
            return 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200&h=400&fit=crop';
        }
        if (str_starts_with($value, 'data:')) {
            return $value;
        }
        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }
        if (str_starts_with($value, '/storage/')) {
            return 'https://findmyinterior.com' . $value;
        }
        if (str_starts_with($value, 'storage/')) {
            return 'https://findmyinterior.com/' . $value;
        }
        return 'https://findmyinterior.com/storage/' . ltrim($value, '/');
    }
}
