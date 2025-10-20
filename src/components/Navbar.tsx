"use client";

import { Container } from "@/app/(site)/components/Container";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { parseFilters } from "@/lib/api/server/utils";
import { AmenityId } from "@/lib/constants/amenities";
import { Dates, Guests } from "@/lib/types";
import { logoUrl, logoUrlReduced } from "@/lib/utils";
import { motion } from "framer-motion";
import { SearchParams } from "next/dist/server/request/search-params";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { lazy, useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { SignButton } from "./SignButton";

const FiltersDialog = lazy(() => import("./Navbar/FiltersDialog"));
const FilterButtons = lazy(() => import("./Navbar/FilterButtons"));

export type FilterState = {
  dates: Dates;
  guests: Record<Guests, number>;
  amenities?: AmenityId[];
};

export default function Navbar({ search = true }: { search?: boolean }) {
  const searchParams = useSearchParams();
  const [searchCity, setSearchCity] = useState(searchParams.get("city") ?? "");
  const [focusInput, setFocusInput] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [filtersStep, setFiltersStep] = useState(0);
  const [filtersQuery, setFiltersQuery] = useState<SearchParams>({});
  const [showCityError, setShowCityError] = useState(false);
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
  const isMobile = !useMediaQuery("(max-width: 768px)");
  const searchEffect = isMobile;

  useEffect(() => {
    const isSearchPage = pathname.includes("/search");

    if (isSearchPage || searchParams.toString() !== "") {
      const params = Object.fromEntries(searchParams.entries());

      setFiltersQuery(params);
      const parsedFilters = parseFilters(params);

      setFilters((prevFilters) => ({
        ...prevFilters,
        dates: {
          startDate: parsedFilters.startDate,
          endDate: parsedFilters.endDate,
        },
        guests: {
          adults: parsedFilters.adults ?? prevFilters.guests.adults,
          children: parsedFilters.children ?? prevFilters.guests.children,
          infant: parsedFilters.infant ?? prevFilters.guests.infant,
          pets: parsedFilters.pets ?? prevFilters.guests.pets,
        },
        amenities: parsedFilters.amenities?.map((amenity) => Number(amenity)) ?? prevFilters.amenities,
      }));
    }
  }, [searchParams, pathname]);

  const handleSearchCityInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCity(event.target.value);
    if (showCityError) {
      setShowCityError(false);
    }
  };

  const handleSearchCity = () => {
    if (searchCity) {
      const params = new URLSearchParams({ ...filtersQuery, city: searchCity.trim() });
      router.push(`/search?${params.toString()}`);
    }
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

  const handleCloseCalendar = (searchListings?: boolean, query?: SearchParams) => {
    let searchQuery = "";
    if (query) {
      if (searchCity) {
        const params = new URLSearchParams({ ...query, city: searchCity.trim() });
        searchQuery = `/search?${params.toString()}`;
      } else {
        setShowCityError(true);
        setTimeout(() => setShowCityError(false), 3000);
      }
    }

    if (searchListings) {
      router.push(searchQuery);
    }
    setOpenCalendar(false);
  };

  return (
    <nav className="flex items-center justify-center bg-myGreenComplement/50 shadow-sm h-full w-full p-0 m-0">
      <Container noPadding className="flex items-center justify-around sticky z-50 top-0 sm:justify-between w-full px-0.5 py-4 sm:px-12">
        <button onClick={() => router.push(hosting ? "/hosting" : "/")} className="relative flex items-center justify-center cursor-pointer">
          <div className="relative w-[150px] h-[67px] hidden lg:block">
            <Image src={logoUrl} alt="logo" fill className="object-contain" sizes="100%" />
          </div>

          <div className="relative w-[108px] h-[46px] hidden md:block lg:hidden">
            <Image src={logoUrlReduced} alt="logo" fill className="object-contain" sizes="100%" />
          </div>
        </button>
        <div className="flex flex-1 justify-center">
          {search && (
            <motion.div
              className="flex flex-col w-full "
              animate={{ height: showFilters ? "auto" : "40px" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex w-full justify-around items-center">
                <div className="flex-1 flex justify-center">
                  <div className="flex flex-col">
                    <div
                      className={`flex items-center gap-2 h-10 border rounded-full transition-all duration-300 ${
                        showCityError ? "border-red-500 bg-red-50 animate-pulse" : "border-myGrayDark bg-myGray/10"
                      }`}
                    >
                      <input
                        type="text"
                        placeholder={showCityError ? "Please enter a city to search" : "Where do you want to go?"}
                        className={`rounded-full py-2 ${searchEffect ? "px-4" : "px-2"} text-sm focus:outline-none transition-colors duration-300 ${
                          showCityError ? "bg-red-50 text-red-700 placeholder-red-400" : "focus:bg-myGray/10 hover:bg-myGray/10"
                        }`}
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
                          className={`flex flex-row w-full h-full items-center justify-center font-medium rounded-full p-2 gap-2 ${
                            showCityError ? "bg-red-300 text-red-700" : "bg-myGray/10 text-myGrayDark"
                          }   overflow-hidden transition-colors hover:cursor-pointer`}
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
                          className="flex flex-row w-full h-full items-center justify-center font-medium rounded-full p-2 gap-2 bg-myGray/10 text-myGrayDark overflow-hidden transition-colors hover:cursor-pointer"
                          disabled={searchCity === ""}
                          onClick={handleSearchCity}
                        >
                          <IoSearch className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <FilterButtons
                      showFilters={showFilters}
                      filtersQuery={filtersQuery}
                      onOpenCalendar={handleOpenCalendar}
                      onCloseFilters={() => setShowFilters(false)}
                    />
                  </div>
                </div>
              </div>
              <FiltersDialog
                isOpen={openCalendar}
                step={filtersStep}
                onClose={handleCloseCalendar}
                setQuery={setFiltersQuery}
                filters={filters}
                setFilters={setFilters}
              />
            </motion.div>
          )}
        </div>
        <div className="mr-4">
          <SignButton hosting={!!hosting} />
        </div>
      </Container>
    </nav>
  );
}
