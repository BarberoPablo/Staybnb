import { SearchParams } from "next/dist/server/request/search-params";
import { MapCoordinates } from "./types";

type StructureFilters = { guests?: number; bedrooms?: number; beds?: number; bathrooms?: number };
type GuestFilters = { adults?: number; children?: number; infant?: number; pets?: number };
type PriceFilters = { minPrice?: number; maxPrice?: number };
type DateFilters = { startDate?: Date; endDate?: Date };
type AmenitiesFilters = { amenities?: string[] };
type PaginationFilters = { offset?: number; limit?: number };

type DateQuery = { startDate?: string; endDate?: string };
type AmenitiesQuery = { amenities?: string };
type MapQuery = { neLat?: number; neLng?: number; swLat?: number; swLng?: number };

export type ParsedFilters = StructureFilters & GuestFilters & PriceFilters & DateFilters & AmenitiesFilters & PaginationFilters;
export type ParsedQuery = StructureFilters & GuestFilters & PriceFilters & DateQuery & AmenitiesQuery & PaginationFilters & MapQuery & { city: string };

export function parseFilters(params: SearchParams): ParsedFilters {
  const filters: ParsedFilters = {};

  const paginationFilters: PaginationFilters = {
    ...(params.offset ? { offset: toNumber(params.offset) } : {}),
    ...(params.limit ? { limit: toNumber(params.limit) } : {}),
  };

  Object.assign(filters, paginationFilters);

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

export function parseFiltersToQuery(filters: ParsedFilters, city: string, mapCoordinates: MapCoordinates | undefined): ParsedQuery {
  const { amenities, startDate, endDate, ...rest } = filters;

  const query: ParsedQuery = {
    ...rest,
    city,
  };

  if (amenities && amenities.length > 0) {
    query.amenities = amenities.join();
  }

  if (startDate) {
    query.startDate = startDate.toISOString();
  }

  if (endDate) {
    query.endDate = endDate.toISOString();
  }

  if (mapCoordinates) {
    query.neLat = mapCoordinates.northEast.lat;
    query.neLng = mapCoordinates.northEast.lng;
    query.swLat = mapCoordinates.southWest.lat;
    query.swLng = mapCoordinates.southWest.lng;
  }

  return query;
}
