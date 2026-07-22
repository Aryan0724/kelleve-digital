"use client";

import { useEffect, useState } from "react";
import { TrueDialAPI } from "@/lib/api";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import WriteReviewModal from "./WriteReviewModal";

export default function ReviewSection({ listing, authUser }: { listing: any, authUser?: any }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [listing.slug, page]);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await TrueDialAPI.getListingReviews(listing.slug, page);
    if (res.success) {
      if (page === 1) {
        setReviews(res.data.data);
      } else {
        setReviews(prev => [...prev, ...res.data.data]);
      }
      setHasMore(res.data.next_page_url !== null);
    }
    setLoading(false);
  };

  const handleHelpful = async (reviewId: number) => {
    if (!authUser) {
      alert("Please login to vote.");
      return;
    }
    // Optimistic update
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return { ...r, helpful_votes_count: (r.helpful_votes_count || 0) + 1 }; // simple fake toggle logic for MVP
      }
      return r;
    }));
    // We would call the API here: await TrueDialAPI.voteHelpful(reviewId);
  };

  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 space-y-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Reviews & Ratings</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center text-yellow-400">
              <Star className="w-6 h-6 fill-current" />
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50 ml-2">{listing.avg_rating || "0.0"}</span>
            </div>
            <span className="text-zinc-500 dark:text-zinc-400">({listing.review_count || 0} reviews)</span>
          </div>
        </div>
        
        {authUser?.id !== listing.user_id && (
          <button 
            onClick={() => setWriteReviewOpen(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-sm shadow-blue-500/20 active:scale-95"
          >
            Write a Review
          </button>
        )}
      </div>

      <div className="space-y-6">
        {reviews.length === 0 && !loading ? (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            No reviews yet. Be the first to share your experience!
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    {review.user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-50">{review.user?.name}</div>
                    <div className="text-xs text-zinc-500">{new Date(review.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-zinc-300 dark:text-zinc-600"}`} />
                  ))}
                </div>
              </div>

              {review.title && <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mt-4">{review.title}</h4>}
              {review.body && <p className="text-zinc-600 dark:text-zinc-300 mt-2 text-sm leading-relaxed">{review.body}</p>}

              {/* Vendor Reply */}
              {review.replies && review.replies.length > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-900/50 border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Reply from Business</span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{review.replies[0].body}</p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-4">
                <button 
                  onClick={() => handleHelpful(review.id)}
                  className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({review.helpful_votes_count || 0})
                </button>
              </div>
            </div>
          ))
        )}

        {loading && <div className="text-center text-sm text-zinc-500 py-4">Loading reviews...</div>}
        
        {hasMore && !loading && (
          <div className="text-center">
            <button 
              onClick={() => setPage(p => p + 1)}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
      
      {/* WriteReviewModal placeholder */}
      {writeReviewOpen && (
        <WriteReviewModal 
          listingId={listing.id}
          listingSlug={listing.slug}
          onClose={() => setWriteReviewOpen(false)} 
          onSubmitted={() => {
            setPage(1);
            fetchReviews();
          }} 
        />
      )}
    </div>
  );
}
