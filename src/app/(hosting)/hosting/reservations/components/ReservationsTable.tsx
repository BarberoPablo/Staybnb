"use client";

import { ParseGuests } from "@/components/ParseGuests";
import { Reservation, ReservationStatus } from "@/lib/types/reservation";
import { showUTCDate } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FaSort, FaSortDown, FaSortUp, FaTimes } from "react-icons/fa";

interface ReservationsTableProps {
  reservations: Reservation[];
}

type SortField = "startDate" | "endDate" | "totalPrice" | "createdAt" | "totalNights" | "status";
type SortDirection = "asc" | "desc" | null;

export default function ReservationsTable({ reservations }: ReservationsTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="w-4 h-4 text-gray-400" />;
    if (sortDirection === "asc") return <FaSortUp className="w-4 h-4 text-myGreenSemiBold" />;
    if (sortDirection === "desc") return <FaSortDown className="w-4 h-4 text-myGreenSemiBold" />;
    return <FaSort className="w-4 h-4 text-gray-400" />;
  };

  const sortedReservations = useMemo(() => {
    if (!sortField || !sortDirection) return reservations;
    return [...reservations].sort((a, b) => {
      let aValue: number | string | Date;
      let bValue: number | string | Date;

      switch (sortField) {
        case "startDate":
          aValue = a.startDate.getTime();
          bValue = b.startDate.getTime();
          break;
        case "endDate":
          aValue = a.endDate.getTime();
          bValue = b.endDate.getTime();
          break;
        case "totalPrice":
          aValue = a.totalPrice;
          bValue = b.totalPrice;
          break;
        case "createdAt":
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case "totalNights":
          aValue = a.totalNights;
          bValue = b.totalNights;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortField, sortDirection, reservations]);

  const getStatusBadge = (status: ReservationStatus) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "upcoming":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "completed":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case "canceled":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "canceledByHost":
        return `${baseClasses} bg-orange-100 text-orange-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Upcoming";
      case "completed":
        return "Completed";
      case "canceled":
        return "Canceled";
      case "canceledByHost":
        return "Canceled by Host";
      default:
        return status;
    }
  };

  const handleCancelReservation = (reservationId: string) => {
    // TODO: Implement cancel reservation functionality
    console.log("Cancel reservation:", reservationId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort("startDate")}
            >
              <div className="flex items-center gap-2">
                Check-in
                {getSortIcon("startDate")}
              </div>
            </th>
            <th
              className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort("endDate")}
            >
              <div className="flex items-center gap-2">
                Check-out
                {getSortIcon("endDate")}
              </div>
            </th>
            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
            <th
              className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort("totalPrice")}
            >
              <div className="flex items-center gap-2">
                Total Price
                {getSortIcon("totalPrice")}
              </div>
            </th>
            <th
              className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort("createdAt")}
            >
              <div className="flex items-center gap-2">
                Reserved on
                {getSortIcon("createdAt")}
              </div>
            </th>
            <th
              className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort("totalNights")}
            >
              <div className="flex items-center gap-2">
                Nights
                {getSortIcon("totalNights")}
              </div>
            </th>
            <th
              className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center gap-2">
                Status
                {getSortIcon("status")}
              </div>
            </th>
            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <AnimatePresence>
            {sortedReservations.map((reservation) => (
              <motion.tr
                key={reservation.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{showUTCDate(reservation.startDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{showUTCDate(reservation.endDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ParseGuests(reservation.guests, reservation.id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${reservation.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{showUTCDate(reservation.createdAt)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.totalNights}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(reservation.status)}>{getStatusText(reservation.status)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
