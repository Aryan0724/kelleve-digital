<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class District extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'state',];

    protected $casts = [
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function cities(): HasMany
    {
        return $this->hasMany(City::class);
    }

    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);
    }

    public function builders(): HasMany
    {
        return $this->hasMany(Builder::class);
    }

    public function suppliers(): HasMany
    {
        return $this->hasMany(Supplier::class);
    }

    public function workers(): HasMany
    {
        return $this->hasMany(Worker::class);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
