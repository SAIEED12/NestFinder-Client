"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { User, Mail, Calendar, ShieldCheck } from "lucide-react";

export default function AdminProfile() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-[#E05638] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Formatting helper for standard user signup dates
  const formatDate = (dateString) => {
    if (!dateString) return "2026-06-19"; // Fallback to current date match
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-xs overflow-hidden mt-6">
      
      {/* 1. Brand Theme Matched Banner Gradient */}
      <div className="h-44 w-full bg-gradient-to-r from-[#E05638] via-[#e26246] to-amber-500 relative" />

      {/* 2. Main Profile Avatar Panel Section */}
      <div className="flex flex-col items-center -mt-16 pb-6 relative z-10">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 bg-zinc-100 shadow-md">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-orange-50 dark:bg-zinc-800 flex items-center justify-center text-[#E05638] text-3xl font-bold select-none">
              {user?.name?.charAt(0).toUpperCase() || "O"}
            </div>
          )}
        </div>

        {/* Identity Signature Text Details */}
        <div className="text-center mt-4 space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {user?.name || "Premium Property Owner"}
          </h2>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-zinc-900 text-white dark:bg-white dark:text-black">
            {user?.role || "owner"}
          </span>
        </div>
      </div>

      {/* 3. The 4-Box Information Specification Grid */}
      <div className="p-8 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Box 1: Full Name */}
        <div className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-2xs">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400">
            <User size={20} className="stroke-[1.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Full Name</p>
            <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-0.5 truncate">
              {user?.name || "Doe"}
            </p>
          </div>
        </div>

        {/* Box 2: Email Address */}
        <div className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-2xs">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400">
            <Mail size={20} className="stroke-[1.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Email Address</p>
            <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-0.5 truncate">
              {user?.email || "doe@gmail.com"}
            </p>
          </div>
        </div>

        {/* Box 3: Role Specification */}
        <div className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-2xs">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400">
            <ShieldCheck size={20} className="stroke-[1.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Role</p>
            <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-0.5 capitalize">
              {user?.role || "owner"}
            </p>
          </div>
        </div>

        {/* Box 4: Account Membership Timestamp */}
        <div className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-2xs">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400">
            <Calendar size={20} className="stroke-[1.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Member Since</p>
            <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mt-0.5">
              {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}