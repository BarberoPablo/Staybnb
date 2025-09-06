import { SearchParams } from "next/dist/server/request/search-params";

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

export function buildSearchListingsWhereClause(city: string, filters: ParsedFilters) {
  const { guests, bedrooms, beds, bathrooms, adults, children, infant, pets, minPrice, maxPrice, amenities, startDate, endDate } = filters;

  const whereClause: Record<string, unknown> = {
    status: "published",
    location: {
      path: ["city"],
      string_contains: city,
      mode: "insensitive",
    },
  };

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
    whereClause.AND = conditions;
  }

  // Amenities
  if (amenities?.length) {
    whereClause.AND = (whereClause.AND || []) as object[];
    amenities.forEach((amenityId) => {
      (whereClause.AND as object[]).push({
        listing_amenities: {
          some: { amenity_id: Number(amenityId) },
        },
      });
    });
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
