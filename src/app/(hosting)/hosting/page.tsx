"use client";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function Hosting() {
  const router = useRouter();
  const handleMyListings = () => {
    router.push("/hosting/listings");
  };

  const handleCreateListing = () => {
    router.push("/hosting/create");
  };

  return (
    <>
      <header>
        <Navbar search={false} />
      </header>
      <main className="w-full mt-2 flex-grow px-5">
        <div className="flex items-center justify-center gap-20">
          <button className="basic-button justify-center w-50 h-50" onClick={handleMyListings}>
            My listings
          </button>
          <button className="basic-button justify-center w-50 h-50" onClick={handleCreateListing}>
            Create Listing
          </button>
        </div>
      </main>
    </>
  );
}
