import { parseListingWithReservationsFromDB } from "../parsers/listing";
import { parseResumedReservationWithListingFromDB } from "../parsers/reservation";
import { Listing, ListingWithReservationsDB } from "../types/listing";
import { CreateReservation, ResumedReservationWithListingDB } from "../types/reservation";
import customFetch from "./fetch";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const endpoint = {
  getReservations: () => `${baseUrl}/api/reservations`,
  createReservation: `${baseUrl}/api/reservations`,
  getListings: (params: string) => `${baseUrl}/api/listings?${params}`,
  getListing: (id: number) => `${baseUrl}/api/listings/${id}`,
};

export const api = {
  async getReservations() {
    const { data } = await customFetch.get<ResumedReservationWithListingDB[]>(endpoint.getReservations());
    const parsedData = parseResumedReservationWithListingFromDB(data);
    return parsedData;
  },
  async createReservation(data: CreateReservation) {
    return await customFetch.post(endpoint.createReservation, { ...data });
  },
  async getListings(city: string) {
    const { data } = await customFetch.get<Listing[]>(endpoint.getListings(`city=${city}`));
    return data;
  },
  async getListing(id: number) {
    const { data } = await customFetch.get<ListingWithReservationsDB>(endpoint.getListing(id));
    const parsedData = parseListingWithReservationsFromDB(data);
    return parsedData;
  },
};
