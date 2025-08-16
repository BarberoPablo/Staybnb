"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { IoCalendar, IoFilter, IoLocation, IoPerson, IoSearch, IoTime } from "react-icons/io5";

// Mock data - replace with actual data from your API
const mockReservations = [
  {
    id: "1",
    listingTitle: "Cozy Mountain Cabin",
    location: "Aspen, CO",
    checkIn: "2024-01-15",
    checkOut: "2024-01-20",
    guests: 4,
    status: "upcoming",
    totalPrice: 1200,
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    listingTitle: "Beachfront Villa",
    location: "Miami, FL",
    checkIn: "2024-02-10",
    checkOut: "2024-02-15",
    guests: 6,
    status: "upcoming",
    totalPrice: 1800,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    listingTitle: "Urban Loft",
    location: "New York, NY",
    checkIn: "2023-12-20",
    checkOut: "2023-12-25",
    guests: 2,
    status: "completed",
    totalPrice: 900,
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7c65?w=400&h=300&fit=crop",
  },
];

type ReservationStatus = "all" | "upcoming" | "completed" | "cancelled";

export default function ReservationsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus>("all");

  const filteredReservations = mockReservations.filter((reservation) => {
    const matchesSearch =
      reservation.listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) || reservation.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-myGrayDark">My Reservations</h1>
        <p className="text-myGray mt-2">Manage and view all your upcoming and past trips</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex-1 relative">
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-myGray w-5 h-5" />
          <input
            type="text"
            placeholder="Search reservations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenBold focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <IoFilter className="text-myGray w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReservationStatus)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenBold focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
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
                  <Image src={reservation.imageUrl} alt={reservation.listingTitle} fill className="object-cover" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-myGrayDark mb-2">{reservation.listingTitle}</h3>
                      <div className="flex items-center gap-4 text-sm text-myGray">
                        <div className="flex items-center gap-1">
                          <IoLocation className="w-4 h-4" />
                          {reservation.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <IoPerson className="w-4 h-4" />
                          {reservation.guests} {reservation.guests === 1 ? "guest" : "guests"}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                      {getStatusText(reservation.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <IoCalendar className="w-4 h-4 text-myGray" />
                      <div>
                        <p className="text-xs text-myGray">Check-in</p>
                        <p className="font-medium text-myGrayDark">{new Date(reservation.checkIn).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoTime className="w-4 h-4 text-myGray" />
                      <div>
                        <p className="text-xs text-myGray">Check-out</p>
                        <p className="font-medium text-myGrayDark">{new Date(reservation.checkOut).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-myGreenBold rounded-full"></div>
                      <div>
                        <p className="text-xs text-myGray">Total</p>
                        <p className="font-medium text-myGrayDark">${reservation.totalPrice}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button className="px-4 py-2 bg-myGreenBold text-background rounded-lg hover:bg-myGreenDark transition-colors text-sm">
                      View Details
                    </button>
                    {reservation.status === "upcoming" && (
                      <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">Cancel</button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
