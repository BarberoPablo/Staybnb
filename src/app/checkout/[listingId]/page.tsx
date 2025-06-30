"use client";

import { useQueryParams } from "@/hooks/useQueryParams";
import { useUser } from "@/hooks/useUser";
import { mockListings } from "@/lib/mockListings";
import { listingQueryParams } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Checkout from "./components/Checkout";

export default function CheckoutPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const router = useRouter();
  const { user, loading } = useUser();
  const params: Partial<Record<(typeof listingQueryParams)[number], string>> = useQueryParams(listingQueryParams);
  const numericId = parseInt(listingId ?? "");

  const listing = mockListings.find((listing) => listing.id === numericId);
  const isInvalid = !listingId || !params.startDate || !params.endDate || !params.adults || !listing;

  useEffect(() => {
    if (!loading && !user) {
      const fullPath = window.location.pathname + window.location.search;
      router.push(`/auth?redirectTo=${encodeURIComponent(fullPath)}`);
    }
  }, [user, router, loading]);

  const handleGoBackHome = () => {
    router.push("/");
  };

  if (isInvalid) {
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
