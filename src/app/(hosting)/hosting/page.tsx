"use client";

import Navbar from "@/components/Navbar";
import { basicButton } from "@/lib/styles";
import { useRouter } from "nextjs-toploader/app";

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
          <button className={`${basicButton} justify-center w-50 h-50`} onClick={handleMyListings}>
            My listings
          </button>
          <button className={`${basicButton} justify-center w-50 h-50`} onClick={handleCreateListing}>
            Create Listing
          </button>
        </div>
      </main>
    </>
  );
}
