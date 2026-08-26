<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'title', 'slug', 'instructor_name', 'category', 'duration',
        'level', 'price', 'thumbnail_url', 'description', 'modules', 'is_active'
    ];

    protected $casts = [
        'modules' => 'json',
        'price' => 'decimal:2',
        'is_active' => 'boolean'
    ];
}
