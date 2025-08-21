import { tableHeaders } from "@/app/(hosting)/hosting/listings/reservations/[id]/components/ReservationsTable";
import { ReservationStatus } from "@/lib/types/reservation";

export function SkeletonReservationsTable({ variant, rows = 4 }: { variant: ReservationStatus; rows?: number }) {
  const columns = tableHeaders[variant];

  return (
    <table className="w-full text-center">
      <thead className="flex-1 border-2 border-myGreen bg-myGreen">
        <tr>
          {columns.map((column) => (
            <th key={"skeleton-" + column} className="border-r border-gray-300 py-2">
              <div className="mx-auto h-4 w-24 rounded bg-myGreen animate-pulse" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="flex-1 border-2 border-myGreen">
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i} className={`${i % 2 === 0 ? "bg-gray-300" : "bg-gray-200"}`}>
            {columns.map((_, j) => (
              <td key={"skeleton-" + j} className="py-3 px-2">
                <div className="mx-auto h-4 w-20 rounded bg-gray-200 animate-pulse" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
