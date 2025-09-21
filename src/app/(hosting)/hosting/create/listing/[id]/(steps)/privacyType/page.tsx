"use client";

import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { FaPeopleRoof } from "react-icons/fa6";
import { PiDoorOpenLight, PiHouseLineLight } from "react-icons/pi";
import { CreateListingForm } from "@/lib/schemas/createListingSchema";

const privacyTypes: {
  icon: React.JSX.Element;
  name: CreateListingForm["privacyType"];
  title: string;
  description: string;
}[] = [
  {
    icon: <PiHouseLineLight className="w-12 h-12" />,
    name: "Entire",
    title: "An entire place",
    description: "Guests have the whole place to themselves.",
  },
  {
    icon: <PiDoorOpenLight className="w-12 h-12" />,
    name: "Private",
    title: "A room",
    description: "Guests have their own room in a home, plus access to shared spaces.",
  },
  {
    icon: <FaPeopleRoof className="w-12 h-12" />,
    name: "Shared",
    title: "A shared room in a hostel",
    description: "Guests sleep in a shared room in a professionally managed hostel with staff onsite 24/7.",
  },
];

export default function PrivacyTypeStep() {
  // ✅ Access the shared form context from layout
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateListingForm>();

  const selectedPrivacyType = watch("privacyType");

  const handleSelectPrivacyType = (privacyType: CreateListingForm["privacyType"]) => {
    setValue("privacyType", privacyType, { shouldValidate: true });
  };

  return (
    <div className="w-full p-2 sm:px-12 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-8">
        <div className="text-center mt-8 sm:mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">What type of place will guests have?</h1>
          <p className="text-lg text-myGray max-w-2xl mx-auto">Choose the privacy level that best describes your listing</p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="space-y-4">
            {privacyTypes.map((privacy) => (
              <button
                key={privacy.name}
                onClick={() => handleSelectPrivacyType(privacy.name)}
                className={`w-full flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:cursor-pointer ${
                  selectedPrivacyType === privacy.name
                    ? "border-myGreenSemiBold bg-myGreenExtraLight shadow-md"
                    : "border-gray-300 hover:border-myGreenLight"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-myGrayDark">{privacy.icon}</div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-myGrayDark mb-1">{privacy.title}</h3>
                    <p className="text-sm text-myGray">{privacy.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {errors.privacyType && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{errors.privacyType.message}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
