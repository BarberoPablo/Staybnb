"use client";

import { ParsedFilters } from "@/lib/api/server/utils";
import Link from "next/link";
import { IoLocationOutline, IoSearch } from "react-icons/io5";
import { FilterChips } from "./FilterChips";

interface City {
  name: string;
  state: string | null;
  country: string | null;
  lat: number;
  lng: number;
}

interface NoListingsFoundProps {
  city: string | undefined;
  cities: City[];
  filters: ParsedFilters;
}

export function NoListingsFound({ city, cities, filters }: NoListingsFoundProps) {
  return (
    <div className="text-center">
      <IoSearch className="w-16 h-16 text-myGray mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-myGrayDark mb-2">No listings found</h1>
      <p className="text-myGray mb-8">We couldn&apos;t find any places {city ? `in ${city}` : ""}</p>

      {/* Filter Chips */}
      <div className="max-w-4xl mx-auto mb-8">
        <FilterChips city={city} filters={filters} />
      </div>

      {cities.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-myGrayDark mb-4">Explore these popular destinations:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cities.slice(0, 12).map((cityItem) => (
              <Link
                key={`${cityItem.name}-${cityItem.state}-${cityItem.country}`}
                href={`/search?city=${encodeURIComponent(cityItem.name)}`}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-myGreen hover:shadow-md transition-all duration-200 group"
              >
                <IoLocationOutline className="w-5 h-5 text-myGray group-hover:text-myGreen transition-colors" />
                <div className="text-left">
                  <div className="font-medium text-myGrayDark group-hover:text-myGreen transition-colors">{cityItem.name}</div>
                  {(cityItem.state || cityItem.country) && (
                    <div className="text-sm text-myGray">{[cityItem.state, cityItem.country].filter(Boolean).join(", ")}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
