"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { Shield, User, Mail, Search, ShieldCheck, AlertCircle, X } from "lucide-react";

// ─── Pure Tailwind confirmation modal, zero HeroUI dependency ───────────────
function ConfirmModal({ isOpen, user, role, onConfirm, onCancel }) {
  if (!isOpen || !user) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-[28px] shadow-2xl">
        
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-2 pt-8 pb-3 text-center px-6">
          <div className="w-13 h-13 w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center mb-1">
            <Shield size={22} />
          </div>
          <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Confirm Role Change
          </h3>
        </div>

        {/* Body */}
        <div className="px-8 py-3 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Change{" "}
            <span className="font-bold text-slate-900 dark:text-zinc-200">
              {user?.name}
            </span>
            &apos;s role to{" "}
            <span className="font-extrabold text-[#E05638] uppercase bg-[#E05638]/10 px-2 py-0.5 rounded-md">
              {role}
            </span>
            ?{" "}
            This will override their current dashboard access immediately.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-center pt-4 pb-7 px-6">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Keep Current Role
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E05638] hover:bg-[#c94a2e] active:scale-95 transition-all shadow-sm"
          >
            Confirm Change
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function AdminAllUsers() {
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const session = sessionData;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [pendingRole, setPendingRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const expressApiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${expressApiUrl}/api/admin/users`);
      if (!response.ok) throw new Error("Failed to fetch users.");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const initiateRoleChange = (user, targetRole) => {
    setPendingUser(user);
    setPendingRole(targetRole);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPendingUser(null);
    setPendingRole("");
  };

  const confirmRoleChange = async () => {
    if (!pendingUser || !pendingRole) return;
    const userId = pendingUser._id || pendingUser.id;

    setIsModalOpen(false);

    try {
      setActionLoading(userId);
      const expressApiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

      const response = await fetch(`${expressApiUrl}/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: pendingRole }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update role.");

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId || u.id === userId ? { ...u, role: pendingRole } : u
        )
      );
      toast.success(`Role updated to ${pendingRole.toUpperCase()} successfully!`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update role.");
    } finally {
      setActionLoading(null);
      setPendingUser(null);
      setPendingRole("");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#E05638] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-500">Loading users...</p>
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <AlertCircle size={32} className="text-red-500 mb-2" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Access Denied</h3>
        <p className="text-xs text-zinc-500 mt-1">This page is restricted to administrators only.</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Confirmation Modal ── */}
      <ConfirmModal
        isOpen={isModalOpen}
        user={pendingUser}
        role={pendingRole}
        onConfirm={confirmRoleChange}
        onCancel={handleCancel}
      />

      <div className="space-y-4">
        {/* Header + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-950 dark:text-white tracking-tight">
              System User Directory
            </h2>
            <p className="text-xs text-zinc-500">
              Monitor registered accounts and manage access roles.
            </p>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-[#E05638] w-full sm:w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Identity Details</th>
                  <th className="px-6 py-4">Account ID</th>
                  <th className="px-6 py-4">Current Role</th>
                  <th className="px-6 py-4 text-center">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-semibold text-slate-700 dark:text-zinc-300">
                {filteredUsers.map((u) => {
                  const targetId = u._id || u.id;
                  return (
                    <tr
                      key={targetId}
                      className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 transition-colors"
                    >
                      {/* Name + email */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <User size={14} className="text-zinc-400" />
                          {u.name || "Anonymous"}
                        </div>
                        <div className="text-xs text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1.5 mt-0.5">
                          <Mail size={12} /> {u.email}
                        </div>
                      </td>

                      {/* ID */}
                      <td className="px-6 py-4 font-mono text-xs text-zinc-400 select-all max-w-[150px] truncate">
                        {targetId}
                      </td>

                      {/* Role badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            u.role === "admin"
                              ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40"
                              : u.role === "owner"
                              ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40"
                              : "bg-zinc-50 text-zinc-600 border-zinc-100 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700"
                          }`}
                        >
                          {u.role === "admin" && <ShieldCheck size={12} />}
                          {u.role || "tenant"}
                        </span>
                      </td>

                      {/* Role select */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <select
                            value={u.role || "tenant"}
                            disabled={actionLoading === targetId}
                            onChange={(e) => initiateRoleChange(u, e.target.value)}
                            className="px-3 py-1.5 bg-slate-50 border border-zinc-200 text-xs font-bold rounded-xl focus:outline-none focus:border-[#E05638] cursor-pointer text-slate-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 disabled:opacity-50"
                          >
                            <option value="tenant">Tenant</option>
                            <option value="owner">Property Owner</option>
                            <option value="admin">Administrator</option>
                          </select>
                          {actionLoading === targetId && (
                            <div className="ml-2 w-4 h-4 border-2 border-[#E05638] border-t-transparent rounded-full animate-spin" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}