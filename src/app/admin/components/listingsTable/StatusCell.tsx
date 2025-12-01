"use client";

import { ListingStatus, ListingWithHost } from "@/lib/types/listing";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { STATUS_CONFIG } from "./statusConfig";
import useListingStatusUpdater from "./useListingStatusUpdater";

type Props = {
  listing: ListingWithHost;
  setListings: React.Dispatch<React.SetStateAction<ListingWithHost[]>>;
};

export default function StatusCell({ listing, setListings }: Props) {
  const [open, setOpen] = useState(false);
  const { updatingSet, updateStatus } = useListingStatusUpdater(setListings);
  const isUpdating = updatingSet.has(listing.id);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const { label, className } = STATUS_CONFIG[listing.status];

  const onSelect = (newStatus: ListingStatus) => {
    if (newStatus === listing.status) {
      setOpen(false);
      return;
    }
    updateStatus(listing.id, newStatus);
    setOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block"
      onBlur={(e) => {
        const currentTarget = e.currentTarget;
        requestAnimationFrame(() => {
          if (!currentTarget.contains(document.activeElement)) setOpen(false);
        });
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        disabled={isUpdating}
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${className} hover:opacity-80 transition-opacity ${
          isUpdating ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {label}
        {!isUpdating && <FaChevronDown className="w-3 h-3" />}
        {isUpdating && <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="absolute z-50 flex flex-col mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
        >
          {(Object.keys(STATUS_CONFIG) as ListingStatus[]).map((s) => {
            const sConf = STATUS_CONFIG[s];
            const isCurrent = listing.status === s;
            return (
              <button
                key={s}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(s);
                }}
                disabled={isCurrent || isUpdating}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  isCurrent || isUpdating ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${sConf.className}`}>{sConf.label}</span>
                  {isCurrent && <span className="text-xs text-gray-400">(current)</span>}
                </div>
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
