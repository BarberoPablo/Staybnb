"use client";

import { ParseGuests } from "@/components/ParseGuests";
import { api } from "@/lib/api/api";
import { Reservation } from "@/lib/types/reservation";
import { showUTCDate } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
//import toast from "react-hot-toast";

const tableHeaders = ["Check-in", "Check-out", "Guests", "Total Price", "Reserved on", "Total nights", "Discount", "Cancel"];

export default function ReservationsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  console.log({ id });
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservations = await api.getHostListingReservations(id);
        setReservations(reservations);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservations();
  }, [id]);

  const handleCancelReservation = async (reservationId: string) => {
    /* try {
      const response = await api.cancelReservation(reservationId);
      if (response.success) {
        const updatedReservations = reservations.filter((reservation) => reservation.id !== reservationId);
        setReservations(updatedReservations);
        toast.success("Reservation canceled");
      }
    } catch (error) {
      toast.error("Failed to cancel reservation");
      console.error(error);
    } */
    console.log(reservationId);
  };

  if (reservations.length === 0) return <div>No reservations found</div>;

  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <table className="flex-1 text-center">
          <thead className="flex-1 border-2 border-myGreenDark bg-myGreen rounded-lg">
            <tr>
              {tableHeaders.map((header) => (
                <th key={"table-head-" + header} className="border-r border-gray-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="flex-1 border-2 border-myGreenDark rounded-lg">
            {reservations.map((reservation, index) => (
              <tr key={reservation.id} className={`flex-1 ${index % 2 === 0 ? "bg-gray-300" : "bg-gray-200"}`}>
                <td>{showUTCDate(reservation.startDate)}</td>
                <td>{showUTCDate(reservation.endDate)}</td>
                <td>{ParseGuests(reservation.guests, reservation.id)}</td>
                <td>{reservation.totalPrice}</td>
                <td>{showUTCDate(reservation.createdAt)}</td>
                <td>{reservation.totalNights}</td>
                <td>{reservation.discount}</td>
                <td>
                  <button onClick={() => handleCancelReservation(reservation.id)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
