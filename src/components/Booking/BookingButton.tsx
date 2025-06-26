"use client";

import { Listing } from "@/lib/types";
import { useState } from "react";
import BookingModal from "./BookingModal";
import BookingForm from "./BookingForm";

export default function BookingButton({ listing }: { listing: Listing }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="block sm:hidden">
        <div className="fixed bottom-0 left-0 w-full py-2 px-4 border-t border-t-gray-300 backdrop-blur-md sm:hidden">
          <button className="w-full bg-gray-800 text-white py-3 rounded-lg" onClick={() => setIsOpen(true)}>
            Reserve
          </button>
        </div>
        <BookingModal isOpen={isOpen} listing={listing} onClose={() => setIsOpen(false)} />
      </div>

      <div className="hidden sm:flex justify-end lg:justify-center col-span-5">
        <BookingForm listing={listing} priceFirst={true} onConfirm={() => console.log("Testing")} />
      </div>
    </>
  );
}
