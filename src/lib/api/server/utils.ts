import { SearchParams } from "next/dist/server/request/search-params";

export type ParsedFilters = {
  guests?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  startDate?: Date;
  endDate?: Date;
};

export function parseFilters(params: SearchParams): ParsedFilters {
  const filters: ParsedFilters = {};

  // Handle structure parameters (convert to numbers)
  if (params.guests) filters.guests = toNumber(params.guests);
  if (params.bedrooms) filters.bedrooms = toNumber(params.bedrooms);
  if (params.beds) filters.beds = toNumber(params.beds);
  if (params.bathrooms) filters.bathrooms = toNumber(params.bathrooms);

  // Handle price parameters (convert to numbers)
  if (params.minPrice) filters.minPrice = toNumber(params.minPrice);
  if (params.maxPrice) filters.maxPrice = toNumber(params.maxPrice);

  // Handle dates parameters (convert to dates)
  if (params.startDate) filters.startDate = new Date(params.startDate as string);
  if (params.endDate) filters.endDate = new Date(params.endDate as string);

  // Handle amenities (ensure it's always an array)
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
  console.log("Building where clause with filters:", filters);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    status: "published",
    location: {
      path: ["city"],
      string_contains: city,
      mode: "insensitive",
    },
  };

  // Add price filters if provided
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    whereClause.night_price = {};
    if (filters.minPrice !== undefined) {
      whereClause.night_price.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      whereClause.night_price.lte = filters.maxPrice;
    }
  }

  // Build structure filters using AND operator
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const structureConditions: any[] = [];

  if (filters.guests !== undefined) {
    structureConditions.push({
      structure: {
        path: ["guests"],
        gte: filters.guests,
      },
    });
  }
  if (filters.bedrooms !== undefined) {
    structureConditions.push({
      structure: {
        path: ["bedrooms"],
        gte: filters.bedrooms,
      },
    });
  }
  if (filters.beds !== undefined) {
    structureConditions.push({
      structure: {
        path: ["beds"],
        gte: filters.beds,
      },
    });
  }
  if (filters.bathrooms !== undefined) {
    structureConditions.push({
      structure: {
        path: ["bathrooms"],
        gte: filters.bathrooms,
      },
    });
  }

  if (structureConditions.length > 0) {
    if (structureConditions.length === 1) {
      Object.assign(whereClause, structureConditions[0]);
    } else {
      whereClause.AND = structureConditions;
    }
  }

  if (filters.amenities && Array.isArray(filters.amenities) && filters.amenities.length > 0) {
    whereClause.AND = whereClause.AND || [];
    filters.amenities.forEach((amenityId) => {
      whereClause.AND.push({
        listing_amenities: {
          some: {
            amenity_id: Number(amenityId),
          },
        },
      });
    });
  }

  if (filters.startDate && filters.endDate) {
    // Helper: normalize a Date to UTC midnight (YYYY-MM-DDT00:00:00Z)
    // This ensures we ignore hours/minutes/seconds and only compare by year-month-day.
    const toUtcMidnight = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

    const startDay = toUtcMidnight(filters.startDate);
    const endDay = toUtcMidnight(filters.endDate);
    /* 
      Add 1 day to the normalized start date.
      Why? Because we treat the reservation interval as [start, end), meaning the "end date" is exclusive.
      This way, if a reservation ends on Sept 17, a new booking can safely start on Sept 17 (same calendar day).
    */
    const startDayPlus1 = new Date(startDay.getTime() + 24 * 60 * 60 * 1000);
    /* 
      Exclude listings that have overlapping reservations.
      Conflict happens if:
      - A reservation starts before the search's checkout day (endDay), AND
      - That reservation ends after the day *after* the search's check-in (startDayPlus1).
      By pushing startDay forward 1 day, we effectively ignore hours and make end-date exclusive.
    */
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
