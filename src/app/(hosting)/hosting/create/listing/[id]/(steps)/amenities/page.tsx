"use client";

import AmenityIcon from "@/components/icons/AmenityIcon";
import { AMENITIES } from "@/lib/constants/amenities";
import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { MdOutlineBathroom, MdOutlineBedroomParent, MdOutlineLocalActivity, MdOutlineTableBar } from "react-icons/md";

import { FaKitchenSet } from "react-icons/fa6";
import { IoGameControllerOutline } from "react-icons/io5";
import { LuSiren } from "react-icons/lu";

type AmenityCategory = {
  name: string;
  amenities: Array<(typeof AMENITIES)[number]>;
  icon: React.JSX.Element;
};

const amenityCategories: AmenityCategory[] = [
  {
    name: "General",
    amenities: AMENITIES.filter((amenity) => amenity.category === "general"),
    icon: <HiOutlineDotsCircleHorizontal className="w-6 h-6 text-myGreenSemiBold" />,
  },
  {
    name: "Kitchen",
    amenities: AMENITIES.filter((amenity) => amenity.category === "kitchen"),
    icon: <FaKitchenSet className="w-6 h-6 text-myGreenSemiBold" />,
  },
  {
    name: "Dining",
    amenities: AMENITIES.filter((amenity) => amenity.category === "dining"),
    icon: <MdOutlineTableBar className="w-6 h-6 text-myGreenSemiBold" />,
  },
  {
    name: "Bedroom",
    amenities: AMENITIES.filter((amenity) => amenity.category === "bedroom"),
    icon: <MdOutlineBedroomParent className="w-6 h-6 text-myGreenSemiBold" />,
  },
  {
    name: "Bathroom",
    amenities: AMENITIES.filter((amenity) => amenity.category === "bathroom"),
    icon: <MdOutlineBathroom className="w-6 h-6 text-myGreenSemiBold" />,
  },
  {
    name: "Entertainment",
    amenities: AMENITIES.filter((amenity) => amenity.category === "entertainment"),
    icon: <IoGameControllerOutline className="w-6 h-6 text-myGreenSemiBold" />,
  },
  {
    name: "Security",
    amenities: AMENITIES.filter((amenity) => amenity.category === "security"),
    icon: <LuSiren className="w-6 h-6 text-myGreenSemiBold" />,
  },
  {
    name: "Activities",
    amenities: AMENITIES.filter((amenity) => amenity.category === "activities"),
    icon: <MdOutlineLocalActivity className="w-6 h-6 text-myGreenSemiBold" />,
  },
];

export default function AmenitiesStep() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateListingForm>();

  const selectedAmenities = watch("amenities") || [];

  const handleAmenityToggle = (amenityId: number) => {
    const isSelected = selectedAmenities.includes(amenityId);
    const newAmenities = isSelected ? selectedAmenities.filter((id) => id !== amenityId) : [...selectedAmenities, amenityId];

    setValue("amenities", newAmenities, { shouldValidate: true });
  };

  return (
    <div className="w-full p-2 sm:px-12 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-8">
        <div className="text-center mt-8 sm:mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">Tell guests what your place has to offer</h1>
          <p className="text-lg text-myGray max-w-2xl mx-auto">Select all the amenities that apply to your space</p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-6xl mx-auto">
        <div className="rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="space-y-8">
            {amenityCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  {category.icon}
                  <h3 className="text-xl font-semibold text-myGrayDark">{category.name}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.amenities.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        onClick={() => handleAmenityToggle(amenity.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left hover:cursor-pointer ${
                          isSelected ? "border-myGreenSemiBold bg-myGreenExtraLight shadow-md" : "border-gray-300 hover:border-myGreenLight"
                        }`}
                      >
                        <div className="text-myGrayDark">
                          <AmenityIcon icon={amenity.icon} className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-myGrayDark">{amenity.name}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {errors.amenities && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{errors.amenities.message}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
