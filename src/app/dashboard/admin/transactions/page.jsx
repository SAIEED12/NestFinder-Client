"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { 
  Search, 
  ShieldAlert, 
  CreditCard, 
  User, 
  Home, 
  ArrowUpRight, 
  Calendar,
  Hash
} from "lucide-react";

export default function AdminTransactionsLedger() {
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const session = sessionData;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGlobalTransactions();
  }, []);

  const fetchGlobalTransactions = async () => {
    try {
      setLoading(true);
      const expressApiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${expressApiUrl}/api/admin/transactions`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Global financial clearings load exception:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((txn) =>
    txn.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#E05638] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500">Compiling financial audit data grids...</p>
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <ShieldAlert size={32} className="text-red-500 mb-2" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Access Unauthorized</h3>
        <p className="text-xs text-zinc-500 mt-1">Administrative permissions are required to access this financial grid.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header controls pane layout row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white tracking-tight">Platform Clearing Records</h2>
          <p className="text-xs text-zinc-500">Track structural lease settlements and balance updates platform-wide.</p>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter by hash, entity, or listing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-[#E05638] w-full sm:w-64"
          />
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[24px] p-8 text-center">
          <CreditCard className="mx-auto text-zinc-300 dark:text-zinc-700 mb-2" size={32} />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Transactions Logged</h3>
          <p className="text-xs text-zinc-500 mt-0.5">No matching successful checkout transactions found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction Reference</th>
                  <th className="px-6 py-4">Property Domain</th>
                  <th className="px-6 py-4">Identity Allocation Map</th>
                  <th className="px-6 py-4">Clearance Value</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-semibold text-slate-700 dark:text-zinc-300">
                {filteredTransactions.map((txn, index) => (
                  <tr key={txn.transactionId || index} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                    {/* Transaction Reference Hash */}
                    <td className="px-6 py-4 space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono text-xs max-w-[180px] truncate select-all">
                        <Hash size={13} className="text-zinc-400" /> {txn.transactionId}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                        <Calendar size={12} /> {txn.date ? new Date(txn.date).toLocaleString() : "Processed"}
                      </div>
                    </td>

                    {/* Property Name Cell */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 max-w-[200px] truncate">
                        <Home size={13} className="text-zinc-400 shrink-0" /> {txn.propertyName}
                      </div>
                    </td>

                    {/* Entities Breakdown Cell (Tenant / Owner) */}
                    <td className="px-6 py-4 text-xs space-y-1">
                      <div>
                        <span className="text-zinc-400 font-medium">Tenant:</span>
                        <span className="ml-1.5 text-slate-900 dark:text-white font-bold">{txn.tenantName}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-medium">Host Owner:</span>
                        <span className="ml-1.5 text-zinc-500 dark:text-zinc-400 font-semibold">{txn.ownerName}</span>
                      </div>
                    </td>

                    {/* Clearance Value Amount */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-slate-950 dark:text-white">${txn.amount}</div>
                      <div className="text-[9px] tracking-widest font-black uppercase text-emerald-500 mt-0.5">
                        ✓ Settled via Stripe
                      </div>
                    </td>

                    {/* View Listing Shortcut Button */}
                    <td className="px-6 py-4 text-center">
                      <Link href={`/all-properties/${txn.propertyId}`}>
                        <button className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 transition-colors" title="Inspect Target Showcase Unit">
                          <ArrowUpRight size={14} />
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