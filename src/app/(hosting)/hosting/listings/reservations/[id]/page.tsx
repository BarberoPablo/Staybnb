"use client";

import { CancelReservationDialog } from "@/app/(site)/reservations/components/CancelReservationDialog";
import { api } from "@/lib/api/api";
import { Reservation } from "@/lib/types/reservation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReservationsTable } from "./components/ReservationsTable";

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
      <div className="flex flex-col items-center justify-center w-full gap-4">
        <h2 className="text-2xl font-semibold">Active reservations</h2>
        <ReservationsTable reservations={reservations} status={["active"]} onClick={handleCancelReservation} />
        <h2 className="text-2xl font-semibold">Canceled reservations</h2>
        <ReservationsTable reservations={reservations} status={["canceled", "canceledByHost"]} />
      </div>
      <CancelReservationDialog isOpen={openCancelDialog} setIsOpen={setOpenCancelDialog} reservationId={selectedReservation} />
    </div>
  );
}
