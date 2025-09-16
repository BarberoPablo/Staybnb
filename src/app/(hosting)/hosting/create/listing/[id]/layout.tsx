import { getDraftListing } from "@/lib/api/server/api";
import { CreateListingInitForm } from "@/lib/schemas/createListingSchema";
import CreateListingFormProvider from "./components/CreateListingFormProvider";

export default async function CreateListingFormLayout({ params, children }: { params: Promise<{ id: string }>; children: React.ReactNode }) {
  const { id } = await params;

  try {
    const draftListing = await getDraftListing(Number(id));

    const defaultValues = draftListing[0] ? draftListing[0] : getDefaultValues();

    return (
      <CreateListingFormProvider listingId={Number(id)} defaultValues={defaultValues}>
        {children}
      </CreateListingFormProvider>
    );
  } catch (error) {
    console.error("Error fetching draft listing", error);
    return <div>Error fetching draft listing</div>;
  }
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
