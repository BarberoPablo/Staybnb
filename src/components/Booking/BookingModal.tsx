"use client";

import { ListingWithReservations } from "@/lib/types/listing";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import BookingForm from "./BookingForm";

export default function BookingModal({ isOpen, listing, onClose }: { isOpen: boolean; listing: ListingWithReservations; onClose: () => void }) {
  const handleConfirm = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel className="flex flex-col items-center bg-white rounded-lg py-2 sm:py-4 max-w-sm w-full">
          <DialogTitle className="text-xl font-semibold text-myGreenLight">Select your dates</DialogTitle>
          <div className="w-full px-6">
            <BookingForm listing={listing} onConfirm={handleConfirm}>
              <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-4xl">
                Cancel
              </button>
            </BookingForm>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
