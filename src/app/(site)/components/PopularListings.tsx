"use client";

import { Listing } from "@/lib/types/listing";
import { motion } from "framer-motion";
import HomeListingCard from "./HomeListingCard";

export default function PopularListings({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) return null;

  return (
    <section className="py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-myGrayDark mb-2">Popular right now</h2>
          <p className="text-myGray">Most loved by our community</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <HomeListingCard key={listing.id} listing={listing} href={`/listing/${listing.id}`} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
