import { getHostListing } from "@/lib/api/server/endpoints/listings";
import { generateSEOMetadata } from "@/lib/seo";
import { notFound, redirect } from "next/navigation";
import EditListingForm from "./components/EditListingForm";

export const metadata = generateSEOMetadata({
  title: "Edit Listing",
  description: "Edit your vacation rental listing details.",
  noIndex: true,
});

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const listing = await getHostListing(Number(id));

    if (!listing) {
      notFound();
    }

    return <EditListingForm listing={listing} />;
  } catch (error) {
    console.error("Error fetching listing:", error);
    redirect("/hosting/listings");
  }
}
