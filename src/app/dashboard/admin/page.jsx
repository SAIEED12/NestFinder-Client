"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { secureFetch } from "@/lib/api";
import Link from "next/link";
import { 
  Users, 
  Building, 
  FileText, 
  CreditCard, 
  ArrowUpRight, 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  XCircle,
  Hash,
  Sparkles
} from "lucide-react";

export default function AdminDashboard() {
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const session = sessionData;

  const [stats, setStats] = useState({ totalUsers: 0, totalProperties: 0, activeBookings: 0, totalEscrow: 0 });
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboardOverview();
  }, []);

  const fetchAdminDashboardOverview = async () => {
    try {
      setLoading(true);

      // 💡 Concurrently fetch all core datasets from administrative endpoints with your JWT token
      const [usersRes, propertiesRes, bookingsRes, transactionsRes] = await Promise.all([
        secureFetch("/api/admin/users"),
        secureFetch("/api/admin/properties"),
        secureFetch("/api/admin/bookings"),
        secureFetch("/api/admin/transactions")
      ]);

      let usersData = [];
      let propertiesData = [];
      let bookingsData = [];
      let transactionsData = [];

      if (usersRes.ok) usersData = await usersRes.json();
      if (propertiesRes.ok) propertiesData = await propertiesRes.json();
      if (bookingsRes.ok) bookingsData = await bookingsRes.json();
      if (transactionsRes.ok) transactionsData = await transactionsRes.json();

      // Calculate localized escrow summary balances
      const totalEscrow = transactionsData.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      setStats({
        totalUsers: usersData.length,
        totalProperties: propertiesData.length,
        activeBookings: bookingsData.filter(b => b.bookingStatus === "Approved").length,
        totalEscrow
      });

      // Filter and capture up to 3 properties awaiting verification
      setPendingApprovals(propertiesData.filter(p => p.status === "Pending").slice(0, 3));

      // Capture top 3 most recent successful clearings
      setRecentTransactions(transactionsData.slice(0, 3));

    } catch (err) {
      console.error("Administrative metrics overview compiler failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-200/20">
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-red-200/20">
            Rejected
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-200/20">
            Pending
          </span>
        );
    }
  };

  if (loading || sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#E05638] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500">Compiling global administrative telemetry data arrays...</p>
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <ShieldAlert size={32} className="text-red-500 mb-2" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Access Unauthorized</h3>
        <p className="text-xs text-zinc-500 mt-1">Administrator access credentials are required to view this grid.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner Header */}
      <div className="bg-slate-900 dark:bg-zinc-900 text-white rounded-[28px] p-6 relative overflow-hidden shadow-xl border border-zinc-800">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
          <Sparkles size={200} />
        </div>
        <div className="space-y-1 relative z-10">
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            System Control Panel Terminal 🛠️
          </h2>
          <p className="text-xs text-zinc-400 max-w-md font-medium">
            Monitor real-time system activities, process property approvals, manage user roles, and trace transaction records.
          </p>
        </div>
      </div>

      {/* ─── METRICS CARDS GRID GRID ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Accounts */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] flex items-center justify-between shadow-3xs">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Total Members</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalUsers}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/5 text-purple-500 flex items-center justify-center border border-purple-500/10">
            <Users size={20} />
          </div>
        </div>

        {/* Global Catalog Listings */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] flex items-center justify-between shadow-3xs">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Total Listings</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalProperties}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/5 text-blue-500 flex items-center justify-center border border-blue-500/10">
            <Building size={20} />
          </div>
        </div>

        {/* Active System Leases */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] flex items-center justify-between shadow-3xs">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Active Bookings</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.activeBookings}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#E05638]/5 text-[#E05638] flex items-center justify-center border border-[#E05638]/10">
            <FileText size={20} />
          </div>
        </div>

        {/* Gross Escrow Balance processed */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] flex items-center justify-between shadow-3xs">
          <div className="space-y-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Gross Volume</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">${stats.totalEscrow}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/5 text-emerald-500 flex items-center justify-center border border-emerald-500/10">
            <CreditCard size={20} />
          </div>
        </div>
      </div>

      {/* ─── TWO COLUMN SPLIT CONTENT GRIDS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left Hand: Pending Listing Verifications Column */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] shadow-3xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Clock size={14} className="text-amber-500"/> Pending Verification
            </h3>
            <Link href="/dashboard/admin/all-properties" className="text-xs font-bold text-[#E05638] flex items-center gap-0.5 hover:underline">
              Inventory Table <ArrowUpRight size={14} />
            </Link>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl text-xs text-zinc-400 font-medium">
              Excellent! Zero property listings are currently awaiting auditing verification.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map((property) => (
                <div 
                  key={property._id} 
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-slate-50 dark:border-zinc-800 p-4 rounded-xl gap-3 bg-slate-50/20 dark:bg-zinc-900/10 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {property.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-medium truncate">
                      📍 {property.location} &bull; Type: <span className="uppercase">{property.propertyType}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-xs font-black text-slate-950 dark:text-white">${property.rent}</div>
                    <div>{getStatusBadge(property.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Hand: Recent Financial Settlement Logs */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 p-5 rounded-[24px] shadow-3xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard size={14} className="text-emerald-500"/> Recent Settlements
            </h3>
            <Link href="/dashboard/admin/transactions" className="text-xs font-bold text-[#E05638] flex items-center gap-0.5 hover:underline">
              Financial Ledger <ArrowUpRight size={14} />
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl text-xs text-zinc-400 font-medium">
              No financial clearing transaction invoices settled on platform indexes yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((txn, idx) => (
                <div 
                  key={txn.transactionId || idx} 
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-slate-50 dark:border-zinc-800 p-4 rounded-xl gap-3 bg-slate-50/20 dark:bg-zinc-900/10 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate font-bold flex items-center gap-1">
                      <Hash size={11}/> {txn.transactionId?.substring(0, 16)}...
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-medium truncate">
                      Tenant: <b>{txn.tenantName}</b> &rarr; Property Unit
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10">
                      +${txn.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}