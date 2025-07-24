"use client";

import { CancelReservationDialog } from "@/app/(site)/reservations/components/CancelReservationDialog";
import { ParseGuests } from "@/components/ParseGuests";
import { api } from "@/lib/api/api";
import { Reservation } from "@/lib/types/reservation";
import { showUTCDate } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineCancelPresentation } from "react-icons/md";

const tableHeaders = ["Check-in", "Check-out", "Guests", "Total Price", "Reserved on", "Total nights", "Discount", "Cancel"];

export default function ReservationsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservations = await api.getHostListingReservations(id);
        setReservations(reservations);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservations();
  }, [id]);

  const handleCancelReservation = async (reservationId: string) => {
    setSelectedReservation(reservationId);
    setOpenCancelDialog(true);
  };

  if (loading) return <div>Loading...</div>;

  if (reservations.length === 0) return <div>No reservations found</div>;

  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <table className="flex-1 text-center">
          <thead className="flex-1 border-2 border-myGreenDark bg-myGreen">
            <tr>
              {tableHeaders.map((header) => (
                <th key={"table-head-" + header} className="border-r border-gray-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="flex-1 border-2 border-myGreenDark">
            {reservations.map((reservation, index) => (
              <tr key={reservation.id} className={`${index % 2 === 0 ? "bg-gray-300" : "bg-gray-200"}`}>
                <td>{showUTCDate(reservation.startDate)}</td>
                <td>{showUTCDate(reservation.endDate)}</td>
                <td>{ParseGuests(reservation.guests, reservation.id)}</td>
                <td>{reservation.totalPrice}</td>
                <td>{showUTCDate(reservation.createdAt)}</td>
                <td>{reservation.totalNights}</td>
                <td>{reservation.discount}</td>
                <td>
                  <button
                    onClick={() => handleCancelReservation(reservation.id)}
                    className="flex p-1 w-full items-center justify-center hover:cursor-pointer"
                  >
                    <MdOutlineCancelPresentation className="w-8 h-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CancelReservationDialog isOpen={openCancelDialog} setIsOpen={setOpenCancelDialog} reservationId={selectedReservation} />
    </div>
  );
}
