"use client";

import { PopularDestination } from "@/lib/api/server/endpoints/cities";
import { motion } from "framer-motion";
import DestinationCard from "./DestinationCard";

export default function PopularDestinations({ destinations }: { destinations: PopularDestination[] }) {
  if (destinations.length === 0) return null;

  return (
    <section className="py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-myGrayDark mb-2">Explore popular destinations</h2>
          <p className="text-myGray">Discover places with the most properties</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <DestinationCard key={`${destination.name}-${index}`} destination={destination} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
