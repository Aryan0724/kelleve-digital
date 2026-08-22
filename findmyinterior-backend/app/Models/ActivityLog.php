<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $guarded = [];

    protected $casts = [
        'properties' => 'array',
    ];

    /**
     * Enforce immutability. Audit logs can NEVER be updated or deleted.
     */
    protected static function booted()
    {
        static::updating(function ($log) {
            throw new \Exception('Audit logs are immutable and cannot be updated.');
        });

        static::deleting(function ($log) {
            throw new \Exception('Audit logs are immutable and cannot be deleted.');
        });
    }

    /**
     * Helper to safely record a destructive admin action.
     */
    public static function recordAdminAction($adminId, $eventType, $subject, $beforeState, $afterState, $reason)
    {
        if (empty($reason)) {
            throw new \InvalidArgumentException('A mandatory reason must be provided for all admin actions.');
        }

        return self::create([
            'user_id' => $adminId,
            'event_type' => $eventType,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id' => $subject ? $subject->id : null,
            'description' => $reason,
            'properties' => [
                'before_state' => $beforeState,
                'after_state' => $afterState,
            ],
        ]);
    }
}
