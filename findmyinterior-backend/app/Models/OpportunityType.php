<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpportunityType extends Model
{
    use HasFactory;

    protected $fillable = ['type', 'creator_roles', 'target_roles'];

    protected $casts = [
        'creator_roles' => 'array',
        'target_roles' => 'array',
    ];
}
