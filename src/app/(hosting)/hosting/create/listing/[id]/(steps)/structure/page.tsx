"use client";

import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { PiBathtubLight, PiBedLight, PiHouseLineLight, PiUsersLight } from "react-icons/pi";

type StructureField = {
  key: keyof CreateListingForm["structure"];
  label: string;
  description: string;
  icon: React.JSX.Element;
  min: number;
  max: number;
};

const structureFields: StructureField[] = [
  {
    key: "guests",
    label: "Guests",
    description: "How many guests can stay?",
    icon: <PiUsersLight className="w-12 h-12" />,
    min: 1,
    max: 20,
  },
  {
    key: "bedrooms",
    label: "Bedrooms",
    description: "How many bedrooms?",
    icon: <PiHouseLineLight className="w-12 h-12" />,
    min: 0,
    max: 20,
  },
  {
    key: "beds",
    label: "Beds",
    description: "How many beds?",
    icon: <PiBedLight className="w-12 h-12" />,
    min: 0,
    max: 20,
  },
  {
    key: "bathrooms",
    label: "Bathrooms",
    description: "How many bathrooms?",
    icon: <PiBathtubLight className="w-12 h-12" />,
    min: 0,
    max: 20,
  },
];

export default function StructureStep() {
  const { watch, setValue } = useFormContext<CreateListingForm>();

  const structure = watch("structure");

  const handleQuantityChange = (key: keyof CreateListingForm["structure"], value: number) => {
    setValue(`structure.${key}`, value, { shouldValidate: true });
  };

  return (
    <div className="w-full p-2 sm:px-12 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-8">
        <div className="text-center mt-8 sm:mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">Share some basics about your place</h1>
          <p className="text-lg text-myGray max-w-2xl mx-auto">You&apos;ll add more details later, like bed types</p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="space-y-6">
            {structureFields.map((field, index) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col sm:flex-row gap-8 items-center justify-between p-6 rounded-xl border border-gray-200 hover:border-myGreenLight transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="text-myGrayDark">{field.icon}</div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-myGrayDark capitalize">{field.label}</h3>
                    <p className="text-sm text-myGray">{field.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(field.key, Math.max(field.min, (structure?.[field.key] || 0) - 1))}
                    disabled={(structure?.[field.key] || 0) <= field.min}
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 text-myGray hover:text-myGrayDark hover:cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300`}
                  >
                    <CiCircleMinus className="h-12 w-12" />
                  </button>

                  <div className="min-w-[3rem] text-center">
                    <span className="text-2xl font-semibold text-myGrayDark">{structure?.[field.key] || 0}</span>
                  </div>

                  <button
                    onClick={() => handleQuantityChange(field.key, Math.min(field.max, (structure?.[field.key] || 0) + 1))}
                    disabled={(structure?.[field.key] || 0) >= field.max}
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 text-myGray hover:text-myGrayDark hover:cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300`}
                  >
                    <CiCirclePlus className="h-12 w-12" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
