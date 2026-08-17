<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use SoftDeletes;
    
    protected $fillable = ['listing_id', 'user_id', 'reviewer_id', 'tenant_id', 'rating', 'title', 'body', 'status', 'helpful_count', 'vendor_reply', 'vendor_replied_at'];

    public function scopeApproved($query) { return $query->where('status', 'approved'); }
    
    public function user() { return $this->belongsTo(User::class); }
    public function listing() { return $this->belongsTo(Listing::class); }
    public function replies() { return $this->hasMany(ReviewReply::class); }
    public function helpfulVotes() { return $this->hasMany(ReviewHelpfulVote::class); }

    protected static function booted()
    {
        static::saved(function ($review) {
            if ($review->status == 'approved') {
                $listing = $review->listing;
                if ($listing) {
                    $avg = $listing->reviews()->approved()->avg('rating');
                    $count = $listing->reviews()->approved()->count();
                    $listing->update(['avg_rating' => $avg, 'review_count' => $count]);
                }
            }
        });
    }
}

