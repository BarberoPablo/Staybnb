"use client";

import { Listing } from "@/lib/types";
import { useState } from "react";
import BookingModal from "./BookingModal";

export default function BookingModalTrigger({ listing }: { listing: Listing }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full py-2 px-4 border-t border-t-gray-300 backdrop-blur-md sm:hidden">
        <button className="w-full bg-gray-800 text-white py-3 rounded-lg" onClick={() => setIsOpen(true)}>
          Reserve
        </button>
      </div>

      <BookingModal isOpen={isOpen} listing={listing} onClose={() => setIsOpen(false)} />
    </>
  );
}
