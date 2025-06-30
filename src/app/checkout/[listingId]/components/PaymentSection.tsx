"use client";

import { useUser } from "@/hooks/useUser";
import { createReservation } from "@/lib/supabase/reservations";
import { calculateTotal } from "@/lib/utils";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ListingData } from "./Checkout";
import { CreateReservation } from "@/lib/types";

type ConfirmationState = "loading" | "confirmed" | "error";

const reserve = {
  title: {
    loading: "Reserving...",
    confirmed: "Your reservation is confirmed!",
    error: "Whops...",
  },
  message: {
    loading: "Please wait while we make the reservation",
    confirmed: "A confirmation email has been sent to your inbox.",
    error: "Something went wrong. Please try again.",
  },
  button: {
    loading: <AiOutlineLoading3Quarters className="animate-spin" />,
    confirmed: "My reservations",
    error: "Refresh",
  },
};

export default function PaymentSection({ listingData }: { listingData: ListingData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>("loading");
  const router = useRouter();
  const { user } = useUser();

  const handleConfirmPayment = async () => {
    if (!user) {
      return;
    }

    setIsOpen(true);

    const summary = calculateTotal(listingData.startDate, listingData.endDate, listingData.listing);

    const reservationData: CreateReservation = {
      userId: user.id,
      listingId: listingData.listing.id,
      startDate: listingData.startDate,
      endDate: listingData.endDate,
      guests: listingData.guests,
      totalPrice: summary.total,
      totalNights: summary.nights,
      nightPrice: listingData.listing.price,
      discount: summary.discount || 0,
      discountPercentage: summary.discountPercentage || 0,
    };

    try {
      await createReservation(reservationData);
      setConfirmationState("confirmed");
    } catch (error) {
      console.log({ error });
      if (error instanceof Error) {
        console.error(error.message);
        setConfirmationState("error");
      }
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
      router.push("/reservations");
    }
  };

  return (
    <div className="flex flex-col">
      <h1>Select Payment method</h1>
      <div>
        <h2>Dates:</h2>
        <div className="flex flex-col">
          <h3>
            Start:
            {listingData.startDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </h3>
          <h3>
            End:
            {listingData.endDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </h3>
        </div>
      </div>
      <button
        className="bg-myGreen hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mt-4 transition-colors disabled:opacity-50"
        onClick={handleConfirmPayment}
      >
        Confirm & Pay
      </button>
      <Dialog open={isOpen} onClose={handleCloseModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <DialogPanel
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
            className="flex flex-col items-center justify-between bg-white rounded-lg sm:py-4 w-96 h-48"
          >
            <DialogTitle id="dialog-title" className="text-xl font-semibold text-myGreen">
              {reserve.title[confirmationState]}
            </DialogTitle>
            <div id="dialog-description" className="w-full px-6">
              {reserve.message[confirmationState]}
            </div>
            <button
              disabled={confirmationState === "loading"}
              className="flex items-center justify-center w-32 h-10 border border-myGreen rounded-lg"
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
