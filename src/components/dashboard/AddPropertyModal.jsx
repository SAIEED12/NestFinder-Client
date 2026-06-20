"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast"
import { uploadImage } from "@/lib/imageUpload";
import { addProperty } from "@/lib/action/properties";
import { useRouter } from "next/navigation";



export default function AddPropertyPage() {
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const router = useRouter();

  const handleSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const image = await uploadImage(formData.get("images"));
    
    const property = {
        ...data,
        images: image.url,
        amenities: selectedAmenities
    }

    const result = await addProperty(property);
    console.log(result);


    
    // Add the selected checkboxes to our payload array
    data.amenities = selectedAmenities;
    toast.success("Property added successfully!")
    router.push("/dashboard/owner/my-properties")

  };

  // Shared pure Tailwind CSS classes for form consistency
  const textInputClass = "w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05638]/20 focus:border-[#E05638] transition-all shadow-xs";
  const selectClass = "w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05638]/20 focus:border-[#E05638] transition-all shadow-xs appearance-none cursor-pointer";
  const labelClass = "text-xs font-semibold text-slate-700 dark:text-zinc-300";

  // List of amenities for our checkboxes
  const amenitiesList = [
    { id: "wifi", label: "WiFi" },
    { id: "parking", label: "Parking" },
    { id: "ac", label: "Air Conditioning" },
    { id: "lift", label: "Lift" },
    { id: "security", label: "Security" },
    { id: "generator", label: "Generator" },
    { id: "gym", label: "Gym" },
    { id: "pool", label: "Swimming Pool" }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm my-4">
      
      {/* Form Header */}
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Add New Property</h1>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
          Provide your property specifications below. Fields marked with * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hidden internal metadata configuration settings */}
        <input type="hidden" name="status" value="Pending" />

        {/* ROW 1: Title & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="title" className={labelClass}>Property Title *</label>
            <input type="text" id="title" name="title" className={textInputClass} placeholder="Luxury Apartment in Dhaka" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="location" className={labelClass}>Location *</label>
            <input type="text" id="location" name="location" className={textInputClass} placeholder="Khulna, Bangladesh" required />
          </div>
        </div>

        {/* ROW 2: Property Type & Rent Type (Swapped to Native Select tags for 100% stability) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 relative">
            <label htmlFor="propertyType" className={labelClass}>Property Type *</label>
            <select id="propertyType" name="propertyType" className={selectClass} required defaultValue="">
              <option value="" disabled hidden>Select Type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="cabin">Cabin</option>
            </select>
          </div>
          
          <div className="space-y-2 relative">
            <label htmlFor="rentType" className={labelClass}>Rent Type *</label>
            <select id="rentType" name="rentType" className={selectClass} required defaultValue="">
              <option value="" disabled hidden>Select Rent Type</option>
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Daily">Daily</option>
            </select>
          </div>
        </div>

        {/* ROW 3: Rent & Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="rent" className={labelClass}>Monthly Rent ($) *</label>
            <input type="number" id="rent" name="rent" className={textInputClass} placeholder="15000" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="size" className={labelClass}>Property Size (sqft) *</label>
            <input type="number" id="size" name="size" className={textInputClass} placeholder="1200" required />
          </div>
        </div>

        {/* ROW 4: Bedrooms & Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="bedrooms" className={labelClass}>Bedrooms *</label>
            <input type="number" id="bedrooms" name="bedrooms" className={textInputClass} placeholder="2" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="bathrooms" className={labelClass}>Bathrooms *</label>
            <input type="number" id="bathrooms" name="bathrooms" className={textInputClass} placeholder="2" required />
          </div>
        </div>

        {/* ROW 5: Extra Features & Image URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="extraFeatures" className={labelClass}>Extra Features</label>
            <input type="text" id="extraFeatures" name="extraFeatures" className={textInputClass} placeholder="Balcony, Pet Friendly, Rooftop, CCTV" />
          </div>
          <div className="space-y-2">
            <label htmlFor="images" className={labelClass}>Image *</label>
            <input type="file" id="images" name="images" className={textInputClass} placeholder="Upload images" required />
          </div>
        </div>

        {/* ROW 6: Description Paragraph */}
        <div className="space-y-2">
          <label htmlFor="description" className={labelClass}>Description *</label>
          <textarea 
            id="description" 
            name="description" 
            rows={4} 
            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05638]/20 focus:border-[#E05638] transition-all shadow-xs resize-none" 
            placeholder="Write property details..." 
            required
          />
        </div>

{/* ROW 7: Checkbox Amenities Matrix */}
<div className="space-y-3">
  <label className={labelClass}>Amenities</label>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
    {amenitiesList.map((amenity) => (
      <label
        key={amenity.id}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <input
          type="checkbox"
          value={amenity.id}
          checked={selectedAmenities.includes(amenity.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedAmenities([...selectedAmenities, amenity.id]);
            } else {
              setSelectedAmenities(selectedAmenities.filter(id => id !== amenity.id));
            }
          }}
          className="w-4 h-4 rounded accent-[#E05638] cursor-pointer"
        />
        <span className="text-sm text-slate-700 dark:text-zinc-300 font-medium select-none group-hover:text-[#E05638] transition-colors">
          {amenity.label}
        </span>
      </label>
    ))}
  </div>
</div>

        {/* Submit Actions Area */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end">
          <Button 
            type="submit" 
            className="bg-black hover:bg-zinc-800 text-white font-semibold rounded-xl text-sm shadow-md px-6"
          >
            Add Property
          </Button>
        </div>
      </form>
    </div>
  );
}