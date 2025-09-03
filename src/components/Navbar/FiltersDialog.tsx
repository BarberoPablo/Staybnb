"use client";

import { Dates } from "@/lib/types";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useMemo } from "react";
import SelectDays from "./SelectDays";

export default function FiltersDialog({ isOpen, onClose, setDates }: { isOpen: boolean; onClose: () => void; setDates: (dates: Dates) => void }) {
  const [filterStep, setFilterStep] = useState(0);

  const filtersMenu = useMemo(
    () => [
      {
        step: "Date Range",
        title: "Select Check-in and Check-out Dates",
        content: <SelectDays setDates={setDates} />,
      },
      {
        title: "Guests",
        step: "Guests",

        content: <div className="text-center">Guests filter coming soon...</div>,
      },
      {
        title: "Amenities",
        step: "Amenities",
        content: <div className="text-center">Amenities filter coming soon...</div>,
      },
    ],
    [setDates]
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          className="flex flex-col bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl h-[640px]"
        >
          {/* Top Navigation Tabs */}
          <div className="flex w-full mb-6 border-b border-gray-200">
            {filtersMenu.map((filter, index) => (
              <button
                key={index}
                onClick={() => setFilterStep(index)}
                className={`w-full py-2 text-sm font-medium transition-colors duration-200 ${
                  filterStep === index ? "text-myGreenSemiBold border-b-2 border-myGreenSemiBold" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {filter.step}
              </button>
            ))}
          </div>

          <DialogTitle id="dialog-title" className="text-2xl font-bold text-myGrayDark text-center mb-4">
            {filtersMenu[filterStep].title}
          </DialogTitle>

          <div id="dialog-description" className="flex-1 flex flex-col justify-center items-center text-center text-myGray">
            {filtersMenu[filterStep].content}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
