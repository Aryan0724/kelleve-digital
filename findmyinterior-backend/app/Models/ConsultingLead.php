<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultingLead extends Model
{
    use HasFactory;

    protected $connection = 'truedial_mysql';

    protected $fillable = [
        'name',
        'phone',
        'service_type',
        'message',
        'status',
    ];
}
