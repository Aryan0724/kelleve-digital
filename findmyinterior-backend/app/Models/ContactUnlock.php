<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactUnlock extends Model
{
    protected $fillable = ['user_id', 'requirement_id', 'requirement_type', 'payment_id'];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function requirement()
    {
        return $this->morphTo(__FUNCTION__, 'requirement_type', 'requirement_id');
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
