<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ListingService extends Model {
    use SoftDeletes;
    
    protected $fillable = ['listing_id', 'tenant_id', 'name', 'description', 'price_from', 'price_to', 'is_active'];
}

