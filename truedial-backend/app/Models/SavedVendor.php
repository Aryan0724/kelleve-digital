<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class SavedVendor extends Model {
    
    protected $fillable = ['tenant_id', 'user_id', 'vendor_id'];
}

