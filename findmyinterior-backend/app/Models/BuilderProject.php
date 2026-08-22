<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class BuilderProject extends Model
{
    protected $connection = 'fmi_mysql';
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'builder_id', 'title', 'slug', 'description', 'cover_image',
        'project_type', 'location', 'city', 'bhk_options',
        'area_sqft_min', 'area_sqft_max',
        'price_min', 'price_max',
        'possession_date', 'is_possession_ready',
    ];

    protected $casts = [
        'possession_date' => 'date',
        'is_possession_ready' => 'boolean',
    ];
    // ─── Relationships ────────────────────────────────────────────────────────

    public function builder(): BelongsTo
    {
        return $this->belongsTo(Builder::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(BuilderProjectImage::class)->orderBy('sort_order');
    }

    public function getUserAttribute()
    {
        return $this->builder?->user;
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopePossessionReady($query)
    {
        return $query->where('is_possession_ready', true);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('status', 'upcoming');
    }

    public function scopeOngoing($query)
    {
        return $query->where('status', 'ongoing');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeResidential($query)
    {
        return $query->where('project_type', 'residential');
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    public function getFormattedPriceAttribute(): string
    {
        if (!$this->price_min && !$this->price_max) {
            return 'Price on Request';
        }
        $min = '₹' . number_format($this->price_min / 100000, 2) . 'L';
        $max = '₹' . number_format($this->price_max / 100000, 2) . 'L';
        return "{$min} – {$max}";
    }
}
