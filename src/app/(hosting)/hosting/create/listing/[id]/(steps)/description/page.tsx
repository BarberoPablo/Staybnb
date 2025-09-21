"use client";

import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { PiFileTextLight } from "react-icons/pi";
import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

const maxLength = 500;

export default function DescriptionStep() {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext<CreateListingForm>();

  const description = watch("description") || "";
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (errors.description && errors.description.message) {
      toast.error(errors.description.message);
    }
  }, [errors.description]);

  return (
    <div className="w-full p-2 sm:px-12 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-8">
        <div className="text-center mt-8 sm:mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">Create your description</h1>
          <p className="text-lg text-myGray max-w-2xl mx-auto">Share what makes your place special.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <PiFileTextLight className="w-6 h-6 text-myGreenSemiBold" />
                <h3 className="text-lg font-semibold text-myGrayDark">Listing Description</h3>
              </div>

              <div className="space-y-3">
                <label htmlFor="description" className="block text-sm font-medium text-myGrayDark">
                  Description of your listing
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                    maxLength: {
                      value: maxLength,
                      message: `Description must be ${maxLength} characters or less`,
                    },
                  })}
                  id="description"
                  className="w-full min-h-40 text-lg p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-myGreen focus:border-transparent resize-none"
                  placeholder="Spacious loft in the heart of the city with stunning views..."
                  maxLength={maxLength}
                />
                <div className="flex justify-end items-center">
                  <span className={`text-sm font-medium ${description.length > maxLength * 0.8 ? "text-red-500" : "text-myGray"}`}>
                    {description.length}/{maxLength}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
