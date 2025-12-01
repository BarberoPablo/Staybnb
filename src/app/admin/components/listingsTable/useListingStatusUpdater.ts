"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { updateListingStatus } from "@/lib/api/server/endpoints/listings";
import { ListingStatus, ListingWithHost } from "@/lib/types/listing";
import { useRouter } from "next/navigation";

/**
 * Hook that encapsulates optimistic update logic for listing status.
 * - Accepts setListings setter to update local list state.
 * - Returns updating set and an updateStatus function.
 *
 * Responsable por:
 * - optimistic UI
 * - revert on error
 * - toast
 * - router.refresh() on success
 *
 * Usage:
 * const { updatingSet, updateStatus } = useListingStatusUpdater(setListings)
 */
export default function useListingStatusUpdater(setListings: React.Dispatch<React.SetStateAction<ListingWithHost[]>>) {
  const updatingRef = useRef<Set<number>>(new Set());
  const [, forceRerender] = useState(0); // to trigger updates when updatingRef changes
  const router = useRouter();

  const getUpdatingSet = () => updatingRef.current;

  const updateStatus = async (listingId: number, newStatus: ListingStatus) => {
    let previousStatus: ListingStatus | null = null;

    setListings((prev) => {
      return prev.map((l) => {
        if (l.id === listingId) {
          previousStatus = l.status;
          return { ...l, status: newStatus };
        }
        return l;
      });
    });

    updatingRef.current.add(listingId);
    forceRerender((n) => n + 1);

    try {
      const result = await updateListingStatus(listingId, newStatus);
      if (!result.success) throw new Error("Failed to update status");

      toast.success(`Listing status updated to ${newStatus}`, { duration: 4000 });
      router.refresh();
    } catch (err) {
      setListings((prev) => prev.map((l) => (l.id === listingId && previousStatus ? { ...l, status: previousStatus } : l)));
      const errorMessage = err instanceof Error ? err.message : "Failed to update listing status";
      toast.error(errorMessage, { duration: 3000 });
    } finally {
      updatingRef.current.delete(listingId);
      forceRerender((n) => n + 1);
    }
  };

  return {
    updatingSet: getUpdatingSet(),
    updateStatus,
  };
}
