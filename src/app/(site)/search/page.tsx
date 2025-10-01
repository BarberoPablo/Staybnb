import { getAllCities, searchListings } from "@/lib/api/server/api";
import { parseFilters } from "@/lib/api/server/utils";
import SearchContainer from "./components/SearchContainer";

type SearchPageParams = Record<string, string | string[] | undefined>;

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchPageParams> }) {
  const params = await searchParams;
  const city = typeof params.city === "string" ? params.city : undefined;
  const filters = parseFilters(params);

  const [{ listings, cityCenter }, cities] = await Promise.all([searchListings(city, filters), getAllCities()]);

  return <SearchContainer listings={listings} city={city} cityCenter={cityCenter} cities={cities} filters={filters} />;
}
