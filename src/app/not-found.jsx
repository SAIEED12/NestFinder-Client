"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPinOff, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center px-6 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white relative overflow-hidden select-none transition-colors duration-300">
      
      {/* Enhanced Ambient Radial Blur Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-[#E05638]/10 to-amber-500/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 16 }}
        className="max-w-md w-full bg-white/70 dark:bg-zinc-900/40 border border-slate-200/80 dark:border-zinc-800/60 rounded-[32px] p-8 text-center backdrop-blur-xl shadow-xl dark:shadow-2xl relative z-10 space-y-6 transition-colors duration-300"
      >
        {/* Large 404 Header Layout */}
        <div className="relative flex items-center justify-center h-28">
          <h1 className="text-8xl font-black tracking-tighter text-slate-200 dark:text-zinc-800/40 select-none font-mono transition-colors duration-300">
            404
          </h1>
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute w-14 h-14 rounded-2xl bg-[#E05638]/10 border border-[#E05638]/20 flex items-center justify-center text-[#E05638] shadow-lg shadow-[#E05638]/5"
          >
            <MapPinOff size={24} />
          </motion.div>
        </div>

        {/* Text Block Description */}
        <div className="space-y-2">
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
            Lost in the Neighborhood?
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium leading-relaxed max-w-xs mx-auto transition-colors">
            The property listing or layout route you are attempting to locate has either been relocated, unlisted, or never existed in our directory records.
          </p>
        </div>

        <hr className="border-slate-100 dark:border-zinc-800/80 my-2 transition-colors" />

        {/* Action Call to Action Button */}
        <div className="pt-1">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02, gap: "12px" }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E05638] hover:bg-[#c9492e] text-white text-xs font-bold rounded-xl shadow-md shadow-[#E05638]/10 transition-all focus:outline-none group"
            >
              <Home size={14} />
              Back to Marketplace Home
              <ArrowRight size={13} className="text-orange-200 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </Link>
        </div>

      </motion.div>
    </div>
  );
}