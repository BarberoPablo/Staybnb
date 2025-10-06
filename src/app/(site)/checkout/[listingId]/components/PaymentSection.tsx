"use client";

import { PriceSummary } from "@/components/Booking/PriceSummary";
import { createReservation } from "@/lib/api/server/api";
import { CreateReservation } from "@/lib/types/reservation";
import { Guests } from "@/lib/types";
import { calculateNights, displayGuestLabel } from "@/lib/utils";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCalendar, IoCard, IoCheckmarkCircle, IoPeople } from "react-icons/io5";
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
  const nights = calculateNights(listingData.startDate, listingData.endDate);
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [reservationId, setReservationId] = useState<string>("");

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
      const response = await createReservation(reservationData);

      if (response.success) {
        setConfirmationState("confirmed");
        setReservationId(response.reservationId);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      setConfirmationState(errorMessage.includes("available") ? "error" : "serverError");
      setErrorMessage(errorMessage);
    }
  };

  const handleCloseModal = () => {
    if (confirmationState !== "loading") {
      handleRedirect();
    }
  };

  const handleRedirect = () => {
    if (confirmationState === "error" || confirmationState === "serverError") {
      window.location.reload();
    } else {
      router.push("/profile/reservations?id=" + reservationId);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-myGreen rounded-full flex items-center justify-center mx-auto mb-4">
          <IoCard className="w-8 h-8 text-myGrayDark" />
        </div>
        <h1 className="text-3xl font-bold text-myGrayDark mb-2">Payment Method</h1>
        <p className="text-myGray">Complete your booking securely</p>
      </div>

      {/* Trip Information */}
      <div className="rounded-xl border bg-gradient-to-r p-6 from-myGreenExtraLight to-myGreenExtraLight/60 border-myGreenSemiBold/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-myGreen rounded-full flex items-center justify-center">
            <IoCalendar className="w-5 h-5 text-myGrayDark" />
          </div>
          <h2 className="text-xl font-semibold text-myGrayDark">Trip Information</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-myGray font-medium">Check-in:</span>
            <span className="font-semibold text-myGrayDark text-sm sm:text-base">
              {listingData.startDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              <span className="text-xs sm:text-sm text-myGray font-normal ml-1">at {listingData.listing.checkInTime}</span>
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-myGray font-medium">Check-out:</span>
            <span className="font-semibold text-myGrayDark text-sm sm:text-base">
              {listingData.endDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              <span className="text-xs sm:text-sm text-myGray font-normal ml-1">at {listingData.listing.checkOutTime}</span>
            </span>
          </div>

          {/* Guests Information */}
          <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
            <IoPeople className="w-4 h-4 text-myGray" />
            <span className="text-myGray font-medium">Guests:</span>
            <span className="font-semibold text-myGrayDark text-sm sm:text-base ml-auto">
              {Object.entries(listingData.guests)
                .map(([guest, value]) => displayGuestLabel(guest as Guests, Number(value)))
                .join(", ")}
            </span>
          </div>
        </div>
        <PriceSummary
          nights={nights}
          listing={listingData.listing}
          discountPercentage={listingData.promo?.discountPercentage}
          className="flex flex-col mt-4"
        />
      </div>

      {/* Payment Button */}
      <button
        disabled={listingData.startDate.getTime() >= listingData.endDate.getTime()}
        className="w-full bg-myGreen hover:bg-myGreenSemiBold text-myGrayDark font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02] hover:cursor-pointer"
        onClick={handleConfirmPayment}
      >
        Confirm and Pay
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
              <div className="w-20 h-20 bg-myGreenExtraLight rounded-full flex items-center justify-center mb-6">
                <IoCheckmarkCircle className="w-12 h-12 text-myGreenSemiBold" />
              </div>
            )}

            <DialogTitle id="dialog-title" className="text-2xl font-bold text-myGrayDark text-center mb-4">
              {reserve.title[confirmationState]}
            </DialogTitle>

            <div id="dialog-description" className="text-center text-myGray mb-8">
              {confirmationState === "serverError" || confirmationState === "error" ? (
                <p className="text-red-500">{errorMessage}</p>
              ) : (
                reserve.message[confirmationState]
              )}
            </div>

            <button
              disabled={confirmationState === "loading"}
              className="flex items-center justify-center w-full bg-myGreenSemiBold hover:bg-myGreen text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300 hover:cursor-pointer"
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
