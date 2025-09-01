import { searchListings } from "@/lib/api/server/api";
import SearchContainer from "./components/SearchContainer";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ city?: string; filters?: string }> }) {
  const { city, filters } = await searchParams;

  const listings = await searchListings(city, filters);

  return <SearchContainer listings={listings} city={city} />;
}
