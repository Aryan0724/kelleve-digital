<?php

namespace App\Models;

use App\Traits\TenantAwareTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsEvent extends Model
{
    use HasFactory, TenantAwareTrait;

    const UPDATED_AT = null; // No updated_at for analytics events

    protected $fillable = [
        'tenant_id',
        'event_type',
        'entity_type',
        'entity_id',
        'user_id',
        'session_id',
        'metadata',
        'created_at',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function entity()
    {
        return $this->morphTo();
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
