import { getDraftListing } from "@/lib/api/server/api";
import CreateListingsMenu from "./components/CreateListingsMenu";

export default async function CreateLitingPage(/* { params }: { params: Promise<{ id: string }> } */) {
  /* const { id } = await params;

  if (id) {
    // fetch draft listing from database and pass it to CreateListingsMenu
  } else{
    
  } */
  const draftListings = await getDraftListing();

  return <CreateListingsMenu draftListings={draftListings} />;
}
