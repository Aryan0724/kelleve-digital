<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdvertisementStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'advertisement_id',
        'date',
        'impressions',
        'clicks',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function advertisement(): BelongsTo
    {
        return $this->belongsTo(Advertisement::class);
    }
}
