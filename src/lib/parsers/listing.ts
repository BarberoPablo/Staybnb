import { ListingForm } from "@/store/useListingForm";
import {
  CreateListingDB,
  HostListingsWithReservations,
  HostListingsWithReservationsDB,
  Listing,
  ListingDB,
  ListingWithReservations,
  ListingWithReservationsDB,
} from "../types/listing";
import { ReservedDate } from "../types/reservation";
import { parseReservationsFromDB } from "./reservation";

export function parseListingFromDB(listingDB: ListingDB): Listing {
  return {
    id: listingDB.id,
    hostId: listingDB.host_id,
    createdAt: listingDB.created_at,
    propertyType: listingDB.property_type,
    privacyType: listingDB.privacy_type,
    title: listingDB.title,
    description: listingDB.description,
    location: listingDB.location,
    checkInTime: listingDB.check_in_time,
    checkOutTime: listingDB.check_out_time,
    nightPrice: listingDB.night_price,
    promotions: listingDB.promotions?.map((promo) => ({
      minNights: promo.min_nights,
      discountPercentage: promo.discount_percentage,
      description: promo.description,
    })),
    structure: listingDB.structure,
    guestLimits: listingDB.guest_limits,
    score: listingDB.score,
    images: listingDB.images,
    minCancelDays: listingDB.min_cancel_days,
    status: listingDB.status,
  };
}

export function parseListingWithReservationsFromDB(listingWithReservationDB: ListingWithReservationsDB): ListingWithReservations {
  const listing = parseListingFromDB(listingWithReservationDB);
  let reservations: ReservedDate[] = [];

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
    check_in_time: listingForm.checkInTime,
    check_out_time: listingForm.checkOutTime,
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
    min_cancel_days: listingForm.minCancelDays,
    status: "pending",
  };
}

export function parseHostListingsWithReservations(listings: HostListingsWithReservationsDB[]): HostListingsWithReservations[] {
  const parsedListings = listings.map((listing) => ({
    ...parseListingFromDB(listing),
    reservations: [...parseReservationsFromDB(listing.reservations)],
  }));

  return parsedListings;
}
