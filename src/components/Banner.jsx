"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Home, Search } from "lucide-react";

export default function Banner() {
  const router = useRouter();
  const [location, setLocation]       = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [minPrice, setMinPrice]       = useState("");
  const [maxPrice, setMaxPrice]       = useState("");

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (location.trim())                        params.set("search", location.trim());
    if (propertyType && propertyType !== "all") params.set("propertyType", propertyType);
    if (minPrice)                               params.set("minPrice", minPrice);
    if (maxPrice)                               params.set("maxPrice", maxPrice);
    router.push(`/all-properties?${params.toString()}`);
  };

  return (
    <section className="relative w-full h-[580px] flex items-center justify-center bg-zinc-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/hero.jpg')` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-zinc-950/70 to-zinc-950/40 backdrop-blur-[0.5px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl w-full px-6 flex flex-col items-start text-white">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium tracking-wide text-orange-200 shadow-sm mb-6">
          <span>2,400+ premium homes worldwide</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] max-w-2xl mb-4">
          Find a place you&apos;ll love to <br /> call home.
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 max-w-lg leading-relaxed mb-10">
          Discover verified, design-forward rentals across the world&apos;s most desirable neighborhoods — and book your next stay with total confidence.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full bg-white dark:bg-zinc-900/90 rounded-2xl sm:rounded-full p-2.5 shadow-2xl border border-white/15 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center backdrop-blur-md"
        >
          {/* Location */}
          <div className="sm:col-span-4 flex items-center gap-2 px-3 border-b sm:border-b-0 sm:border-r border-zinc-100 dark:border-zinc-800 pb-2 sm:pb-0">
            <MapPin className="text-zinc-400 shrink-0" size={16} />
            <input
              type="text"
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none"
            />
          </div>

          {/* Property type */}
          <div className="sm:col-span-3 flex items-center gap-2 px-3 border-b sm:border-b-0 sm:border-r border-zinc-100 dark:border-zinc-800 pb-2 sm:pb-0">
            <Home className="text-zinc-400 shrink-0" size={16} />
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-700 dark:text-zinc-300 focus:outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="all">Any type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="cabin">Cabin</option>
              <option value="studio">Studio</option>
              <option value="condo">Condo</option>
            </select>
            <span className="text-zinc-400 text-[10px] pointer-events-none">▼</span>
          </div>

          {/* Min price */}
          <div className="sm:col-span-2 flex flex-col justify-center px-3 border-b sm:border-b-0 sm:border-r border-zinc-100 dark:border-zinc-800 pb-2 sm:pb-0 h-10">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">Min Price</span>
            <div className="flex items-center gap-0.5 mt-1">
              <span className="text-xs font-bold text-zinc-400">$</span>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                className="w-full bg-transparent text-sm font-bold text-slate-800 dark:text-zinc-200 focus:outline-none placeholder-zinc-400/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Max price */}
          <div className="sm:col-span-2 flex flex-col justify-center px-3 pb-2 sm:pb-0 h-10">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">Max Price</span>
            <div className="flex items-center gap-0.5 mt-1">
              <span className="text-xs font-bold text-zinc-400">$</span>
              <input
                type="number"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                className="w-full bg-transparent text-sm font-bold text-slate-800 dark:text-zinc-200 focus:outline-none placeholder-zinc-400/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="sm:col-span-1 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-11 h-11 rounded-xl sm:rounded-full bg-[#E05638] hover:bg-[#c9492e] active:scale-95 text-white shadow-md transition-all flex items-center justify-center shrink-0"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={2.5} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}