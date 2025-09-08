"use client";

import { Container } from "@/app/(site)/components/Container";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { parseFilters } from "@/lib/api/server/utils";
import { AmenityId } from "@/lib/constants/amenities";
import { Dates, Guests } from "@/lib/types";
import { logoUrl } from "@/lib/utils";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { motion } from "framer-motion";
import { SearchParams } from "next/dist/server/request/search-params";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { lazy, useEffect, useState } from "react";
import { IoMenu, IoSearch } from "react-icons/io5";
import ChangeViewButton from "./ChangeViewButton";
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
  const searchEffect = !useMediaQuery("(max-width: 500px)");

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
        amenities: (parsedFilters.amenities as AmenityId[]) ?? prevFilters.amenities,
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
      let query = `/search?city=${encodeURIComponent(searchCity.trim())}`;
      if (filtersQuery && Object.keys(filtersQuery).length > 0) {
        query += buildQueryStringFromParams(filtersQuery);
      }

      router.push(query);
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
    if (query || searchListings) {
      if (searchCity) {
        let searchQuery = `/search?city=${encodeURIComponent(searchCity.trim())}`;
        if (query && Object.keys(query).length > 0) {
          searchQuery += buildQueryStringFromParams(query);
        }

        router.push(searchQuery);
      } else {
        setShowCityError(true);
        setTimeout(() => setShowCityError(false), 3000);
      }
    }

    setOpenCalendar(false);
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
                  <div
                    className={`flex items-center gap-2 h-10 border rounded-full transition-all duration-300 ${
                      showCityError ? "border-red-500 bg-red-50 animate-pulse" : "border-myGreenSemiBold bg-myGreenExtraLight"
                    }`}
                  >
                    <input
                      type="text"
                      placeholder={showCityError ? "Please enter a city to search" : "Where do you want to go?"}
                      className={`rounded-full py-2 ${searchEffect ? "px-4" : "px-2"} text-sm focus:outline-none transition-colors duration-300 ${
                        showCityError ? "bg-red-50 text-red-700 placeholder-red-400" : "focus:bg-myGreenLight hover:bg-myGreenLight"
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
                          showCityError ? "bg-red-300 text-red-700" : "bg-myGreenLight text-myGray"
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
                        className="flex flex-row w-full h-full items-center justify-center font-medium rounded-full p-2 gap-2 bg-myGreenLight text-myGray overflow-hidden transition-colors hover:cursor-pointer"
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
        onClose={handleCloseCalendar}
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

export function buildQueryStringFromParams(params: SearchParams): string {
  const queryParts: string[] = [];

  if (params.startDate) {
    queryParts.push(`startDate=${encodeURIComponent(params.startDate as string)}`);
  }
  if (params.endDate) {
    queryParts.push(`endDate=${encodeURIComponent(params.endDate as string)}`);
  }

  if (params.adults) {
    queryParts.push(`adults=${params.adults}`);
  }
  if (params.children) {
    queryParts.push(`children=${params.children}`);
  }
  if (params.infant) {
    queryParts.push(`infant=${params.infant}`);
  }
  if (params.pets) {
    queryParts.push(`pets=${params.pets}`);
  }

  if (params.amenities) {
    const amenitiesValue = Array.isArray(params.amenities) ? params.amenities.join(",") : params.amenities;
    queryParts.push(`amenities=${encodeURIComponent(amenitiesValue)}`);
  }

  if (params.minPrice) {
    queryParts.push(`minPrice=${params.minPrice}`);
  }
  if (params.maxPrice) {
    queryParts.push(`maxPrice=${params.maxPrice}`);
  }

  if (params.guests) {
    queryParts.push(`guests=${params.guests}`);
  }
  if (params.bedrooms) {
    queryParts.push(`bedrooms=${params.bedrooms}`);
  }
  if (params.beds) {
    queryParts.push(`beds=${params.beds}`);
  }
  if (params.bathrooms) {
    queryParts.push(`bathrooms=${params.bathrooms}`);
  }

  return queryParts.length > 0 ? `&${queryParts.join("&")}` : "";
}
