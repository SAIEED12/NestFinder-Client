"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Featured() {
  const [featuredData, setFeaturedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/properties/featured`)
      .then((res) => res.json())
      .then((data) => {
        setFeaturedData(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Could not fetch storefront listings.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 bg-transparent">
        <span className="loading loading-ring loading-lg text-[#E05638]"></span>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12 space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tigh ">
          Featured Properties
        </h2>
        <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">
          Explore premium verified rentals selected for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredData.map((property, index) => (
          <motion.div
            key={property._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className=" border border-slate-100 dark:border-zinc-800/80 dark:bg-[#1a1a1a] shadow-xs hover:shadow-md transition-all h-[460px] flex flex-col overflow-hidden rounded-3xl p-4"
          >
            {/* 1. Card Image Frame Layout */}
            <div className="h-48 w-full overflow-hidden bg-slate-50 dark:bg-zinc-800 rounded-2xl relative">
              <img
                src={property.images}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* 2. Card Content Base Block */}
            <div className="pt-5 pb-2 px-1 flex flex-col justify-between flex-grow">
              <div className="space-y-3">

                <div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-zinc-100/80 dark:bg-zinc-800/40 backdrop-blur-md border border-zinc-200/40 dark:border-zinc-700/30 text-[#E05638] shadow-2xs select-none">
                    {property.propertyType}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg text-slate-900 dark:text-white font-extrabold tracking-tight line-clamp-1">
                  {property.title}
                </h3>

                {/* Location */}
                <p className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1 font-semibold uppercase tracking-wide">
                  <span className="text-[#E05638]">📍</span> {property.location}
                </p>
              </div>

              {/* 3. Bottom Utility Interaction Row with Active Link Option */}
              <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800/60 mt-4">
                <div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    ${property.rent}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                    {" "}
                    / {property.rentType}
                  </span>
                </div>

                {/* View Details Target Navigation Button Link */}
                <Link
                  href={`/properties/${property._id}`}
                  className="inline-flex items-center justify-center bg-[#E05638] hover:bg-[#c9492e] dark:bg-transparent dark:hover:bg-[#E05638]/10 text-white dark:text-[#E05638] border border-transparent dark:border-[#E05638]/40 font-bold text-xs px-4 h-9 rounded-xl transition-all shadow-sm active:scale-95 select-none"
                >
                  View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
