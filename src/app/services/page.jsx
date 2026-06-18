import React from 'react';
import { Home, Key, ShieldCheck, HardHat, ArrowRight } from 'lucide-react';
import { Button } from "@heroui/react";

export default function Services() {
  const servicesList = [
    {
      icon: <Home size={28} className="text-[#E05638]" />,
      title: "Property Rentals",
      description: "Discover verified, design-forward rentals across the world's most desirable neighborhoods with transparent processing."
    },
    {
      icon: <Key size={28} className="text-[#E05638]" />,
      title: "Home Buying & Sales",
      description: "Expert guidance through your entire purchasing or selling journey, making homeownership seamless and stress-free."
    },
    {
      icon: <ShieldCheck size={28} className="text-[#E05638]" />,
      title: "Verified Listings",
      description: "Every single property on our platform goes through a rigorous multi-point verification background check for total security."
    },
    {
      icon: <HardHat size={28} className="text-[#E05638]" />,
      title: "Property Management",
      description: "Comprehensive hands-off management for landlords, tracking maintenance, leasing contracts, and premium guest hospitality."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200">
      
      {/* 1. Header Hero Section */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center md:py-24">
        <span className="text-xs font-bold uppercase tracking-widest text-[#E05638]">
          Our Expertise
        </span>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Services Designed for Modern Living
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 dark:text-zinc-400">
          Whether you are looking to rent a premium home worldwide, buy your dream property, or manage your real estate assets, NestFinder has you covered.
        </p>
      </section>

      {/* 2. Services Grid */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {servicesList.map((service, index) => (
            <div 
              key={index}
              className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 dark:bg-zinc-800/50">
                {service.icon}
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-zinc-400">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Call To Action (CTA) Banner */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-[#E05638] px-8 py-12 text-center text-white shadow-xl md:px-12 md:py-16">
          <div className="relative z-10 mx-auto max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to find your next stay?
            </h2>
            <p className="mt-4 text-sm text-orange-100">
              Explore thousands of verified properties or consult with our property specialists today to lock down your ideal space.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button className="rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#E05638] shadow-sm hover:bg-orange-50 transition-all flex items-center gap-2">
                Browse Properties <ArrowRight size={16} />
              </Button>
              <Button variant="bordered" className="rounded-xl border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all">
                Contact Support
              </Button>
            </div>
          </div>
          {/* Background subtle visual blob decoration */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#c9492e] opacity-50 blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-[#f06e52] opacity-30 blur-2xl"></div>
        </div>
      </section>

    </main>
  );
}