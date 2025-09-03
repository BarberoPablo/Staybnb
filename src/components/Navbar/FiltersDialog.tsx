"use client";

import { Dates } from "@/lib/types";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useMemo, useState } from "react";
import SelectDays from "./SelectDays";
import SelectGuests from "./SelectGuests";

export default function FiltersDialog({
  isOpen,
  step,
  setQuery,
  onClose,
}: {
  isOpen: boolean;
  step: number;
  setQuery: (query: string) => void;
  onClose: () => void;
}) {
  const [filterStep, setFilterStep] = useState(0);
  const [dates, setDates] = useState<Dates>({
    startDate: undefined,
    endDate: undefined,
  });

  const filtersMenu = useMemo(
    () => [
      {
        step: "Date Range",
        title: "When are you planning to stay?",
        content: <SelectDays setDates={setDates} dates={dates} />,
      },
      {
        step: "Guests",
        title: "Who's coming with you?",
        content: <SelectGuests />,
      },
      {
        step: "Amenities",
        title: "Looking for specific comforts?",
        content: <div className="text-center">Amenities filter coming soon...</div>,
      },
    ],
    [setDates, dates]
  );

  useEffect(() => {
    setFilterStep(step);
  }, [step]);

  const handleFilters = () => {
    let query = "";

    if (dates.startDate && dates.endDate) {
      query += `&startDate=${dates.startDate.toISOString()}&endDate=${dates.endDate.toISOString()}`;
    }
    setDates({ startDate: undefined, endDate: undefined });
    setQuery(query);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-start justify-center p-4 pt-8 sm:items-center sm:pt-4 overflow-y-auto">
        <DialogPanel
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          className="flex flex-col bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl min-h-[570px] overflow-y-auto "
        >
          {/* Top Navigation Tabs */}
          <div className="flex w-full mb-6 border-b border-gray-200">
            {filtersMenu.map((filter, index) => (
              <button
                key={index}
                onClick={() => setFilterStep(index)}
                className={`w-full py-2 text-sm font-medium transition-colors duration-200 hover:cursor-pointer ${
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

          <div id="dialog-description" className="flex-1 flex flex-col items-center text-center text-myGray overflow-y-auto">
            {filtersMenu[filterStep].content}
          </div>
          <button
            className="flex items-center justify-center w-full bg-myGreenSemiBold hover:bg-myGreen text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300"
            onClick={handleFilters}
          >
            Apply Filters
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
