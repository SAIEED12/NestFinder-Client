import React from 'react';
import { Shield, Target, Users, Award, ArrowUpRight } from 'lucide-react';
import { Button } from "@heroui/react";

export default function AboutPage() {
  const coreValues = [
    {
      icon: <Shield size={24} className="text-[#E05638]" />,
      title: "Trust & Security",
      description: "We verify every home layout, host identity, and payment pipeline to give you absolute peace of mind."
    },
    {
      icon: <Target size={24} className="text-[#E05638]" />,
      title: "Design Forward",
      description: "Our properties are curated specifically for architecture, premium aesthetics, and functional workspaces."
    },
    {
      icon: <Users size={24} className="text-[#E05638]" />,
      title: "Community First",
      description: "We foster deep local connections, helping travelers integrate beautifully into neighborhoods worldwide."
    }
  ];

  const stats = [
    { number: "2,400+", label: "Premium Homes" },
    { number: "40k+", label: "Happy Stays" },
    { number: "18+", label: "Countries Covered" },
    { number: "4.9", label: "Average Rating" }
  ];

  return (
    <main className="min-h-screen bg-white text-slate-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200">
      
      {/* 1. Hero / Vision Section */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 text-center md:pt-24 md:pb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-[#E05638]">
          Our Journey
        </span>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Redefining how the world finds home.
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-500 dark:text-zinc-400">
          NestFinder started with a simple problem: finding design-forward, verified premium rental accommodations shouldn&apos;t feel like a gamble. We bridge the gap between boutique hotel hospitality and the comfort of residential homes.
        </p>
      </section>

      {/* 2. Business Statistics Metrics */}
      <section className="mx-auto max-w-5xl px-6 py-8 border-y border-slate-100 dark:border-zinc-800">
        <div className="grid grid-cols-2 gap-y-8 text-center md:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                {stat.number}
              </span>
              <span className="mt-1 text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Core Values Grid */}
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            What drives NestFinder
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            The principles dictating our everyday choices and operational frameworks.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {coreValues.map((value, index) => (
            <div 
              key={index} 
              className="flex flex-col items-start p-6 rounded-2xl bg-slate-50/50 dark:bg-zinc-900/40 border border-transparent dark:border-zinc-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-zinc-800/50">
                {value.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-zinc-400">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Bottom Call To Action */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl border border-slate-100 dark:border-zinc-800 p-8 md:p-12 bg-white dark:bg-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
              Interested in partnering with us?
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400 max-w-xl">
              List your design-forward property on NestFinder to unlock premium, corporate, and digital nomad tenants globally.
            </p>
          </div>
          <Button className="rounded-xl bg-[#E05638] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c9492e] transition-all flex items-center gap-2 shrink-0">
            List Your Space <ArrowUpRight size={16} />
          </Button>
        </div>
      </section>

    </main>
  );
}