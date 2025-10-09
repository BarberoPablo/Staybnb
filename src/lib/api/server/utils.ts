import { SearchParams } from "next/dist/server/request/search-params";
import { ListingForScoring, ScoredListing } from "./types";

type StructureFilters = { guests?: number; bedrooms?: number; beds?: number; bathrooms?: number };
type GuestFilters = { adults?: number; children?: number; infant?: number; pets?: number };
type PriceFilters = { minPrice?: number; maxPrice?: number };
type DateFilters = { startDate?: Date; endDate?: Date };
type AmenitiesFilters = { amenities?: string[] };

export type ParsedFilters = StructureFilters & GuestFilters & PriceFilters & DateFilters & AmenitiesFilters;

export function parseFilters(params: SearchParams): ParsedFilters {
  const filters: ParsedFilters = {};

  // Structure parameters
  const structureFilters: StructureFilters = {
    ...(params.guests ? { guests: toNumber(params.guests) } : {}),
    ...(params.bedrooms ? { bedrooms: toNumber(params.bedrooms) } : {}),
    ...(params.beds ? { beds: toNumber(params.beds) } : {}),
    ...(params.bathrooms ? { bathrooms: toNumber(params.bathrooms) } : {}),
  };

  Object.assign(filters, structureFilters);

  // Guest parameters
  const guestFilters: GuestFilters = {
    ...(params.adults ? { adults: toNumber(params.adults) } : {}),
    ...(params.children ? { children: toNumber(params.children) } : {}),
    ...(params.infant ? { infant: toNumber(params.infant) } : {}),
    ...(params.pets ? { pets: toNumber(params.pets) } : {}),
  };

  Object.assign(filters, guestFilters);

  // Calculate total guests
  const totalGuests = Object.values(guestFilters).reduce((sum, value) => sum + (value ?? 0), 0);

  if (totalGuests > 0) {
    filters.guests = totalGuests;
  }

  // Price parameters
  const priceFilters: PriceFilters = {
    ...(params.minPrice ? { minPrice: toNumber(params.minPrice) } : {}),
    ...(params.maxPrice ? { maxPrice: toNumber(params.maxPrice) } : {}),
  };

  Object.assign(filters, priceFilters);

  // Date parameters
  const dateFilters: DateFilters = {
    ...(params.startDate ? { startDate: new Date(params.startDate as string) } : {}),
    ...(params.endDate ? { endDate: new Date(params.endDate as string) } : {}),
  };

  Object.assign(filters, dateFilters);

  // Handle amenities
  if (params.amenities) {
    if (typeof params.amenities === "string") {
      filters.amenities = params.amenities
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id);
    } else if (Array.isArray(params.amenities)) {
      filters.amenities = params.amenities;
    }
  }

  return filters;
}

export const toNumber = (value: string | string[] | undefined): number | undefined => {
  if (typeof value === "string" && !isNaN(Number(value))) {
    const num = Number(value);
    return num > 0 ? num : undefined;
  }
  return undefined;
};

export function buildSearchListingsWhereClause(
  city: string,
  filters: ParsedFilters,
  mapCoordinates?: { zoom: number; northEast: { lat: number; lng: number }; southWest: { lat: number; lng: number } },
) {
  const { guests, bedrooms, beds, bathrooms, adults, children, infant, pets, minPrice, maxPrice, amenities, startDate, endDate } = filters;

  const whereClause: Record<string, unknown> = {
    status: "published",
    location: {
      path: ["city"],
      string_contains: city,
      mode: "insensitive",
    },
  };

  if (mapCoordinates) {
    const { northEast, southWest } = mapCoordinates;

    whereClause.AND = [
      {
        location: {
          path: ["city"],
          string_contains: city,
          mode: "insensitive",
        },
      },
      {
        location: {
          path: ["lat"],
          gte: southWest.lat,
          lte: northEast.lat,
        },
      },
      {
        location: {
          path: ["lng"],
          gte: southWest.lng,
          lte: northEast.lng,
        },
      },
    ];

    // Remove the original location filter since we're using AND now
    delete whereClause.location;
  }

  // Prices
  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.night_price = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
    };
  }

  // Structure + Guest limits
  const conditions = [
    ...buildStructureConditions({ guests, bedrooms, beds, bathrooms }),
    ...buildGuestLimitConditions({ adults, children, infant, pets }),
  ];

  if (conditions.length === 1) {
    Object.assign(whereClause, conditions[0]);
  } else if (conditions.length > 1) {
    // If we already have AND conditions (from map coordinates), merge them
    if (whereClause.AND && Array.isArray(whereClause.AND)) {
      whereClause.AND = [...whereClause.AND, ...conditions];
    } else {
      whereClause.AND = conditions;
    }
  }

  // Amenities
  if (amenities?.length) {
    const amenityConditions = amenities.map((amenityId) => ({
      listing_amenities: {
        some: { amenity_id: Number(amenityId) },
      },
    }));

    if (whereClause.AND && Array.isArray(whereClause.AND)) {
      whereClause.AND = [...whereClause.AND, ...amenityConditions];
    } else {
      whereClause.AND = amenityConditions;
    }
  }

  // Dates
  if (startDate && endDate) {
    const startDay = toUtcMidnight(startDate);
    const endDay = toUtcMidnight(endDate);
    const startDayPlus1 = new Date(startDay.getTime() + 24 * 60 * 60 * 1000);

    whereClause.NOT = {
      reservations: {
        some: {
          status: "upcoming",
          AND: [{ start_date: { lt: endDay.toISOString() } }, { end_date: { gt: startDayPlus1.toISOString() } }],
        },
      },
    };
  }

  return whereClause;
}

function buildStructureConditions(filters: StructureFilters) {
  return (Object.keys(filters) as (keyof StructureFilters)[])
    .filter((key) => filters[key] !== undefined)
    .map((key) => ({
      structure: { path: [key], gte: filters[key] },
    }));
}

function buildGuestLimitConditions(filters: GuestFilters) {
  return (Object.keys(filters) as (keyof GuestFilters)[])
    .filter((key) => filters[key] !== undefined)
    .map((key) => ({
      guest_limits: { path: [key, "max"], gte: filters[key] },
    }));
}

const toUtcMidnight = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

export function sortByPopularity<T extends ListingForScoring>(listings: T[]): ScoredListing<T>[] {
  const scoredListings = listings.map((listing) => ({
    ...listing,
    popularityScore: calculatePopularityScore(listing),
  }));

  return scoredListings.sort((a, b) => b.popularityScore - a.popularityScore);
}

/**
 * Calculate popularity score for a listing
 * Based on: favorites (40%), reservations (35%), rating (25%)
 */
export function calculatePopularityScore(listing: ListingForScoring): number {
  const favoritesCount = listing._count?.favorites ?? 0;
  const reservationsCount = listing._count?.reservations ?? 0;
  const scoreData = listing.score as { value: number; reviews: unknown[] } | null | undefined;
  const rating = scoreData?.value ?? 0;

  // Normalize favorites (assume max ~50 for normalization)
  const favoritesScore = Math.min(favoritesCount / 50, 1) * 40;

  // Normalize reservations (assume max ~30 for normalization)
  const reservationsScore = Math.min(reservationsCount / 30, 1) * 35;

  // Normalize rating (0-5 scale)
  const ratingScore = (rating / 5) * 25;

  return favoritesScore + reservationsScore + ratingScore;
}

export function sortByFeatured<T extends ListingForScoring>(listings: T[]): ScoredListing<T>[] {
  const scoredListings = listings.map((listing) => ({
    ...listing,
    popularityScore: calculateFeaturedScore(listing),
  }));

  return scoredListings.sort((a, b) => b.popularityScore - a.popularityScore);
}

/**
 * Calculate featured score for a listing
 * Based on: rating (50%), review count (30%), image quality/count (15%)
 */
export function calculateFeaturedScore(listing: ListingForScoring): number {
  const scoreData = listing.score as { value: number; reviews: unknown[] } | null | undefined;
  const rating = scoreData?.value ?? 0;
  const reviewCount = Array.isArray(scoreData?.reviews) ? scoreData.reviews.length : 0;
  const imageCount = listing.images?.length ?? 0;

  // Rating score (0-5 scale) - heavily weighted
  const ratingScore = (rating / 5) * 50;

  // Review count score (minimum 3 reviews for quality signal, normalize to ~20 reviews)
  const reviewCountScore = reviewCount >= 3 ? Math.min(reviewCount / 20, 1) * 30 : 0;

  // Image quality score (5+ images = good, 10+ = excellent)
  const imageScore = Math.min(imageCount / 10, 1) * 15;

  return ratingScore + reviewCountScore + imageScore;
}
