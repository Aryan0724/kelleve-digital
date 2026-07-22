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
        'image_url',
        'valid_until',
        'status',
    ];

    protected $casts = [
        'valid_until' => 'datetime',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
