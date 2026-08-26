<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = ['city', 'district', 'state', 'lat', 'lng', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];
}
