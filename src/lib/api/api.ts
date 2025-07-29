import { ListingForm } from "@/store/useListingForm";
import { parseHostListingsWithReservations, parseListingFormData, parseListingFromDB, parseListingWithReservationsFromDB } from "../parsers/listing";
import { parseListingReservedDatesDB, parseReservationsFromDB, parseResumedReservationWithListingFromDB } from "../parsers/reservation";
import { MapCoordinates } from "../types";
import { HostListingsWithReservationsDB, ListingDB, ListingWithReservationsDB } from "../types/listing";
import { CreateReservation, ListingReservedDatesDB, ReservationDB, ResumedReservationWithListingDB } from "../types/reservation";
import customFetch from "./fetch";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const endpoint = {
  getUserReservations: () => `${baseUrl}/api/reservations`,
  getListingReservations: (listingId: number) => `${baseUrl}/api/reservations/${listingId}`, // clients not included
  createReservation: `${baseUrl}/api/reservations`,
  getListings: (params: string) => `${baseUrl}/api/listings?${params}`,
  getListing: (id: number) => `${baseUrl}/api/listings/${id}`,
  createListing: `${baseUrl}/api/listings`,
  cancelReservation: (id: string) => `${baseUrl}/api/reservations/${id}/cancel`,
  getHostListings: () => `${baseUrl}/api/host/listings?includeReservations=false`,
  getHostListingsWithReservations: () => `${baseUrl}/api/host/listings?includeReservations=true`,
  getHostListingReservations: (id: number) => `${baseUrl}/api/host/listings/${id}/reservations`,
};

export const api = {
  async getUserReservations() {
    const { data } = await customFetch.get<ResumedReservationWithListingDB[]>(endpoint.getUserReservations());
    const parsedData = parseResumedReservationWithListingFromDB(data);
    return parsedData;
  },
  async getListingReservations(listingId: number) {
    const { data } = await customFetch.get<ListingReservedDatesDB>(endpoint.getListingReservations(listingId));
    const parsedData = parseListingReservedDatesDB(data);
    return parsedData;
  },
  async createReservation(data: CreateReservation) {
    return await customFetch.post(endpoint.createReservation, { ...data });
  },
  async getListings(params: { city?: string } & Partial<MapCoordinates>) {
    const query = new URLSearchParams();

    if (params.city) query.append("city", params.city);

    if (params.zoom && params.northEast && params.southWest) {
      query.append("northEast", `${params.northEast.lat},${params.northEast.lng}`);
      query.append("southWest", `${params.southWest.lat},${params.southWest.lng}`);
      query.append("zoom", `${params.zoom}`);
    }

    const { data } = await customFetch.get<ListingDB[]>(endpoint.getListings(query.toString()));
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
  async cancelReservation(id: string) {
    return await customFetch.patch(endpoint.cancelReservation(id));
  },
  async getHostListingsWithReservations() {
    const { data } = await customFetch.get<HostListingsWithReservationsDB[]>(endpoint.getHostListingsWithReservations());
    const parsedListingsWithReservations = parseHostListingsWithReservations(data);
    return parsedListingsWithReservations;
  },
  async getHostListings() {
    const { data } = await customFetch.get<ListingDB[]>(endpoint.getHostListings());
    const parsedHostListings = data.map((listing) => parseListingFromDB(listing));
    return parsedHostListings;
  },
  async getHostListingReservations(ListingId: number) {
    const { data } = await customFetch.get<ReservationDB[]>(endpoint.getHostListingReservations(ListingId));
    const parsedHostListings = parseReservationsFromDB(data);
    return parsedHostListings;
  },
};
