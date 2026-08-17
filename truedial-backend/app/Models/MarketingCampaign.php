<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class MarketingCampaign extends Model {
    
    protected $fillable = ['user_id', 'tenant_id', 'name', 'message', 'audience', 'status', 'scheduled_at'];
    protected $casts = ['audience' => 'json', 'scheduled_at' => 'datetime'];
}

