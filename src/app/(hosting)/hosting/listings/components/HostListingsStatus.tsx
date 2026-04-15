"use client";

import { HostListings } from "@/lib/api/host/listings/listings.schema";
import { motion } from "framer-motion";

interface StatusItem {
  label: string;
  count: number;
  color: string;
}

export default function HostListingsStatus({ listings }: { listings: HostListings }) {
  const statusItems: StatusItem[] = [
    {
      label: "Total Listings",
      count: listings.length,
      color: "text-myGreenSemiBold",
    },
    {
      label: "Published",
      count: listings.filter((l) => l.status === "PUBLISHED").length,
      color: "text-myGrayDark",
    },
    {
      label: "Paused",
      count: listings.filter((l) => l.status === "PAUSED").length,
      color: "text-myPurple",
    },
    {
      label: "Pending",
      count: listings.filter((l) => l.status === "PENDING").length,
      color: "text-myPurple",
    },
    {
      label: "Rejected",
      count: listings.filter((l) => l.status === "REJECTED").length,
      color: "text-myPurple",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
      <div className="bg-white/60 rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
          {statusItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className={`text-3xl font-bold ${item.color} mb-2`}>{item.count}</div>
              <div className="text-myGray">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
