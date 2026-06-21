"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, ArrowRight } from 'lucide-react';

// GLOBAL CONSTANT: Enriched metadata for high-impact widescreen displays
const LOCATIONS_DATA = [
  {
    city: "Amalfi Coast",
    neighborhoods: "Positano, Ravello, Praiano, Amalfi Town, Maiori",
    count: 84,
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&auto=format&fit=crop&q=80"
  },
  {
    city: "Melbourne",
    neighborhoods: "Fitzroy, St Kilda, Southbank, Carlton, Brunswick",
    count: 112,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80"
  },
  {
    city: "Austin",
    neighborhoods: "Downtown, West Lake Hills, Barton Hills, East Austin",
    count: 95,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80"
  }
];

export default function TopLocations() {
  const router = useRouter();

  const handleLocationSearch = (city) => {
    router.push(`/properties?search=${encodeURIComponent(city.toLowerCase())}`);
  };

  return (
    <section className="py-28 bg-white dark:bg-zinc-950 transition-colors duration-200 overflow-hidden relative">
      {/* Background soft ambient branding glow blur */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#E05638]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Expanded Section Header Panel */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#E05638] bg-[#E05638]/5 border border-[#E05638]/20 px-4 py-1.5 rounded-full shadow-2xs">
               Explore Cities
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Find Homes in Top Locations
            </h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-zinc-400 max-w-2xl font-medium leading-relaxed">
              Browse elite architectural rentals grouped by globally celebrated metropolitan regions and high-demand residential neighborhoods.
            </p>
          </div>
        </div>

        {/* 💡 RESTORED: Symmetrical, equal-sized grid layout across all items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LOCATIONS_DATA.map((loc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => handleLocationSearch(loc.city)}
              // 💡 Symmetrical columns structure + tall h-[460px] profile size
              className="group relative h-[460px] rounded-[32px] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-slate-100 dark:border-zinc-900/80"
            >
              {/* Background Image Layer */}
              <img 
                src={loc.image} 
                alt={loc.city} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&auto=format&fit=crop&q=80";
                }}
              />
              
              {/* Deeper, cleaner gradient scrim mapping for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent transition-opacity group-hover:opacity-95 duration-500" />

              {/* Magnified Translucent Micro-Badge */}
              <span className="absolute top-6 right-6 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl px-3.5 py-2 shadow-xs select-none">
                <Building2 size={12} className="text-[#E05638]" />
                {loc.count} Units Listed
              </span>

              {/* Content Anchored to Bottom with expanded paddings */}
              <div className="absolute bottom-0 inset-x-0 p-8 flex items-end justify-between text-white z-20">
                <div className="space-y-2 max-w-[80%]">
                  <h3 className="text-2xl md:text-3xl font-black tracking-wide drop-shadow-xs">
                    {loc.city}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-300 dark:text-zinc-300 font-medium tracking-wide line-clamp-1 opacity-90">
                    {loc.neighborhoods}
                  </p>
                </div>
                
                {/* Scaled up action button indicator */}
                <div className="p-3.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl group-hover:bg-[#E05638] group-hover:text-white group-hover:border-transparent text-white transition-all duration-300 transform group-hover:rotate-45 shadow-sm">
                  <ArrowRight size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}