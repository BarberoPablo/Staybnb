"use client";

import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { MdCabin } from "react-icons/md";
import { PiBuildingApartmentLight, PiHouseLineLight, PiSailboatLight } from "react-icons/pi";
import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import toast from "react-hot-toast";

const propertyTypes: {
  icon: React.JSX.Element;
  name: CreateListingForm["propertyType"];
  description: string;
}[] = [
  {
    icon: <PiHouseLineLight className="w-12 h-12" />,
    name: "House",
    description: "A standalone house",
  },
  {
    icon: <PiBuildingApartmentLight className="w-12 h-12" />,
    name: "Apartment",
    description: "A unit in a building",
  },
  {
    icon: <PiSailboatLight className="w-12 h-12" />,
    name: "Boat",
    description: "A boat or yacht",
  },
  {
    icon: <MdCabin className="w-12 h-12" />,
    name: "Cabin",
    description: "A cabin or cottage",
  },
];

export default function PropertyTypeStep() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateListingForm>();

  const selectedPropertyType = watch("propertyType");

  const handleSelectPropertyType = (propertyType: CreateListingForm["propertyType"]) => {
    setValue("propertyType", propertyType, { shouldValidate: true });
  };

  if (errors.propertyType && errors.propertyType.message) {
    toast.error(errors.propertyType.message);
  }

  return (
    <div className="w-full p-2 sm:px-12 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-8">
        <div className="text-center mt-8 sm:mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">Which of these best describes your place?</h1>
          <p className="text-lg text-myGray max-w-2xl mx-auto">Choose the property type that best matches your listing</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {propertyTypes.map((property) => (
              <button
                key={property.name}
                onClick={() => handleSelectPropertyType(property.name)}
                className={`flex flex-col items-center justify-center p-6 h-32 rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:cursor-pointer ${
                  selectedPropertyType === property.name
                    ? "border-myGreenSemiBold bg-myGreenExtraLight shadow-md"
                    : "border-gray-300 hover:border-myGreenLight"
                }`}
              >
                <div className="text-myGrayDark mb-3">{property.icon}</div>
                <h3 className="text-lg font-semibold text-myGrayDark mb-1">{property.name}</h3>
                <p className="text-sm text-myGray text-center">{property.description}</p>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
