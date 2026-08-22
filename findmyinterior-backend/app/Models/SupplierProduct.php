<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SupplierProduct extends Model
{
    protected $connection = 'fmi_mysql';
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'supplier_id', 'name', 'slug', 'description', 'cover_image',
        'category', 'unit', 'price_min', 'price_max',
    ];

    protected $casts = [];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(SupplierProductImage::class)->orderBy('sort_order');
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    public function getFormattedPriceAttribute(): string
    {
        if (!$this->price_min && !$this->price_max) {
            return 'Price on Request';
        }
        if ($this->price_min && $this->price_max) {
            return '₹' . number_format($this->price_min) . ' – ₹' . number_format($this->price_max);
        }
        return '₹' . number_format($this->price_min ?? $this->price_max);
    }
}
