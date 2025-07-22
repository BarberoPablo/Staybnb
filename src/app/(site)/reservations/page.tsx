import "rsuite/Tabs/styles/index.css";
import { ReservationTabs } from "./components/ReservationTabs";

export default function ReservationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-semibold text-3xl">My Reservations</h1>

      <div className="flex flex-col">
        <div className="flex flex-col gap-8">
          <ReservationTabs />
        </div>
      </div>
    </div>
  );
}
