"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Search,
  User,
  Mail,
  Phone
} from "lucide-react";

export default function OwnerBookingRequests() {
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const session = sessionData;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Modals / Actions states
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchRequests();
    } else if (!sessionLoading && !session) {
      setLoading(false);
    }
  }, [session, sessionLoading]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const expressApiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

      const response = await fetch(
        `${expressApiUrl}/api/bookings/owner/${session?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.session?.id || ""}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load booking requests.");
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error("Error loading requests:", err);
      setError("Failed to fetch booking requests from the server ledger.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, currentStatus) => {
    let finalStatus = "Approved";
    let reason = "";

    if (currentStatus === "Reject") {
      finalStatus = "Rejected";
      reason = prompt("Please provide a reason for rejecting this lease reservation request:") || "Provider allocation restrictions.";
      if (reason === null) return; // Cancel out entirely if user cancels prompt
    }

    try {
      setActionLoading(bookingId);
      const expressApiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

      const response = await fetch(`${expressApiUrl}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.session?.id || ""}`,
        },
        body: JSON.stringify({
          status: finalStatus,
          rejectionReason: reason
        })
      });

      const resData = await response.json();

      if (!response.ok) {
        alert(resData.error || "Failed to update booking status.");
        return;
      }

      // Live state synchronization
      setRequests(prev => prev.map(req => 
        req._id === bookingId ? { ...req, bookingStatus: finalStatus, rejectionReason: reason } : req
      ));

    } catch (err) {
      console.error("Status adjustment crash:", err);
      alert("Network exception updating status parameters.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full text-xs font-bold border border-green-200/40">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-full text-xs font-bold border border-red-200/40">
            <XCircle size={12} /> Rejected
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-200/40">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  const filteredRequests = requests.filter(req => {
    const propertyTitle = req.propertyTitle || req.title || req.property?.title || "";
    const matchesSearch = 
      propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.tenantEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.tenantName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || req.bookingStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading || sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#E05638] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500">Processing inbound structural updates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Tenant Reservation Logs</h2>
          <p className="text-xs text-zinc-500">Manage rental requests across your active listings.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter tenants or listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-[#E05638] w-full sm:w-56"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-[#E05638]"
          >
            <option value="all">All Request Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[24px] p-8 text-center">
          <AlertCircle className="mx-auto text-zinc-300 dark:text-zinc-600 mb-2" size={32} />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Requests Found</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Inbound property lease queues are currently empty.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Tenant Information</th>
                  <th className="px-6 py-4">Property Parameters</th>
                  <th className="px-6 py-4">Booking Amount</th>
                  <th className="px-6 py-4">Process Metrics</th>
                  <th className="px-6 py-4 text-center">Management Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-semibold text-slate-700 dark:text-zinc-300">
                {filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                    {/* Tenant Information Cell */}
                    <td className="px-6 py-4 space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User size={13} className="text-zinc-400" /> {req.tenantName || "Applicant Profile"}
                      </div>
                      <div className="text-xs text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1.5">
                        <Mail size={12} /> {req.tenantEmail}
                      </div>
                      <div className="text-xs text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1.5">
                        <Phone size={12} /> {req.contactNumber || "Unspecified Wire Line"}
                      </div>
                    </td>

                    {/* Property Information Cell */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {req.propertyTitle || req.title || req.property?.title || "Lease Domain Listing"}
                      </div>
                      <div className="text-xs text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1 mt-0.5">
                        <Calendar size={13} /> Targeted Move-in: {req.moveInDate ? new Date(req.moveInDate).toLocaleDateString() : "Immediate"}
                      </div>
                    </td>

                    {/* Booking Amount Cell */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-slate-900 dark:text-white">${req.rentAmount}</div>
                      <div className="text-[10px] tracking-wide text-emerald-500 font-extrabold uppercase mt-0.5">
                        {req.paymentStatus === "Paid" ? "💳 Secured Payment" : "⏳ Unresolved Invoice"}
                      </div>
                    </td>

                    {/* Status Badge Cell */}
                    <td className="px-6 py-4">
                      <div>{getStatusBadge(req.bookingStatus)}</div>
                      {req.rejectionReason && (
                        <div className="text-[10px] text-red-500/80 font-medium max-w-[160px] truncate mt-1">
                          Reason: {req.rejectionReason}
                        </div>
                      )}
                    </td>

                    {/* Actions Panel Cell */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/all-properties/${req.propertyId}`}>
                          <button className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 transition-colors" title="Inspect Listing">
                            <Eye size={14} />
                          </button>
                        </Link>

                        {req.bookingStatus === "Pending" ? (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(req._id, "Approve")}
                              disabled={actionLoading !== null || req.paymentStatus !== "Paid"}
                              className={`px-3 py-1.5 font-bold text-xs rounded-xl shadow-2xs transition-all ${
                                req.paymentStatus !== "Paid"
                                  ? "bg-slate-100 text-zinc-400 cursor-not-allowed"
                                  : "bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95"
                              }`}
                              title={req.paymentStatus !== "Paid" ? "Awaiting Tenant Checkout Complete" : "Approve Lease"}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(req._id, "Reject")}
                              disabled={actionLoading !== null}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-2xs transition-all active:scale-95"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400">Processed</span>
                        )}
                      </div>
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