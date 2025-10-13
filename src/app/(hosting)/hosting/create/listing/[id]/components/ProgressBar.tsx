"use client";

import { updateDraftListing } from "@/lib/api/server/endpoints/daft-listings";
import { CreateListingForm, createListingSchema } from "@/lib/schemas/createListingSchema";
import { getStepFields, hostingSteps, hostingStepsConfig } from "@/lib/types/hostingSteps";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { FaCheck, FaSave, FaTimes } from "react-icons/fa";
import { useListingFormContext } from "./CreateListingFormProvider";

export default function ProgressBar({ listingId }: { listingId: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const { getValues } = useFormContext<CreateListingForm>();
  const { markStepAsVisited, getCurrentFormData, handleStepClick, isRedirecting } = useListingFormContext();
  const currentStepIndex = hostingSteps.findIndex((step) => pathname.includes(step));
  const progress = (currentStepIndex / (hostingSteps.length - 1)) * 99;
  const [isFormLoaded, setIsFormLoaded] = useState(false);

  useEffect(() => {
    const formData = getValues();
    if (formData && Object.keys(formData).length > 0) {
      setIsFormLoaded(true);
    }
  }, [getValues]);

  useEffect(() => {
    if (isFormLoaded) {
      markStepAsVisited(currentStepIndex);
    }
  }, [currentStepIndex, isFormLoaded, markStepAsVisited]);

  const getStepButtonStyle = (stepIndex: number, status: "unvisited" | "completed" | "error"): string => {
    if (stepIndex === currentStepIndex) {
      return "flex items-center justify-center w-4 h-4 sm:h-8 sm:w-8 text-sm font-medium border-2 border-myGreenSemiBold text-myGreenSemiBold bg-white rounded-full transition-all duration-300";
    }
    if (status === "completed") {
      return "flex items-center justify-center w-4 h-4 sm:h-8 sm:w-8 text-sm font-medium bg-myGreenSemiBold text-white border border-myGreenSemiBold rounded-full hover:bg-myGreenBold transition-all duration-300";
    }
    if (status === "error") {
      return "flex items-center justify-center w-4 h-4 sm:h-8 sm:w-8 text-sm font-medium bg-red-500 text-white border border-red-500 rounded-full hover:bg-red-600 transition-all duration-300";
    }
    return "flex items-center justify-center w-4 h-4 sm:h-8 sm:w-8 text-sm font-medium border border-gray-300 text-gray-400 bg-gray-50 rounded-full transition-all duration-300";
  };

  const getStepButtonContent = (stepIndex: number, status: "unvisited" | "completed" | "error") => {
    if (stepIndex === currentStepIndex) {
      return stepIndex + 1;
    }
    if (status === "completed") {
      return <FaCheck className="sm:w-4 sm:h-4 w-2 h-2" />;
    } else if (status === "error") {
      return <FaTimes className="sm:w-4 sm:h-4 w-2 h-2" />;
    } else {
      return stepIndex + 1;
    }
  };

  const getStepValidationStatusSync = (stepIndex: number): "unvisited" | "completed" | "error" => {
    if (!isFormLoaded) return "unvisited";

    const formValues = getValues();
    const visitedSteps = formValues.visitedSteps || [];

    if (!visitedSteps.includes(stepIndex)) {
      return "unvisited";
    }

    const stepPath = hostingSteps[stepIndex];
    const stepFields = getStepFields(stepPath);

    const hasErrors = stepFields.some((field) => {
      const schema = createListingSchema.shape[field];
      return schema ? !schema.safeParse(formValues[field]).success : false;
    });

    const status = hasErrors ? "error" : "completed";
    return status;
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

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={handleSaveAndExit}
        disabled={isRedirecting}
        className={`flex items-center gap-2 px-6 py-3 w-fit rounded-lg font-medium border border-gray-300 bg-gray-100 text-myGrayDark hover:bg-gray-200 transition-all duration-200 ${
          isRedirecting ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <FaSave className="w-4 h-4" />
        Save and back to menu
      </button>
      <div className="relative w-full bg-gray-200 rounded-full h-2 mb-6">
        <div className="absolute top-[-6px] sm:top-[-12px] flex items-center justify-between gap-2 w-full">
          {Array.from({ length: hostingSteps.length }).map((_, index) => {
            const status = getStepValidationStatusSync(index);
            return (
              <button
                disabled={isRedirecting}
                key={index}
                className={`${getStepButtonStyle(index, status)} ${isRedirecting ? "cursor-not-allowed" : "cursor-pointer"}`}
                title={`Step ${index + 1}: ${hostingStepsConfig[index]?.name || hostingSteps[index]}`}
                onClick={() => handleStepClick(index)}
              >
                {getStepButtonContent(index, status)}
              </button>
            );
          })}
        </div>
        <motion.div
          className="bg-myGreen h-2 rounded-full transition-all duration-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
