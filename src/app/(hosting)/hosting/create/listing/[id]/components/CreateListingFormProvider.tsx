"use client";

import { CreateListingForm, createListingSchema } from "@/lib/schemas/createListingSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import NavigationButtons from "./NavigationButtons";
import ProgressBar from "./ProgressBar";

interface CreateListingFormProviderProps {
  children: React.ReactNode;
  defaultValues: Partial<CreateListingForm>;
  listingId: number;
}

export default function CreateListingFormProvider({ children, defaultValues, listingId }: CreateListingFormProviderProps) {
  const methods = useForm<CreateListingForm>({
    mode: "onChange",
    resolver: zodResolver(createListingSchema),
    shouldUnregister: false,
    defaultValues: defaultValues,
  });

  return (
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
  );
}
