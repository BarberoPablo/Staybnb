import { ListingForm } from "@/store/useListingForm";
import { parseListingFormData, parseListingFromDB, parseListingWithReservationsFromDB } from "../parsers/listing";
import { parseListingReservedDatesDB, parseResumedReservationWithListingFromDB } from "../parsers/reservation";
import { ListingDB, ListingWithReservationsDB } from "../types/listing";
import { CreateReservation, ListingReservedDatesDB, ResumedReservationWithListingDB } from "../types/reservation";
import customFetch from "./fetch";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const endpoint = {
  getUserReservations: () => `${baseUrl}/api/reservations`,
  getListingReservations: (listingId: number) => `${baseUrl}/api/reservations/${listingId}`,
  createReservation: `${baseUrl}/api/reservations`,
  getListings: (params: string) => `${baseUrl}/api/listings?${params}`,
  getListing: (id: number) => `${baseUrl}/api/listings/${id}`,
  createListing: `${baseUrl}/api/listings`,
};

export const api = {
  async getUserReservations() {
    const { data } = await customFetch.get<ResumedReservationWithListingDB[]>(endpoint.getUserReservations());
    const parsedData = parseResumedReservationWithListingFromDB(data);
    return parsedData;
  },
  async getListingReservations(listingId: number) {
    const { data } = await customFetch.get<ListingReservedDatesDB>(endpoint.getListingReservations(listingId));
    console.log({ data });
    const parsedData = parseListingReservedDatesDB(data);
    return parsedData;
  },
  async createReservation(data: CreateReservation) {
    return await customFetch.post(endpoint.createReservation, { ...data });
  },
  async getListings(city: string) {
    const { data } = await customFetch.get<ListingDB[]>(endpoint.getListings(`city=${city}`));
    const parsedListings = data.map((listing) => parseListingFromDB(listing));
    return parsedListings;
  },
  async getListing(id: number) {
    const { data } = await customFetch.get<ListingWithReservationsDB>(endpoint.getListing(id));
    const parsedData = parseListingWithReservationsFromDB(data);
    return parsedData;
  },
  async createListing(data: ListingForm) {
    const parsedListingFormData = parseListingFormData(data);
    return await customFetch.post(endpoint.createListing, { ...parsedListingFormData });
  },
};
