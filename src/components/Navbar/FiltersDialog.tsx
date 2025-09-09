"use client";

import { AmenityId } from "@/lib/constants/amenities";
import { Dates, Guests } from "@/lib/types";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchParams } from "next/dist/server/request/search-params";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FilterState } from "../Navbar";
import SelectAmenities from "./SelectAmenities";
import SelectDays from "./SelectDays";
import SelectGuests from "./SelectGuests";

export default function FiltersDialog({
  isOpen,
  step,
  setQuery,
  onClose,
  filters,
  setFilters,
}: {
  isOpen: boolean;
  step: number;
  setQuery: (query: SearchParams) => void;
  onClose: (searchListings?: boolean, query?: SearchParams) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}) {
  const [filterStep, setFilterStep] = useState(0);

  const setDates = useCallback(
    (dates: Dates) => {
      setFilters((prev) => ({ ...prev, dates }));
    },
    [setFilters]
  );

  const setGuests = useCallback(
    (guests: Record<Guests, number>) => {
      setFilters((prev) => ({ ...prev, guests }));
    },
    [setFilters]
  );

  const setAmenities = useCallback(
    (amenities: AmenityId[]) => {
      setFilters((prev) => ({ ...prev, amenities }));
    },
    [setFilters]
  );

  const filtersMenu = useMemo(
    () => [
      {
        step: "Date Range",
        title: "When are you planning to stay?",
        content: <SelectDays setDates={setDates} dates={filters.dates} />,
      },
      {
        step: "Guests",
        title: "Who's coming with you?",
        content: <SelectGuests guests={filters.guests} setGuests={setGuests} />,
      },
      {
        step: "Amenities",
        title: "Looking for specific comforts?",
        content: <SelectAmenities selectedAmenities={filters.amenities || []} setSelectedAmenities={setAmenities} />,
      },
    ],
    [filters.dates, filters.guests, filters.amenities, setDates, setGuests, setAmenities]
  );

  useEffect(() => {
    setFilterStep(step);
  }, [step]);

  const handleFilters = () => {
    const query: SearchParams = {};

    if (filters.dates.startDate && filters.dates.endDate) {
      query.startDate = filters.dates.startDate.toISOString();
      query.endDate = filters.dates.endDate.toISOString();
    }

    const { adults, children, infant, pets } = filters.guests;
    if (children > 0) query.children = children.toString();
    if (infant > 0) query.infant = infant.toString();
    if (pets > 0) query.pets = pets.toString();
    if (children > 0 || infant > 0 || pets > 0 || adults > 1) query.adults = adults.toString();

    if (filters.amenities && filters.amenities.length > 0) {
      query.amenities = filters.amenities.join(",");
    }

    setQuery(query);
    onClose(true, query);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog key="filters-dialog" open={isOpen} onClose={() => onClose()} className="relative z-50">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
              scale: { duration: 0.2 },
            }}
            className="fixed inset-0 flex justify-center p-4 pt-8 items-center sm:pt-4 overflow-y-auto"
          >
            <DialogPanel
              aria-labelledby="dialog-title"
              aria-describedby="dialog-description"
              className="flex flex-col bg-white rounded-2xl p-4 sm:p-8 w-full max-w-md shadow-2xl min-h-[570px] overflow-y-auto overflow-x-hidden"
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

              <div
                id="dialog-description"
                className="flex-1 flex flex-col items-center text-center max-h-[346px] 2xl:min-h-[440px] text-myGray overflow-y-auto overflow-x-hidden w-full"
              >
                {filtersMenu[filterStep].content}
              </div>

              <button
                className="flex items-center justify-center w-full bg-myGreenSemiBold hover:bg-myGreen text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300 hover:cursor-pointer"
                onClick={handleFilters}
              >
                Search
              </button>
            </DialogPanel>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
