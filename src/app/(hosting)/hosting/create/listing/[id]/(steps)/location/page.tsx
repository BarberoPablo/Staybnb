"use client";

import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import { errorClass, inputClass, labelClass } from "@/lib/styles";
import { Location } from "@/lib/types/listing";
import { reverseGeocode } from "@/lib/utils";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import { FieldError, useFormContext, useWatch, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { PiMapPinLight } from "react-icons/pi";

// Dynamic import for map to avoid SSR issues
const MapLocationNoSSR = dynamic(() => import("@/app/(hosting)/hosting/create/components/MapLocation"), { ssr: false });

type LocationField = {
  key: keyof CreateListingForm["location"];
  label: string;
  placeholder?: string;
};

// Function to build formatted address from individual fields
const buildFormattedAddress = (locationData: CreateListingForm["location"]) => {
  const parts = [];

  if (locationData.housenumber) parts.push(locationData.housenumber);
  if (locationData.street) parts.push(locationData.street);
  if (locationData.city) parts.push(locationData.city);
  if (locationData.state) parts.push(locationData.state);
  if (locationData.postcode) parts.push(locationData.postcode);
  if (locationData.country) parts.push(locationData.country);

  return parts.join(", ");
};

export default function LocationStep() {
  const {
    setValue,
    control,
    formState: { errors },
  } = useFormContext<CreateListingForm>();

  const location = useWatch({ control, name: "location" });
  const isFirstRender = useRef(true);

  const locationFields: LocationField[] = [
    { key: "country", label: "Country *", placeholder: "Country" },
    { key: "city", label: "City *", placeholder: "City" },
    { key: "state", label: "State *", placeholder: "State" },
    { key: "street", label: "Street *", placeholder: "Main St" },
    { key: "housenumber", label: "Housenumber *", placeholder: "Housenumber" },
    { key: "postcode", label: "Postcode *", placeholder: "12345" },
  ];
  const handleChangeLocation = useCallback(
    (address: Location) => {
      setValue("location", address, { shouldValidate: true });
    },
    [setValue],
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (errors.location) {
      const locationErrors = Object.values(errors.location).filter((error) => error && typeof error === "object" && "message" in error) as FieldError[];
      if (locationErrors.length > 0) {
        const firstError = locationErrors[0];
        toast.error(firstError.message || "Please complete all location fields");
      }
    }
  }, [errors.location]);

  useEffect(() => {
    if (!location?.lat && !location?.lng && typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const address = await reverseGeocode(userLat, userLng);
          if (typeof address !== "string") {
            handleChangeLocation(address);
          }
        },
        async (error) => {
          console.warn("Geolocation error:", error);
          const address = await reverseGeocode(-34.6037, -58.3816);
          if (typeof address !== "string") {
            handleChangeLocation(address);
          }
        },
      );
    }
  }, [location?.lat, location?.lng, handleChangeLocation]);

  useEffect(() => {
    if (!location) return;

    const newFormattedAddress = buildFormattedAddress(location);

    if (newFormattedAddress && newFormattedAddress !== location.formatted) {
      setValue("location.formatted", newFormattedAddress, { shouldValidate: true });
    }
  }, [location, setValue]);

  return (
    <div className="w-full p-2 sm:px-12 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-8">
        <div className="text-center mt-8 sm:mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">Where&apos;s your place located?</h1>
          <p className="text-lg text-myGray max-w-2xl mx-auto">Pin your location on the map so guests can find your place easily</p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="space-y-6">
            {/* Map Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-myGrayDark">Select your location</h3>
              </div>

              {location?.lat && location?.lng ? (
                <MapLocationNoSSR
                  displayLocation={false}
                  zIndex={0}
                  lat={location.lat}
                  lng={location.lng}
                  formattedLocation={location.formatted || ""}
                  handleChangeLocation={handleChangeLocation}
                />
              ) : (
                <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                  <p className="text-sm text-gray-500">Loading map...</p>
                </div>
              )}
            </div>

            {/* Display formatted address (read-only) */}
            <div className="bg-myGreenExtraLight rounded-xl border border-myGreenLight p-4">
              <label className={labelClass}>Formatted Address (Auto-generated)</label>
              <div className="text-myGrayDark font-medium bg-white rounded-lg p-3 border border-gray-200">
                {location?.formatted || "Address will be generated from the fields below"}
              </div>
              <p className="text-xs text-myGray mt-2">This is how your address will appear to guests</p>
            </div>

            {/* Location Input Fields */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <PiMapPinLight className="w-6 h-6 text-myGreenSemiBold" />
                <h3 className="text-lg font-semibold text-myGrayDark">Location Details</h3>
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
          </div>
        </div>
      </motion.div>
    </div>
  );
}
