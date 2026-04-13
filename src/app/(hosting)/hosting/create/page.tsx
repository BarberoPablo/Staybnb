import { getDraftListings } from "@/lib/api/server/endpoints/host/daft-listings";
import { generateSEOMetadata } from "@/lib/seo";
import CreateListingsMenu from "./components/CreateListingsMenu";

export const metadata = generateSEOMetadata({
  title: "Create Listing",
  description: "Create a new vacation rental listing.",
  noIndex: true,
});

export default async function CreateLitingPage() {
  const draftListings = await getDraftListings();

  return <CreateListingsMenu draftListings={draftListings} />;
}
