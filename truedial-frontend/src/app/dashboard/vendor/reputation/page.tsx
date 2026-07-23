"use client";

import { useState, useEffect } from "react";
import { TrueDialAPI } from "@/lib/api";
import { Star, Filter, MessageSquare, Flag, ThumbsUp, AlertCircle, ChevronDown, CheckCircle } from "lucide-react";

export default function VendorReputationCenter() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // Analytics State
  const [analytics, setAnalytics] = useState({
    avgRating: 0,
    totalReviews: 0,
    receivedRepliesPercent: 0,
    avgResponseTime: "0 hours"
  });

  // Filters State
  const [filter, setFilter] = useState("all"); // 'all', 'awaiting', 'replied', 'reported', '1star', '5star'

  // Modal State
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [modalType, setModalType] = useState<"reply" | "report" | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [reportReason, setReportReason] = useState("Spam");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await TrueDialAPI.getVendorReviews(page);
    if (res.success) {
      const fetchedReviews = res.data.data;
      if (page === 1) {
        setReviews(fetchedReviews);
        // Compute mock analytics for now
        const total = res.data.total;
        const avg = fetchedReviews.length > 0 ? fetchedReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / fetchedReviews.length : 0;
        const replied = fetchedReviews.filter((r: any) => r.replies && r.replies.length > 0).length;
        setAnalytics({
          avgRating: avg,
          totalReviews: total,
          receivedRepliesPercent: total > 0 ? Math.round((replied / fetchedReviews.length) * 100) : 0,
          avgResponseTime: "3.2 hours"
        });
      } else {
        setReviews(prev => [...prev, ...fetchedReviews]);
      }
      setHasMore(res.data.next_page_url !== null);
    }
    setLoading(false);
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim()) return;
    setSubmitting(true);
    const res = await TrueDialAPI.replyToReview(selectedReview.id, replyBody);
    if (res.success) {
      setReviews(prev => prev.map(r => r.id === selectedReview.id ? { ...r, replies: [res.data] } : r));
      setModalType(null);
      setSelectedReview(null);
      setReplyBody("");
    } else {
      alert(res.message || "Failed to post reply");
    }
    setSubmitting(false);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await TrueDialAPI.reportReview(selectedReview.id, reportReason, "");
    if (res.success) {
      setReviews(prev => prev.map(r => r.id === selectedReview.id ? { ...r, status: 'reported' } : r));
      setModalType(null);
      setSelectedReview(null);
    } else {
      alert(res.message || "Failed to report review");
    }
    setSubmitting(false);
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'awaiting') return !r.replies || r.replies.length === 0;
    if (filter === 'replied') return r.replies && r.replies.length > 0;
    if (filter === 'reported') return r.status === 'reported';
    if (filter === '5star') return r.rating === 5;
    if (filter === '1star') return r.rating === 1;
    return true; // 'all'
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Reputation Center</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your business reviews, respond to customers, and track your ratings.</p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-1">Overall Rating</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-zinc-900 dark:text-white">{analytics.avgRating.toFixed(1)}</span>
              <div className="flex text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-1">Total Reviews</div>
            <div className="text-4xl font-bold text-zinc-900 dark:text-white">{analytics.totalReviews}</div>
            <div className="text-xs text-green-500 mt-1 font-medium">+2 this week</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-1">Response Rate</div>
            <div className="text-4xl font-bold text-zinc-900 dark:text-white">{analytics.receivedRepliesPercent}%</div>
            <div className="text-xs text-zinc-500 mt-1">Reviews with replies</div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-1">Avg Response Time</div>
            <div className="text-4xl font-bold text-zinc-900 dark:text-white">{analytics.avgResponseTime}</div>
          </div>
        </div>

        {/* Inbox Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-2 bg-zinc-50 dark:bg-zinc-900/50">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>All Reviews</button>
            <button onClick={() => setFilter('awaiting')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${filter === 'awaiting' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
              <AlertCircle className="w-4 h-4" /> Awaiting Reply
            </button>
            <button onClick={() => setFilter('replied')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'replied' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>Replied</button>
            <button onClick={() => setFilter('5star')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${filter === '5star' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>5 <Star className="w-3 h-3 fill-current" /></button>
            <button onClick={() => setFilter('1star')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${filter === '1star' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>1 <Star className="w-3 h-3 fill-current" /></button>
            <button onClick={() => setFilter('reported')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${filter === 'reported' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>Reported</button>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {loading && page === 1 ? (
              <div className="p-12 text-center text-zinc-500">Loading inbox...</div>
            ) : filteredReviews.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">No reviews found for this filter.</div>
            ) : (
              filteredReviews.map(review => (
                <div key={review.id} className={`p-6 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${!review.replies?.length && review.status !== 'reported' ? 'border-l-4 border-l-red-500' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-zinc-300 dark:text-zinc-600"}`} />
                          ))}
                        </div>
                        <span className="font-semibold text-zinc-900 dark:text-white">{review.user?.name}</span>
                        <span className="text-sm text-zinc-500">{new Date(review.created_at).toLocaleDateString()}</span>
                        {review.status === 'reported' && (
                          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium"><Flag className="w-3 h-3" /> Reported</span>
                        )}
                      </div>
                      <h4 className="font-bold text-zinc-900 dark:text-white mb-1">{review.title}</h4>
                      <p className="text-zinc-600 dark:text-zinc-300 text-sm max-w-3xl">{review.body}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {(!review.replies || review.replies.length === 0) ? (
                        <button 
                          onClick={() => { setSelectedReview(review); setModalType('reply'); }}
                          className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                        >
                          Reply
                        </button>
                      ) : (
                        <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium rounded-lg flex items-center justify-center gap-2 border border-green-200 dark:border-green-900/50">
                          <CheckCircle className="w-4 h-4" /> Replied
                        </div>
                      )}
                      
                      {review.status !== 'reported' && (
                        <button 
                          onClick={() => { setSelectedReview(review); setModalType('report'); }}
                          className="px-4 py-2 text-zinc-500 hover:text-red-600 text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <Flag className="w-3 h-3" /> Report
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Display Reply if exists */}
                  {review.replies && review.replies.length > 0 && (
                    <div className="mt-4 ml-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Your Reply
                        </span>
                        <span className="text-xs text-zinc-500">{new Date(review.replies[0].created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">{review.replies[0].body}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {hasMore && !loading && (
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
              <button onClick={() => setPage(p => p + 1)} className="text-sm font-medium text-blue-600 hover:text-blue-700">Load More</button>
            </div>
          )}
        </div>
      </main>

      {/* Reply Modal */}
      {modalType === 'reply' && selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md h-full shadow-2xl animate-fade-in-right flex flex-col">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold">Reply to Review</h3>
              <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {/* Original Review Context */}
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-2 text-sm text-zinc-500">
                  <span className="font-semibold text-zinc-900 dark:text-white">{selectedReview.user?.name}</span>
                  <span>•</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < selectedReview.rating ? "fill-current" : "text-zinc-300 dark:text-zinc-600"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">"{selectedReview.body}"</p>
              </div>

              <form id="replyForm" onSubmit={handleReplySubmit}>
                <label className="block text-sm font-medium mb-2">Your Public Response</label>
                <textarea 
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  className="w-full h-48 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Thank the customer for their feedback..."
                  maxLength={1000}
                  required
                ></textarea>
                <div className="text-right text-xs text-zinc-500 mt-2">{replyBody.length}/1000</div>
              </form>
            </div>
            
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
              <button onClick={() => setModalType(null)} className="flex-1 py-3 font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors">Cancel</button>
              <button type="submit" form="replyForm" disabled={submitting} className="flex-1 py-3 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50">
                {submitting ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {modalType === 'report' && selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2 text-red-600"><Flag className="w-5 h-5" /> Report Review</h3>
              <button onClick={() => setModalType(null)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">&times;</button>
            </div>
            
            <form onSubmit={handleReportSubmit} className="p-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">Reporting a review sends it to our moderation team. It will be temporarily hidden from your public profile pending review.</p>
              
              <label className="block text-sm font-medium mb-3">Reason for reporting</label>
              <div className="space-y-3 mb-6">
                {['Spam', 'Fake review', 'Offensive', 'Wrong business', 'Other'].map(reason => (
                  <label key={reason} className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <input 
                      type="radio" 
                      name="reportReason" 
                      value={reason} 
                      checked={reportReason === reason} 
                      onChange={() => setReportReason(reason)}
                      className="text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{reason}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setModalType(null)} className="flex-1 py-2.5 font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50">
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
