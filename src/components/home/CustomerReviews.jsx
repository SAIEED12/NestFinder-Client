"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MessageSquare, Quote, Building } from "lucide-react";

// ─── Avatar with initials fallback ───────────────────────────────────────────
function Avatar({ src, name }) {
  const [failed, setFailed] = useState(false);

  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  // Pick a stable color from name
  const colors = [
    "bg-rose-500", "bg-orange-500", "bg-amber-500",
    "bg-emerald-500", "bg-sky-500", "bg-violet-500", "bg-pink-500",
  ];
  const colorIndex = name
    ? name.charCodeAt(0) % colors.length
    : 0;
  const bgColor = colors[colorIndex];

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name || "Tenant"}
        onError={() => setFailed(true)}
        className="w-9 h-9 rounded-xl object-cover shrink-0 border border-zinc-100 dark:border-zinc-800"
      />
    );
  }

  return (
    <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center ${bgColor} border border-white/20`}>
      <span className="text-[11px] font-black text-white">{initials}</span>
    </div>
  );
}

// ─── Star row ─────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? "text-amber-500 fill-amber-500" : "text-zinc-200 dark:text-zinc-800"}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopReviews = async () => {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const res  = await fetch(`${base}/api/home/top-reviews`);
        if (res.ok) setReviews(await res.json());
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopReviews();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="w-48 h-6 bg-slate-100 dark:bg-zinc-800 rounded-lg animate-pulse mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-56 bg-slate-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 rounded-[24px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="bg-slate-50/50 dark:bg-zinc-950/20 border-y border-slate-100/80 dark:border-zinc-900/40 py-20">
      <div className="max-w-7xl mx-auto px-4 space-y-12">

        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E05638]/5 rounded-full text-[10px] font-black text-[#E05638] uppercase tracking-widest border border-[#E05638]/10">
            <MessageSquare size={12} /> Testimonials
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
            What Our Tenants Say
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            Real feedback from verified tenants about their stay experience.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => {
            const avatarSrc =
              review.tenantImage || review.userImage || review.image || review.avatar || null;

            return (
              <div
                key={review._id}
                className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[24px] p-5 flex flex-col gap-4 shadow-sm group relative overflow-hidden hover:border-[#E05638]/20 dark:hover:border-[#E05638]/20 transition-all duration-300"
              >
                {/* Background quote icon */}
                <Quote
                  size={52}
                  className="absolute -top-2 -right-2 text-slate-50 dark:text-zinc-800/30 group-hover:text-orange-50/60 transition-colors z-0"
                  strokeWidth={3}
                />

                {/* Stars */}
                <div className="relative z-10">
                  <Stars rating={review.rating} />
                </div>

                {/* Comment */}
                <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-zinc-300 line-clamp-4 italic relative z-10 flex-1">
                  &ldquo;{review.comment || "Exceptional stay with great attention to detail."}&rdquo;
                </p>

                {/* Footer */}
                <div className="border-t border-slate-100 dark:border-zinc-800/60 pt-3 space-y-2 relative z-10">
                  {/* Property link */}
                  {review.propertyTitle && (
                    <Link
                      href={`/all-properties/${review.propertyId}`}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 hover:text-[#E05638] transition-colors"
                    >
                      <Building size={11} className="shrink-0 text-zinc-300 dark:text-zinc-600" />
                      <span className="truncate">{review.propertyTitle}</span>
                    </Link>
                  )}

                  {/* Tenant identity */}
                  <div className="flex items-center gap-2.5">
                    <Avatar src={avatarSrc} name={review.tenantName} />
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate leading-tight">
                        {review.tenantName || "Verified Guest"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}