<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageAttachment extends Model
{
    use HasFactory;
    protected $connection = 'fmi_mysql';

    protected $fillable = [
        'message_id',
        'file_url',
        'file_type',
        'file_size',
        'uploaded_by',
    ];

    public function message()
    {
        return $this->belongsTo(Message::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
