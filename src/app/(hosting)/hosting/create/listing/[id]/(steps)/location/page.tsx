"use client";

import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import { errorClass, inputClass, labelClass } from "@/lib/styles";
import { Location } from "@/lib/types/listing";
import { reverseGeocode } from "@/lib/utils";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import { FieldError, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { PiMapPinLight } from "react-icons/pi";

// Dynamic import for map to avoid SSR issues
const MapLocationNoSSR = dynamic(() => import("@/app/(hosting)/hosting/create/components/MapLocation"), { ssr: false });

type LocationField = {
  key: keyof CreateListingForm["location"];
  label: string;
  placeholder?: string;
};

export default function LocationStep() {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<CreateListingForm>();

  const location = watch("location");
  const isFirstRender = useRef(true);

  const locationFields: LocationField[] = [
    { key: "formatted", label: "Formatted Address *", placeholder: "123 Main St, City, State 12345" },
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
    [setValue]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (errors.location) {
      const locationErrors = Object.values(errors.location).filter((error) => error && typeof error === "object" && "message" in error) as FieldError[];
      console.log(locationErrors);
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
        }
      );
    }
  }, [location?.lat, location?.lng, handleChangeLocation]);

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

            {/* Location Details */}
            {location?.formatted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-4 bg-myGreenExtraLight rounded-xl border border-myGreenLight"
              >
                <h4 className="font-semibold text-myGrayDark mb-2">Selected Location:</h4>
                <p className="text-myGrayDark">{location.formatted}</p>
              </motion.div>
            )}

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
                    <input {...register(`location.${key}`)} value={location?.[key] ?? ""} type="text" placeholder={placeholder} className={inputClass} />
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
