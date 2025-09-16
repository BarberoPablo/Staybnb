import { DraftListing, DraftListingDB } from "../types/draftListing";

export function parseDraftListingFromDB(dbDraft: DraftListingDB): DraftListing {
  const parsedPromotions = dbDraft.promotions?.map((promotion) => ({
    minNights: promotion.min_nights,
    discountPercentage: promotion.discount_percentage,
    description: promotion.description,
  }));

  const draftListing = {
    id: dbDraft.id,
    hostId: dbDraft.host_id,
    propertyType: dbDraft.property_type,
    privacyType: dbDraft.privacy_type,
    location: dbDraft.location,
    checkInTime: dbDraft.check_in_time,
    checkOutTime: dbDraft.check_out_time,
    title: dbDraft.title,
    description: dbDraft.description,
    nightPrice: dbDraft.night_price ? Number(dbDraft.night_price) : undefined,
    promotions: parsedPromotions,
    structure: dbDraft.structure,
    guestLimits: dbDraft.guest_limits,
    amenities: dbDraft.amenities,
    images: dbDraft.images,
    minCancelDays: dbDraft.min_cancel_days,
    currentStep: dbDraft.current_step,
    createdAt: new Date(dbDraft.created_at),
    updatedAt: new Date(dbDraft.updated_at),
  };

  return draftListing;
}
