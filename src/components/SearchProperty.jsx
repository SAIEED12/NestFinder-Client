'use client'
import { Button } from "@heroui/react";
import { redirect } from "next/navigation";


const SearchProperty = () => {
  const onSubmit = (e) =>{
    e.preventDefault();
    redirect(`/all-properties?search=${e.target.search.value}`)
  }
  return (
    <div className="flex gap-2">
      <form onSubmit={onSubmit}>
        <input name="search"
          type="search"
          placeholder="Location"
          className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#E05638]/20 focus:border-[#E05638] transition-all "
        />
        <Button type="submit" className="bg-[#E05638] text-white font-semibold rounded-xl px-5 ml-2">
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchProperty;
