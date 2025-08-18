"use client";

import { api } from "@/lib/api/api";
import { CreateReservation } from "@/lib/types/reservation";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCalendar, IoCard, IoCheckmarkCircle } from "react-icons/io5";
import { ListingData } from "./Checkout";

type ConfirmationState = "loading" | "confirmed" | "error" | "serverError";

const reserve = {
  title: {
    loading: "Reserving...",
    confirmed: "Your reservation is confirmed!",
    error: "Unavailable dates",
    serverError: "Oops...",
  },
  message: {
    loading: "Please wait while we make the reservation",
    confirmed: "An email with the details has been sent to your inbox.",
    error: "Selected dates are not available.",
    serverError: "Something went wrong. Please try again.",
  },
  button: {
    loading: <AiOutlineLoading3Quarters className="animate-spin" />,
    confirmed: "My reservations",
    error: "Refresh",
    serverError: "Refresh",
  },
};

export default function PaymentSection({ listingData }: { listingData: ListingData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>("loading");
  const router = useRouter();

  const handleConfirmPayment = async () => {
    setIsOpen(true);

    const reservationData: CreateReservation = {
      listingId: listingData.listing.id,
      startDate: listingData.startDate,
      endDate: listingData.endDate,
      guests: listingData.guests,
    };

    try {
      const response = await api.createReservation(reservationData);

      if (response.success) {
        setConfirmationState("confirmed");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      setConfirmationState(errorMessage.includes("available") ? "error" : "serverError");
    }
  };

  const handleCloseModal = () => {
    if (confirmationState !== "loading") {
      handleRedirect();
    }
  };

  const handleRedirect = () => {
    if (confirmationState === "error") {
      window.location.reload();
    } else {
      router.push("/profile/reservations");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-myGreenLight rounded-full flex items-center justify-center mx-auto mb-4">
          <IoCard className="w-8 h-8 text-myGrayDark" />
        </div>
        <h1 className="text-3xl font-bold text-myGrayDark mb-2">Payment Method</h1>
        <p className="text-myGray">Complete your booking securely</p>
      </div>

      {/* Trip Dates */}
      <div className="bg-myGreenLight rounded-xl border border-myGreenBold/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-myGreen rounded-full flex items-center justify-center">
            <IoCalendar className="w-5 h-5 text-myGrayDark" />
          </div>
          <h2 className="text-xl font-semibold text-myGrayDark">Trip Dates</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-myGray font-medium">Check-in:</span>
            <span className="font-semibold text-myGrayDark">
              {listingData.startDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-myGray font-medium">Check-out:</span>
            <span className="font-semibold text-myGrayDark">
              {listingData.endDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        disabled={listingData.startDate.getTime() >= listingData.endDate.getTime()}
        className="w-full bg-myGreenBold hover:bg-myGreenDark text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02]"
        onClick={handleConfirmPayment}
      >
        Confirm & Pay
      </button>

      {/* Confirmation Modal */}
      <Dialog open={isOpen} onClose={handleCloseModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
            className="flex flex-col items-center justify-between bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
          >
            {/* Success Icon */}
            {confirmationState === "confirmed" && (
              <div className="w-20 h-20 bg-myGreenLight rounded-full flex items-center justify-center mb-6">
                <IoCheckmarkCircle className="w-12 h-12 text-myGreenBold" />
              </div>
            )}

            <DialogTitle id="dialog-title" className="text-2xl font-bold text-myGrayDark text-center mb-4">
              {reserve.title[confirmationState]}
            </DialogTitle>

            <div id="dialog-description" className="text-center text-myGray mb-8">
              {reserve.message[confirmationState]}
            </div>

            <button
              disabled={confirmationState === "loading"}
              className="flex items-center justify-center w-full bg-myGreenBold hover:bg-myGreenDark text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300"
              onClick={handleRedirect}
            >
              {reserve.button[confirmationState]}
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
