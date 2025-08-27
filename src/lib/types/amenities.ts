export type Amenity = {
  id: number;
  name: string;
  category: string;
};

export type AmenityDB = {
  amenities: { id: number; name: string; category: string };
};

export type CreateListingAmenityDB = Amenity;
