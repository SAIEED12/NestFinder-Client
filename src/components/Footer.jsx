"use client";

import React from "react";
import { Link } from "@heroui/react";
import { Home, MapPin, Phone, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    if(pathname.includes('dashboard')){
      return null;
    }
  return (
    <footer className="w-full bg-[#121110] text-zinc-400 transition-colors duration-200">
      {/* Upper Footer Grid Container */}
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">
        {/* Column 1: Brand Info & Metadata (Spans 4/12 columns) */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E05638] text-white">
              <Home size={18} strokeWidth={2.5} />
            </div>
            <p className="text-xl font-bold tracking-tight">NestFinder</p>
          </div>
          <p className="text-zinc-400 leading-relaxed max-w-sm text-sm mt-2">
            NestFinder is a premium property rental marketplace connecting
            verified owners with tenants worldwide. Discover, book, and move
            into your next home with total confidence.
          </p>
          <div className="flex flex-col gap-2.5 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-zinc-500 shrink-0" />
              <span>131 Ember Street, Suite 900, New York</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-zinc-500 shrink-0" />
              <span>+1 (555) 018-2200</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-zinc-500 shrink-0" />
              <span>hello@nestfinder.com</span>
            </div>
          </div>
        </div>

        {/* Space Adjustment for Column Offsets on desktop */}
        <div className="hidden md:block md:col-span-1"></div>

        {/* Column 2: Marketplace Links (Spans 2/12 columns) */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Marketplace
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link
                href="/"
                className="text-zinc-400 hover:text-white no-underline hover:no-underline"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/all-properties"
                className="text-zinc-400 hover:text-white no-underline hover:no-underline"
              >
                All Properties
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="text-zinc-400 hover:text-white no-underline hover:no-underline"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="text-zinc-400 hover:text-white no-underline hover:no-underline"
              >
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Company Links (Spans 2/12 columns) */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Company
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link
                href="/about"
                className="text-zinc-400 hover:text-white no-underline hover:no-underline"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-zinc-400 hover:text-white no-underline hover:no-underline"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-zinc-400 hover:text-white no-underline hover:no-underline"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-zinc-400 hover:text-white no-underline hover:no-underline"
              >
                Press
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Support Links (Spans 2/12 columns) */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Support
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link
                href="/services"
                className="text-zinc-400 hover:text-white no-underline hover:no-underline"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-zinc-400 hover:text-white no-underline hover:no-underline"
              >
                Safety
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-zinc-400 hover:text-white no-underline hover:no-underline"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-zinc-400 hover:text-white no-underline hover:no-underline"
              >
                Privacy
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: Follow Section (Spans 1/12 columns on desktop) */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap">
            Follow
          </h4>
          <div className="flex gap-2 items-center">
            {/* X / Twitter */}
            <a
              href="#"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-850 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors border border-zinc-800"
              aria-label="X (Twitter)"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="#"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-850 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors border border-zinc-800"
              aria-label="Facebook"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>

            {/* Instagram (Converted to clean Solid Fill to match alignment perfectly) */}
            <a
              href="#"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-850 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors border border-zinc-800"
              aria-label="Instagram"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Lower Copyright Boundary Bar */}
      <div className="border-t border-zinc-800/60 py-6">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 NestFinder. All rights reserved.</p>
          <p className="font-medium text-zinc-400">
            Crafted for premium living.
          </p>
        </div>
      </div>
    </footer>
  );
}
