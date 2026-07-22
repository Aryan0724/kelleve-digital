<?php

namespace App\Models;

use App\Traits\HasMedia;
use App\Traits\TenantAwareTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ListingService extends Model
{
    use HasFactory, SoftDeletes, TenantAwareTrait, HasMedia;

    protected $fillable = [
        'tenant_id',
        'listing_id',
        'service_category_id',
        'name',
        'slug',
        'description',
        'tags',
        'price_starting_at',
        'price_type',
        'currency',
        'tax_rate',
        'duration_minutes',
        'is_bookable',
        'booking_buffer',
        'availability_type',
        'online_booking_enabled',
        'visibility',
        'status',
        'is_featured',
        'sort_order',
        'published_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_bookable' => 'boolean',
        'online_booking_enabled' => 'boolean',
        'is_featured' => 'boolean',
        'price_starting_at' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'published_at' => 'datetime',
    ];

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
