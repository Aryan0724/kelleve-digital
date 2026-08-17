<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ListingGallery extends Model {
    
    protected $fillable = ['listing_id', 'image_url', 'caption', 'type', 'video_url', 'sort_order'];
}

