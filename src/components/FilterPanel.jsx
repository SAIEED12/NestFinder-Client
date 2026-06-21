"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select, ListBox, Button } from "@heroui/react";
import { Sparkles, Home, Building2, Palmtree, Tent, ArrowUpDown, SlidersHorizontal, RefreshCw } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Properties", icon: <Sparkles size={16} /> },
  { id: "house", label: "Houses", icon: <Home size={16} /> },
  { id: "apartment", label: "Apartments", icon: <Building2 size={16} /> },
  { id: "villa", label: "Villas", icon: <Palmtree size={16} /> },
  { id: "cabin", label: "Cabins", icon: <Tent size={16} /> },
];

const SORT_OPTIONS = [
  { key: "featured", label: "Sort: Featured" },
  { key: "low-to-high", label: "Price: Low to High" },
  { key: "high-to-low", label: "Price: High to Low" },
];

export default function FilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Sync state cleanly with incoming active search parameters from URL paths
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("propertyType") || "all");
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "featured");

  const updateQueryParams = (type, value) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (type === "propertyType") {
      if (value && value !== "all") params.set("propertyType", value);
      else params.delete("propertyType");
    }
    
    if (type === "sort") {
      if (value && value !== "featured") params.set("sort", value);
      else params.delete("sort");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (id) => {
    setSelectedCategory(id);
    updateQueryParams("propertyType", id);
  };

  const handleSortChange = (key) => {
    setSortOption(key);
    updateQueryParams("sort", key);
  };

  const handleReset = () => {
    setSelectedCategory("all");
    setSortOption("featured");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("propertyType");
    params.delete("sort");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full space-y-6 bg-slate-50/40 dark:bg-zinc-900/20 border border-slate-100 dark:border-zinc-900/60 p-5 rounded-[28px] shadow-2xs">
      
      {/* Top Controls Layout Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-200">
          <SlidersHorizontal size={16} className="text-[#E05638]" />
          <span className="text-xs font-black uppercase tracking-wider">Refine Ledger Index</span>
        </div>

        {/* Sorting Dropdown Menu */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select
            aria-label="Sort Properties"
            selectedKeys={[sortOption]}
            onChange={(e) => handleSortChange(e.target.value)}
            startContent={<ArrowUpDown size={14} className="text-zinc-400 mr-1" />}
            className="w-full md:w-56"
            classNames={{
              trigger: "h-11 bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl shadow-2xs px-4",
              value: "text-xs font-bold text-slate-700 dark:text-zinc-300",
            }}
          >
            {/* 💡 Using correct dot-notation compound items to pass compilation */}
            <Select.Popover className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl">
              <ListBox>
                {SORT_OPTIONS.map((opt) => (
                  <ListBox.Item id={opt.key} key={opt.key} textValue={opt.label} className="text-xs font-semibold rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-900">
                    {opt.label}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          {/* Reset Filters Toggle Button */}
          {(selectedCategory !== "all" || sortOption !== "featured") && (
            <Button
              isIconOnly
              onClick={handleReset}
              className="bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 rounded-xl h-11 w-11 shadow-2xs min-w-0 flex items-center justify-center"
              title="Reset Filters"
            >
              <RefreshCw size={14} className="text-zinc-500" />
            </Button>
          )}
        </div>
      </div>

      {/* Categories Horizontal Selector Ribbon Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-t border-zinc-100/60 dark:border-zinc-900/60 pt-4 select-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`inline-flex items-center gap-2 px-4 h-10 rounded-xl text-xs font-extrabold transition-all border tracking-wide whitespace-nowrap shadow-2xs active:scale-95 ${
                isActive
                  ? "bg-[#E05638] border-transparent text-white shadow-xs"
                  : "bg-white dark:bg-zinc-950 border-zinc-200/60 dark:border-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              <span className={isActive ? "text-white" : "text-[#E05638]"}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}