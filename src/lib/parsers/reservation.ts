import {
  CreateReservation,
  CreateReservationDB,
  Reservation,
  ReservationDB,
  ResumedReservationWithListing,
  ResumedReservationWithListingDB,
} from "../types/reservation";

export function parseReservationFromDB(reservations: ReservationDB[]): Reservation[] {
  const response = reservations.map((reservation) => ({
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

  return response;
}

export function parseResumedReservationWithListingFromDB(reservations: ResumedReservationWithListingDB[]): ResumedReservationWithListing[] {
  const response = reservations.map((reservation) => ({
    ...parseReservationFromDB([reservation])[0],
    listing: {
      id: reservation.listing.id,
      title: reservation.listing.title,
      images: reservation.listing.images,
      location: reservation.listing.location,
      type: reservation.listing.type,
      promotions: reservation.listing.promotions,
    },
  }));

  return response;
}

export function parseCreateReservationToDB(reservation: CreateReservation): CreateReservationDB {
  const reservationDB: CreateReservationDB = {
    user_id: reservation.userId,
    listing_id: reservation.listingId,
    start_date: reservation.startDate,
    end_date: reservation.endDate,
    guests: reservation.guests,
  };

  return reservationDB;
}
