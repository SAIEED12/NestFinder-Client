import React from "react";
import PropertyCard from "@/components/ui/PropertyCard";
import { getAllProperties } from "@/lib/api/property";

export default async function AllProperties() {

  let properties = [];
  try {
    properties = await getAllProperties();
  } catch (error) {
    console.error("Server-side properties extraction error:", error);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-200 py-12">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Title Content Header */}
        <div className="space-y-3 border-b border-zinc-100 dark:border-zinc-900 pb-6">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#E05638] bg-[#E05638]/5 border border-[#E05638]/10 px-4 py-1.5 rounded-full shadow-2xs">
            🏠 Marketplace Vault
          </span>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Discover Your Next Space
          </h1>
          <p className="text-sm text-zinc-400 font-medium max-w-xl leading-relaxed">
            Browse through our master ledger of secure, fully audited premium residences available worldwide.
          </p>
        </div>

        {/* Pure 3-Column Symmetrical Grid Layout */}
        <div>
          {properties.length === 0 ? (
            <div className="w-full text-center py-24 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[32px] p-6 bg-slate-50/20">
              <p className="text-sm font-bold text-slate-700 dark:text-zinc-400">No properties available inside your catalog.</p>
              <p className="text-xs text-zinc-400 mt-1">Make sure you have documents marked as status "Approved" inside your database collection cluster.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, idx) => (
                <PropertyCard 
                  key={property._id || idx} 
                  property={property} 
                  index={idx} 
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}