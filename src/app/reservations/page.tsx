"use client";

import { useUser } from "@/hooks/useUser";
import { getUserReservations } from "@/lib/supabase/reservations";
import { ReservationWithListing } from "@/lib/types";
import { useEffect, useState } from "react";
import ListingReservation from "./components/ListingReservation";

export default function ReservationsPage() {
  const { user, loading } = useUser();
  const [userReservations, setUserReservations] = useState<ReservationWithListing[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const userReservations = async () => {
      try {
        const reservations = await getUserReservations(user?.id ?? "");
        setUserReservations(reservations);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong");
        }
      }
    };
    if (!loading && user) {
      userReservations();
    }
  }, [user, loading]);

  return (
    <div>
      <h1>Reservations</h1>

      <div className="border border-gray-300 rounded-2xl">
        {error && <p>{error}</p>}
        {userReservations.length > 0 &&
          userReservations.map((reservation, index) => (
            <div key={reservation.listingId + "item" + index}>
              <ListingReservation listing={reservation} />
              {index !== userReservations.length - 1 && <hr className="text-gray-300 mt-2" />}
            </div>
          ))}
      </div>
    </div>
  );
}
