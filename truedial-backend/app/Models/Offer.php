<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    
    protected $fillable = ['listing_id', 'tenant_id', 'title', 'description', 'promo_code', 'valid_until', 'status', 'discount_type', 'discount_value', 'cta_label', 'cta_url'];

    public function scopeActive($query) { return $query->where('status', 'active'); }
    public function listing() { return $this->belongsTo(Listing::class); }
}

