<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarketingCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'message',
        'audience',
        'status',
        'scheduled_at',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];
}
