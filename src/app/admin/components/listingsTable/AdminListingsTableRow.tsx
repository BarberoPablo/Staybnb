"use client";

import type { ListingWithHost } from "@/lib/types/listing";
import { showUTCDate } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import HostCell from "./HostCell";
import ListingTitleCell from "./ListingTitleCell";
import StatusCell from "./StatusCell";

export default function AdminListingsTableRow({
  listing,
  tdStyle,
  setListings,
}: {
  listing: ListingWithHost;
  tdStyle: string;
  setListings: React.Dispatch<React.SetStateAction<ListingWithHost[]>>;
}) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
      className="hover:bg-gray-50 transition-colors"
    >
      <td className={`${tdStyle} max-w-xs`}>
        <ListingTitleCell listing={listing} />
      </td>

      <td className={tdStyle}>
        <div className="text-gray-900">{listing.location.city}</div>
        <div className="text-xs text-gray-500">{listing.location.country}</div>
      </td>

      <td className={tdStyle}>
        <HostCell host={listing.host} />
      </td>

      <td className={tdStyle}>
        <span className="font-semibold text-gray-900">${listing.nightPrice.toFixed(2)}</span>
        <span className="text-xs text-gray-500">/night</span>
      </td>

      <td className={tdStyle}>
        <StatusCell listing={listing} setListings={setListings} />
      </td>

      <td className={tdStyle}>
        <div className="text-gray-900">{showUTCDate(listing.createdAt)}</div>
      </td>

      <td className={tdStyle}>
        <Link href={`/listing/${listing.id}`} className="text-myGreenSemiBold hover:text-myGreenBold font-medium text-sm transition-colors cursor-pointer">
          View Listing
        </Link>
      </td>
    </motion.tr>
  );
}
