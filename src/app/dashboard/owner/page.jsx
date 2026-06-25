"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { secureFetch } from "@/lib/api";
import Link from "next/link";
import { 
  DollarSign, 
  Building, 
  FileText, 
  ArrowUpRight, 
  PlusCircle, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ShieldAlert,
  Sparkles
} from "lucide-react";

export default function OwnerDashboard() {
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const session = sessionData;

  const [stats, setStats] = useState({ totalEarnings: 0, totalProperties: 0, totalBookings: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchOwnerDashboardData();
    }
  }, [session]);

  const fetchOwnerDashboardData = async () => {
    try {
      setLoading(true);
      const ownerId = session?.user?.id;

      // 💡 Fetch stats from your backend analytics engine & recent requests concurrently via secure channels
      const [analyticsRes, requestsRes] = await Promise.all([
        secureFetch(`/api/owner/analytics/${ownerId}`),
        secureFetch(`/api/bookings/owner/${ownerId}`)
      ]);

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.ok ? await analyticsRes.json() : null;
        if (analyticsData?.success) {
          setStats({
            totalEarnings: analyticsData.stats.totalEarnings || 0,
            totalProperties: analyticsData.stats.totalProperties || 0,
            totalBookings: analyticsData.stats.totalBookings || 0
          });
        }
      }

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        // Keep top 3 most recent requests for overview showcase summary panel
        setRecentRequests(requestsData.slice(0, 3));
      }

    } catch (err) {
      console.error("Owner dashboard ledger data load failure:", err);
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
        <p className="mt-4 text-sm text-gray-500">Compiling your hosting profile matrices...</p>
      </div>
    );
  }

  if (!session || session?.user?.role !== "owner") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <ShieldAlert size={32} className="text-red-500 mb-2" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Access Denied</h3>
        <p className="text-xs text-zinc-500 mt-1">Host Owner clearance permissions are required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome Greeting Row */}
      <div className="bg-slate-900 dark:bg-zinc-900 text-white rounded-[28px] p-6 relative overflow-hidden shadow-xl border border-zinc-800">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
          <Sparkles size={200} />
        </div>
        <div className="space-y-1 relative z-10">
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            Welcome back, {session?.user?.name || "Host"}! 🏢
          </h2>
          <p className="text-xs text-zinc-400 max-w-md font-medium">
            Monitor real-time rental revenue streams, evaluate tenant application forms, and add new properties instantly.
          </p>
        </div>
      </div>

      {/* ─── QUICK METRICS CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Yield Earnings */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] flex items-center justify-between shadow-3xs">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">${stats.totalEarnings}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/5 text-emerald-500 flex items-center justify-center border border-emerald-500/10">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Total Properties List */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] flex items-center justify-between shadow-3xs">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Active Listings</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalProperties}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/5 text-blue-500 flex items-center justify-center border border-blue-500/10">
            <Building size={20} />
          </div>
        </div>

        {/* Incoming Rental requests count */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] flex items-center justify-between shadow-3xs">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Total Booking Requests</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalBookings}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#E05638]/5 text-[#E05638] flex items-center justify-center border border-[#E05638]/10">
            <FileText size={20} />
          </div>
        </div>
      </div>

      {/* ─── TWO COLUMN SUMMARY SECTION CONTENT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Hand Column: Recent Requests Action Hub Card */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] shadow-3xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
              Recent Rental Requests
            </h3>
            <Link href="/dashboard/owner/booking-requests" className="text-xs font-bold text-[#E05638] flex items-center gap-0.5 hover:underline">
              Manage Requests <ArrowUpRight size={14} />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl text-xs text-zinc-400 font-medium">
              No reservation profiles recorded against your listings ledger yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div 
                  key={request._id} 
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-slate-50 dark:border-zinc-800 p-4 rounded-xl gap-3 bg-slate-50/20 dark:bg-zinc-900/10 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white max-w-[220px] truncate">
                      {request.propertyTitle || "Premium Workspace Unit"}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400 font-medium">
                      <span>Tenant: <b>{request.tenantName}</b></span>
                      <span>Value: <b>${request.rentAmount}</b></span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div>{getStatusBadge(request.bookingStatus)}</div>
                    <span className={`text-[10px] font-black uppercase ${
                      request.paymentStatus === "Paid" ? "text-emerald-500" : "text-amber-500"
                    }`}>
                      {request.paymentStatus === "Paid" ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Hand Column: Shortcuts Quick Path Actions */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] shadow-3xs flex-1 space-y-4">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
              Quick Shortcuts
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link href="/dashboard/owner/add-property" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-all group">
                <span className="flex items-center gap-2"><PlusCircle size={14} className="text-[#E05638]"/> Create New Listing</span>
                <ArrowUpRight size={14} className="text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              
              <Link href="/dashboard/owner/my-properties" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-all group">
                <span className="flex items-center gap-2"><Building size={14} className="text-blue-500"/> Manage My Portfolio</span>
                <ArrowUpRight size={14} className="text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link href="/dashboard/owner/analytics" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-all group">
                <span className="flex items-center gap-2"><TrendingUp size={14} className="text-emerald-500"/> Revenue Analytics</span>
                <ArrowUpRight size={14} className="text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}