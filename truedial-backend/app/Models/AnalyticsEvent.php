<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalyticsEvent extends Model
{
    
    public $timestamps = false;
    protected $fillable = ['tenant_id', 'event_type', 'entity_type', 'entity_id', 'user_id', 'session_id', 'metadata', 'ip_address', 'created_at'];
    protected $casts = ['metadata' => 'json'];
}

