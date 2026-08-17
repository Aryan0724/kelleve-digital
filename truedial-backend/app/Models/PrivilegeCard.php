<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrivilegeCard extends Model
{
    
    protected $fillable = ['tenant_id', 'user_id', 'card_number', 'status', 'valid_until'];
    
    public function user() { return $this->belongsTo(User::class); }
}

