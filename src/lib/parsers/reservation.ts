import {
  CreateReservation,
  CreateReservationDB,
  ListingReservedDates,
  ListingReservedDatesDB,
  Reservation,
  ReservationDB,
  ReservationStatus,
  ReservationStatusDB,
  ResumedReservationWithListing,
  ResumedReservationWithListingDB,
} from "../types/reservation";

const reservationStatus: Record<ReservationStatusDB, ReservationStatus> = {
  canceled_by_host: "canceledByHost",
  upcoming: "upcoming",
  completed: "completed",
  canceled: "canceled",
};

export function parseReservationsFromDB(reservations: ReservationDB[]): Reservation[] {
  const response = reservations.map((reservation) => ({
    id: reservation.id,
    userId: reservation.user_id,
    listingId: reservation.listing_id,
    guests: reservation.guests,
    totalPrice: Number(reservation.total_price),
    totalNights: reservation.total_nights,
    nightPrice: Number(reservation.night_price),
    discount: Number(reservation.discount) || 0,
    discountPercentage: Number(reservation.discount_percentage) || 0,
    createdAt: new Date(reservation.created_at),
    status: reservationStatus[reservation.status],
    startDate: new Date(reservation.start_date),
    endDate: new Date(reservation.end_date),
  }));

  return response;
}

export function parseResumedReservationWithListingFromDB(reservations: ResumedReservationWithListingDB[]): ResumedReservationWithListing[] {
  const response = reservations.map((reservation) => {
    return {
      ...parseReservationsFromDB([reservation])[0],
      listing: {
        id: reservation.listing.id,
        title: reservation.listing.title,
        images: reservation.listing.images,
        location: reservation.listing.location,
        propertyType: reservation.listing.property_type,
        privacyType: reservation.listing.privacy_type,
        nightPrice: Number(reservation.listing.night_price),
        checkInTime: reservation.listing.check_in_time,
        checkOutTime: reservation.listing.check_out_time,
      },
    };
  });

  return response;
}

export function parseCreateReservationToDB(reservation: CreateReservation): CreateReservationDB {
  const reservationDB: CreateReservationDB = {
    listing_id: reservation.listingId,
    start_date: new Date(reservation.startDate),
    end_date: new Date(reservation.endDate),
    guests: reservation.guests,
  };

  return reservationDB;
}

export function parseListingReservedDatesDB(listingReservedDatesDB: ListingReservedDatesDB): ListingReservedDates {
  const reservedDates: ListingReservedDates = {
    reservations: [],
    listing: {
      checkInTime: listingReservedDatesDB.listing.check_in_time,
      checkOutTime: listingReservedDatesDB.listing.check_out_time,
      timezone: listingReservedDatesDB.listing.timezone,
    },
  };
  if (listingReservedDatesDB.reservations.length !== 0) {
    reservedDates.reservations = listingReservedDatesDB.reservations.map((reservation) => ({
      startDate: new Date(reservation.start_date),
      endDate: new Date(reservation.end_date),
    }));
  }

  return reservedDates;
}
