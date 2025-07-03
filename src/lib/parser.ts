import { Listing, ListingDB } from "./types/listing";

export function parseListingFromDB(reservationDB: ListingDB): Listing {
  return {
    id: reservationDB.id,
    title: reservationDB.title,
    description: reservationDB.description,
    location: reservationDB.location,
    price: reservationDB.night_price,
    promotions: reservationDB.promotions?.map((promo) => ({
      minNights: promo.min_nights,
      discountPercentage: promo.discount_percentage,
      description: promo.description,
    })),
    type: reservationDB.type,
    hostId: reservationDB.host_id,
    structure: reservationDB.structure,
    guestLimits: reservationDB.guest_limits,
    score: reservationDB.score,
    images: reservationDB.images,
  };
}
