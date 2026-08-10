"use client";

import { useState, useEffect } from "react";
import { TrueDialAPI } from "@/lib/api";
import { Loader2, MessageSquare, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await TrueDialAPI.get("/truedial/user/my-reviews");
        if (res && res.data) {
          setReviews(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">My Reviews</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage the reviews you've written for businesses.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="premium-card p-12 text-center rounded-xl border border-border bg-card/50">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No reviews yet</h3>
          <p className="text-muted-foreground text-sm mt-2 mb-6">Share your experiences and help others make better decisions.</p>
          <Link href="/search" className="btn-primary rounded-full px-6 py-2">
            Find Businesses to Review
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="premium-card p-6 rounded-xl border border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {review.business?.logo ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden relative">
                      <Image src={review.business.logo} alt={review.business.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {review.business?.title?.charAt(0) || "B"}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">
                      <Link href={`/business/${review.business?.slug}`} className="hover:text-primary transition">
                        {review.business?.title}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Link href={`/business/${review.business?.slug}`} className="text-muted-foreground hover:text-primary transition p-2 rounded-full hover:bg-secondary">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="mt-4 text-sm text-foreground/80">
                <p>{review.body}</p>
              </div>
              
              {review.reply && (
                <div className="mt-4 p-3 bg-secondary/50 rounded-lg border border-border/50 text-sm">
                  <div className="font-medium text-primary mb-1 flex items-center gap-1">
                    Response from Owner
                  </div>
                  <p className="text-muted-foreground">{review.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
