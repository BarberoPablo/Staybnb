"use client";

import { Container } from "@/app/(site)/components/Container";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AmenityId } from "@/lib/constants/amenities";
import { Dates, Guests } from "@/lib/types";
import { logoUrl } from "@/lib/utils";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { lazy, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { IoCalendar, IoMenu, IoPeople, IoSearch } from "react-icons/io5";
import { MdHomeWork } from "react-icons/md";
import { RoundButton } from "./Button/RoundButton";
import ChangeViewButton from "./ChangeViewButton";
import { SignButton } from "./SignButton";

const FiltersDialog = lazy(() => import("./Navbar/FiltersDialog"));

export type FilterState = {
  dates: Dates;
  guests: Record<Guests, number>;
  amenities?: AmenityId[];
};

export default function Navbar({ search = true }: { search?: boolean }) {
  const [searchCity, setSearchCity] = useState("");
  const [focusInput, setFocusInput] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [filtersStep, setFiltersStep] = useState(0);
  const [filtersQuery, setFiltersQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    dates: {
      startDate: undefined,
      endDate: undefined,
    },
    guests: {
      adults: 1,
      children: 0,
      infant: 0,
      pets: 0,
    },
    amenities: [],
  });

  const router = useRouter();
  const pathname = usePathname();
  const hosting = pathname.includes("/hosting");
  const searchEffect = !useMediaQuery("(max-width: 500px)");

  const handleSearchCityInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCity(event.target.value);
  };

  const handleSearchCity = () => {
    let query = `/search?city=${encodeURIComponent(searchCity.trim())}`;

    if (filtersQuery !== "") {
      query += filtersQuery;
    }

    router.push(query);
    setSearchCity("");
    setShowFilters(false);
  };

  const handleFocusInput = (focus: boolean) => {
    if (focus) {
      setShowFilters(true);
    }
    setFocusInput(focus);
  };

  const handleOpenCalendar = (step: number) => {
    setFiltersStep(step);
    setOpenCalendar(true);
  };

  return (
    <nav className="flex items-center justify-center bg-myGreenComplement shadow-sm border border-gray-200 h-full w-full p-0 m-0">
      <Container
        noPadding
        className="flex items-center justify-around sticky top-0 sm:justify-between w-full px-0.5 py-4 sm:px-12"
        style={{ paddingTop: "16px", paddingBottom: "16px" }}
      >
        <div className="hidden sm:block">
          <Link href={`${hosting ? "/hosting" : "/"}`}>
            <Image src={logoUrl} alt="logo" className="object-cover" width={80} height={63} />
          </Link>
        </div>
        {search && (
          <motion.div
            className="flex flex-col w-full "
            animate={{ height: showFilters ? "auto" : "40px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex w-full justify-around items-center">
              <div className="flex-1 flex justify-center">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 h-10 border border-myGreenSemiBold bg-myGreenExtraLight rounded-full">
                    <input
                      type="text"
                      placeholder="Where do you want to go?"
                      className={`rounded-full py-2 ${
                        searchEffect ? "px-4" : "px-2"
                      } text-sm focus:outline-none focus:bg-myGreenLight hover:bg-myGreenLight transition-colors duration-300`}
                      value={searchCity}
                      name="searchCity"
                      onChange={handleSearchCityInput}
                      onFocus={() => handleFocusInput(true)}
                      onBlur={() => handleFocusInput(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearchCity();
                      }}
                    />

                    {searchEffect ? (
                      <motion.button
                        className="flex flex-row w-full h-full items-center justify-center font-medium rounded-full p-2 gap-2 bg-myGreenLight text-myGray overflow-hidden transition-colors hover:cursor-pointer"
                        disabled={searchCity === ""}
                        onClick={handleSearchCity}
                        initial={{ width: 40 }}
                        animate={focusInput ? { width: 100 } : { width: 40 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <IoSearch className="w-5 h-5" />

                        {focusInput && (
                          <motion.span
                            style={{ pointerEvents: "none" }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          >
                            Search
                          </motion.span>
                        )}
                      </motion.button>
                    ) : (
                      <button
                        className="flex flex-row w-full h-full items-center justify-center font-medium rounded-full p-2 gap-2 bg-myGreenLight text-myGray overflow-hidden transition-colors hover:cursor-pointer"
                        disabled={searchCity === ""}
                        onClick={handleSearchCity}
                      >
                        <IoSearch className="w-5 h-5" />
                      </button>
                    )}
                  </div>
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
                            onClick={() => handleOpenCalendar(0)}
                          >
                            <IoCalendar className="text-myGrayDark" />
                          </RoundButton>
                          <RoundButton
                            className="w-10 h-10 bg-myGreenExtraLight shadow-md text-2xl text-myGrayDark border border-myGreenSemiBold"
                            style={{
                              backgroundColor: `${filtersQuery.includes("adults") ? "var(--color-myPurple)" : "var(--color-myGreenExtraLight)"}`,
                              borderColor: `${filtersQuery.includes("adults") ? "var(--color-myGray)" : "var(--color-myGreenSemiBold)"}`,
                            }}
                            onClick={() => handleOpenCalendar(1)}
                          >
                            <IoPeople className="text-myGrayDark" />
                          </RoundButton>
                          <RoundButton
                            className="w-10 h-10 bg-myGreenExtraLight shadow-md text-2xl text-myGrayDark border border-myGreenSemiBold"
                            onClick={() => handleOpenCalendar(2)}
                          >
                            <MdHomeWork className="text-myGrayDark" />
                          </RoundButton>
                          <RoundButton className="w-10 h-10 bg-myGreenExtraLight shadow-md text-3xl text-myGrayDark" onClick={() => setShowFilters(false)}>
                            <IoIosClose />
                          </RoundButton>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="">
                <div className="hidden md:flex gap-2">
                  <ChangeViewButton />
                  <SignButton />
                </div>
                <DropDownNavbarMenu />
              </div>
            </div>
          </motion.div>
        )}
      </Container>
      <FiltersDialog
        isOpen={openCalendar}
        step={filtersStep}
        onClose={() => setOpenCalendar(false)}
        setQuery={setFiltersQuery}
        filters={filters}
        setFilters={setFilters}
      />
    </nav>
  );
}

function DropDownNavbarMenu() {
  return (
    <div className="text-right md:hidden">
      <Menu>
        <MenuButton className="rounded-lg bg-myGreenExtraLight p-2">
          <IoMenu className="w-6 h-6 text-myGrayDark" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-46 origin-top-right rounded-xl border border-myGrayDark/5 bg-background/80 p-1 text-sm/6 text-myGrayDark transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >
          <SignButton isMobile={true} />
          <ChangeViewButton isMobile={true} />
        </MenuItems>
      </Menu>
    </div>
  );
}
