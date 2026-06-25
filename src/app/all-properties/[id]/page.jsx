import React from 'react';
import { getPropertyById } from '@/lib/api/property';
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import Image from 'next/image';
import Link from 'next/link';
import BookingCard from '@/components/BookingCard';
import { 
  MapPin, BedDouble, Bath, Maximize2, 
  Wifi, Shield, ArrowLeft, Building2, CheckCircle2 
} from 'lucide-react';
import PropertyReviewSection from '@/components/PropertyReviewSection';

const AMENITY_MAP = {
  wifi: { label: "High-Speed WiFi", icon: <Wifi size={16} /> },
  lift: { label: "Elevator Access", icon: <Building2 size={16} /> },
  security: { label: "24/7 Monitored Security", icon: <Shield size={16} /> },
};



export default async function PropertyDetailsPage({ params }) {
  const { id } = await params;
  
  let property = null;
  const userSession = await auth.api.getSession({
    headers: await headers(),
  });

  // console.log(userSession)


  try {
    property = await getPropertyById(id);
  } catch (error) {
    console.error("Error drawing custom property sheet:", error);
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-zinc-950 px-4">
        <p className="text-sm font-bold text-slate-700 dark:text-zinc-400">Listing file sheet missing or corrupted.</p>
        <Link href="/all-properties" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#E05638] hover:underline">
          <ArrowLeft size={14} /> Back to Marketplace Vault
        </Link>
      </div>
    );
  }

  const parsedBathrooms = property.bathrooms ? Math.floor(Number(property.bathrooms)) : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-200 py-10">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* 1. Navigation Breadcrumb */}
        <Link 
          href="/all-properties" 
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-slate-900 dark:hover:text-white tracking-wide uppercase transition-colors group w-fit"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Marketplace</span>
        </Link>

        {/* 2. Symmetrical Main Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN PANEL VIEW */}
          <div className="lg:col-span-7 space-y-8">
            <div className="h-[440px] w-full overflow-hidden bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-900/80 rounded-[32px] relative shadow-xs">
              <Image
                src={property.images || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200"}
                alt={property.title}
                fill
                priority
                sizes="(max-w-7xl) 60vw, 100vw"
                className="object-cover"
              />
              <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-zinc-950/80 backdrop-blur-md border border-white/10 text-white shadow-sm">
                 {property.propertyType}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-none">
                {property.title}
              </h1>
              <p className="text-xs md:text-sm text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 font-bold uppercase tracking-wide">
                <MapPin size={16} strokeWidth={2.2} className="text-[#E05638] shrink-0" />
                <span>{property.location}</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 border-y border-zinc-100 dark:border-zinc-900 py-5 select-none">
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 dark:bg-zinc-900/20 rounded-2xl border border-slate-100/60 dark:border-zinc-900/40">
                <BedDouble size={20} strokeWidth={2} className="text-[#E05638] mb-1" />
                <span className="text-xs font-black text-slate-900 dark:text-zinc-200">{property.bedrooms || "0"} Bedrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 dark:bg-zinc-900/20 rounded-2xl border border-slate-100/60 dark:border-zinc-900/40">
                <Bath size={20} strokeWidth={2} className="text-[#E05638] mb-1" />
                <span className="text-xs font-black text-slate-900 dark:text-zinc-200">{parsedBathrooms} Bathrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 dark:bg-zinc-900/20 rounded-2xl border border-slate-100/60 dark:border-zinc-900/40">
                <Maximize2 size={18} strokeWidth={2} className="text-[#E05638] mb-1" />
                <span className="text-xs font-black text-slate-900 dark:text-zinc-200">{property.size || "—"} Sq Ft</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">About This Space</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                {property.description}
              </p>
            </div>

            {property.extraFeatures && (
              <div className="space-y-3 pt-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">Premium Architectural Accents</h3>
                <div className="flex flex-wrap gap-2">
                  {property.extraFeatures.split(',').map((feature, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-zinc-100 dark:border-zinc-800">
                      <CheckCircle2 size={13} className="text-zinc-400" />
                      {feature.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT STICKY INTERACTIVE COLUMN SIDEBAR */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            <BookingCard property={property} userSession={userSession} />

            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[32px] p-6 space-y-4">
                <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Included Amenities</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {property.amenities.map((item) => {
                    const mapped = AMENITY_MAP[item.toLowerCase()] || { label: item, icon: <CheckCircle2 size={15} /> };
                    return (
                      <div key={item} className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-zinc-300 bg-slate-50/50 dark:bg-zinc-900/40 border border-slate-100/40 dark:border-zinc-800/60 p-3 rounded-xl">
                        <div className="text-[#E05638]">{mapped.icon}</div>
                        <span className="capitalize">{mapped.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}


          </div>
        </div>

            <PropertyReviewSection propertyId={id} />
      </div>
    </div>
  );
}