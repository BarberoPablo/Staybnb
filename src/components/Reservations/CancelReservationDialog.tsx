import { cancelReservation } from "@/lib/api/server/api";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose, IoWarning } from "react-icons/io5";

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
      const response = await cancelReservation(reservationId);

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
            scale: { duration: 0.2 },
          }}
        >
          <DialogPanel className="relative bg-white rounded-2xl shadow-2xl w-[min(400px,calc(100vw-2rem))] border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <IoWarning className="w-5 h-5 text-red-600" />
                </div>
                <DialogTitle className="text-xl font-semibold text-myGrayDark">Cancel Reservation</DialogTitle>
              </div>
              <button
                onClick={onClose}
                disabled={loading || reloading}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <IoClose className="w-4 h-4 text-myGray" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-center text-center h-20">
                {reloading && (
                  <div className="space-y-2">
                    <div className="w-8 h-8 border-2 border-myGreenSemiBold border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-myGray">Refreshing page...</p>
                  </div>
                )}
                {loading && (
                  <div className="space-y-2">
                    <div className="w-8 h-8 border-2 border-myGreenSemiBold border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-myGray">Canceling reservation...</p>
                  </div>
                )}
                {!loading && !reloading && (
                  <p className="text-myGrayDark">Are you sure you want to cancel this reservation? This action cannot be undone.</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 pt-0">
              <button
                disabled={loading || reloading}
                className="flex-1 px-4 py-3 bg-gray-100 text-myGrayDark rounded-xl font-medium transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                onClick={onClose}
              >
                Go Back
              </button>
              <button
                disabled={loading || reloading}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium transition-colors hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                onClick={handleCancelReservation}
              >
                Cancel Reservation
              </button>
            </div>
          </DialogPanel>
        </motion.div>
      </div>
    </Dialog>
  );
}
