import { parseResumedReservationWithListingFromDB } from "../parsers/reservation";
import { CreateReservation } from "../types/reservation";
import customFetch from "./fetch";

const baseUrl = ""; // Empty string for local run

export const endpoint = {
  getReservations: () => `${baseUrl}/api/reservations`,
  createReservation: `${baseUrl}/api/reservations`,
  getListings: (params: string) => `${baseUrl}/api/listings?${params}`,
};

export const api = {
  async getReservations() {
    const { data, error } = await customFetch.get(endpoint.getReservations());

    if (error) throw error;

    const parsedData = parseResumedReservationWithListingFromDB(data);
    return parsedData;
  },
  async createReservation(data: CreateReservation) {
    return await customFetch.post(endpoint.createReservation, { ...data });
  },
  async getListings(city: string) {
    return await customFetch.get(endpoint.getListings(`city=${city}`));
  },
};
