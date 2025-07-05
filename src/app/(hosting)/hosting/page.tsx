"use client";

import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";

export default function page() {
  const handleCreateListing = () => {
    redirect("/hosting/create");
  };

  return (
    <>
      <header>
        <Navbar search={false} />
      </header>
      <main className="w-full mt-2 flex-grow px-5">
        <div className="flex flex-col">
          Hosting
          <button onClick={handleCreateListing}>Create Listing</button>
        </div>
      </main>
    </>
  );
}
