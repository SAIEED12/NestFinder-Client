import React from "react";
import PropertiesTable from "./PropertiesTable";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { getProperty } from "@/lib/api/property";

// Next.js Server Components accept a 'searchParams' prop for parsing query parameters
export default async function OwnerMyPropertiesPage({ searchParams }) {
  // Await searchParams as required by modern Next.js versions
  const resolvedParams = await searchParams;

  // Extract the page from the URL query (e.g., ?page=2). Default to 1 if empty.
  const currentPage = Number(resolvedParams?.page) || 1;

  // Fetch the current paginated window directly from your Express server database
  let propertiesData = { data: [], page: 1, totalPage: 1 };

  try {
    propertiesData = await getProperty(currentPage);
  } catch (error) {
    console.error("Failed to load properties on server component:", error);
  }

  return (
    <div className="space-y-6">
      {/* Upper Dashboard Header Action Panel */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Properties
          </h1>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
            Manage, track, and monitor your listed properties across global
            locations.
          </p>
        </div>

        {/* Navigation Shortcut Link to Add New Listing */}
        <Link
          href="/dashboard/owner/add-property"
          className="bg-[#E05638] hover:bg-[#c9492e] text-white font-semibold rounded-xl flex items-center gap-2 shadow-sm h-10 px-4 text-sm"
        >
          <PlusCircle size={16} />
          Add New Property
        </Link>
      </div>

      {/* Main Table Segment Wrapper */}
      <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 p-4 shadow-xs">
        <PropertiesTable propertiesData={propertiesData} />
      </div>
    </div>
  );
}
