"use client";

import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { PiBabyLight, PiDogLight, PiUsersLight } from "react-icons/pi";

type GuestType = {
  key: keyof CreateListingForm["guestLimits"];
  label: string;
  description: string;
  icon: React.JSX.Element;
  min: number;
  max: number;
};

const guestTypes: GuestType[] = [
  {
    key: "adults",
    label: "Adults",
    description: "Ages 13 or above",
    icon: <PiUsersLight className="w-12 h-12" />,
    min: 1,
    max: 16,
  },
  {
    key: "children",
    label: "Children",
    description: "Ages 2-12",
    icon: <PiBabyLight className="w-12 h-12" />,
    min: 0,
    max: 16,
  },
  {
    key: "infant",
    label: "Infants",
    description: "Under 2",
    icon: <PiBabyLight className="w-12 h-12" />,
    min: 0,
    max: 5,
  },
  {
    key: "pets",
    label: "Pets",
    description: "Bringing a service animal?",
    icon: <PiDogLight className="w-12 h-12" />,
    min: 0,
    max: 5,
  },
];

export default function GuestsStep() {
  const { watch, setValue, trigger } = useFormContext<CreateListingForm>();

  const guestLimits = watch("guestLimits");

  const handleQuantityChange = (type: keyof CreateListingForm["guestLimits"], field: "min" | "max", newValue: number) => {
    const { min, max } = guestLimits?.[type] || { min: 0, max: 0 };

    if (field === "max" && newValue < min) newValue = min;
    if (field === "min" && newValue > max) {
      setValue(`guestLimits.${type}.max`, newValue, { shouldValidate: true });
    }

    setValue(`guestLimits.${type}.${field}`, newValue, { shouldValidate: true });
    trigger(`guestLimits.${type}.${field}`);
  };

  return (
    <div className="w-full p-2 sm:px-12 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-8">
        <div className="text-center mt-8 sm:mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">How many guests can your place accommodate?</h1>
          <p className="text-lg text-myGray max-w-2xl mx-auto">Set minimum and maximum limits for each guest type</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="space-y-6">
            {guestTypes.map((guestType, index) => (
              <motion.div
                key={guestType.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 rounded-xl border border-gray-200 hover:border-myGreenLight transition-colors duration-200"
              >
                <div className="flex flex-col sm:flex-row  items-center justify-between">
                  <div className="flex mb-8 sm:mb-0 items-center gap-4">
                    <div className="text-myGrayDark">{guestType.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-myGrayDark capitalize">{guestType.label}</h3>
                      <p className="text-sm text-myGray">{guestType.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Minimum */}
                    <div className="flex flex-col justify-center items-center gap">
                      <span className="text-sm text-myGray">Min</span>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleQuantityChange(guestType.key, "min", Math.max(guestType.min, (guestLimits?.[guestType.key]?.min || 0) - 1))}
                          disabled={(guestLimits?.[guestType.key]?.min || 0) <= guestType.min}
                          className="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 text-myGray hover:text-myGrayDark hover:cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300"
                        >
                          <CiCircleMinus className="h-12 w-12" />
                        </button>
                        <div className="min-w-[3rem] text-center">
                          <span className="text-2xl font-semibold text-myGrayDark">{guestLimits?.[guestType.key]?.min || 0}</span>
                        </div>
                        <button
                          onClick={() => handleQuantityChange(guestType.key, "min", Math.min(guestType.max, (guestLimits?.[guestType.key]?.min || 0) + 1))}
                          disabled={(guestLimits?.[guestType.key]?.min || 0) >= guestType.max}
                          className="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 text-myGray hover:text-myGrayDark hover:cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300"
                        >
                          <CiCirclePlus className="h-12 w-12" />
                        </button>
                      </div>
                    </div>

                    {/* Maximum */}
                    <div className="flex flex-col items-center gap">
                      <span className="text-sm text-myGray">Max</span>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleQuantityChange(guestType.key, "max", Math.max(guestType.min, (guestLimits?.[guestType.key]?.max || 0) - 1))}
                          disabled={(guestLimits?.[guestType.key]?.max || 0) <= (guestLimits?.[guestType.key]?.min || 0)}
                          className="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 text-myGray hover:text-myGrayDark hover:cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300"
                        >
                          <CiCircleMinus className="h-12 w-12" />
                        </button>
                        <div className="min-w-[3rem] text-center">
                          <span className="text-2xl font-semibold text-myGrayDark">{guestLimits?.[guestType.key]?.max || 0}</span>
                        </div>
                        <button
                          onClick={() => handleQuantityChange(guestType.key, "max", Math.min(guestType.max, (guestLimits?.[guestType.key]?.max || 0) + 1))}
                          disabled={(guestLimits?.[guestType.key]?.max || 0) >= guestType.max}
                          className="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 text-myGray hover:text-myGrayDark hover:cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300"
                        >
                          <CiCirclePlus className="h-12 w-12" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
