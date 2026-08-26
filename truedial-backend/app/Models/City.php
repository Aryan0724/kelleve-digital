<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $fillable = ['district_id', 'name', 'state', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];

    public function district()
    {
        return $this->belongsTo(District::class);
    }
}
