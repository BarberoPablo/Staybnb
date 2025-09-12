import { Amenity, AmenityDB } from "../types/amenities";

export function parseAmenitiesFromDB(amenitiesDB: AmenityDB[]): Amenity[] {
  return amenitiesDB.map((amenityDB) => ({
    id: amenityDB.amenities.id,
    name: amenityDB.amenities.name,
    category: amenityDB.amenities.category,
  }));
}
