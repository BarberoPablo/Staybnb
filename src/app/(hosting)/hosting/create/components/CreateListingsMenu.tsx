"use client";

import { createDraftListing } from "@/lib/api/server/api";
import { DraftListing } from "@/lib/types/draftListing";
import { hostingSteps } from "@/lib/types/hostingSteps";
import { useRouter } from "nextjs-toploader/app";

export default function CreateListingsMenu({ draftListings }: { draftListings: DraftListing[] }) {
  const router = useRouter();

  const handleCreateNewListing = async () => {
    const { success, id } = await createDraftListing();
    if (success) {
      router.push(`/hosting/create/listing/${id}/${hostingSteps[0]}`);
    }
  };

  return (
    <div>
      <h1>Create Listings Menu</h1>
      <button onClick={handleCreateNewListing} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:cursor-pointer">
        Create New Listing
      </button>
      <div className="flex flex-row gap-4">
        {draftListings.map((draft) => (
          <div key={draft.id} className="w-25 h-25 border border-gray-300 rounded-md">
            {draft.title}
          </div>
        ))}
      </div>
    </div>
  );
}
