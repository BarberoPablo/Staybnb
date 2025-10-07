import { getAllCities } from "@/lib/api/server/endpoints/cities";
import { searchListings } from "@/lib/api/server/endpoints/listings";
import { parseFilters } from "@/lib/api/server/utils";
import SearchPageClient from "./components/SearchPageClient";
import { ErrorBoundary } from "@/components/ErrorBoundary";

type SearchPageParams = Record<string, string | string[] | undefined>;

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchPageParams> }) {
  const params = await searchParams;
  const city = typeof params.city === "string" ? params.city : undefined;
  const filters = parseFilters(params);

  const [{ listings, cityCenter }, cities] = await Promise.all([searchListings(city, filters), getAllCities()]);

  return (
    <ErrorBoundary>
      <SearchPageClient listings={listings} city={city} cityCenter={cityCenter} cities={cities} filters={filters} />
    </ErrorBoundary>
  );
}
