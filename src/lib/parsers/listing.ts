import { ListingForm } from "@/store/useListingForm";
import { CreateListingDB, Listing, ListingDB, ListingWithReservations, ListingWithReservationsDB } from "../types/listing";
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

export function parseListingFormData(listingForm: ListingForm): CreateListingDB {
  return {
    property_type: listingForm.propertyType,
    privacy_type: listingForm.privacyType,
    location: listingForm.location,
    lat: listingForm.lat,
    lng: listingForm.lng,
    timezone: listingForm.timezone,
    title: listingForm.title,
    description: listingForm.description,
    night_price: listingForm.nightPrice,
    promotions: listingForm.promotions.map((p) => ({
      min_nights: p.minNights,
      discount_percentage: p.discountPercentage,
      description: p.description,
    })),
    images: listingForm.images,
    structure: listingForm.structure,
    guest_limits: listingForm.guestLimits,
    amenities: listingForm.amenities,
    safety_items: listingForm.safetyItems,
    score: listingForm.score,
  };
}
