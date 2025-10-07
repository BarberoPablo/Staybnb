import { getHostReservationsGroupedByListing } from "@/lib/api/server/endpoints/reservations";
import HostReservationsContainer from "./components/HostReservationsContainer";

export default async function ReservationsPage() {
  const listingsWithReservations = await getHostReservationsGroupedByListing();

  return (
    <div className="flex flex-col w-full flex-grow py-8 px-6 sm:px-12 gap-8">
      {listingsWithReservations.length > 0 && (
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">Reservations</h1>
          <p className="text-lg text-myGray max-w-2xl mx-auto">Manage bookings across all your listings</p>
        </div>
      )}

      <HostReservationsContainer listingsWithReservations={listingsWithReservations} />
    </div>
  );
}
