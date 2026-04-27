import { Listing, ListingDB } from "../types/listing";

export function parseListingFromDB(listingDB: ListingDB): Listing {
  return {
    id: listingDB.id,
    hostId: listingDB.host_id,
    createdAt: new Date(listingDB.created_at),
    propertyType: listingDB.property_type,
    privacyType: listingDB.privacy_type,
    title: listingDB.title,
    description: listingDB.description,
    location: listingDB.location,
    checkInTime: listingDB.check_in_time,
    checkOutTime: listingDB.check_out_time,
    nightPrice: Number(listingDB.night_price),
    promotions: listingDB.promotions?.map((promo) => ({
      minNights: promo.min_nights,
      discountPercentage: Number(promo.discount_percentage),
      description: promo.description,
    })),
    structure: listingDB.structure,
    guestLimits: listingDB.guest_limits,
    score: {
      value: listingDB.score.value,
      reviews: listingDB.score.reviews.map((review) => ({
        score: review.score,
        message: review.message,
        userId: review.user_id,
      })),
    },
    images: listingDB.images,
    minCancelDays: listingDB.min_cancel_days,
    status: listingDB.status,
    amenities: listingDB.amenities,
  };
}
