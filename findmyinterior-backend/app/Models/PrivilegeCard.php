<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrivilegeCard extends Model
{
    use HasFactory, \App\Traits\TenantAwareTrait;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'card_number',
        'status',
        'valid_until',
    ];

    protected $casts = [
        'valid_until' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
