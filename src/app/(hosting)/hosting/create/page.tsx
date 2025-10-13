import { getDraftListing } from "@/lib/api/server/endpoints/daft-listings";
import { generateSEOMetadata } from "@/lib/seo";
import CreateListingsMenu from "./components/CreateListingsMenu";

export const metadata = generateSEOMetadata({
  title: "Create Listing",
  description: "Create a new vacation rental listing.",
  noIndex: true,
});

export default async function CreateLitingPage() {
  const draftListings = await getDraftListing();

  return <CreateListingsMenu draftListings={draftListings} />;
}
