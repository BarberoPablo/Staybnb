"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ListingData } from "./Checkout";

const reserve = {
  title: {
    loading: "Reserving...",
    confirmed: "Your reservation is confirmed!",
    error: "Whops...",
  },
  message: {
    loading: "Please wait while we make the reservation",
    confirmed: "A confirmation email has been sent to your inbox.",
    error: "Something went wrong, refresh page and try again",
  },
  button: {
    loading: <AiOutlineLoading3Quarters className="animate-spin" />,
    confirmed: "My reservations",
    error: "Refresh",
  },
};

export default function PaymentSection({ listingData }: { listingData: ListingData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationState, setConfirmationState] = useState<"loading" | "confirmed" | "error">("loading");
  const router = useRouter();

  //If no user -> login and back to here

  useEffect(() => {
    if (!isOpen) return;
    const timeoutId = setTimeout(() => setConfirmationState("confirmed"), 3000);
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  const handleConfirmPayment = async () => {
    setIsOpen(true);
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
      router.push("/");
    }
  };

  return (
    <div>
      <h1>Select Payment method</h1>
      <button onClick={handleConfirmPayment}>Confirm & Pay</button>

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
