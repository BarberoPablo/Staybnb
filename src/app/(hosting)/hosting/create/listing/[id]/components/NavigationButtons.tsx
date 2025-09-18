"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { completeDraftListing, updateDraftListing } from "@/lib/api/server/api";
import { CreateListingForm, createListingSchema } from "@/lib/schemas/createListingSchema";
import { getStepFields, hostingSteps, hostingStepsConfig } from "@/lib/types/hostingSteps";
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
  const xs = useMediaQuery("(max-width: 500px)");

  const currentStepIndex = hostingSteps.findIndex((step) => pathname.includes(step));
  const canGoBack = currentStepIndex > 0;
  const canGoNext = currentStepIndex < hostingSteps.length - 1;
  const isLastStep = currentStepIndex === hostingSteps.length - 1;

  const schemaFields = createListingSchema.keyof().options as (keyof CreateListingForm)[];
  const formFields = schemaFields.filter((field) => !["id", "hostId", "createdAt", "updatedAt"].includes(field as string));

  const getCurrentFormData = (): Partial<CreateListingForm> => {
    const allValues = getValues();

    return Object.fromEntries(
      formFields.filter((field) => allValues[field] !== undefined).map((field) => [field, allValues[field]])
    ) as Partial<CreateListingForm>;
  };

  const goBack = () => {
    if (canGoBack) {
      router.push(`/hosting/create/listing/${listingId}/${hostingSteps[currentStepIndex - 1]}`);
    }
  };

  const goNext = async () => {
    if (!canGoNext) return;

    const currentStep = hostingSteps[currentStepIndex];
    const fieldsToValidate = getStepFields(currentStep);

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      try {
        const formData = getCurrentFormData();
        const { success } = await updateDraftListing(listingId, { ...formData, currentStep: currentStepIndex });
        if (success) {
          router.push(`/hosting/create/listing/${listingId}/${hostingSteps[currentStepIndex + 1]}`);
        }
      } catch (error) {
        console.error("Error saving draft:", error);
        toast.error("Failed to save changes. Please try again.");
      }
    }
  };

  const handleSaveAndExit = async () => {
    try {
      const formData = getCurrentFormData();
      const { success } = await updateDraftListing(listingId, { ...formData, currentStep: currentStepIndex });
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

      const isValid = await trigger();
      if (!isValid) {
        // Get current form values and manually validate each field
        const formValues = getValues();

        const validationErrors = formFields.filter((field) => {
          return !createListingSchema.shape[field]?.safeParse(formValues[field]).success;
        });

        if (validationErrors.length > 0) {
          const firstErrorField = validationErrors[0] as keyof CreateListingForm;

          // Find which step contains this field
          const stepConfig = hostingStepsConfig.find((step) => step.fields.includes(firstErrorField));

          if (stepConfig) {
            toast.error(`Please complete the ${stepConfig.name} step before finishing`);
            router.push(`/hosting/create/listing/${listingId}/${stepConfig.path}`);
            return;
          }
        }

        toast.error("Please complete all required fields before finishing");
        return;
      }

      const result = await completeDraftListing(listingId);

      if (result.success) {
        toast.success("Listing created successfully!");
        router.push("/hosting/listings");
      } else {
        toast.error("Failed to create listing. Please try again.");
      }
    } catch (error) {
      console.error("Error completing listing:", error);
      toast.error("Failed to create listing. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky z-40 bottom-0 left-0 w-full border-t border-gray-200 px-4 py-4 bg-background"
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
          className="flex items-center gap-2 h-12 px-6 py-3 rounded-lg font-medium bg-myGray text-white hover:bg-myGrayDark hover:cursor-pointer transition-all duration-200"
        >
          <FaSave className="w-4 h-4" />
          {xs ? "" : "Save & Exit"}
        </button>

        <button
          onClick={isLastStep ? handleComplete : goNext}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-myGreenSemiBold text-white hover:bg-myGreenBold hover:cursor-pointer`}
        >
          {isLastStep ? (
            <>Complete</>
          ) : (
            <>
              Next
              <FaArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
