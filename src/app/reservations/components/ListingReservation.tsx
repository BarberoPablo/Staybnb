import DateRange from "@/components/DateRange";
import ListingPrice from "@/components/ListingPrice";
import { ListingSummary, ReservationWithListing } from "@/lib/types";
import Image from "next/image";

export default function ListingReservation({ listing }: { listing: ReservationWithListing }) {
  const summary: ListingSummary = {
    nights: listing.totalNights,
    baseTotal: listing.nightPrice * listing.totalNights,
    total: listing.totalPrice,
    discount: listing.discount,
    discountPercentage: listing.discountPercentage,
  };

  return (
    <div className="flex flex-col p-4">
      <h2>{listing.listing.title}</h2>
      <div className="flex gap-2">
        <div className="w-40 h-40 relative">
          <Image src={listing.listing.images[0]} alt="listing main image" fill className="object-cover" />
        </div>
        <div className="flex flex-col">
          <h3>{listing.listing.location}</h3>
          <h3>{listing.listing.type}</h3>
          <DateRange startDate={listing.startDate} endDate={listing.endDate} />
          <ListingPrice summary={summary} listing={listing.listing} />
        </div>
      </div>
    </div>
  );
}
