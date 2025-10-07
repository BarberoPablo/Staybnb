import { getHostListings } from "@/lib/api/server/endpoints/listings";
import HostListingCards from "./components/HostListingCards";
import HostListingsHeader from "./components/HostListingsHeader";
import HostListingsStatus from "./components/HostListingsStatus";

export default async function HostListingPage() {
  const listings = await getHostListings();

  return (
    <div className="flex flex-col w-full flex-grow min-h-screen py-8 px-6 sm:px-12 gap-8">
      <HostListingsHeader />

      <HostListingCards listings={listings} />

      <HostListingsStatus listings={listings} />
    </div>
  );
}
