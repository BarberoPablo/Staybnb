import { DraftListing, DraftListingDB } from "../types/draftListing";
import { CreateListingDB, PrivacyType, PropertyType } from "../types/listing";

type CreateListingForPrisma = Omit<CreateListingDB, "amenities">;

export function parseDraftListingFromDB(dbDraft: DraftListingDB): DraftListing {
  const parsedPromotions = dbDraft.promotions?.map((promotion) => ({
    minNights: promotion.min_nights,
    discountPercentage: Number(promotion.discount_percentage),
    description: promotion.description,
  }));

  return {
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
    visitedSteps: dbDraft.visited_steps || [],
    createdAt: new Date(dbDraft.created_at),
    updatedAt: new Date(dbDraft.updated_at),
  };
}

export function parseDraftListingToCreateListingDB(draftData: DraftListingDB): CreateListingForPrisma {
  return {
    property_type: draftData.property_type as PropertyType,
    privacy_type: draftData.privacy_type as PrivacyType,
    title: draftData.title!,
    description: draftData.description!,
    location: draftData.location!,
    check_in_time: draftData.check_in_time!,
    check_out_time: draftData.check_out_time!,
    night_price: Number(draftData.night_price!),
    promotions: draftData.promotions ?? [],
    images: draftData.images!,
    structure: draftData.structure!,
    guest_limits: draftData.guest_limits!,
    safety_items: [],
    score: {
      value: 0,
      reviews: [],
    },
    min_cancel_days: draftData.min_cancel_days!,
    status: "pending",
    // amenities are handled separately through listingAmenities relationship
  };
}
