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

export function parseDraftListingToDB(draftListingData: DraftListing): Partial<DraftListingDB> {
  const parsedPromotions = draftListingData.promotions?.map((promotion) => ({
    min_nights: promotion.minNights,
    discount_percentage: promotion.discountPercentage,
    description: promotion.description,
  }));

  const parsedData = {
    property_type: draftListingData.propertyType,
    privacy_type: draftListingData.privacyType,
    location: draftListingData.location,
    check_in_time: draftListingData.checkInTime,
    check_out_time: draftListingData.checkOutTime,
    title: draftListingData.title,
    description: draftListingData.description,
    night_price: Number(draftListingData.nightPrice),
    promotions: parsedPromotions,
    structure: draftListingData.structure,
    guest_limits: draftListingData.guestLimits,
    amenities: draftListingData.amenities,
    images: draftListingData.images,
    min_cancel_days: draftListingData.minCancelDays,
    current_step: draftListingData.currentStep,
  };

  return parsedData;
}
