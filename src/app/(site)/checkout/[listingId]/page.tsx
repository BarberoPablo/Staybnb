import { fetchListingCheckout } from "@/lib/api/listings/listings.http";
import { generateSEOMetadata } from "@/lib/seo";
import { ListingSearchParams } from "@/lib/types";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buildRedirectQueryString, requireUserWithProfile } from "../../auth/components/requireUserWithProfile";
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

  const listingId = resolvedParams.listingId;
  const redirectTo = `/checkout/${listingId}${buildRedirectQueryString(resolvedSearchParams)}`;

  await requireUserWithProfile(redirectTo);

  const { startDate, endDate, adults } = resolvedSearchParams as ListingSearchParams;

  let listing;
  try {
    listing = await fetchListingCheckout(listingId);
  } catch (error) {
    console.error(error);
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
