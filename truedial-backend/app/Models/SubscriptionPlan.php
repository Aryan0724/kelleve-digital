<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    protected $fillable = ['name', 'slug', 'price_monthly', 'price_yearly', 'features', 'is_active'];
    protected $casts = [
        'features' => 'json',
        'is_active' => 'boolean',
        'price_monthly' => 'decimal:2',
        'price_yearly' => 'decimal:2'
    ];
}
