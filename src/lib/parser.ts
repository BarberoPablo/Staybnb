import { CreateReservation, Listing, Reservation } from "./types";
import { CreateReservationDB, ListingDB, ReservationDB } from "./typesDB";

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

export function parseReservationFromDB(reservation: ReservationDB): Reservation {
  return {
    id: reservation.id,
    userId: reservation.user_id,
    listingId: reservation.listing_id,
    startDate: new Date(reservation.start_date),
    endDate: new Date(reservation.end_date),
    guests: reservation.guests,
    totalPrice: reservation.total_price,
    totalNights: reservation.total_nights,
    nightPrice: reservation.night_price,
    discount: reservation.discount || 0,
    discountPercentage: reservation.discount_percentage || 0,
    createdAt: new Date(reservation.created_at || "") || "",
  };
}

export function parseCreateReservationToDB(reservation: CreateReservation): CreateReservationDB {
  const reservationDB: CreateReservationDB = {
    user_id: reservation.userId,
    listing_id: reservation.listingId,
    start_date: reservation.startDate,
    end_date: reservation.endDate,
    guests: reservation.guests,
    total_price: reservation.totalPrice,
    total_nights: reservation.totalNights,
    night_price: reservation.nightPrice,
    discount: reservation.discount,
    discount_percentage: reservation.discountPercentage,
  };

  return reservationDB;
}

/* export function parseReservationsWithListingFromDB(reservationsFromDB: ReservationDB[]): ReservationWithListing[] {
  const reservations = reservationsFromDB.map((reservation) => ({ 
    id: reservation.id,
    userId: reservation.user_id,
    listingId: reservation.listing_id,
    startDate: new Date(reservation.start_date),
    endDate: new Date(reservation.end_date),
    guests: reservation.guests,
    totalPrice: reservation.total_price,
    totalNights: reservation.total_nights,
    nightPrice: reservation.night_price,
    discount: reservation.discount || 0,
    discountPercentage: reservation.discount_percentage || 0,
    createdAt: new Date(reservation.created_at || "") || "",

   }));

  return reservations;
}
 */
