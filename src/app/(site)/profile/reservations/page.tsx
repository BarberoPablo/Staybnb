import { SkeletonReservations } from "@/app/(site)/profile/components/SkeletonReservations";
import { getUserReservations } from "@/lib/api/server/endpoints/reservations";
import { generateSEOMetadata } from "@/lib/seo";
import { Suspense } from "react";
import ReservationsClient from "./components/ReservationsClient";

export const metadata = generateSEOMetadata({
  title: "My Reservations",
  description: "View and manage your vacation rental reservations.",
  noIndex: true,
});

export default async function ReservationsSection() {
  try {
    const reservations = await getUserReservations();

    return (
      <Suspense fallback={<SkeletonReservations />}>
        <ReservationsClient initialReservations={reservations} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Error loading reservations</h3>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
}
