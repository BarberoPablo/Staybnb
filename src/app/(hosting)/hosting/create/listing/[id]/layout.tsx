import { getDraftListing } from "@/lib/api/server/api";
import CreateListingFormProvider from "./components/CreateListingFormProvider";

export default async function CreateListingFormLayout({ params, children }: { params: Promise<{ id: string }>; children: React.ReactNode }) {
  const { id } = await params;

  try {
    const draftListing = await getDraftListing(Number(id));

    if (!draftListing[0]) {
      throw new Error("Draft listing not found");
    }

    return (
      <CreateListingFormProvider listingId={Number(id)} defaultValues={draftListing[0]}>
        {children}
      </CreateListingFormProvider>
    );
  } catch (error) {
    console.error("Error fetching draft listing", error);
    return <div>Error fetching draft listing</div>;
  }
}
