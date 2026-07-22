<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedVendor extends Model
{
    use \App\Traits\TenantAwareTrait;

    protected $fillable = ['tenant_id', 'user_id', 'vendor_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }
}
