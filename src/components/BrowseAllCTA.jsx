"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Compass } from 'lucide-react';

export default function BrowseAllCTA() {
  return (
    <section className="py-20 bg-white dark:bg-zinc-950 transition-colors duration-200 relative overflow-hidden">
      {/* Soft background branding glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#E05638]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* 💡 FIXED: Swapped solid dark container for a clean, light card that blends with the page theme */}
        <div className="relative bg-white dark:bg-zinc-900/30 backdrop-blur-md rounded-[40px] border border-slate-100 dark:border-zinc-800/80 p-8 md:p-16 text-center shadow-2xl overflow-hidden group">
          
          {/* Light modern grid accent lines */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#E05638_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6 flex flex-col items-center">
            
            {/* Soft theme-matched icon wrapper */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-3 bg-[#E05638]/5 border border-[#E05638]/10 rounded-2xl text-[#E05638] shadow-2xs mb-2"
            >
              <Compass size={24} />
            </motion.div>

            {/* Typography Heading Setup updated for light backdrop contrast */}
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Still Looking for Your <span className="text-[#E05638]">Perfect Space?</span>
            </h2>
            
            <p className="text-sm md:text-md text-slate-500 dark:text-zinc-400 max-w-lg font-medium ">
              Unlock our complete international collection database. Filter seamlessly by room quantities, pricing caps, operational configurations, and unique structural amenities instantly.
            </p>

            {/* Theme Matched Large Navigation Button */}
            <div className="pt-4 w-full sm:w-auto">
              <Link 
                href="/properties"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#E05638] hover:bg-[#c9492e] text-white font-extrabold text-sm px-8 h-12 rounded-2xl shadow-sm shadow-[#E05638]/10 hover:shadow-[#E05638]/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 group select-none"
              >
                <Search size={16} strokeWidth={2.5} />
                <span>Explore All Properties</span>
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

          </div>

          {/* Accent lower corner decorative light blocks */}
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#E05638]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        </div>
      </div>
    </section>
  );
}