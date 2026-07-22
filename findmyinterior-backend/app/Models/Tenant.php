<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tenant extends Model
{
    use HasFactory;
    protected $fillable = [
        'slug',
        'name',
        'domain',
        'logo',
        'theme',
        'status',
    ];

    protected $casts = [
        'theme' => 'array',
    ];

    public function modules(): HasMany
    {
        return $this->hasMany(TenantModule::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'tenant_user')
            ->withPivot('role_id', 'status')
            ->withTimestamps();
    }
}
