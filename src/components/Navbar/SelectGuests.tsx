"use client";

import { Guests } from "@/lib/types";
import { listingGuests } from "@/lib/utils";
import React from "react";

interface SelectGuestsProps {
  guests: Record<Guests, number>;
  setGuests: (guests: Record<Guests, number>) => void;
}

export default function SelectGuests({ guests, setGuests }: SelectGuestsProps) {
  const handleGuest = (type: Guests, amount: number) => {
    setGuests({ ...guests, [type]: guests[type] + amount });
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 space-y-3 w-full">
      {listingGuests.map((type) => (
        <div key={type} className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <label className="capitalize font-medium text-myGrayDark min-w-[60px]">{type}</label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={type === "adults" ? guests[type] === 1 : guests[type] === 0}
              className="w-8 h-8 bg-myGreenExtraLight hover:bg-myGreen hover:cursor-pointer text-myGrayDark hover:text-white rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleGuest(type, -1)}
            >
              -
            </button>

            <span className="w-8 text-center font-semibold text-myGrayDark">{guests[type]}</span>

            <button
              type="button"
              disabled={guests[type] === 10}
              className="w-8 h-8 bg-myGreenExtraLight hover:bg-myGreen hover:cursor-pointer text-myGrayDark hover:text-white rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleGuest(type, 1)}
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
