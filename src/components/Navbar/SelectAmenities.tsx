"use client";

import { AMENITIES, AmenityId } from "@/lib/constants/amenities";
import { useCallback, useMemo } from "react";
import AmenityButton from "./AmenityButton";

interface SelectAmenitiesProps {
  selectedAmenities: AmenityId[];
  setSelectedAmenities: (amenities: AmenityId[]) => void;
}

export default function SelectAmenities({ selectedAmenities, setSelectedAmenities }: SelectAmenitiesProps) {
  // Memoize the toggle function to prevent unnecessary re-renders
  const toggleAmenity = useCallback(
    (amenityId: AmenityId) => {
      if (selectedAmenities.includes(amenityId)) {
        setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId));
      } else {
        setSelectedAmenities([...selectedAmenities, amenityId]);
      }
    },
    [selectedAmenities, setSelectedAmenities]
  );

  // Memoize the grouped amenities to prevent recalculation on every render
  const amenitiesByCategory = useMemo(() => {
    return AMENITIES.reduce((acc, amenity) => {
      const category = amenity.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(amenity);
      return acc;
    }, {} as Record<string, Array<(typeof AMENITIES)[number]>>);
  }, []);

  // Memoize category labels to prevent object recreation
  const categoryLabels = useMemo(
    () =>
      ({
        general: "Essentials",
        kitchen: "Kitchen",
        dining: "Dining",
        bedroom: "Bedroom",
        bathroom: "Bathroom",
        entertainment: "Entertainment",
        security: "Security",
        activities: "Activities",
      } as Record<string, string>),
    []
  );

  return (
    <div className="w-full mb-4">
      {selectedAmenities.length > 0 && (
        <div className="sticky top-0 bg-white border-b border-gray-200 mb-4 pb-2 z-10 flex justify-between items-center">
          <p className="text-sm text-myGray">
            Selected: {selectedAmenities.length} amenit{selectedAmenities.length !== 1 ? "ies" : "y"}
          </p>
          <button onClick={() => setSelectedAmenities([])} className="text-sm text-red-600 hover:text-red-800 hover:underline hover:cursor-pointer">
            Clear all
          </button>
        </div>
      )}
      <div className="space-y-6">
        {Object.entries(amenitiesByCategory).map(([category, amenities]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-semibold text-myGrayDark capitalize">{categoryLabels[category] || category}</h3>
            <div className="grid grid-cols-1 gap-2">
              {amenities.map((amenity) => (
                <AmenityButton key={amenity.id} amenity={amenity} isSelected={selectedAmenities.includes(amenity.id)} onToggle={toggleAmenity} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
