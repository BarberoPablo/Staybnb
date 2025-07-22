"use client";

import { useUser } from "@/hooks/useUser";
import { api } from "@/lib/api/api";
import { ResumedReservationWithListing } from "@/lib/types/reservation";
import { useEffect, useState } from "react";
import { Tabs } from "rsuite";
import "rsuite/Tabs/styles/index.css";
import ListingReservation from "./ListingReservation";

type userReservations = {
  total: number;
  active: ResumedReservationWithListing[];
  canceled: ResumedReservationWithListing[];
  history: ResumedReservationWithListing[];
};

export function ReservationTabs() {
  const { user, loading } = useUser();
  const [userReservations, setUserReservations] = useState<userReservations>({
    total: 0,
    active: [],
    canceled: [],
    history: [],
  });
  const [error, setError] = useState("");
  const [loadingReservations, setLoadingReservations] = useState(false);
  const tabs = [
    { eventKey: "active", title: "Active", reservations: userReservations.active },
    { eventKey: "history", title: "History", reservations: userReservations.history },
    { eventKey: "canceled", title: "Canceled", reservations: userReservations.canceled },
  ];

  useEffect(() => {
    if (!loading && user) {
      setLoadingReservations(true);
      const fetchReservations = async () => {
        try {
          const reservations = await api.getUserReservations();
          const now = new Date();
          setUserReservations({
            total: reservations.length,
            active: reservations.filter((r) => r.status === "active" && new Date(r.endDate) >= now),
            canceled: reservations.filter((r) => r.status === "canceled"),
            history: reservations.filter((r) => r.status === "active" && new Date(r.endDate) < now),
          });
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("Something went wrong");
          }
        } finally {
          setLoadingReservations(false);
        }
      };
      fetchReservations();
    }
  }, [user, loading]);

  if (loading || loadingReservations) {
    return <div>Loading reservations...</div>;
  }

  if (!loading && !loadingReservations && userReservations.total === 0) {
    return <div>No reservations found</div>;
  }
  if (error) {
    return (
      <div>
        <p className="text-red-600 font-semibold my-4">{error}</p>
      </div>
    );
  }

  return (
    <Tabs defaultActiveKey="active" appearance="tabs">
      {tabs.map((tab) => (
        <Tabs.Tab key={tab.eventKey} eventKey={tab.eventKey} title={tab.title} disabled={tab.reservations.length === 0}>
          <ReservationTab reservations={tab.reservations} eventKey={tab.eventKey} />
        </Tabs.Tab>
      ))}
    </Tabs>
  );
}

function ReservationTab({ reservations, eventKey }: { reservations: ResumedReservationWithListing[]; eventKey: string }) {
  return (
    <div className="flex flex-col border-x border-b border-gray-300 rounded-tr-lg rounded-b-lg">
      {reservations.map((reservation, index) => (
        <div key={`${reservation.listingId}-${reservation.createdAt}`}>
          <ListingReservation key={`${reservation.listingId}-${reservation.createdAt}`} reservation={reservation} eventKey={eventKey} />
          {index !== reservations.length - 1 && <hr className="text-gray-300 mt-2" />}
        </div>
      ))}
    </div>
  );
}
