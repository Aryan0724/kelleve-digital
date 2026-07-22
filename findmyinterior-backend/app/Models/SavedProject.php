<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedProject extends Model
{
    use \App\Traits\TenantAwareTrait;

    protected $fillable = ['tenant_id', 'user_id', 'requirement_id', 'requirement_type'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function requirement()
    {
        return $this->morphTo();
    }
}
