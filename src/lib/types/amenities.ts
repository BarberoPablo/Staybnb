export type Amenity = {
  id: number;
  name: string;
  category: string;
};

export type AmenityDB = {
  listing_id: number;
  amenity_id: number;
  amenities: Amenity & { created_at: Date; updated_at: Date };
};
