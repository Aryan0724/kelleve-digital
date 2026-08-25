<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDocument extends Model
{
    use HasFactory;
    protected $connection = 'fmi_mysql';

    protected $fillable = [
        'user_id',
        'document_type',
        'file_path',
        'status',
        'rejection_reason',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function getFilePathAttribute($value)
    {
        if (empty($value)) return $value;
        if (str_starts_with($value, 'data:') || str_starts_with($value, 'TEXT:')) {
            return $value;
        }
        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }
        if (str_starts_with($value, '/storage/')) {
            return 'https://findmyinterior.com' . $value;
        }
        if (str_starts_with($value, 'storage/')) {
            return 'https://findmyinterior.com/' . $value;
        }
        return 'https://findmyinterior.com/storage/' . ltrim($value, '/');
    }
}
