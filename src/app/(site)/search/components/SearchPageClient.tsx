"use client";

import { ParsedFilters } from "@/lib/api/server/utils";
import { City } from "@/lib/types/cities";
import { Listing } from "@/lib/types/listing";
import dynamic from "next/dynamic";

const SearchContainer = dynamic(() => import("./SearchContainer"), { ssr: false });

interface SearchPageClientProps {
  listings: Listing[];
  city: string | undefined;
  cityCenter: { lat: number; lng: number } | null;
  cities: City[];
  filters: ParsedFilters;
}

export default function SearchPageClient({ listings, city, cityCenter, cities, filters }: SearchPageClientProps) {
  return <SearchContainer listings={listings} city={city} cityCenter={cityCenter} cities={cities} filters={filters} />;
}
