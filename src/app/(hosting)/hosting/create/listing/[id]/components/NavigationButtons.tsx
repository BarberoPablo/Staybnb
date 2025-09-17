"use client";

import { updateDraftListing } from "@/lib/api/server/api";
import { CreateListingForm, createListingSchema } from "@/lib/schemas/createListingSchema";
import { hostingSteps } from "@/lib/types/hostingSteps";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { FaArrowLeft, FaArrowRight, FaSave } from "react-icons/fa";

export default function NavigationButtons({ listingId }: { listingId: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const { trigger, getValues } = useFormContext<CreateListingForm>();

  const currentStepIndex = hostingSteps.findIndex((step) => pathname.includes(step));
  const canGoBack = currentStepIndex > 0;
  const canGoNext = currentStepIndex < hostingSteps.length - 1;
  const isLastStep = currentStepIndex === hostingSteps.length - 1;

  const getCurrentFormData = (): Partial<CreateListingForm> => {
    const allValues = getValues();
    const formData: Partial<CreateListingForm> = {};
    const fieldsToSave = createListingSchema.keyof().options as (keyof CreateListingForm)[];

    fieldsToSave.forEach((field) => {
      if (allValues[field] !== undefined) {
        (formData[field] as CreateListingForm[typeof field] | undefined) = allValues[field];
      }
    });

    return formData;
  };

  const goBack = () => {
    if (canGoBack) {
      router.push(`/hosting/create/listing/${listingId}/${hostingSteps[currentStepIndex - 1]}`);
    }
  };

  const goNext = async () => {
    if (!canGoNext) return;

    const currentField = hostingSteps[currentStepIndex];
    const isValid = await trigger(currentField);

    if (isValid) {
      router.push(`/hosting/create/listing/${listingId}/${hostingSteps[currentStepIndex + 1]}`);
    }
  };

  const handleSaveAndExit = async () => {
    try {
      const formData = getCurrentFormData();
      const { success } = await updateDraftListing(listingId, formData);
      if (success) {
        toast.success("Draft saved successfully!");
        router.push("/hosting/create");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save changes. Please try again.");
    }
  };

  const handleComplete = async () => {
    try {
      const formData = getCurrentFormData();
      await updateDraftListing(listingId, formData);

      // TODO: Implement complete listing functionality
      console.log("Complete listing clicked");
      router.push("/hosting/listings");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save changes. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky bottom-0 left-0 w-full border-t border-gray-200 px-4 py-4 bg-background"
    >
      <div className="flex w-full justify-between items-center max-w-4xl mx-auto">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            canGoBack
              ? "bg-gray-100 text-myGrayDark hover:bg-gray-200 border border-gray-300 hover:cursor-pointer"
              : "bg-gray-50 text-gray-400 hover:cursor-not-allowed border border-gray-200"
          }`}
        >
          <FaArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={handleSaveAndExit}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-myGray text-white hover:bg-myGrayDark hover:cursor-pointer transition-all duration-200"
        >
          <FaSave className="w-4 h-4" />
          Save & Exit
        </button>

        <button
          onClick={isLastStep ? handleComplete : goNext}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-myGreenSemiBold text-white hover:bg-myGreenBold hover:cursor-pointer"
        >
          {isLastStep ? "Complete Listing" : "Next"}
          {!isLastStep && <FaArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>
  );
}
