<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory, \App\Traits\TenantAwareTrait;

    protected $fillable = [
        'tenant_id',
        'listing_id',
        'title',
        'description',
        'promo_code',
        'valid_until',
        'status',
        'discount_type',
        'discount_value',
        'cta_label',
        'cta_url',
    ];

    protected $casts = [
        'valid_until' => 'datetime',
        'discount_value' => 'decimal:2',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'model')->orderBy('order', 'asc');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                     ->where(function($q) {
                         $q->whereNull('valid_until')
                           ->orWhere('valid_until', '>', now());
                     });
    }

    public function getComputedStatusAttribute()
    {
        if ($this->status === 'active' && $this->valid_until && $this->valid_until < now()) {
            return 'expired';
        }
        return $this->status;
    }
}
