"use client";

import { errorClass, inputClass, labelClass } from "@/lib/styles";
import { EditListing } from "@/lib/types/listing";
import dynamic from "next/dynamic";
import { Controller, useFormContext } from "react-hook-form";
import { FaMapMarkerAlt } from "react-icons/fa";

const MapLocationNoSSR = dynamic(() => import("@/components/Hosting/Steps/components/MapLocation"), { ssr: false });

type LocationField = {
  key: keyof EditListing["location"];
  label: string;
  placeholder?: string;
};

export default function LocationSection() {
  const {
    register,
    watch,
    formState: { errors },
    control,
  } = useFormContext<EditListing>();

  const location = watch("location");

  const locationFields: LocationField[] = [
    { key: "formatted", label: "Formatted Address *", placeholder: "123 Main St, City, State 12345" },
    { key: "street", label: "Street *", placeholder: "Main St" },
    { key: "city", label: "City *", placeholder: "City" },
    { key: "state", label: "State *", placeholder: "State" },
    { key: "postcode", label: "Postcode *", placeholder: "12345" },
    { key: "country", label: "Country *", placeholder: "Country" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-myGrayDark">
        <div className="w-8 h-8 bg-myGreenExtraLight rounded-full flex items-center justify-center">
          <FaMapMarkerAlt className="w-4 h-4 text-myGreenSemiBold" />
        </div>
        Location
      </h3>

      <Controller
        control={control}
        name="location"
        render={({ field }) => (
          <MapLocationNoSSR
            lat={field.value.lat}
            lng={field.value.lng}
            formattedLocation={field.value.formatted}
            handleChangeLocation={(value) => field.onChange(value)}
          />
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locationFields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className={labelClass}>{label}</label>
            <input {...register(`location.${key}`)} value={location?.[key] ?? ""} type="text" placeholder={placeholder} className={inputClass} />
            {errors.location?.[key] && <p className={errorClass}>{errors.location[key]?.message}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
