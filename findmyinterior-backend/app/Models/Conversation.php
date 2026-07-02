<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'customer_id',
        'vendor_id',
        'status',
        'project_stage',
        'customer_unread_count',
        'vendor_unread_count',
        'unlocked_at',
        'first_vendor_reply_at',
        'last_customer_reply_at',
        'last_vendor_reply_at',
        'last_message_at',
        'awarded_at',
        'completed_at',
    ];

    protected $casts = [
        'unlocked_at' => 'datetime',
        'first_vendor_reply_at' => 'datetime',
        'last_customer_reply_at' => 'datetime',
        'last_vendor_reply_at' => 'datetime',
        'last_message_at' => 'datetime',
        'awarded_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function project()
    {
        return $this->belongsTo(\App\Models\Requirement::class, 'project_id');
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
