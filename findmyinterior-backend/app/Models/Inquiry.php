<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Inquiry extends Model
{
    use HasFactory, \App\Traits\TenantAwareTrait;

    protected $fillable = [
        'tenant_id',
        'user_id', 'inquirable_type', 'inquirable_id',
        'name', 'phone', 'email', 'message',
        'is_read', 'whatsapp_sent', 'email_sent',
    ];

    protected $casts = [];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Polymorphic parent: Listing, Builder, Supplier, or Worker
     */
    public function inquirable(): MorphTo
    {
        return $this->morphTo();
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeNew($query)
    {
        return $query->where('is_read', false);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    public function markAsRead(): void
    {
        $this->update(['is_read' => true]);
    }
}
