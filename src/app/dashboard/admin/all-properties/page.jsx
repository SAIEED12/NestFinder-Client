"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import {
  Search, ShieldAlert, CheckCircle2, XCircle,
  Trash2, MessageSquare, X, AlertTriangle,
  MapPin, Home, DollarSign, Pencil
} from "lucide-react";

// ─── Modal Shell ─────────────────────────────────────────────────────────────
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-[28px] shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
          <X size={15} />
        </button>
        {children}
      </div>
    </div>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ isOpen, property, onConfirm, onCancel }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="flex flex-col items-center gap-2 pt-8 pb-3 text-center px-6">
        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center mb-1">
          <Trash2 size={20} />
        </div>
        <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Delete Listing</h3>
      </div>
      <div className="px-8 pb-4 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Permanently delete <span className="font-bold text-slate-900 dark:text-zinc-200">&ldquo;{property?.title}&rdquo;</span>? This cannot be undone.
        </p>
      </div>
      <div className="flex gap-3 justify-center pb-7 px-6">
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-500 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">Cancel</button>
        <button onClick={onConfirm} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all shadow-sm">Delete Permanently</button>
      </div>
    </Modal>
  );
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────
function RejectModal({ isOpen, property, feedbackText, setFeedbackText, onConfirm, onCancel }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="flex flex-col items-center gap-2 pt-8 pb-3 text-center px-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-1">
          <MessageSquare size={20} />
        </div>
        <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Reject Listing</h3>
        <p className="text-xs text-zinc-400 font-medium">{property?.title}</p>
      </div>
      <div className="px-6 pb-3 space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
          Rejection Reason <span className="text-red-400">*</span>
        </label>
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Explain why this listing is being rejected..."
          rows={4}
          className="w-full text-xs font-medium p-3 bg-slate-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-[#E05638]/60 focus:ring-2 focus:ring-[#E05638]/10 text-slate-800 dark:text-zinc-100 placeholder:text-zinc-400 resize-none transition-all"
        />
        {!feedbackText.trim() && (
          <p className="text-[10px] text-zinc-400 flex items-center gap-1">
            <AlertTriangle size={10} /> Feedback is required before submitting.
          </p>
        )}
      </div>
      <div className="flex gap-3 justify-center pb-7 px-6 pt-2">
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-500 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">Cancel</button>
        <button onClick={onConfirm} disabled={!feedbackText.trim()} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">Submit Rejection</button>
      </div>
    </Modal>
  );
}

// ─── Update Modal ─────────────────────────────────────────────────────────────
function UpdateModal({ isOpen, property, onConfirm, onCancel }) {
  const [form, setForm] = useState({ title: "", location: "", rent: "", propertyType: "", status: "" });
  const [saving, setSaving] = useState(false);

  // Sync form when property changes
  React.useEffect(() => {
    if (property) {
      setForm({
        title:        property.title        || "",
        location:     property.location     || "",
        rent:         property.rent         || "",
        propertyType: property.propertyType || "",
        status:       property.status       || "Pending",
      });
    }
  }, [property]);

  const field = "w-full text-xs font-medium p-3 bg-slate-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-[#E05638]/60 focus:ring-2 focus:ring-[#E05638]/10 text-slate-800 dark:text-zinc-100 placeholder:text-zinc-400 transition-all";

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.location.trim() || !form.rent) {
      toast.error("Title, location, and rent are required.");
      return;
    }
    setSaving(true);
    await onConfirm(form);
    setSaving(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="flex flex-col items-center gap-2 pt-8 pb-4 text-center px-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center mb-1">
          <Pencil size={20} />
        </div>
        <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Update Listing</h3>
        <p className="text-xs text-zinc-400 font-medium line-clamp-1 max-w-[280px]">{property?.title}</p>
      </div>

      <div className="px-6 pb-3 space-y-3">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Property title"
            className={field}
          />
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">Location</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
            placeholder="City, Country"
            className={field}
          />
        </div>

        {/* Rent + Type row */}
        <div className="flex gap-3">
          <div className="space-y-1 flex-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">Rent ($)</label>
            <input
              type="number"
              value={form.rent}
              onChange={(e) => setForm(f => ({ ...f, rent: e.target.value }))}
              placeholder="0"
              className={field}
            />
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">Type</label>
            <select
              value={form.propertyType}
              onChange={(e) => setForm(f => ({ ...f, propertyType: e.target.value }))}
              className={field}
            >
              <option value="">Select type</option>
              {["house", "apartment", "villa", "cabin", "studio", "condo"].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
            className={field}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 justify-center pb-7 px-6 pt-3">
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-500 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:opacity-50 transition-all shadow-sm flex items-center gap-2"
        >
          {saving && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          Save Changes
        </button>
      </div>
    </Modal>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Approved: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40",
    Rejected: "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40",
    Pending:  "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40",
  };
  const label = status || "Pending";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${map[label] ?? map.Pending}`}>
      {label}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminAllProperties() {
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const session = sessionData;

  const [properties, setProperties]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchTerm, setSearchTerm]       = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen]   = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const [rejectModalOpen, setRejectModalOpen]   = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [feedbackText, setFeedbackText]         = useState("");

  const [updateModalOpen, setUpdateModalOpen]   = useState(false);
  const [propertyToUpdate, setPropertyToUpdate] = useState(null);

  useEffect(() => { fetchProperties(); }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res  = await fetch(`${base}/api/admin/properties`);
      if (res.ok) setProperties(await res.json());
    } catch (err) { console.error(err); }
    finally       { setLoading(false); }
  };

  // Approve
  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res  = await fetch(`${base}/api/admin/properties/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved", adminFeedback: "" }),
      });
      if (res.ok) {
        setProperties(prev => prev.map(p => p._id === id ? { ...p, status: "Approved" } : p));
        toast.success("Listing approved!");
      }
    } catch { toast.error("Failed to approve."); }
    finally   { setActionLoading(null); }
  };

  // Delete
  const confirmDelete = async () => {
    const id = propertyToDelete._id;
    setDeleteModalOpen(false);
    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res  = await fetch(`${base}/api/admin/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProperties(prev => prev.filter(p => p._id !== id));
        toast.success("Property deleted.");
      }
    } catch { toast.error("Failed to delete."); }
    finally   { setPropertyToDelete(null); }
  };

  // Reject
  const confirmReject = async () => {
    if (!feedbackText.trim()) { toast.error("Please provide rejection feedback."); return; }
    const id = selectedProperty._id;
    setRejectModalOpen(false);
    try {
      setActionLoading(id);
      const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res  = await fetch(`${base}/api/admin/properties/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected", adminFeedback: feedbackText }),
      });
      if (res.ok) {
        setProperties(prev => prev.map(p => p._id === id ? { ...p, status: "Rejected", adminFeedback: feedbackText } : p));
        toast.success("Listing rejected with feedback.");
      }
    } catch { toast.error("Failed to reject."); }
    finally   { setActionLoading(null); setSelectedProperty(null); }
  };

  // Update
  const confirmUpdate = async (form) => {
    const id = propertyToUpdate._id;
    try {
      const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res  = await fetch(`${base}/api/admin/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setProperties(prev => prev.map(p => p._id === id ? { ...p, ...form } : p));
        toast.success("Listing updated successfully.");
        setUpdateModalOpen(false);
        setPropertyToUpdate(null);
      } else {
        toast.error("Failed to update listing.");
      }
    } catch { toast.error("Failed to update listing."); }
  };

  const filteredProperties = properties.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#E05638] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-zinc-400">Loading properties...</p>
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <ShieldAlert size={32} className="text-red-500 mb-2" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Access Denied</h3>
        <p className="text-xs text-zinc-500 mt-1">Administrator access required.</p>
      </div>
    );
  }

  return (
    <>
      <DeleteModal isOpen={deleteModalOpen} property={propertyToDelete} onConfirm={confirmDelete} onCancel={() => { setDeleteModalOpen(false); setPropertyToDelete(null); }} />
      <RejectModal isOpen={rejectModalOpen} property={selectedProperty} feedbackText={feedbackText} setFeedbackText={setFeedbackText} onConfirm={confirmReject} onCancel={() => { setRejectModalOpen(false); setSelectedProperty(null); }} />
      <UpdateModal isOpen={updateModalOpen} property={propertyToUpdate} onConfirm={confirmUpdate} onCancel={() => { setUpdateModalOpen(false); setPropertyToUpdate(null); }} />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-950 dark:text-white tracking-tight">Global Listing Inventory</h2>
            <p className="text-xs text-zinc-500">Approve, reject, update, or remove property listings.</p>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input type="text" placeholder="Search listings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-[#E05638] w-full sm:w-64" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Listing</th>
                  <th className="px-6 py-4">Price / Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-slate-700 dark:text-zinc-300">
                {filteredProperties.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-16 text-center text-xs text-zinc-400">No listings found.</td></tr>
                ) : filteredProperties.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 transition-colors">

                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]">{p.title}</div>
                      <div className="text-xs text-zinc-400 font-medium flex items-center gap-1 mt-0.5 truncate max-w-[200px]">
                        <MapPin size={10} /> {p.location}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-black text-slate-900 dark:text-white flex items-center gap-0.5">
                        <DollarSign size={13} className="text-zinc-400" />{p.rent}
                      </div>
                      <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1 mt-0.5">
                        <Home size={10} /> {p.propertyType}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                      {p.adminFeedback && p.status === "Rejected" && (
                        <p className="text-[10px] text-zinc-400 mt-1 max-w-[160px] truncate" title={p.adminFeedback}>
                          ↳ {p.adminFeedback}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {p.status !== "Approved" && (
                          <button onClick={() => handleApprove(p._id)} disabled={actionLoading !== null} title="Approve"
                            className="p-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl transition-colors shadow-sm">
                            <CheckCircle2 size={13} />
                          </button>
                        )}
                        {p.status !== "Rejected" && (
                          <button onClick={() => { setSelectedProperty(p); setFeedbackText(""); setRejectModalOpen(true); }} disabled={actionLoading !== null} title="Reject with feedback"
                            className="p-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl transition-colors shadow-sm">
                            <XCircle size={13} />
                          </button>
                        )}
                        <button onClick={() => { setPropertyToUpdate(p); setUpdateModalOpen(true); }} title="Update listing"
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors shadow-sm">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => { setPropertyToDelete(p); setDeleteModalOpen(true); }} title="Delete listing"
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors shadow-sm">
                          <Trash2 size={13} />
                        </button>
                        {actionLoading === p._id && (
                          <div className="w-4 h-4 border-2 border-[#E05638] border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}