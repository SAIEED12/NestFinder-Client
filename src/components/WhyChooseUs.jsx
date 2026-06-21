"use client";

import React from 'react';
import { ShieldCheck, Snowflake, Users, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhyChooseUs() {
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Escrow-Backed Stripe Payments",
      description: "Reservation fees are handled directly via secure Stripe payment gateways. Transaction metrics are fully logged to protect both tenants and owners.",
      badge: "Secure",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-emerald-500/5",
      dotColor: "bg-emerald-500"
    },
    {
      icon: Users,
      title: "Role-Based Integrity Moderation",
      description: "Separate dedicated dashboards isolate operations for Tenants, Owners, and Administrators. Admin validation screens ensure only approved assets go live.",
      badge: "Verified",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 shadow-blue-500/5",
      dotColor: "bg-blue-500"
    },
    {
      icon: Snowflake,
      title: "Complete Feedback Transparency",
      description: "Our unique admin moderation workflow forces feedback compilation on rejected properties. Owners view detailed revision metrics instantly.",
      badge: "Transparent",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-amber-500/5",
      dotColor: "bg-amber-500"
    }
  ];

  return (
    <section className="py-28 bg-white dark:bg-zinc-950 transition-colors duration-200 relative overflow-hidden">
      {/* Background soft ambient branding glow blur */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#E05638]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* 💡 SCALE UP MODIFICATION: Re-architected into an asymmetric 1-to-2 column split hero mesh */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
          
          {/* Left Anchor Title Column Panel */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#E05638] bg-[#E05638]/5 border border-[#E05638]/20 px-4 py-1.5 rounded-full shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E05638] animate-pulse"></span>
                Core Benefits
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Redefining the Rental Experience
              </h2>
              <p className="text-sm md:text-base text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
                A transparent and completely secure property marketplace designed to connect verified owners and tenants seamlessly.
              </p>
            </div>

            {/* Micro-branding line divider signature layout */}
            <div className="hidden lg:block h-[1px] w-1/2 bg-gradient-to-r from-[#E05638]/30 to-transparent" />
          </div>

          {/* Right Cards Stack Column (Takes up 2/3 width on wide screens) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  // 💡 Height expanded to min-h-[340px] for dramatic spatial breathing room
                  className={`group relative flex flex-col justify-between p-8 bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 rounded-[32px] shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${
                    idx === 0 ? "md:col-span-2 min-h-[280px]" : "md:col-span-1 min-h-[340px]"
                  }`}
                >
                  <div className="space-y-6">
                    {/* Icon & Status Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded-2xl group-hover:bg-[#E05638] group-hover:text-white transition-colors duration-300 shadow-2xs">
                        <IconComponent size={24} strokeWidth={1.5} />
                      </div>
                      
                      {/* Translucent Live Badge */}
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase border rounded-xl px-3 py-1.5 shadow-xs backdrop-blur-md ${benefit.badgeColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${benefit.dotColor}`}></span>
                        {benefit.badge}
                      </span>
                    </div>

                    {/* Typography Cluster */}
                    <div className="space-y-2.5">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#E05638] transition-colors duration-300 tracking-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-medium opacity-90">
                        {benefit.description}
                      </p>
                    </div>
                  </div>

                  {/* Clean Action Callout Anchor area */}
                  <div className="mt-8 pt-5 border-t border-zinc-100 dark:border-zinc-900 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 group-hover:text-[#E05638] transition-colors duration-300">
                    <span>Learn Platform Protocol</span>
                    <ArrowUpRight size={14} className="transform translate-y-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
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