"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { secureFetch } from "@/lib/api";
import Link from "next/link";
import { 
  Building, 
  Heart, 
  CreditCard, 
  Calendar, 
  ArrowUpRight, 
  MapPin, 
  User,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles
} from "lucide-react";

export default function TenantDashboard() {
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const session = sessionData;

  const [stats, setStats] = useState({ activeBookings: 0, totalFavorites: 0, totalSpent: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchTenantDashboardData();
    }
  }, [session]);

  const fetchTenantDashboardData = async () => {
    try {
      setLoading(true);
      const userId = session?.user?.id;

      // 💡 Fetching Tenant's bookings and favorites concurrently via secure channels
      const [bookingsRes, favoritesRes] = await Promise.all([
        secureFetch(`/api/bookings/tenant/${userId}`),
        secureFetch(`/api/favorites/tenant/${userId}`)
      ]);

      let bookingsData = [];
      let favoritesData = [];

      if (bookingsRes.ok) bookingsData = await bookingsRes.json();
      if (favoritesRes.ok) favoritesData = await favoritesRes.json();

      // Calculate localized stats metrics
      const settledBookings = bookingsData.filter(b => b.paymentStatus === "Paid");
      const totalSpent = settledBookings.reduce((sum, b) => sum + (Number(b.rentAmount) || 0), 0);

      setStats({
        activeBookings: bookingsData.filter(b => b.bookingStatus === "Approved").length,
        totalFavorites: favoritesData.length,
        totalSpent
      });

      // Keep top 3 most recent bookings for summary panel showcase
      setRecentBookings(bookingsData.slice(0, 3));

    } catch (err) {
      console.error("Tenant overview metrics compilation exception:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200/20">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 px-2.5 py-1 rounded-full text-xs font-bold border border-red-200/20">
            <XCircle size={12} /> Rejected
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200/20">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  if (loading || sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#E05638] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500">Compiling your personalized dashboard profile...</p>
      </div>
    );
  }

  if (!session || session?.user?.role !== "tenant") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <ShieldAlert size={32} className="text-red-500 mb-2" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Access Denied</h3>
        <p className="text-xs text-zinc-500 mt-1">Tenant verification profile needed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner Card Row */}
      <div className="bg-slate-900 dark:bg-zinc-900 text-white rounded-[28px] p-6 relative overflow-hidden shadow-xl border border-zinc-800">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
          <Sparkles size={200} />
        </div>
        <div className="space-y-1 relative z-10">
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            Welcome back, {session?.user?.name || "Explorer"}! 👋
          </h2>
          <p className="text-xs text-zinc-400 max-w-md font-medium">
            Manage your lease checkouts, view saved luxury properties, and monitor upcoming move-in dates easily.
          </p>
        </div>
      </div>

      {/* ─── QUICK METRICS GRID CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active Leases */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] flex items-center justify-between shadow-3xs">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Active Leases</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.activeBookings}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#E05638]/5 text-[#E05638] flex items-center justify-center border border-[#E05638]/10">
            <Building size={20} />
          </div>
        </div>

        {/* Saved Favorites */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] flex items-center justify-between shadow-3xs">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">My Favorites</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalFavorites}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-pink-500/5 text-pink-500 flex items-center justify-center border border-pink-500/10">
            <Heart size={20} />
          </div>
        </div>

        {/* Total Settled Capital */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] flex items-center justify-between shadow-3xs">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Total Rent Settled</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">${stats.totalSpent}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/5 text-emerald-500 flex items-center justify-center border border-emerald-500/10">
            <CreditCard size={20} />
          </div>
        </div>
      </div>

      {/* ─── TWO COLUMN SUMMARY SECTION CONTENT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Recent Bookings Activity Overview Table */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] shadow-3xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
              Recent Booking Logs
            </h3>
            <Link href="/dashboard/tenant/my-bookings" className="text-xs font-bold text-[#E05638] flex items-center gap-0.5 hover:underline">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl text-xs text-zinc-400 font-medium">
              No reservation profiles recorded yet. Try booking your first premium workspace stay!
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div 
                  key={booking._id} 
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-slate-50 dark:border-zinc-800 p-4 rounded-xl gap-3 bg-slate-50/20 dark:bg-zinc-900/10 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white max-w-[240px] truncate">
                      {booking.propertyTitle || "Premium Workspace Unit"}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400 font-medium">
                      <span className="flex items-center gap-1"><Calendar size={11}/> Move-In: {new Date(booking.moveInDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-0.5"><CreditCard size={11}/> ${booking.rentAmount}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div>{getStatusBadge(booking.bookingStatus)}</div>
                    <Link href={`/all-properties/${booking.propertyId}`}>
                      <button className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-zinc-500 hover:text-[#E05638] transition-colors shadow-3xs">
                        <ArrowUpRight size={13} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Shortcut Directory Links Grid Map */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] shadow-3xs flex-1 space-y-4">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
              Quick Navigation
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link href="/all-properties" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-all group">
                <span className="flex items-center gap-2"><MapPin size={14} className="text-[#E05638]"/> Browse Marketplace</span>
                <ArrowUpRight size={14} className="text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              
              <Link href="/dashboard/tenant/favorites" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-all group">
                <span className="flex items-center gap-2"><Heart size={14} className="text-pink-500"/> My Saved Units</span>
                <ArrowUpRight size={14} className="text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link href="/dashboard/tenant/my-bookings" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-all group">
                <span className="flex items-center gap-2"><Building size={14} className="text-blue-500"/> Lease Documents</span>
                <ArrowUpRight size={14} className="text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}