"use client";

import { useState } from "react";
import { Star, MessageSquare, CheckCircle2, ThumbsUp, ShieldCheck, Clock, Reply, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: "Pooja Singhania",
      rating: 5,
      date: "3 days ago",
      comment: "Aesthete Studio transformed our 4BHK in Bandra with incredible attention to detail! Their woodwork team was very professional and delivered on time.",
      verified: true,
      service: "Turnkey Interiors",
      reply: "Thank you so much Pooja! It was a pleasure designing your beautiful home in Bandra. We look forward to serving you again."
    },
    {
      id: 2,
      author: "Vikramaditya Deshmukh",
      rating: 5,
      date: "1 week ago",
      comment: "Best interior consultants in Mumbai. We used our TrueDial Privilege Card and got an instant 20% discount on the modular kitchen cabinetry.",
      verified: true,
      service: "Modular Kitchen",
      reply: ""
    },
    {
      id: 3,
      author: "Dr. Ananya Rao",
      rating: 4,
      date: "2 weeks ago",
      comment: "Great acoustic wall paneling work for our dental clinic in Andheri. Slightly delayed by 2 days due to rain, but quality is outstanding.",
      verified: true,
      service: "Commercial Fit-Out",
      reply: ""
    }
  ]);

  const [filterRating, setFilterRating] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const filteredReviews = reviews.filter((rev) => {
    const matchesSearch = rev.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rev.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = filterRating === "All" || 
                          (filterRating === "5" && rev.rating === 5) ||
                          (filterRating === "4" && rev.rating === 4) ||
                          (filterRating === "Unreplied" && !rev.reply);
    return matchesSearch && matchesRating;
  });

  const handleSendReply = (id: number) => {
    if (!replyText.trim()) return;
    setReviews(reviews.map(r => r.id === id ? { ...r, reply: replyText.trim() } : r));
    setReplyingTo(null);
    setReplyText("");
    setToastMessage("Official business reply posted and customer notified via email!");
    setTimeout(() => setToastMessage(""), 4000);
  };

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white mb-1">Customer Reviews & Reputation</h1>
          <p className="text-muted-foreground text-sm">
            Monitor verified client feedback and reply to build trust on TrueDial & Find My Interior.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 py-1.5 px-3 text-sm font-bold flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {avgRating} Overall Rating
          </Badge>
          <Badge className="bg-primary/10 text-primary border-primary/20 py-1.5 px-3 text-sm">
            {reviews.length} Total Reviews
          </Badge>
        </div>
      </div>

      {/* RATING BREAKDOWN BANNER */}
      <div className="premium-card p-6 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="md:col-span-1 text-center md:text-left border-b md:border-b-0 md:border-r border-border pb-4 md:pb-0">
          <div className="text-4xl font-extrabold text-foreground">{avgRating}</div>
          <div className="flex items-center justify-center md:justify-start gap-1 my-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
            ))}
          </div>
          <div className="text-xs text-muted-foreground">Based on {reviews.length} verified ratings</div>
        </div>

        <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-muted/40 p-4 rounded-xl text-center">
            <div className="text-xs text-muted-foreground font-semibold">5-Star Reviews</div>
            <div className="text-xl font-bold text-green-600 mt-1">
              {reviews.filter(r => r.rating === 5).length}
            </div>
          </div>
          <div className="bg-muted/40 p-4 rounded-xl text-center">
            <div className="text-xs text-muted-foreground font-semibold">4-Star Reviews</div>
            <div className="text-xl font-bold text-blue-600 mt-1">
              {reviews.filter(r => r.rating === 4).length}
            </div>
          </div>
          <div className="bg-muted/40 p-4 rounded-xl text-center">
            <div className="text-xs text-muted-foreground font-semibold">Replied</div>
            <div className="text-xl font-bold text-primary mt-1">
              {reviews.filter(r => r.reply).length}
            </div>
          </div>
          <div className="bg-muted/40 p-4 rounded-xl text-center">
            <div className="text-xs text-muted-foreground font-semibold">Pending Reply</div>
            <div className="text-xl font-bold text-amber-600 mt-1">
              {reviews.filter(r => !r.reply).length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="premium-card p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search reviews by name or keyword..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10" 
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-muted-foreground mr-1" />
          {["All", "5", "4", "Unreplied"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterRating(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterRating === tab 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "5" ? "5 ★ Only" : tab === "4" ? "4 ★ Only" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* REVIEWS LIST */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="premium-card p-12 text-center text-muted-foreground rounded-xl">
            <Star className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="font-medium">No reviews found matching your selected filter.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div key={rev.id} className="premium-card p-6 rounded-xl space-y-4 transition hover:border-primary/30">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-foreground">{rev.author}</h3>
                      {rev.verified && (
                        <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20 py-0.5">
                          <ShieldCheck className="w-3 h-3 mr-1 inline" /> Verified Client
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Service: <span className="font-semibold text-foreground">{rev.service}</span> • {rev.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
              </div>

              <p className="text-sm text-foreground/90 leading-relaxed pl-14">
                "{rev.comment}"
              </p>

              {/* Existing Business Reply */}
              {rev.reply && (
                <div className="ml-14 bg-muted/60 p-4 rounded-xl border border-border/80 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary">
                    <ShieldCheck className="w-4 h-4" /> Official Business Response
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {rev.reply}
                  </p>
                </div>
              )}

              {/* Reply Button or Inline Form */}
              <div className="ml-14 pt-2">
                {replyingTo === rev.id ? (
                  <div className="space-y-3 bg-muted/40 p-4 rounded-xl border border-border">
                    <Textarea
                      rows={3}
                      placeholder={`Reply to ${rev.author} as official business owner...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="bg-background text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => { setReplyingTo(null); setReplyText(""); }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleSendReply(rev.id)}
                        className="font-semibold"
                      >
                        Post Official Reply
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setReplyingTo(rev.id);
                      setReplyText(rev.reply || "");
                    }}
                    className="text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    {rev.reply ? "Edit Official Response" : "Reply to Customer"}
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
