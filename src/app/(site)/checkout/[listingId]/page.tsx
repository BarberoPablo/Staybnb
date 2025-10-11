import { getListingWithReservations } from "@/lib/api/server/endpoints/listings";
import { generateSEOMetadata } from "@/lib/seo";
import { ListingSearchParams } from "@/lib/types";
import Link from "next/link";
import { redirect } from "next/navigation";
import Checkout from "./components/Checkout";

export const metadata = generateSEOMetadata({
  title: "Checkout",
  description: "Complete your reservation and secure your vacation rental.",
  noIndex: true,
});

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ listingId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) as ListingSearchParams;

  const listingId = parseInt(resolvedParams.listingId ?? "");
  const { startDate, endDate, adults } = resolvedSearchParams;

  let listing;
  try {
    listing = await getListingWithReservations(listingId);
  } catch {
    redirect("/");
  }

  const isInvalid = !listingId || !startDate || !endDate || !adults || !listing;

  if (isInvalid) {
    return (
      <div>
        <h1>Invalid information (check dates, guests and listing)</h1>
        <Link href={"/"}>
          <button>Go back home</button>
        </Link>
      </div>
    );
  }

  return <Checkout listing={listing} searchParams={resolvedSearchParams} />;
}
