<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CallLog extends Model
{
    protected $connection = 'fmi_mysql';
    protected $fillable = [
        'caller_id',
        'caller_ip',
        'receiver_type',
        'receiver_id'
    ];
}
