"use client";

import { updateDraftListing } from "@/lib/api/server/endpoints/host/daft-listings";
import { CreateListingForm, createListingSchema } from "@/lib/schemas/createListingSchema";
import { getStepPayload, hostingSteps } from "@/lib/types/hostingSteps";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import NavigationButtons from "./NavigationButtons";
import ProgressBar from "./ProgressBar";

interface CreateListingFormProviderProps {
  children: React.ReactNode;
  defaultValues: Partial<CreateListingForm>;
  listingId: string;
}

interface ListingFormContextType {
  markStepAsVisited: (stepIndex: number) => void;
  handleStepClick: (stepIndex: number) => Promise<void>;
  isRedirecting: boolean;
}

const ListingFormContext = createContext<ListingFormContextType | undefined>(undefined);

export const useListingFormContext = () => {
  const context = useContext(ListingFormContext);
  if (!context) {
    throw new Error("useListingFormContext must be used within CreateListingFormProvider");
  }
  return context;
};

export default function CreateListingFormProvider({ children, defaultValues, listingId }: CreateListingFormProviderProps) {
  const methods = useForm<CreateListingForm>({
    mode: "onChange",
    resolver: zodResolver(createListingSchema),
    shouldUnregister: false,
    defaultValues: defaultValues,
  });

  const router = useRouter();
  const pathname = usePathname();
  const { getValues, setValue } = methods;
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setIsRedirecting(false);
  }, [pathname]);

  const markStepAsVisited = useCallback(
    (stepIndex: number) => {
      const currentValues = getValues();
      const visited = currentValues.visitedSteps || [];
      if (!visited.includes(stepIndex)) {
        const newVisitedSteps = [...visited, stepIndex];
        setValue("visitedSteps", newVisitedSteps);
      }
    },
    [getValues, setValue],
  );

  const handleStepClick = useCallback(
    async (stepIndex: number) => {
      try {
        setIsRedirecting(true);
        // Mark the current step as visited before navigating
        const currentStepIndex = hostingSteps.findIndex((step) => pathname.includes(step));
        markStepAsVisited(currentStepIndex);
        setValue("currentStep", stepIndex);

        const stepData = getStepPayload(currentStepIndex, getValues);
        const response = await updateDraftListing(listingId, stepData);

        if (!response?.success) {
          throw new Error("Update failed");
        }

        const stepPath = hostingSteps[stepIndex];
        router.push(`/hosting/create/listing/${listingId}/${stepPath}`);
      } catch (error) {
        console.error("Error saving draft:", error);
        toast.error("Failed to save changes. Please try again.");
        setIsRedirecting(false); // Reset immediately on error since navigation won't happen
      }
    },
    [markStepAsVisited, listingId, router, setValue, pathname, getValues],
  );

  const contextValue: ListingFormContextType = {
    markStepAsVisited,
    handleStepClick,
    isRedirecting,
  };

  return (
    <ListingFormContext.Provider value={contextValue}>
      <FormProvider {...methods}>
        <div className="min-h-screen flex flex-col">
          <div className="w-full px-4 pt-6">
            <div className="max-w-4xl mx-auto">
              <ProgressBar listingId={listingId} />
            </div>
          </div>

          <div className="flex-1">{children}</div>

          <NavigationButtons listingId={listingId} />
        </div>
      </FormProvider>
    </ListingFormContext.Provider>
  );
}
