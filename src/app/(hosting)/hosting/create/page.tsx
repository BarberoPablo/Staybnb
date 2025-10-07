import { getDraftListing } from "@/lib/api/server/endpoints/daft-listings";
import CreateListingsMenu from "./components/CreateListingsMenu";

export default async function CreateLitingPage() {
  const draftListings = await getDraftListing();

  return <CreateListingsMenu draftListings={draftListings} />;
}
