"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { 
  Search, 
  ShieldAlert, 
  Calendar, 
  User, 
  Mail, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye
} from "lucide-react";

export default function AdminAllBookings() {
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const session = sessionData;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchGlobalBookings();
  }, []);

  const fetchGlobalBookings = async () => {
    try {
      setLoading(true);
      const expressApiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${expressApiUrl}/api/admin/bookings`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Global bookings load breakdown:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 px-2.5 py-1 rounded-full text-xs font-bold border border-green-200/20">
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
          <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-200/20">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const propertyTitle = b.propertyTitle || b.title || b.property?.title || "";
    const matchesSearch =
      propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tenantEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || b.bookingStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading || sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#E05638] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500">Retrieving system-wide activity logs...</p>
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <ShieldAlert size={32} className="text-red-500 mb-2" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Access Unauthorized</h3>
        <p className="text-xs text-zinc-500 mt-1">Administrative clearing levels required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header controls layout block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white tracking-tight">Global Activity Ledger</h2>
          <p className="text-xs text-zinc-500">Monitor transaction statuses and leasing timelines platform-wide.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search tenant or property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-[#E05638] w-full sm:w-56"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-[#E05638] text-slate-700 dark:text-zinc-300 transition-colors"
          >
            <option value="all">All Booking Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[24px] p-8 text-center">
          <Calendar className="mx-auto text-zinc-300 dark:text-zinc-700 mb-2" size={32} />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Bookings Found</h3>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Tenant Info</th>
                  <th className="px-6 py-4">Target Property</th>
                  <th className="px-6 py-4">Fulfillment Details</th>
                  <th className="px-6 py-4">Lease Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-semibold text-slate-700 dark:text-zinc-300">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                    {/* Tenant Details Cell */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User size={13} className="text-zinc-400" /> {b.tenantName || "Tenant Account"}
                      </div>
                      <div className="text-xs text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1.5 mt-0.5">
                        <Mail size={12} /> {b.tenantEmail}
                      </div>
                    </td>

                    {/* Property Showcase Details Cell */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                        {b.propertyTitle || b.title || b.property?.title || "Unnamed Listing"}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-1 mt-0.5">
                        <Calendar size={12} /> Move-in: {b.moveInDate ? new Date(b.moveInDate).toLocaleDateString() : "Immediate"}
                      </div>
                    </td>

                    {/* Financial Clearance Cell */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-slate-900 dark:text-white">${b.rentAmount}</div>
                      <div className={`text-[10px] tracking-wide font-extrabold uppercase mt-0.5 ${
                        b.paymentStatus === "Paid" ? "text-emerald-500" : "text-amber-500"
                      }`}>
                        {b.paymentStatus === "Paid" ? "💳 Settled Invoice" : "⏳ Pending Escrow"}
                      </div>
                    </td>

                    {/* Lease Process Badge Cell */}
                    <td className="px-6 py-4">
                      <div>{getStatusBadge(b.bookingStatus)}</div>
                      <div className="text-[10px] text-zinc-400 font-medium mt-1">
                        {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </td>

                    {/* Inspect Row Link Cell */}
                    <td className="px-6 py-4 text-center">
                      <Link href={`/all-properties/${b.propertyId}`}>
                        <button className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 transition-colors" title="Inspect Property Listing">
                          <Eye size={14} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}