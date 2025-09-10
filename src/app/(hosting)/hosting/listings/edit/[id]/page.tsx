import { getHostListing } from "@/lib/api/server/api";
import { notFound, redirect } from "next/navigation";
import EditListingForm from "./components/EditListingForm";

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
