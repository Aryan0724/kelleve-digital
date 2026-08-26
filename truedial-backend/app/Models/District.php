<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $fillable = ['name', 'state', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];

    public function cities()
    {
        return $this->hasMany(City::class);
    }
}
