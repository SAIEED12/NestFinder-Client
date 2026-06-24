"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { DollarSign, Home, Calendar, AlertCircle, TrendingUp } from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

export default function OwnerDashboardHome() {
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const session = sessionData;

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchAnalytics();
    } else if (!sessionLoading && !session) {
      setLoading(false);
    }
  }, [session, sessionLoading]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const expressApiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

      const response = await fetch(`${expressApiUrl}/api/owner/analytics/${session?.user?.id}`, {
        headers: {
          Authorization: `Bearer ${session?.session?.id || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to resolve analytics pipeline metrics.");
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Analytics pull crash:", err);
      setError("Failed to compile executive summary cards metrics data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#E05638] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500">Compiling ledger telemetry analytics summaries...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto my-12">
        <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
        <h3 className="text-sm font-bold text-red-700">Analytics Error</h3>
        <p className="text-xs text-red-600 mt-1">{error || "Data load drop."}</p>
      </div>
    );
  }

  const { stats, chartData } = analytics;

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div>
        <h2 className="text-xl font-black text-slate-950 dark:text-white tracking-tight">
          Welcome Back, {session?.user?.name || "Property Provider"}
        </h2>
        <p className="text-xs text-zinc-500">
          Here is your portfolio's performance overview across the last 12 months.
        </p>
      </div>

      {/* Summary Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Earnings Summary Card */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[28px] p-6 shadow-2xs relative overflow-hidden flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              Total Earnings
            </span>
            <span className="text-3xl font-black text-slate-950 dark:text-white tracking-tight block">
              ${stats.totalEarnings.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
              <TrendingUp size={12} /> Gross Settled Revenue
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center transition-transform group-hover:scale-105">
            <DollarSign size={22} strokeWidth={2.5} />
          </div>
        </div>

        {/* Total Properties Summary Card */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[28px] p-6 shadow-2xs relative overflow-hidden flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              Total Properties
            </span>
            <span className="text-3xl font-black text-slate-950 dark:text-white tracking-tight block">
              {stats.totalProperties}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium block">
              Active Structural Listings
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center transition-transform group-hover:scale-105">
            <Home size={22} />
          </div>
        </div>

        {/* Total Bookings Summary Card */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[28px] p-6 shadow-2xs relative overflow-hidden flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              Total Bookings
            </span>
            <span className="text-3xl font-black text-slate-950 dark:text-white tracking-tight block">
              {stats.totalBookings}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium block">
              Lease Application Vectors
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E05638]/5 text-[#E05638] flex items-center justify-center transition-transform group-hover:scale-105">
            <Calendar size={22} />
          </div>
        </div>
      </div>

      {/* Monthly Earnings Recharts Line Graph Panel */}
      <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[32px] p-6 shadow-2xs">
        <div className="mb-6">
          <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
            Monthly Earnings Profile
          </h3>
          <p className="text-[11px] text-zinc-400">
            Real-time visual distribution tracking successful incoming tenant ledger clearings.
          </p>
        </div>

        <div className="w-full h-80 text-xs font-semibold">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" className="hidden dark:block" />
              
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false}
                dy={10}
                stroke="#a1a1aa"
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                dx={-5}
                stroke="#a1a1aa"
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip 
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #e4e4e7",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}
                formatter={(value) => [`$${value.toLocaleString()} USD`, "Earnings"]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line
                type="monotone"
                dataKey="earnings"
                name="Monthly Revenue Clearings"
                stroke="#E05638"
                strokeWidth={3}
                activeDot={{ r: 6, strokeWidth: 0 }}
                dot={{ r: 4, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}