import { Listing } from "@/lib/types";
import Link from "next/link";
import React from "react";

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listing/${listing.id}`}>
      <div className="border rounded-2xl overflow-hidden">
        <div className="min-h-[200px] bg-cover bg-center" style={{ backgroundImage: `url(${listing.images[0]})` }}></div>

        <div className="flex justify-between px-1">
          <h2 className="text-nowrap overflow-hidden overflow-ellipsis max-w-[200px]">
            {listing.type} in {listing.location}
          </h2>
          <h2>
            ⭐ {listing.score.value} ({listing.score.reviews.length})
          </h2>
        </div>
        <h2 className="font-semibold">{listing.title}</h2>
      </div>
    </Link>
  );
}
