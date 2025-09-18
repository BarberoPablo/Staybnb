import { getDraftListing } from "@/lib/api/server/api";
import CreateListingsMenu from "./components/CreateListingsMenu";

export default async function CreateLitingPage() {
  const draftListings = await getDraftListing();

  return <CreateListingsMenu draftListings={draftListings} />;
}
