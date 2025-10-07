"use client";

import { errorClass, inputClass, labelClass } from "@/lib/styles";
import { EditListing } from "@/lib/types/listing";
import dynamic from "next/dynamic";
import { memo, useEffect, useMemo } from "react";
import { Control, Controller, useFormContext, useWatch } from "react-hook-form";
import { FaMapMarkerAlt } from "react-icons/fa";

const MapLocationNoSSR = dynamic(() => import("@/app/(hosting)/hosting/create/components/MapLocation"), {
  ssr: false,
  loading: () => <div className="h-60 bg-gray-100 animate-pulse rounded-xl" />,
});

type LocationField = {
  key: keyof EditListing["location"];
  label: string;
  placeholder?: string;
};

const buildFormattedAddress = (locationData: EditListing["location"]) => {
  const parts = [];

  if (locationData.housenumber) parts.push(locationData.housenumber);
  if (locationData.street) parts.push(locationData.street);
  if (locationData.city) parts.push(locationData.city);
  if (locationData.state) parts.push(locationData.state);
  if (locationData.postcode) parts.push(locationData.postcode);
  if (locationData.country) parts.push(locationData.country);

  return parts.join(", ");
};

const MapField = memo(({ control }: { control: Control<EditListing> }) => (
  <Controller
    control={control}
    name="location"
    render={({ field }) => (
      <MapLocationNoSSR
        zIndex={0}
        lat={field.value.lat}
        lng={field.value.lng}
        formattedLocation={field.value.formatted}
        handleChangeLocation={field.onChange}
      />
    )}
  />
));

MapField.displayName = "MapField";

export default function LocationSection() {
  const {
    formState: { errors },
    control,
    setValue,
  } = useFormContext<EditListing>();

  const location = useWatch({ control, name: "location" });

  useEffect(() => {
    if (!location) return;

    const newFormattedAddress = buildFormattedAddress(location);

    // Only update if the formatted address is different and not empty
    if (newFormattedAddress && newFormattedAddress !== location.formatted) {
      setValue("location.formatted", newFormattedAddress, { shouldValidate: true });
    }
  }, [location, setValue]);

  const locationFields: LocationField[] = useMemo(
    () => [
      { key: "country", label: "Country *", placeholder: "Country" },
      { key: "city", label: "City *", placeholder: "City" },
      { key: "state", label: "State *", placeholder: "State" },
      { key: "street", label: "Street *", placeholder: "Main St" },
      { key: "housenumber", label: "Housenumber *", placeholder: "Housenumber" },
      { key: "postcode", label: "Postcode *", placeholder: "12345" },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-myGrayDark">
        <div className="w-8 h-8 bg-myGreenExtraLight rounded-full flex items-center justify-center">
          <FaMapMarkerAlt className="w-4 h-4 text-myGreenSemiBold" />
        </div>
        Location
      </h3>

      <MapField control={control} />

      <div className="bg-myGreenExtraLight rounded-xl border border-myGreenLight p-4">
        <label className={labelClass}>Formatted Address (Auto-generated)</label>
        <div className="text-myGrayDark font-medium bg-white rounded-lg p-3 border border-gray-200">
          {location?.formatted || "Address will be generated from the fields below"}
        </div>
        <p className="text-xs text-myGray mt-2">This is how your address will appear to guests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locationFields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className={labelClass}>{label}</label>
            <Controller
              control={control}
              name={`location.${key}`}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder={placeholder}
                  className={inputClass}
                  value={location?.[key] ?? ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setValue(`location.${key}`, e.target.value, { shouldValidate: true });
                  }}
                />
              )}
            />
            {errors.location?.[key] && <p className={errorClass}>{errors.location[key]?.message}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
