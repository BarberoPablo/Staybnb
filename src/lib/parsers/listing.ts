import { Listing, ListingDB, ListingWithReservations, ListingWithReservationsDB } from "../types/listing";
import { ReservationDate } from "../types/reservation";

export function parseListingFromDB(reservationDB: ListingDB): Listing {
  return {
    id: reservationDB.id,
    title: reservationDB.title,
    description: reservationDB.description,
    location: reservationDB.location,
    nightPrice: reservationDB.night_price,
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
    lat: reservationDB.lat,
    lng: reservationDB.lng,
  };
}

export function parseListingWithReservationsFromDB(listingWithReservationDB: ListingWithReservationsDB): ListingWithReservations {
  const listing = parseListingFromDB(listingWithReservationDB);
  let reservations: ReservationDate[] = [];

  if (listingWithReservationDB.reservations?.length > 0) {
    reservations = listingWithReservationDB.reservations.map((reservation) => ({
      startDate: new Date(reservation.start_date),
      endDate: new Date(reservation.end_date),
    }));
  }

  const listingWithReservation = {
    ...listing,
    reservations,
  };

  return listingWithReservation;
}
