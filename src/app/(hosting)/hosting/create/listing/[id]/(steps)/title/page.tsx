"use client";

import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { PiTextAaLight } from "react-icons/pi";
import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

const maxLength = 32;

export default function TitleStep() {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext<CreateListingForm>();

  const title = watch("title") || "";
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (errors.title && errors.title.message) {
      toast.error(errors.title.message);
    }
  }, [errors.title]);

  return (
    <div className="w-full p-2 sm:px-12 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-8">
        <div className="text-center mt-8 sm:mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">Now, let&apos;s give your house a title</h1>
          <p className="text-lg text-myGray max-w-2xl mx-auto">You can always change it later.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <PiTextAaLight className="w-6 h-6 text-myGreenSemiBold" />
                <h3 className="text-lg font-semibold text-myGrayDark">Listing Title</h3>
              </div>

              <div className="space-y-3">
                <label htmlFor="title" className="block text-sm font-medium text-myGrayDark">
                  Title of your listing
                </label>
                <textarea
                  {...register("title", {
                    required: "Title is required",
                    maxLength: {
                      value: maxLength,
                      message: `Title must be ${maxLength} characters or less`,
                    },
                  })}
                  id="title"
                  className="w-full min-h-32 text-lg p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-myGreen focus:border-transparent resize-none"
                  placeholder="Charming cabin with a mountain view"
                  maxLength={maxLength}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-myGray">Short titles work best. Have fun with it!</span>
                  <span className={`text-sm font-medium ${title.length > maxLength * 0.8 ? "text-red-500" : "text-myGray"}`}>
                    {title.length}/{maxLength}
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
