"use client";

import { useState } from "react";
import { Star, UserCircle2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ReviewSection({ reviews, reviewableType, reviewableId, professionalId }: { reviews: any[], reviewableType: string, reviewableId: number, professionalId?: number }) {
  const { user, token } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in to post a review.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/user/reviews", {
        reviewable_type: reviewableType.toLowerCase(),
        reviewable_id: reviewableId,
        professional_id: professionalId,
        rating,
        body,
      });
      setSuccess(true);
      setBody("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to post review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 mt-6">
      <h3 className="text-lg font-semibold text-slate-900 border-b pb-2 mb-6">Client Reviews</h3>
      
      {/* Existing Reviews */}
      <div className="space-y-6 mb-8">
        {reviews.length === 0 ? (
          <p className="text-slate-500 italic">No reviews yet. Be the first to leave a review!</p>
        ) : (
          reviews.map((review: any) => (
            <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
              <div className="flex items-center gap-3 mb-2">
                <UserCircle2 className="h-10 w-10 text-slate-300" />
                <div>
                  <div className="font-medium text-slate-900">{review.user?.name || "Anonymous"}</div>
                  <div className="text-sm text-slate-500">{review.created_at}</div>
                </div>
              </div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}`} />
                ))}
              </div>
              <p className="text-slate-700">{review.body}</p>
            </div>
          ))
        )}
      </div>

      {/* Review Form */}
      <div className="bg-slate-50 p-6 rounded-lg border">
        <h4 className="font-medium text-slate-900 mb-4">Write a Review</h4>
        {success ? (
          <div className="text-green-600 bg-green-50 p-3 rounded-md">
            Thank you! Your review has been submitted and is pending approval.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-600 bg-red-50 p-3 rounded-md text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none">
                    <Star className={`h-6 w-6 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Your Review</label>
              <Textarea 
                required 
                rows={4} 
                placeholder="Share your experience working with this professional..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
