"use client";

import SelectAmenities from "@/components/Navbar/SelectAmenities";
import { AMENITIES, AmenityId } from "@/lib/constants/amenities";
import { Controller, useFormContext } from "react-hook-form";
import { MdHomeWork, MdClose } from "react-icons/md";

export default function AmenitiesSection() {
  const { control, watch, setValue } = useFormContext();
  const amenities = watch("amenities");

  const removeAmenity = (amenityIdToRemove: AmenityId) => {
    const updatedAmenities = amenities.filter((id: AmenityId) => id !== amenityIdToRemove);
    setValue("amenities", updatedAmenities);
  };

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-myGrayDark">
        <div className="w-8 h-8 bg-myGreenExtraLight rounded-full flex items-center justify-center">
          <MdHomeWork className="w-4 h-4 text-myGreenSemiBold" />
        </div>
        Amenities
      </h3>
      <div className="flex gap-6">
        <div className="w-full md:max-w-xs max-h-96 p-4 border border-gray-200 rounded-xl overflow-y-auto">
          <Controller
            control={control}
            name="amenities"
            render={({ field }) => (
              <SelectAmenities
                displaySelected={false}
                selectedAmenities={field.value || []}
                setSelectedAmenities={(value) => {
                  field.onChange(value);
                }}
              />
            )}
          />
        </div>

        <div className="flex-1 hidden md:block">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-myGrayDark">Selected amenities ({amenities?.length || 0})</h4>
          </div>
          <div className="max-h-96 p-4 border border-gray-200 rounded-xl overflow-y-auto bg-gray-50">
            {amenities && amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenityId: AmenityId) => (
                  <div
                    key={amenityId}
                    className="flex items-center gap-2 px-3 py-2 bg-background rounded-lg border border-myGreenSemiBold shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-medium text-myGrayDark">{AMENITIES.find((amenity) => amenity.id === amenityId)?.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenityId)}
                      className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-colors hover:cursor-pointer"
                      aria-label={`Eliminar ${AMENITIES.find((amenity) => amenity.id === amenityId)?.name}`}
                    >
                      <MdClose className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No amenities selected</p>
                <p className="text-gray-400 text-xs mt-1">Select amenities from the list on the left</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
