<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdvertisementStat extends Model
{
    protected $fillable = ['advertisement_id', 'type', 'ip_address', 'user_agent', 'metadata'];
    protected $casts = ['metadata' => 'json'];

    public function advertisement()
    {
        return $this->belongsTo(Advertisement::class);
    }
}
