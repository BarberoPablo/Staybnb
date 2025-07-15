import { api } from "@/lib/api/api";
import { ListingSearchParams } from "@/lib/types";
import Link from "next/link";
import Checkout from "./components/Checkout";

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

  const listing = await api.getListing(listingId);

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

  return (
    <div>
      <Checkout listing={listing} searchParams={resolvedSearchParams} />
    </div>
  );
}
