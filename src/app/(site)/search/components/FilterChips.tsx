"use client";

import { ParsedFilters } from "@/lib/api/server/utils";
import { AMENITIES } from "@/lib/constants/amenities";
import { IoClose } from "react-icons/io5";
import { IoLocationOutline, IoCalendarOutline, IoPeopleOutline, IoStarOutline } from "react-icons/io5";

interface FilterChipsProps {
  city: string | undefined;
  filters: ParsedFilters;
  onRemoveFilter?: (filterType: string, value?: string) => void;
}

export function FilterChips({ city, filters, onRemoveFilter }: FilterChipsProps) {
  const chips: Array<{ type: string; label: string; value?: string; icon: React.ReactNode }> = [];

  // City chip
  if (city) {
    chips.push({
      type: "city",
      label: city,
      icon: <IoLocationOutline className="w-4 h-4" />,
    });
  }

  // Date range chip
  if (filters.startDate && filters.endDate) {
    const startDate = new Date(filters.startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endDate = new Date(filters.endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    chips.push({
      type: "dates",
      label: `${startDate} - ${endDate}`,
      icon: <IoCalendarOutline className="w-4 h-4" />,
    });
  }

  // Guests chip
  if (filters.guests && filters.guests > 0) {
    const guestParts = [];
    if (filters.adults) guestParts.push(`${filters.adults} adult${filters.adults > 1 ? "s" : ""}`);
    if (filters.children) guestParts.push(`${filters.children} child${filters.children > 1 ? "ren" : ""}`);
    if (filters.infant) guestParts.push(`${filters.infant} infant${filters.infant > 1 ? "s" : ""}`);
    if (filters.pets) guestParts.push(`${filters.pets} pet${filters.pets > 1 ? "s" : ""}`);

    chips.push({
      type: "guests",
      label: guestParts.join(", ") || `${filters.guests} guest${filters.guests > 1 ? "s" : ""}`,
      icon: <IoPeopleOutline className="w-4 h-4" />,
    });
  }

  // Amenities chips
  if (filters.amenities && filters.amenities.length > 0) {
    filters.amenities.forEach((amenityId) => {
      const amenity = AMENITIES.find((a) => a.id === parseInt(amenityId));
      if (amenity) {
        chips.push({
          type: "amenity",
          label: amenity.name,
          value: amenityId,
          icon: <IoStarOutline className="w-4 h-4" />,
        });
      }
    });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <p className="text-sm text-myGray mb-3">Active filters:</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, index) => (
          <div
            key={`${chip.type}-${index}`}
            className="flex items-center gap-2 px-3 py-1.5 bg-myGreenExtraLight border border-myGreenSemiBold/20 rounded-full text-sm"
          >
            <span className="text-myGrayDark">{chip.icon}</span>
            <span className="text-myGrayDark font-medium">{chip.label}</span>
            {onRemoveFilter && (
              <button
                onClick={() => onRemoveFilter(chip.type, chip.value)}
                className="text-myGray hover:text-myGrayDark transition-colors"
                aria-label={`Remove ${chip.label} filter`}
              >
                <IoClose className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
