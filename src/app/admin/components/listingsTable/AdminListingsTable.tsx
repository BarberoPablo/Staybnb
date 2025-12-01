"use client";

import { ListingStatus, ListingWithHost } from "@/lib/types/listing";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import AdminListingsTableHeader from "./AdminListingsTableHeader";
import AdminListingsTableRow from "./AdminListingsTableRow";

interface AdminListingsTableProps {
  listings: ListingWithHost[];
}

export type SortField = "title" | "status" | "nightPrice" | "createdAt" | "hostName" | "location";
export type SortDirection = "asc" | "desc" | null;

const tdStyle = "px-6 py-4 whitespace-nowrap text-sm text-gray-900";

const SORT_ACCESSORS: Record<SortField, (l: ListingWithHost) => number | string> = {
  title: (l) => l.title.toLowerCase(),
  status: (l) => l.status,
  nightPrice: (l) => l.nightPrice,
  createdAt: (l) => l.createdAt.getTime(),
  hostName: (l) => `${l.host.firstName} ${l.host.lastName}`.toLowerCase(),
  location: (l) => `${l.location.city}, ${l.location.country}`.toLowerCase(),
};

export default function AdminListingsTable({ listings: initialListings }: AdminListingsTableProps) {
  const [listings, setListings] = useState<ListingWithHost[]>(initialListings);
  const [statusFilter, setStatusFilter] = useState<ListingStatus | "all">("all");
  const [sort, setSort] = useState<{ field: SortField | null; direction: SortDirection }>({ field: null, direction: null });

  useEffect(() => {
    setListings(initialListings);
  }, [initialListings]);

  const handleSort = (field: SortField) => {
    setSort((prev) => {
      if (prev.field !== field) return { field, direction: "asc" };
      if (prev.direction === "asc") return { field, direction: "desc" };
      if (prev.direction === "desc") return { field: null, direction: null };
      return { field, direction: "asc" };
    });
  };

  const filtered = useMemo(() => {
    if (statusFilter === "all") return listings;
    return listings.filter((l) => l.status === statusFilter);
  }, [listings, statusFilter]);

  const sorted = useMemo(() => {
    if (!sort.field || !sort.direction) return filtered;
    const accessor = SORT_ACCESSORS[sort.field];
    return [...filtered].sort((a, b) => {
      const A = accessor(a);
      const B = accessor(b);
      if (A < B) return sort.direction === "asc" ? -1 : 1;
      if (A > B) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [sort, filtered]);

  const statusCounts = useMemo(() => {
    const counts: Record<ListingStatus | "all", number> = {
      all: listings.length,
      draft: 0,
      published: 0,
      paused: 0,
      pending: 0,
    };
    listings.forEach((l) => (counts[l.status] = (counts[l.status] || 0) + 1));
    return counts;
  }, [listings]);

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === "all" ? "bg-myGreenSemiBold text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All ({statusCounts.all})
        </button>

        {(["draft", "published", "paused", "pending"] as ListingStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s ? "bg-myGreenSemiBold text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)} ({statusCounts[s] ?? 0})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <AdminListingsTableHeader sort={sort} onSort={handleSort} />
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {sorted.length === 0 ? (
                <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No listings found
                  </td>
                </motion.tr>
              ) : (
                sorted.map((listing) => <AdminListingsTableRow key={listing.id} listing={listing} tdStyle={tdStyle} setListings={setListings} />)
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
