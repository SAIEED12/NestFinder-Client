"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, BedDouble, Bath, Maximize2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Ensure this import is active at the top

export default function PropertyCard({ property, index = 0 }) {
  if (!property) return null;

  const parsedBathrooms = property.bathrooms 
    ? Math.floor(Number(property.bathrooms)) 
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 shadow-2xs hover:shadow-xl transition-all duration-300 h-[460px] flex flex-col overflow-hidden rounded-[32px] p-4 group relative"
    >
      {/* 1. Image Box Frame Section */}
      {/* 💡 NOTE: Added relative class here so Next.js 'fill' positioning anchors correctly */}
      <div className="h-48 w-full overflow-hidden bg-slate-50 dark:bg-zinc-800 rounded-2xl relative shadow-2xs">
        <Image
          src={property.images || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=80"}
          alt={property.title}
          fill
          sizes="(max-w-7xl) 33vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          priority={index < 3} // Optimizes LCP for the first row of images
        />
        <span className="absolute bottom-3 left-3 z-10 inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-zinc-950/80 backdrop-blur-md border border-white/10 text-white shadow-sm select-none">
          {property.propertyType || "Property"}
        </span>
      </div>

      {/* 2. Metadata Content Block */}
      <div className="pt-5 pb-2 px-1 flex flex-col justify-between flex-grow">
        <div className="space-y-3">
          <h3 className="text-lg text-slate-900 dark:text-white font-extrabold tracking-tight line-clamp-1 group-hover:text-[#E05638] transition-colors">
            {property.title}
          </h3>
          
          <p className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 font-bold uppercase tracking-wide">
            <MapPin size={15} strokeWidth={2.2} className="text-[#E05638] shrink-0" />
            <span className="truncate">{property.location}</span>
          </p>

          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-extrabold text-zinc-500 dark:text-zinc-400 select-none">
            <span className="inline-flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/60 px-3 py-1.5 rounded-xl">
              <BedDouble size={15} strokeWidth={2.2} className="text-zinc-400 dark:text-zinc-500" /> 
              <span>{property.bedrooms || "0"} Bed</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/60 px-3 py-1.5 rounded-xl">
              <Bath size={15} strokeWidth={2.2} className="text-zinc-400 dark:text-zinc-500" /> 
              <span>{parsedBathrooms} Bath</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/60 px-3 py-1.5 rounded-xl">
              <Maximize2 size={14} strokeWidth={2.2} className="text-zinc-400 dark:text-zinc-500" /> 
              <span>{property.size || "—"} sqft</span>
            </span>
          </div>
        </div>

        {/* 3. Financial Pricing & Call to Action Footer Row */}
        <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-900/60 mt-4">
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              ${property.rent}
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
              {" "}/ {property.rentType || "Monthly"}
            </span>
          </div>

          <Link
            href={`/properties/${property._id}`}
            className="inline-flex items-center justify-center gap-1.5 bg-[#E05638] hover:bg-[#c9492e] dark:bg-transparent dark:hover:bg-[#E05638]/10 text-white dark:text-[#E05638] border border-transparent dark:border-[#E05638]/40 font-bold text-xs px-4 h-9 rounded-xl transition-all shadow-xs active:scale-95 select-none"
          >
            <span>View Details</span>
            <ArrowRight size={13} strokeWidth={2.5} className="transform group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}