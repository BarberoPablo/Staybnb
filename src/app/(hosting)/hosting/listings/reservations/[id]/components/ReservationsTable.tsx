import { ParseGuests } from "@/components/ParseGuests";
import { Reservation, ReservationStatus } from "@/lib/types/reservation";
import { showUTCDate } from "@/lib/utils";
import { MdOutlineCancelPresentation } from "react-icons/md";

const upcomingReservationsTableHeaders = ["Check-in", "Check-out", "Guests", "Total Price", "Reserved on", "Total nights", "Discount", "Cancel"];
const canceledReservationsTableHeaders = ["Check-in", "Check-out", "Guests", "Total Price", "Reserved on", "Total nights", "Discount", "Status"];

export const tableHeaders = {
  upcoming: upcomingReservationsTableHeaders,
  canceled: canceledReservationsTableHeaders,
  canceledByHost: canceledReservationsTableHeaders,
  completed: canceledReservationsTableHeaders,
};

const parseStatus = {
  upcoming: "Upcoming",
  canceled: "Canceled",
  canceledByHost: "Canceled by Host",
  completed: "Completed",
};

/* status combinations: [upcoming], [any combination of the other 3] */
export function ReservationsTable({
  reservations,
  status,
  onClick,
}: {
  reservations: Reservation[];
  status: ReservationStatus[];
  onClick?: (id: string) => void;
}) {
  const filteredReservations = status ? reservations.filter((reservation) => status.includes(reservation.status)) : reservations;

  return (
    <table className="w-full text-center">
      <thead className="flex-1 border-2 border-myGreen bg-myGreen">
        <tr>
          {tableHeaders[status[0]].map((header) => (
            <th key={"table-head-" + header} className="border-r border-gray-300 py-1">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="flex-1 border-2 border-myGreen">
        {filteredReservations.map((reservation, index) => (
          <tr key={reservation.id} className={`${index % 2 === 0 ? "bg-gray-300" : "bg-gray-200"}`}>
            <td>{showUTCDate(reservation.startDate)}</td>
            <td>{showUTCDate(reservation.endDate)}</td>
            <td>{ParseGuests(reservation.guests, reservation.id)}</td>
            <td>{reservation.totalPrice}</td>
            <td>{showUTCDate(reservation.createdAt)}</td>
            <td>{reservation.totalNights}</td>
            <td>{reservation.discount}</td>
            <td>
              {reservation.status === "upcoming" && onClick && (
                <button onClick={() => onClick(reservation.id)} className="flex p-1 w-full items-center justify-center hover:cursor-pointer">
                  <MdOutlineCancelPresentation className="w-8 h-6" />
                </button>
              )}
              {(reservation.status === "canceledByHost" || reservation.status === "canceled") && <>{parseStatus[reservation.status]}</>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
