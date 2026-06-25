"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, ArrowUpDown, Info } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";

export default function PublicAllPropertiesPage() {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);

  // Initialize from URL params (set by Banner)
  const [searchLocation, setSearchLocation] = useState(() => searchParams.get("search")       || "");
  const [selectedType,   setSelectedType]   = useState(() => searchParams.get("propertyType") || "all");
  const [currentSort,    setCurrentSort]    = useState("latest");
  const [minPrice,       setMinPrice]       = useState(() => searchParams.get("minPrice")      || "");
  const [maxPrice,       setMaxPrice]       = useState(() => searchParams.get("maxPrice")      || "");
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get("search")     || "");

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchLocation), 400);
    return () => clearTimeout(t);
  }, [searchLocation]);

  // Re-fetch whenever any filter changes
  useEffect(() => {
    fetchProperties();
  }, [debouncedSearch, selectedType, currentSort, minPrice, maxPrice]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const base   = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const params = new URLSearchParams();

      if (debouncedSearch) params.set("search",       debouncedSearch);
      if (selectedType !== "all") params.set("propertyType", selectedType);
      if (currentSort)  params.set("sort",          currentSort);
      if (minPrice)     params.set("minPrice",      minPrice);
      if (maxPrice)     params.set("maxPrice",      maxPrice);

      const res = await fetch(`${base}/api/public/properties?${params}`);
      if (res.ok) setProperties(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">Find Your Next Home</h1>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Explore premium, securely audited rental homes and spaces worldwide.</p>
      </div>

      {/* Filter toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-3 bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-800/80 p-3.5 rounded-[22px] shadow-sm">

        {/* Search */}
        <div className="lg:col-span-2 relative flex items-center">
          <Search size={14} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E05638] text-slate-800 dark:text-zinc-100 placeholder:text-zinc-400"
          />
        </div>

        {/* Type */}
        <div className="relative flex items-center">
          <Filter size={13} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl text-xs font-bold focus:outline-none focus:border-[#E05638] text-slate-700 dark:text-zinc-300 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="cabin">Cabin</option>
            <option value="studio">Studio</option>
            <option value="condo">Condo</option>
          </select>
        </div>

        {/* Sort */}
        <div className="relative flex items-center">
          <ArrowUpDown size={13} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
          <select
            value={currentSort}
            onChange={(e) => setCurrentSort(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl text-xs font-bold focus:outline-none focus:border-[#E05638] text-slate-700 dark:text-zinc-300 cursor-pointer"
          >
            <option value="latest">Newest First</option>
            <option value="asc">Price: Low → High</option>
            <option value="desc">Price: High → Low</option>
          </select>
        </div>

        {/* Min price */}
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-xs font-bold text-zinc-400 pointer-events-none">$</span>
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
            className="w-full pl-7 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl text-xs font-bold focus:outline-none focus:border-[#E05638] text-slate-800 dark:text-zinc-100 placeholder:text-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Max price */}
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-xs font-bold text-zinc-400 pointer-events-none">$</span>
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
            className="w-full pl-7 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl text-xs font-bold focus:outline-none focus:border-[#E05638] text-slate-800 dark:text-zinc-100 placeholder:text-zinc-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm z-10 rounded-[24px] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#E05638] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && properties.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-[32px] bg-slate-50/20 max-w-xl mx-auto p-6 space-y-2">
            <Info size={28} className="mx-auto text-zinc-300 mb-1" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">No Properties Found</h3>
            <p className="text-xs text-zinc-400 font-medium">Try adjusting your search or price range.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((item) => (
              <PropertyCard key={item._id} property={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}