"use client";

import { useState } from "react";
import { TrueDialAPI } from "@/lib/api";
import { Star } from "lucide-react";

export default function WriteReviewModal({ listingId, listingSlug, onClose, onSubmitted }: { listingId: number, listingSlug: string, onClose: () => void, onSubmitted: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/truedial/user/businesses/${listingSlug}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // simple check for auth
        },
        body: JSON.stringify({ rating, title, body })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to submit review. Make sure you are logged in.");
      } else {
        onSubmitted();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <h3 className="text-xl font-bold">Write a Review</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium mb-2">Overall Rating *</label>
            <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <Star className={`w-10 h-10 ${(hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-zinc-300 dark:text-zinc-600"}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Headline</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent"
              placeholder="What's most important to know?"
              maxLength={255}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Written Review</label>
            <textarea 
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent min-h-[120px]"
              placeholder="What did you like or dislike?"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 rounded-xl font-medium text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
