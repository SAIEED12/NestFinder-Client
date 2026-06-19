"use client";

import React from "react";
import { MapPin, Home, DollarSign, Search } from "lucide-react";
import { Button } from "@heroui/react";

export default function Banner() {
  return (
    <section className="relative w-full h-[580px] flex items-center justify-center bg-zinc-900 overflow-hidden">
      {/* 1. Background Image with Dark Vignette Overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/hero.jpg')` }}
      />
      {/* Gradient Overlay matching the reference image's deep blue/dark tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-zinc-950/70 to-zinc-950/40 backdrop-blur-[0.5px]" />

      {/* 2. Banner Core Content Wrapper */}
      <div className="relative z-10 mx-auto max-w-5xl w-full px-6 flex flex-col items-start text-white">
        {/* Premium Homes Count Floating Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium tracking-wide text-orange-150 shadow-sm mb-6">
          <span className="text-orange-200">✨</span>
          <span>2,400+ premium homes worldwide</span>
        </div>

        {/* Hero Headers */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] max-w-2xl mb-4">
          Find a place you&apos;ll love to <br /> call home.
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 max-w-lg leading-relaxed mb-10">
          Discover verified, design-forward rentals across the world&apos;s most
          desirable neighborhoods — and book your next stay with total
          confidence.
        </p>

        {/* 3. Search Architecture Widget Bar */}
        <div className="w-full bg-white dark:bg-zinc-900/90 rounded-2xl sm:rounded-full p-2.5 shadow-2xl border border-white/15 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center backdrop-blur-md">
          {/* A. Location Search Field */}
          <div className="sm:col-span-4 flex items-center gap-2 px-3 border-b sm:border-b-0 sm:border-r border-zinc-100 dark:border-zinc-800 pb-2 sm:pb-0">
            <MapPin className="text-zinc-400 shrink-0" size={18} />
            <input
              type="text"
              placeholder="Location"
              className="w-full bg-transparent text-sm text-slate-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none"
            />
          </div>

          {/* B. Property Type Select Dropdown */}
          <div className="sm:col-span-3 flex items-center gap-2 px-3 border-b sm:border-b-0 sm:border-r border-zinc-100 dark:border-zinc-800 pb-2 sm:pb-0">
            <Home className="text-zinc-400 shrink-0" size={18} />
            <select className="w-full bg-transparent text-sm text-slate-500 dark:text-zinc-400 focus:outline-none appearance-none cursor-pointer">
              <option value="">Any type</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="cabin">Cabin</option>
            </select>
            <span className="text-zinc-400 text-xs ml-auto">▼</span>
          </div>

          {/* C. FIXED: Min Price Field with Horizontal Row Alignment */}
          <div className="sm:col-span-2 flex flex-col justify-center px-3 border-b sm:border-b-0 sm:border-r border-zinc-100 dark:border-zinc-800 pb-2 sm:pb-0 h-10">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider leading-none">
              Min Price
            </span>
            <div className="flex items-center gap-0.5 mt-0.5">
              {/* <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                $
              </span> */}
              <input
                type="number"
                className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-zinc-200 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* D. FIXED: Max Price Field with Horizontal Row Alignment */}
          <div className="sm:col-span-2 flex flex-col justify-center px-3 pb-2 sm:pb-0 h-10">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider leading-none">
              Max Price
            </span>
            <div className="flex items-center gap-0.5 mt-0.5">
              {/* <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                $
              </span> */}
              <input
                type="number"
                className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-zinc-200 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* E. Action Search Trigger Button */}
          <div className="sm:col-span-1 flex justify-end">
            <Button
              isIconOnly
              className="w-full sm:w-11 h-11 rounded-xl sm:rounded-full bg-[#E05638] hover:bg-[#c9492e] text-white shadow-md transition-all shrink-0"
              aria-label="Execute Search"
            >
              <Search size={18} strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
