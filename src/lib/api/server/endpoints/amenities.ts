import { fetchAmenities } from "../../amenities/amenities.http";

export async function getAmenities() {
  return fetchAmenities();
}
