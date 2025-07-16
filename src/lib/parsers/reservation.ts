import {
  CreateReservation,
  CreateReservationDB,
  Reservation,
  ReservationDB,
  ResumedReservationWithListing,
  ResumedReservationWithListingDB,
} from "../types/reservation";
import { createLocalDate } from "../utils";

function parseReservationFromDB(reservations: ReservationDB[]): Omit<Reservation, "startDate" | "endDate">[] {
  const response = reservations.map((reservation) => ({
    id: reservation.id,
    userId: reservation.user_id,
    listingId: reservation.listing_id,
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
  const response = reservations.map((reservation) => {
    const localStartDate = createLocalDate(reservation.start_date, reservation.listing.check_in_time, reservation.listing.location.timezone);
    const localEndDate = createLocalDate(reservation.end_date, reservation.listing.check_out_time, reservation.listing.location.timezone);

    return {
      ...parseReservationFromDB([reservation])[0],
      startDate: localStartDate,
      endDate: localEndDate,
      listing: {
        id: reservation.listing.id,
        title: reservation.listing.title,
        images: reservation.listing.images,
        location: reservation.listing.location,
        propertyType: reservation.listing.property_type,
        privacyType: reservation.listing.privacy_type,
        nightPrice: reservation.listing.night_price,
        checkInTime: reservation.listing.check_in_time,
        checkOutTime: reservation.listing.check_out_time,
      },
    };
  });

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
