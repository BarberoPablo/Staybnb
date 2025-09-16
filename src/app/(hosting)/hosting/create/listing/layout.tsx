"use client";

import { createListingSchema, CreateListingInitForm, CreateListingForm } from "@/lib/schemas/createListingSchema";
import { hostingSteps } from "@/lib/types/hostingSteps";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { FaArrowLeft, FaArrowRight, FaSave } from "react-icons/fa";

interface CreateListingFormProviderProps {
  children: React.ReactNode;
  draftData?: Partial<CreateListingForm>;
}

export default function CreateListingFormProvider({ children, draftData }: CreateListingFormProviderProps) {
  const methods = useForm<CreateListingForm>({
    mode: "onChange",
    resolver: zodResolver(createListingSchema),
    shouldUnregister: false,
    defaultValues: draftData ? { ...getDefaultValues(), ...draftData } : getDefaultValues(),
  });

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen flex flex-col">
        <div className="w-full px-4 pt-6">
          <div className="max-w-4xl mx-auto">
            <ProgressBar />
          </div>
        </div>

        <div className="flex-1">{children}</div>

        <NavigationButtons />
      </div>
    </FormProvider>
  );
}

function getDefaultValues(): CreateListingInitForm {
  return {
    propertyType: undefined,
    privacyType: undefined,
    location: undefined,
    structure: undefined,
    amenities: [],
    images: [],
    title: undefined,
    description: undefined,
    nightPrice: undefined,
    promotions: [],
    checkInTime: "15:00",
    checkOutTime: "11:00",
    minCancelDays: 3,
    guestLimits: {
      adults: { min: 1, max: 2 },
      children: { min: 0, max: 0 },
      infant: { min: 0, max: 0 },
      pets: { min: 0, max: 0 },
    },
  };
}

function NavigationButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const { trigger } = useFormContext<CreateListingForm>();

  const currentStepIndex = hostingSteps.findIndex((step) => pathname.includes(step));
  const canGoBack = currentStepIndex > 0;
  const canGoNext = currentStepIndex < hostingSteps.length - 1;
  const isLastStep = currentStepIndex === hostingSteps.length - 1;

  const goBack = () => {
    if (canGoBack) {
      router.push(`/hosting/create/listing/${hostingSteps[currentStepIndex - 1]}`);
    }
  };

  const goNext = async () => {
    if (!canGoNext) return;

    const currentField = hostingSteps[currentStepIndex];
    const isValid = await trigger(currentField);
    if (isValid) {
      router.push(`/hosting/create/listing/${hostingSteps[currentStepIndex + 1]}`);
    }
  };

  const handleSaveAndExit = async () => {
    // TODO: Implement save draft functionality
    console.log("Save and exit clicked");
  };

  const handleComplete = async () => {
    // TODO: Implement complete listing functionality
    console.log("Complete listing clicked");
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
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:cursor-pointer${
            canGoBack
              ? "bg-gray-100 text-myGrayDark hover:bg-gray-200 border border-gray-300"
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

function ProgressBar() {
  const pathname = usePathname();
  const currentStepIndex = hostingSteps.findIndex((step) => pathname.includes(step));
  const progress = ((currentStepIndex + 1) / hostingSteps.length) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
      <motion.div
        className="bg-myGreenSemiBold h-2 rounded-full transition-all duration-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
