"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import api from "@/lib/api";

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalId: number;
  requirementId: number;
  onSuccess: () => void;
}

export function LeaveReviewModal({ isOpen, onClose, professionalId, requirementId, onSuccess }: LeaveReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post("/user/reviews", {
        professional_id: professionalId,
        requirement_id: requirementId,
        rating: rating,
        review_text: review
      });
      alert("Review submitted successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-sm text-slate-500 font-medium">How was your experience?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-colors"
                >
                  <Star 
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating) 
                        ? "fill-amber-400 text-amber-400" 
                        : "text-slate-300"
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Detailed Feedback (Optional)</label>
            <Textarea 
              placeholder="Tell us about the quality of work, timeline, and professionalism..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="h-24 resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting || rating === 0} className="bg-orange-600 hover:bg-orange-700">
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
