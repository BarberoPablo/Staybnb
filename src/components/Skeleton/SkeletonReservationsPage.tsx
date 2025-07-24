import { SkeletonReservationsTable } from "./SkeletonReservationsTable";

export function SkeletonReservationsPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <div className="h-7 w-56 rounded bg-gray-200 animate-pulse" />
      <SkeletonReservationsTable variant="active" rows={1} />
      <div className="h-7 w-64 rounded bg-gray-200 animate-pulse" />
      <SkeletonReservationsTable variant="canceled" rows={1} />
    </div>
  );
}
