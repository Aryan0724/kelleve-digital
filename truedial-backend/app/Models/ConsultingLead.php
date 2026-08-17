<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsultingLead extends Model
{
    
    protected $fillable = ['listing_id', 'user_id', 'tenant_id', 'name', 'phone', 'email', 'service_type', 'message', 'status'];
}

