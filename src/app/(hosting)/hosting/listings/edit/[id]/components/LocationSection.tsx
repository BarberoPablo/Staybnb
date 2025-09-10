"use client";

import { errorClass, inputClass, labelClass } from "@/lib/styles";
import { EditListing } from "@/lib/types/listing";
import { useFormContext } from "react-hook-form";
import { FaMapMarkerAlt } from "react-icons/fa";

type LocationField = {
  key: keyof EditListing["location"]; // clave del objeto location
  label: string;
  placeholder?: string;
  type: "text" | "number";
  min?: number;
  max?: number;
  step?: string;
};

export default function LocationSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EditListing>();

  const locationFields: LocationField[] = [
    { key: "formatted", label: "Formatted Address", placeholder: "123 Main St, City, State 12345", type: "text" },
    { key: "street", label: "Street", placeholder: "Main St", type: "text" },
    { key: "city", label: "City", placeholder: "City", type: "text" },
    { key: "state", label: "State", placeholder: "State", type: "text" },
    { key: "postcode", label: "Postcode", placeholder: "12345", type: "text" },
    { key: "country", label: "Country", placeholder: "Country", type: "text" },
    { key: "lat", label: "Latitude", placeholder: "40.7128", type: "number", min: -90, max: 90, step: "any" },
    { key: "lng", label: "Longitude", placeholder: "-74.0060", type: "number", min: -180, max: 180, step: "any" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-myGrayDark">
        <div className="w-8 h-8 bg-myGreenExtraLight rounded-full flex items-center justify-center">
          <FaMapMarkerAlt className="w-4 h-4 text-myGreenSemiBold" />
        </div>
        Location
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locationFields.map(({ key, label, placeholder, type, min, max, step }) => (
          <div key={key}>
            <label className={labelClass}>{label}</label>
            <input
              {...register(`location.${key}`, {
                valueAsNumber: type === "number",
                min: min !== undefined ? { value: min, message: `${label} must be between ${min} and ${max}` } : undefined,
                max: max !== undefined ? { value: max, message: `${label} must be between ${min} and ${max}` } : undefined,
              })}
              type={type}
              placeholder={placeholder}
              step={step}
              className={inputClass}
            />
            {errors.location?.[key] && <p className={errorClass}>{errors.location[key].message}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
