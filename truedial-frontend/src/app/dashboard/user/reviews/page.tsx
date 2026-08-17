"use client";
import { useState, useEffect } from "react";
import { Star, Edit2, Trash2, Calendar, Loader2, MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const MOCK_REVIEWS = [
  {
    id: 1, businessSlug: "sharma-grand-restaurant", businessName: "Sharma Grand Restaurant",
    businessCategory: "Restaurants & Cafes", rating: 5,
    body: "Amazing food and excellent service! The butter chicken was divine. Highly recommend for family dinners.",
    created_at: "2026-07-15", helpful: 12
  },
  {
    id: 2, businessSlug: "city-dental-clinic", businessName: "City Dental Clinic",
    businessCategory: "Hospitals & Healthcare", rating: 4,
    body: "Very professional dentist. Minimal pain during the procedure. Slightly long waiting time but worth it.",
    created_at: "2026-06-28", helpful: 7
  },
  {
    id: 3, businessSlug: "kriya-fitness-studio", businessName: "Kriya Fitness Studio",
    businessCategory: "Fitness & Gyms", rating: 4,
    body: "Good equipment and knowledgeable trainers. The morning batch timings could be better.",
    created_at: "2026-05-10", helpful: 3
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production: fetch from /truedial/user/reviews
    setTimeout(() => { setReviews(MOCK_REVIEWS); setLoading(false); }, 500);
  }, []);

  const remove = (id: number) => setReviews(prev => prev.filter(r => r.id !== id));
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">My Reviews</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Reviews you've written about businesses on TrueDial
          </p>
        </div>
        {avgRating && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-amber-600 text-sm">
              {avgRating} avg · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl shadow-sm">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-bold text-lg text-foreground mb-2">No reviews yet</h3>
          <p className="text-muted-foreground text-sm mb-6">
            You haven't reviewed any businesses yet. Explore and share your experience!
          </p>
          <Link href="/search"><Button>Explore Businesses</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(rev => (
            <div key={rev.id} className="bg-card border border-border rounded-2xl p-6 space-y-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <Link href={`/businesses/${rev.businessSlug}`} className="font-bold text-foreground hover:text-primary transition text-base">
                    {rev.businessName}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-primary font-semibold text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                      {rev.businessCategory}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(rev.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StarRating rating={rev.rating} />
                  <span className="font-bold text-sm text-foreground">{rev.rating}/5</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4 italic">
                "{rev.body}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ThumbsUp className="w-3 h-3" />
                  {rev.helpful} people found this helpful
                </span>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition px-3 py-1.5 border border-border rounded-lg hover:border-primary/30">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => remove(rev.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition px-3 py-1.5 border border-red-200 dark:border-red-900/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
