"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Heart, Search, Eye, AlertCircle, Home } from "lucide-react";
import Image from "next/image";

export default function TenantFavoritesDashboard() {
  const { data: sessionData, isPending: sessionLoading } =
    authClient.useSession();
  const session = sessionData;

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      fetchFavorites();
    } else if (!sessionLoading && !session) {
      setLoading(false);
    }
  }, [session, sessionLoading]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const expressApiUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(
        `${expressApiUrl}/api/favorites/tenant/${session?.user?.id}`,
      );

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (err) {
      console.error("Error pulling favorite cards indices:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFavorites = favorites.filter(
    (prop) =>
      prop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading || sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#E05638] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500">
          Retrieving saved showcases...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">
            My Saved Bookmarks
          </h2>
          <p className="text-xs text-zinc-500">
            Track architecture entries currently flagged as your favorites.
          </p>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            placeholder="Search favorites list..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-[#E05638] w-full sm:w-56"
          />
        </div>
      </div>

      {filteredFavorites.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[24px] p-8 text-center">
          <Heart
            className="mx-auto text-zinc-300 dark:text-zinc-700 mb-2"
            size={32}
          />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Favorites Flagged
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Your saved listing collections index is empty.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredFavorites.map((property) => (
            <div
              key={property._id}
              className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[24px] p-4 flex flex-col justify-between shadow-2xs group relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="h-40 w-full rounded-xl bg-slate-100 dark:bg-zinc-800 overflow-hidden relative">
                  <img
                    src={
                      property.images ||
                      property.imageUrl ||
                      "/api/placeholder/400/300"
                    }
                    alt={property.title || "Property Listing"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 absolute top-0 left-0"
                  />
                  <span className="absolute top-2.5 right-2.5 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-black text-slate-950 dark:text-emerald-400 border border-zinc-100/20 shadow-xs">
                    ${property.rent} / {property.rentType || "Month"}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {property.title}
                  </h4>
                  <p className="text-xs text-zinc-400 font-medium truncate">
                    {property.location || "Global Coordinates Listed"}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 dark:border-zinc-800/60 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-[#E05638] uppercase tracking-wide bg-[#E05638]/5 px-2 py-0.5 rounded-md">
                  {property.propertyType || "Residential"}
                </span>
                <Link href={`/all-properties/${property._id}`}>
                  <button className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors text-slate-700 dark:text-zinc-300">
                    <Eye size={13} /> View Listing
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
