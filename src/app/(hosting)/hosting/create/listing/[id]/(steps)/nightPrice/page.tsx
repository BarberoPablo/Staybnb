"use client";

import { InputAutoWidth } from "@/app/(hosting)/hosting/create/components/InputAutoWidth";
import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { PiCurrencyDollarLight } from "react-icons/pi";

export default function NightPriceStep() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateListingForm>();

  const nightPrice = watch("nightPrice") || 0;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (errors.nightPrice && errors.nightPrice.message) {
      toast.error(errors.nightPrice.message);
    }
  }, [errors.nightPrice]);

  const handleOnChange = (number: number) => {
    setValue("nightPrice", number, { shouldValidate: true });
  };

  return (
    <div className="w-full p-2 sm:px-12 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-8">
        <div className="text-center mt-8 sm:mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">Now, set a weekday base price</h1>
          <p className="text-lg text-myGray max-w-2xl mx-auto">You can change it anytime later.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <PiCurrencyDollarLight className="w-6 h-6 text-myGreenSemiBold" />
                <h3 className="text-lg font-semibold text-myGrayDark">Nightly Price</h3>
              </div>

              <div className="flex justify-center items-center py-8">
                <InputAutoWidth nightPrice={nightPrice} handleOnChange={handleOnChange} />
              </div>

              <div className="text-center">
                <p className="text-sm text-myGray">Set your base price for weekdays</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
