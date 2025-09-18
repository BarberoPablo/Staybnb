"use client";

import { UploadPhotos } from "@/app/(hosting)/hosting/create/components/UploadPhotos";
import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { PiCameraLight } from "react-icons/pi";

export default function ImagesStep() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateListingForm>();

  const images = watch("images") || [];
  const isFirstRender = useRef(true);

  const handleSetField = (field: string, value: string[]) => {
    setValue(field as keyof CreateListingForm, value, { shouldValidate: true });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (errors.images && errors.images.message) {
      toast.error(errors.images.message);
    }
  }, [errors.images]);

  return (
    <div className="w-full p-2 sm:px-12 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-8">
        <div className="text-center mt-8 sm:mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">Add some photos of your place</h1>
          <p className="text-lg text-myGray max-w-2xl mx-auto">To start, you&apos;ll need 3 photos. You can add more or make changes later.</p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <PiCameraLight className="w-6 h-6 text-myGreenSemiBold" />
                <h3 className="text-lg font-semibold text-myGrayDark">Upload Photos</h3>
              </div>

              <UploadPhotos images={images} handleSetField={handleSetField} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
