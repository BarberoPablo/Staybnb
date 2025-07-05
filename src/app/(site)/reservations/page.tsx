"use client";

import { useUser } from "@/hooks/useUser";
import { api } from "@/lib/api/api";
import { ResumedReservationWithListing } from "@/lib/types/reservation";
import { useEffect, useState } from "react";
import ListingReservation from "./components/ListingReservation";

export default function ReservationsPage() {
  const { user, loading } = useUser();
  const [userReservations, setUserReservations] = useState<ResumedReservationWithListing[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      const fetchReservations = async () => {
        try {
          const reservations = await api.getReservations();

          setUserReservations(reservations);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("Something went wrong");
          }
        }
      };
      fetchReservations();
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading reservations...</div>;
  }

  if (!loading && !userReservations) {
    return <div>No reservations found</div>;
  }

  return (
    <div>
      <h1>Reservations</h1>

      <div className="border border-gray-300 rounded-2xl">
        {error && <p className="text-red-600 font-semibold my-4">{error}</p>}
        {userReservations.length > 0 &&
          userReservations.map((reservation, index) => (
            <div key={`${reservation.listingId}-${reservation.createdAt}`}>
              <ListingReservation reservation={reservation} />
              {index !== userReservations.length - 1 && <hr className="text-gray-300 mt-2" />}
            </div>
          ))}
      </div>
    </div>
  );
}
