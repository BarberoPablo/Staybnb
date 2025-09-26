"use client";

import { ResumedReservationWithListing } from "@/lib/types/reservation";
import { getTotalGuests } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { IoCalendar, IoFilter, IoLocation, IoPerson, IoStar, IoTime } from "react-icons/io5";
import { CancelReservationDialog } from "../../../../../components/Reservations/CancelReservationDialog";
import { PageHeader } from "../../components/PageHeader";
import { SearchBar } from "../../components/SearchBar";
import { AddReviewDialog } from "./AddReviewDialog";

type ReservationStatus = "all" | "upcoming" | "completed" | "canceled" | "canceledByHost";

const getStatusColor = (status: string) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "canceled":
      return "bg-red-100 text-red-800 border-red-200";
    case "canceledByHost":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function ReservationsClient({ initialReservations }: { initialReservations: ResumedReservationWithListing[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus>("all");
  const [openCancelResevationDialog, setOpenCancelResevationDialog] = useState(false);
  const [openAddReviewDialog, setOpenAddReviewDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ResumedReservationWithListing | null>(null);
  const [reservations, setReservations] = useState<ResumedReservationWithListing[]>(initialReservations);
  const router = useRouter();

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${reservation.listing.location.country} ${reservation.listing.location.city}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReviewAction = (reservation: ResumedReservationWithListing) => {
    setSelectedReservation(reservation);
    setOpenAddReviewDialog(true);
  };

  const handleReviewAdded = (listingId: number, newScore: number, newMessage: string) => {
    setReservations((prevReservations) =>
      prevReservations.map((reservation) => {
        if (reservation.listing.id === listingId) {
          return {
            ...reservation,
            listing: {
              ...reservation.listing,
              score: {
                ...reservation.listing.score,
                userReview: {
                  score: newScore,
                  message: newMessage,
                  userId: reservation.listing.score?.userReview?.userId || "",
                },
                value: reservation.listing.score?.value || 0,
              },
            },
          };
        }
        return reservation;
      })
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Reservations" description="Manage and view all your upcoming and past trips" />

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex-1">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search reservations..." variant="compact" />
        </div>

        <div className="flex items-center gap-2">
          <IoFilter className="text-myGray w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReservationStatus)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenSemiBold focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
            <option value="canceledByHost">Canceled by Host</option>
          </select>
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-12">
            <IoCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No reservations found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredReservations.map((reservation, index) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image */}
                <div className="relative w-full lg:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    priority
                    src={reservation.listing.images[0] + "&w=400"}
                    alt={reservation.listing.title + " main image"}
                    fill
                    className="object-cover"
                    sizes="100%"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-myGrayDark mb-2">{reservation.listing.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-myGray">
                        <div className="flex items-center gap-1">
                          <IoLocation className="w-4 h-4" />
                          <p>
                            {reservation.listing.location.country}, {reservation.listing.location.city}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <IoPerson className="w-4 h-4" />
                          {getTotalGuests(reservation.guests)} {getTotalGuests(reservation.guests) === 1 ? "guest" : "guests"}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <IoCalendar className="w-4 h-4 text-myGray" />
                      <div>
                        <p className="text-xs text-myGray">Check-in</p>
                        <p className="font-medium text-myGrayDark">{new Date(reservation.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoTime className="w-4 h-4 text-myGray" />
                      <div>
                        <p className="text-xs text-myGray">Check-out</p>
                        <p className="font-medium text-myGrayDark">{new Date(reservation.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-myGreenSemiBold rounded-full"></div>
                      <div>
                        <p className="text-xs text-myGray">Total</p>
                        <p className="font-medium text-myGrayDark">${reservation.totalPrice}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      className="px-4 py-2 bg-myGreenSemiBold text-background rounded-lg hover:bg-myGreen hover:cursor-pointer transition-colors text-sm"
                      onClick={() => router.push(`/listing/${reservation.listing.id}`)}
                    >
                      Visit Listing
                    </button>

                    {reservation.status === "upcoming" && (
                      <button
                        className="px-4 py-2 border border-red-300 text-red-600 bg-red-100 rounded-lg hover:bg-red-50 hover:cursor-pointer transition-colors text-sm"
                        onClick={() => setOpenCancelResevationDialog(true)}
                      >
                        Cancel
                      </button>
                    )}

                    {reservation.status === "completed" && !reservation.listing.score?.userReview && (
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-myGreenLight text-myGrayDark rounded-lg hover:bg-myGreen hover:cursor-pointer transition-colors text-sm border border-myGreenSemiBold"
                        onClick={() => handleReviewAction(reservation)}
                      >
                        <IoStar className="w-4 h-4" />
                        Add Review
                      </button>
                    )}

                    {reservation.status === "completed" && reservation.listing.score?.userReview && (
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-100 hover:cursor-pointer transition-colors text-sm"
                        onClick={() => handleReviewAction(reservation)}
                      >
                        <IoStar className="w-4 h-4 text-yellow-500" />
                        <span>Edit Review ({reservation.listing.score.userReview.score}/5)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <CancelReservationDialog reservationId={reservation.id} isOpen={openCancelResevationDialog} setIsOpen={setOpenCancelResevationDialog} />
            </motion.div>
          ))
        )}
      </div>

      {selectedReservation && (
        <AddReviewDialog
          isOpen={openAddReviewDialog}
          setIsOpen={setOpenAddReviewDialog}
          listingId={selectedReservation.listing.id}
          listingTitle={selectedReservation.listing.title}
          existingReview={selectedReservation.listing.score?.userReview}
          onReviewAdded={handleReviewAdded}
        />
      )}
    </div>
  );
}
