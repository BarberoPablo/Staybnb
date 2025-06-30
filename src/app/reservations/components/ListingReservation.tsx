import DateRange from "@/components/DateRange";
import ListingPrice from "@/components/ListingPrice";
import { ListingSummary, ReservationWithListing } from "@/lib/types";
import Image from "next/image";

export default function ListingReservation({ reservation }: { reservation: ReservationWithListing }) {
  const summary: ListingSummary = {
    nights: reservation.totalNights,
    baseTotal: reservation.nightPrice * reservation.totalNights,
    total: reservation.totalPrice,
    discount: reservation.discount,
    discountPercentage: reservation.discountPercentage,
  };

  return (
    <div className="flex flex-col p-4">
      <h2>{reservation.listing.title}</h2>
      <div className="flex gap-2">
        <div className="w-40 h-40 relative">
          <Image src={reservation.listing.images[0]} alt="listing main image" priority fill className="object-cover" sizes="100%" />
        </div>
        <div className="flex flex-col">
          <h3>{reservation.listing.location}</h3>
          <h3>{reservation.listing.type}</h3>
          <DateRange startDate={reservation.startDate} endDate={reservation.endDate} />
          <ListingPrice summary={summary} listing={reservation.listing} />
        </div>
      </div>
    </div>
  );
}
