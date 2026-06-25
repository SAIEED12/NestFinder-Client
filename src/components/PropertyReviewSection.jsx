"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import { toast } from "react-hot-toast";
import { Star, MessageSquare, User, Calendar, MessageCirclePlus } from "lucide-react";

export default function PropertyReviewSection({ propertyId }) {
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const session = sessionData;

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Form State Vectors
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (propertyId) {
      fetchPropertyReviews();
    }
  }, [propertyId]);

  const fetchPropertyReviews = async () => {
    try {
      setLoadingReviews(true);
      const expressApiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${expressApiUrl}/api/properties/${propertyId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed gathering review indexes:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please log in to a tenant profile to submit reviews.");
      return;
    }

    try {
      setSubmitLoading(true);
      const expressApiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

      const response = await fetch(`${expressApiUrl}/api/properties/${propertyId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantName: session.user.name || "Anonymous Tenant",
          tenantEmail: session.user.email,
          rating,
          comment
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failure.");

      toast.success("Review logged to system ledger successfully!");
      setComment("");
      setRating(5);
      
      // Real-time reactive layout state modification hook injection
      setReviews(prev => [data.review, ...prev]);
    } catch (err) {
      toast.error(err.message || "Failed to finalize rating transmission.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800">
      {/* LEFT BLOCK: Existing Review Logs Index */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="text-[#E05638]" size={18} />
          <h3 className="text-lg font-black text-slate-950 dark:text-white tracking-tight">
            Community Experiences ({reviews.length})
          </h3>
        </div>

        {loadingReviews ? (
          <div className="py-6 text-center text-xs text-zinc-400">Loading catalog reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="bg-slate-50/50 dark:bg-zinc-900/30 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[24px] p-8 text-center text-xs text-zinc-400">
            No experiences have been charted for this rental property domain yet.
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {reviews.map((rev, index) => (
              <div 
                key={rev._id || index} 
                className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-2xl p-4 space-y-2 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* User Meta Identifiers */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center">
                      <User size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white leading-none">{rev.tenantName}</h4>
                      <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 block mt-0.5">{rev.tenantEmail}</span>
                    </div>
                  </div>

                  {/* Rating Stars Grid Info Block */}
                  <div className="flex items-center gap-0.5 bg-zinc-50 dark:bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-100 dark:border-zinc-900">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={11} 
                        className={i < rev.rating ? "text-amber-500 fill-amber-500" : "text-zinc-200 dark:text-zinc-800"} 
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Text Layout Content */}
                <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-zinc-300 pl-10">
                  {rev.comment}
                </p>

                {/* Submited Timeline Stamp Footer */}
                <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1 pl-10 pt-1">
                  <Calendar size={10} /> 
                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent Log"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT BLOCK: Dynamic Interactive Review Submission Form */}
      <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[28px] p-5 shadow-2xs h-fit space-y-4">
        <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <MessageCirclePlus className="text-[#E05638]" size={16} />
          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Write a Review</h4>
        </div>

        {!session?.user ? (
          <div className="p-4 bg-amber-50/40 border border-amber-100/50 rounded-xl text-center text-xs font-semibold text-amber-700 leading-normal">
            Please log in with an authenticated tenant account profile to share your feedback.
          </div>
        ) : (
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            {/* Interactive Rating Node Controller */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider">Select Experience Score</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHoverRating(index)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5 transition-transform active:scale-90 outline-none"
                  >
                    <Star
                      size={20}
                      className={`transition-colors ${
                        index <= (hoverRating || rating)
                          ? "text-amber-500 fill-amber-500"
                          : "text-zinc-200 dark:text-zinc-800"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-zinc-500 ml-2">({rating}/5)</span>
              </div>
            </div>

            {/* Review Comment Text Box area */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider">Your Experience Comment</label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience regarding neighborhood noise level, property space availability, or host coordination quality..."
                className="w-full text-xs font-semibold p-3 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-[#E05638]/50 min-h-[110px] text-slate-800 dark:text-zinc-100 placeholder:text-zinc-400 resize-none transition-all"
              />
            </div>

            {/* Submit Button Trigger Layer */}
            <Button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-[#E05638] hover:bg-[#c9492e] text-white font-bold text-xs h-10 rounded-xl shadow-xs transition-all active:scale-98"
            >
              {submitLoading ? "Transmitting Feedback..." : "Publish Property Review"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}