"use client";

import { FormProvider } from "react-hook-form";
import { CreateListingForm, createListingSchema } from "@/lib/schemas/createListingSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const getDefaultValues = (): CreateListingForm => ({
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
});

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

  return <FormProvider {...methods}>{children}</FormProvider>;
}
