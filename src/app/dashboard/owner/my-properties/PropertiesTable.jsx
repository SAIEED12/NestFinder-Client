"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, Bath, Maximize2, Eye, X, MessageSquare } from "lucide-react";

// ─── Feedback View Modal ─────────────────────────────────────────────────────
function FeedbackModal({ isOpen, property, onClose }) {
  if (!isOpen || !property) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-[28px] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X size={15} />
        </button>

        <div className="flex flex-col items-center gap-2 pt-8 pb-3 text-center px-6">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center mb-1">
            <MessageSquare size={20} />
          </div>
          <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Rejection Feedback
          </h3>
          <p className="text-xs text-zinc-400 font-medium line-clamp-1 max-w-[280px]">
            {property.title}
          </p>
        </div>

        <div className="px-6 pb-3">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-4">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium leading-relaxed">
              {property.adminFeedback || "No feedback provided by the administrator."}
            </p>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2 text-center">
            Please address the feedback above and resubmit your listing.
          </p>
        </div>

        <div className="flex justify-center pb-7 pt-3 px-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E05638] hover:bg-[#c94a2e] active:scale-95 transition-all shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Approved: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40",
    Rejected: "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40",
    Pending:  "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40",
  };
  const label = status || "Pending";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${map[label] ?? map.Pending}`}>
      {label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PropertiesTable({ propertiesData }) {
  const properties  = propertiesData?.data || [];
  const page        = Number(propertiesData?.page) || 1;
  const totalPages  = Number(propertiesData?.totalPage) || 1;
  const pages       = Array.from({ length: totalPages }, (_, i) => i + 1);

  const [feedbackModal, setFeedbackModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const openFeedback = (property) => {
    setSelectedProperty(property);
    setFeedbackModal(true);
  };

  return (
    <>
      <FeedbackModal
        isOpen={feedbackModal}
        property={selectedProperty}
        onClose={() => { setFeedbackModal(false); setSelectedProperty(null); }}
      />

      <div className="w-full space-y-4">
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Rent</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-slate-700 dark:text-zinc-300">
                {properties.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-xs text-zinc-400">
                      No properties found in your listing.
                    </td>
                  </tr>
                ) : properties.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 transition-colors">

                    {/* Preview */}
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/50 shrink-0">
                        <img
                          src={item.images || "https://i.ibb.co/MkKVxKLm/hero.jpg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://i.ibb.co/MkKVxKLm/hero.jpg"; }}
                        />
                      </div>
                    </td>

                    {/* Title + specs */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-zinc-100 text-sm line-clamp-1 max-w-[200px]">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5"><Home size={10} /> {item.bedrooms} Bed</span>
                        <span className="flex items-center gap-0.5"><Bath size={10} /> {item.bathrooms} Bath</span>
                        <span className="flex items-center gap-0.5"><Maximize2 size={10} /> {item.size} sqft</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400 max-w-[140px] truncate">
                      {item.location}
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        {item.propertyType}
                      </span>
                    </td>

                    {/* Rent */}
                    <td className="px-6 py-4">
                      <span className="font-black text-slate-900 dark:text-zinc-100">${item.rent}</span>
                      <span className="text-[10px] text-zinc-400 font-normal ml-0.5">/{item.rentType}</span>
                    </td>

                    {/* Status + feedback eye */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.status} />
                        {item.status === "Rejected" && (
                          <button
                            onClick={() => openFeedback(item)}
                            title="View rejection feedback"
                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/40"
                          >
                            <Eye size={12} />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-1 px-6 py-3 border-t border-slate-100 dark:border-zinc-800">
              {page > 1 ? (
                <Link href={`/dashboard/owner/my-properties?page=${page - 1}`} className="px-3 py-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  ← Prev
                </Link>
              ) : (
                <span className="px-3 py-1.5 text-xs font-bold text-zinc-300 dark:text-zinc-700 cursor-not-allowed">← Prev</span>
              )}
              {pages.map((p) => (
                <Link
                  key={p}
                  href={`/dashboard/owner/my-properties?page=${p}`}
                  className={`min-w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                    p === page ? "bg-[#E05638] text-white shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {p}
                </Link>
              ))}
              {page < totalPages ? (
                <Link href={`/dashboard/owner/my-properties?page=${page + 1}`} className="px-3 py-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  Next →
                </Link>
              ) : (
                <span className="px-3 py-1.5 text-xs font-bold text-zinc-300 dark:text-zinc-700 cursor-not-allowed">Next →</span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}