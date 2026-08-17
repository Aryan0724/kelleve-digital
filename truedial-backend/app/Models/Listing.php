<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Listing extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'user_id', 'category_id', 'title', 'slug', 'description', 'tagline', 'cover_image',
        'phone', 'whatsapp', 'email', 'website', 'city', 'district', 'state', 'address',
        'lat', 'lng', 'avg_rating', 'review_count', 'is_featured', 'is_premium', 'is_verified',
        'status', 'views_count', 'phone_clicks', 'whatsapp_clicks', 'website_clicks', 'tenant_id',
        'subscription_plan', 'subscription_status', 'gst_number', 'services', 'products',
        'social_links', 'availability'
    ];
    protected $casts = [
        'services' => 'json',
        'products' => 'json',
        'social_links' => 'json',
        'availability' => 'json',
    ];

    public function scopeActive($query) { return $query->where('status', 'active'); }
    public function scopeByCategory($query, $id) { return $query->where('category_id', $id); }
    
    public function category() { return $this->belongsTo(Category::class); }
    public function gallery() { return $this->hasMany(ListingGallery::class); }
    public function reviews() { return $this->hasMany(Review::class); }
    public function offers() { return $this->hasMany(Offer::class); }
    public function listingProducts() { return $this->hasMany(ListingProduct::class); }
    public function listingServices() { return $this->hasMany(ListingService::class); }
    public function media() { return $this->morphMany(Media::class, 'model'); }
    public function user() { return $this->belongsTo(User::class); } // auth connection
}

