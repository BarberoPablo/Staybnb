import { api } from "@/lib/api/api";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import toast from "react-hot-toast";

export function CancelReservationDialog({
  reservationId,
  isOpen,
  setIsOpen,
}: {
  reservationId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [reloading, setReloading] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const handleCancelReservation = async () => {
    setLoading(true);
    try {
      const response = await api.cancelReservation(reservationId);

      if (response.success) {
        toast.success("Reservation canceled", { duration: 2000 });
        setLoading(false);
        setReloading(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.message || "Error");
        setIsOpen(false);
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { duration: 4000 });
      } else {
        toast.error("Error at canceling", { duration: 4000 });
      }
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          className="flex flex-col items-center bg-white rounded-lg py-2 sm:py-4 max-w-sm w-full gap-10"
        >
          <DialogTitle id="dialog-title" className="text-xl font-semibold text-myGreen">
            Cancel reservation
          </DialogTitle>

          <div id="dialog-description" className="w-full px-6">
            {reloading && <p className="opacity-80">Refreshing page...</p>}
            {loading && <p className="opacity-30">Canceling reservation...</p>}
            {!loading && !reloading && <p className="">Are you sure you want to cancel this reservation?</p>}
          </div>

          <div id="dialog-description" className="flex items-center justify-around w-full px-6 relative">
            <button
              disabled={loading || reloading}
              className="w-25 bg-foreground text-background py-2 rounded opacity-80 disabled:opacity-30 hover:opacity-100"
              onClick={() => setIsOpen(false)}
            >
              Go Back
            </button>
            <button
              disabled={loading || reloading}
              className="w-25 text-background bg-red-500 py-2 rounded opacity-80 disabled:opacity-30 hover:opacity-100"
              onClick={handleCancelReservation}
            >
              Confirm
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
