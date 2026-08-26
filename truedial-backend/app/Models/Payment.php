<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature',
        'amount', 'currency', 'purpose', 'status', 'meta'
    ];

    protected $casts = [
        'meta' => 'json',
        'amount' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
