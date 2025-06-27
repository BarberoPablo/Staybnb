"use client";

import { useQueryParams } from "@/hooks/useQueryParams";
import { mockListings } from "@/lib/mockListings";
import { listingQueryParams } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import Checkout from "./components/Checkout";

export default function CheckoutPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const router = useRouter();
  const params: Partial<Record<(typeof listingQueryParams)[number], string>> = useQueryParams(listingQueryParams);
  const numericId = parseInt(listingId ?? "");

  const listing = mockListings.find((listing) => listing.id === numericId);

  const handleGoBackHome = () => {
    router.push("/");
  };

  if (!listingId || !params.startDate || !params.endDate || !params.adults || !listing) {
    return (
      <div>
        <h1>Invalid information (check dates, guests and listing)</h1>
        <button onClick={handleGoBackHome}>Go back home</button>
      </div>
    );
  }

  return (
    <div>
      <Checkout listing={listing} params={params} />
    </div>
  );
}
