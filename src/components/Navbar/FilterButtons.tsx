"use client";

import { AnimatePresence, motion } from "framer-motion";
import { IoIosClose } from "react-icons/io";
import { IoCalendar, IoPeople } from "react-icons/io5";
import { MdHomeWork } from "react-icons/md";
import { RoundButton } from "../Button/RoundButton";

interface FilterButtonsProps {
  showFilters: boolean;
  filtersQuery: string;
  onOpenCalendar: (step: number) => void;
  onCloseFilters: () => void;
}

export default function FilterButtons({ showFilters, filtersQuery, onOpenCalendar, onCloseFilters }: FilterButtonsProps) {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          className="flex flex-col gap-2 mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex gap-4">
            <RoundButton
              className={`w-10 h-10 shadow-md text-2xl text-myGrayDark border border-myGreenSemiBold`}
              style={{
                backgroundColor: `${filtersQuery.includes("startDate") ? "var(--color-myPurple)" : "var(--color-myGreenExtraLight)"}`,
                borderColor: `${filtersQuery.includes("startDate") ? "var(--color-myGray)" : "var(--color-myGreenSemiBold)"}`,
              }}
              onClick={() => onOpenCalendar(0)}
            >
              <IoCalendar className="text-myGrayDark" />
            </RoundButton>
            <RoundButton
              className="w-10 h-10 bg-myGreenExtraLight shadow-md text-2xl text-myGrayDark border border-myGreenSemiBold"
              style={{
                backgroundColor: `${filtersQuery.includes("adults") ? "var(--color-myPurple)" : "var(--color-myGreenExtraLight)"}`,
                borderColor: `${filtersQuery.includes("adults") ? "var(--color-myGray)" : "var(--color-myGreenSemiBold)"}`,
              }}
              onClick={() => onOpenCalendar(1)}
            >
              <IoPeople className="text-myGrayDark" />
            </RoundButton>
            <RoundButton
              className="w-10 h-10 bg-myGreenExtraLight shadow-md text-2xl text-myGrayDark border border-myGreenSemiBold"
              style={{
                backgroundColor: `${filtersQuery.includes("amenities") ? "var(--color-myPurple)" : "var(--color-myGreenExtraLight)"}`,
                borderColor: `${filtersQuery.includes("amenities") ? "var(--color-myGray)" : "var(--color-myGreenSemiBold)"}`,
              }}
              onClick={() => onOpenCalendar(2)}
            >
              <MdHomeWork className="text-myGrayDark" />
            </RoundButton>
            <RoundButton className="w-10 h-10 bg-myGreenExtraLight shadow-md text-3xl text-myGrayDark" onClick={onCloseFilters}>
              <IoIosClose />
            </RoundButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
