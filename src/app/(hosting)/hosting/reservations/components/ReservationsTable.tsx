"use client";

import { Reservation, ReservationStatus } from "@/lib/types/reservation";
import { showUTCDate } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FaSort, FaSortDown, FaSortUp, FaTimes } from "react-icons/fa";
import { ParseGuests } from "./ParseGuests";

interface ReservationsTableProps {
  reservations: Reservation[];
}

type SortField = "startDate" | "endDate" | "totalPrice" | "createdAt" | "totalNights" | "status";

type SortDirection = "asc" | "desc" | null;

const tdStyle = "px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900";

const TH = ({
  field,
  sort,
  onSort,
  children,
}: {
  field?: SortField;
  sort: { field: SortField | null; direction: SortDirection };
  onSort?: (f: SortField) => void;
  children: React.ReactNode;
}) => {
  const isSortable = !!field;
  const handleClick = () => {
    if (field && onSort) onSort(field);
  };

  const getIcon = () => {
    if (!field || sort.field !== field) {
      return <FaSort className="w-4 h-4 text-gray-400" />;
    }
    if (sort.direction === "asc") {
      return <FaSortUp className="w-4 h-4 text-myGreenSemiBold" />;
    }
    if (sort.direction === "desc") {
      return <FaSortDown className="w-4 h-4 text-myGreenSemiBold" />;
    }
    return <FaSort className="w-4 h-4 text-gray-400" />;
  };

  return (
    <th
      onClick={handleClick}
      className={`px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${
        isSortable ? "cursor-pointer hover:bg-gray-100 transition-colors" : ""
      }`}
    >
      <div className="flex justify-center items-center gap-2">
        {children}
        {isSortable && getIcon()}
      </div>
    </th>
  );
};

const STATUS_CONFIG: Record<ReservationStatus, { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-green-100 text-green-800" },
  completed: { label: "Completed", className: "bg-gray-100 text-gray-800" },
  canceled: { label: "Canceled", className: "bg-red-100 text-red-800" },
  canceledByHost: {
    label: "Canceled by Host",
    className: "bg-orange-100 text-orange-800",
  },
};

const SORT_ACCESSORS: Record<SortField, (r: Reservation) => number | string> = {
  startDate: (r) => r.startDate.getTime(),
  endDate: (r) => r.endDate.getTime(),
  totalPrice: (r) => r.totalPrice,
  createdAt: (r) => r.createdAt.getTime(),
  totalNights: (r) => r.totalNights,
  status: (r) => r.status,
};

export default function ReservationsTable({ reservations }: ReservationsTableProps) {
  const [sort, setSort] = useState<{
    field: SortField | null;
    direction: SortDirection;
  }>({ field: null, direction: null });

  const handleSort = (field: SortField) => {
    setSort((prev) => {
      if (prev.field !== field) return { field, direction: "asc" };
      if (prev.direction === "asc") return { field, direction: "desc" };
      if (prev.direction === "desc") return { field: null, direction: null };
      return { field, direction: "asc" };
    });
  };

  const sortedReservations = useMemo(() => {
    if (!sort.field || !sort.direction) return reservations;
    const accessor = SORT_ACCESSORS[sort.field];
    return [...reservations].sort((a, b) => {
      const aValue = accessor(a);
      const bValue = accessor(b);
      if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [sort, reservations]);

  const handleCancelReservation = (reservationId: string) => {
    // TODO: Implement cancel reservation functionality
    console.log("Cancel reservation:", reservationId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <TH field="startDate" sort={sort} onSort={handleSort}>
              Check-in
            </TH>
            <TH field="endDate" sort={sort} onSort={handleSort}>
              Check-out
            </TH>
            <TH sort={sort}>Guests</TH>
            <TH field="totalPrice" sort={sort} onSort={handleSort}>
              Total Price
            </TH>
            <TH field="createdAt" sort={sort} onSort={handleSort}>
              Reserved on
            </TH>
            <TH field="totalNights" sort={sort} onSort={handleSort}>
              Nights
            </TH>
            <TH field="status" sort={sort} onSort={handleSort}>
              Status
            </TH>
            <TH sort={sort}>Actions</TH>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <AnimatePresence>
            {sortedReservations.map((reservation) => {
              const { label, className } = STATUS_CONFIG[reservation.status];
              return (
                <motion.tr
                  key={reservation.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className={tdStyle}>{showUTCDate(reservation.startDate)}</td>
                  <td className={tdStyle}>{showUTCDate(reservation.endDate)}</td>
                  <td className={tdStyle}>{ParseGuests(reservation.guests, reservation.id)}</td>
                  <td className={tdStyle}>${reservation.totalPrice.toFixed(2)}</td>
                  <td className={tdStyle}>{showUTCDate(reservation.createdAt)}</td>
                  <td className={tdStyle}>{reservation.totalNights}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}>{label}</span>
                  </td>
                  <td className={tdStyle}>
                    {reservation.status === "upcoming" && (
                      <button
                        type="button"
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="flex items-center gap-2 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors hover:cursor-pointer"
                      >
                        <FaTimes className="w-4 h-4" />
                        Cancel
                      </button>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
