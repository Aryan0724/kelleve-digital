<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TruedialInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_name',
        'amount',
        'description',
        'payment_link',
        'status',
    ];
}
