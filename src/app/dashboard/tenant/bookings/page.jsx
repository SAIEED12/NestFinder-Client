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
} from "lucide-react";

const MyBookings = () => {
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const session = sessionData;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (session?.user?.id) {
      fetchBookings();
    } else if (!sessionLoading && !session) {
      setLoading(false);
    }
  }, [session, sessionLoading]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const expressApiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

      const response = await fetch(
        `${expressApiUrl}/api/bookings/tenant/${session?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.session?.id || ""}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`);
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(
        "Failed to load bookings. Please check server logs or token validation.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
            <CheckCircle size={12} />
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold">
            <XCircle size={12} />
            Rejected
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
            <Clock size={12} />
            Pending
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status) => {
    if (status === "Paid") {
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
          <CheckCircle size={12} />
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
        <Clock size={12} />
        Pending
      </span>
    );
  };

  const getStatusMessage = (booking) => {
    if (booking.bookingStatus === "Pending") {
      return "Waiting for final lease confirmation";
    } else if (booking.bookingStatus === "Approved") {
      return "✓ Transaction settled safely";
    } else if (booking.bookingStatus === "Rejected") {
      return `✗ ${booking.rejectionReason || "Booking rejected by provider"}`;
    }
    return booking.bookingStatus;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredBookings = bookings.filter((booking) => {
    const propertyName = booking.propertyTitle || booking.title || booking.property?.title || "";
    const matchesSearch =
      propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tenantEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || booking.bookingStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading || sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#E05638] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Loading your bookings...
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <AlertCircle size={32} className="text-zinc-400 mb-2" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Access Unauthorized
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Please log into your tenant profile account card to view this feed.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md text-center">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-red-700 dark:text-red-400">
            Error Loading Bookings
          </h3>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
          <button
            onClick={fetchBookings}
            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">
            My Bookings
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Total:{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {bookings.length}
            </span>{" "}
            bookings
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-[#E05638] transition-colors w-full sm:w-48"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-[#E05638] transition-colors"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bookings Table View */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[24px] p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Calendar
                size={28}
                className="text-zinc-400 dark:text-zinc-500"
              />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No Bookings Found
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
              {searchTerm || filterStatus !== "all"
                ? "No bookings match your filters. Try adjusting your search."
                : "You haven't made any property bookings yet."}
            </p>
            <Link href="/all-properties">
              <button className="mt-4 px-6 py-2 bg-[#E05638] hover:bg-[#c9492e] text-white text-xs font-bold rounded-xl transition-all">
                Browse Properties
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[24px] overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30">
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Property Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Booking Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Amount Paid
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Booking Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        {/* 💡 FIXED: Implemented cascade parameters on Desktop table matrix cells */}
                        <div className="font-bold text-slate-900 dark:text-white">
                          {booking.propertyTitle ||
                            booking.title ||
                            booking.property?.title ||
                            "Unnamed Property"}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          Move-in: {formatDate(booking.moveInDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-zinc-400" />
                        {formatDateTime(booking.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 dark:text-white">
                        ${booking.rentAmount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getPaymentStatusBadge(booking.paymentStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {getStatusBadge(booking.bookingStatus)}
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                          {getStatusMessage(booking)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link href={`/all-properties/${booking.propertyId}`}>
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg text-xs font-bold transition-colors">
                          <Eye size={14} />
                          <span>View</span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet & Mobile Card View */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-zinc-800">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="p-4 space-y-3">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {booking.propertyTitle ||
                      booking.title ||
                      booking.property?.title ||
                      "Unnamed Property"}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {formatDateTime(booking.createdAt)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      Move-in:
                    </span>
                    <span className="ml-1.5 font-semibold text-slate-700 dark:text-zinc-300">
                      {formatDate(booking.moveInDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      Amount:
                    </span>
                    <span className="ml-1.5 font-bold text-slate-900 dark:text-white">
                      ${booking.rentAmount}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {getPaymentStatusBadge(booking.paymentStatus)}
                  {getStatusBadge(booking.bookingStatus)}
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  {getStatusMessage(booking)}
                </div>
                <Link href={`/all-properties/${booking.propertyId}`}>
                  <button className="w-full py-2.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg text-xs font-bold transition-colors">
                    View Property Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;