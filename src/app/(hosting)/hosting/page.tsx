"use client";

import { redirect } from "next/navigation";

export default function page() {
  const handleCreateListing = () => {
    redirect("/hosting/create");
  };

  return (
    <div className="flex flex-col">
      Hosting
      <button onClick={handleCreateListing}>Create Listing</button>
    </div>
  );
}
