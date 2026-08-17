<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ListingProduct extends Model {
    use SoftDeletes;
    
    protected $fillable = ['listing_id', 'tenant_id', 'name', 'description', 'price', 'unit', 'is_active'];
}

