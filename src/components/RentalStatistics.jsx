"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, KeyRound, Percent } from 'lucide-react';

// GLOBAL CONSTANT: Keeps your array data cleanly separated from the render loop
const METRICS_DATA = [
  {
    icon: KeyRound,
    value: "1,200+",
    label: "Properties Rented",
    desc: "Successful international matches made across the platform."
  },
  {
    icon: CheckCircle2,
    value: "99.4%",
    label: "Verified Listings",
    desc: "Vetted rigorously through secure administrative workflows."
  },
  {
    icon: TrendingUp,
    value: "$4.2M+",
    label: "Owner Earnings",
    desc: "Processed transparently via automated Stripe handshakes."
  },
  {
    icon: Percent,
    value: "0%",
    label: "Hidden Charges",
    desc: "Completely transparent, direct one-time transaction fees."
  }
];

export default function RentalStatistics() {
  return (
    <section className="py-24 bg-slate-50/50 dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          
          {/* Left Block Text Branding */}
          <div className="space-y-5 lg:col-span-1">
            {/* Made the section micro-pill slightly larger and punchier */}
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E05638] bg-[#E05638]/10 border border-[#E05638]/20 px-3.5 py-1.5 rounded-full shadow-sm">
              Market Metrics
            </span>
            {/* Scaled from text-3xl to text-4xl / text-5xl for strong readability */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Our Platform Activity in Numbers
            </h2>
            {/* Scaled from text-xs to text-sm/base with proper color weighting */}
            <p className="text-sm md:text-base text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
              We monitor global transaction flow charts and property availability real-time to maintain full transparency across role dashboards.
            </p>
          </div>

          {/* Right Metrics Grid Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:col-span-2">
            {METRICS_DATA.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="flex items-start gap-5 p-8 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Icon Wrapper box slightly scaled up */}
                  <div className="p-3.5 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-2xl">
                    <IconComponent size={24} />
                  </div>
                  <div className="space-y-1.5">
                    {/* Stat values scaled from text-2xl to text-3xl / text-4xl */}
                    <span className="block text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                      {stat.value}
                    </span>
                    {/* Target labels scaled from text-xs to text-sm */}
                    <span className="block text-sm md:text-base font-bold text-slate-800 dark:text-zinc-200">
                      {stat.label}
                    </span>
                    {/* Explanatory descriptions scaled from text-[11px] to a clean text-xs */}
                    <p className="text-xs text-slate-400 dark:text-zinc-500 leading-relaxed font-medium">
                      {stat.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}