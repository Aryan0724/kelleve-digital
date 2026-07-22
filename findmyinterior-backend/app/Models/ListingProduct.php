<?php

namespace App\Models;

use App\Traits\HasMedia;
use App\Traits\TenantAwareTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ListingProduct extends Model
{
    use HasFactory, SoftDeletes, TenantAwareTrait, HasMedia;

    protected $fillable = [
        'tenant_id',
        'listing_id',
        'product_category_id',
        'name',
        'slug',
        'description',
        'tags',
        'price',
        'price_max',
        'currency',
        'tax_rate',
        'unit',
        'is_in_stock',
        'sku',
        'brand',
        'manufacturer',
        'visibility',
        'status',
        'is_featured',
        'sort_order',
        'published_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_in_stock' => 'boolean',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'price_max' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'published_at' => 'datetime',
    ];

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
