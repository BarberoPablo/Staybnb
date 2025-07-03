import { mockReservations } from "../mockReservations";
import { ReservedDates } from "../types";

export async function getReservedDates(listingId: number): Promise<ReservedDates[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const reservedDates = mockReservations.filter((r) => r.listingId === listingId);
      if (reservedDates.length > 0) {
        resolve(reservedDates);
      } else {
        reject(new Error("No reservations found"));
      }
    }, 100);
  });
}
