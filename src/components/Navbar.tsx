"use client";

import { Container } from "@/app/(site)/components/Container";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { logoUrl } from "@/lib/utils";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { IoCalendar, IoMenu, IoSearch } from "react-icons/io5";
import { RoundButton } from "./Button/RoundButton";
import ChangeViewButton from "./ChangeViewButton";
import { SignButton } from "./SignButton";

export default function Navbar({ search = true }: { search?: boolean }) {
  const [searchCity, setSearchCity] = useState("");
  const [focusInput, setFocusInput] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const hosting = pathname.includes("/hosting");
  const searchEffect = !useMediaQuery("(max-width: 500px)");

  const handleSearchCityInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCity(event.target.value);
  };

  const handleSearchCity = () => {
    router.push(`/search?city=${encodeURIComponent(searchCity.trim())}`);
    setSearchCity("");
  };

  const handleFocusInput = (focus: boolean) => {
    if (focus) {
      setShowFilters(true);
    }
    setFocusInput(focus);
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
            <div className="flex w-full justify-between items-center">
              <div className="flex-1 flex justify-center">
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
                      className="flex flex-row w-full h-full items-center justify-center font-medium rounded-full p-2 gap-2 bg-myGreen text-myGray overflow-hidden transition-colors hover:cursor-pointer"
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
                      className="flex flex-row w-full h-full items-center justify-center font-medium rounded-full p-2 gap-2 bg-myGreen text-myGray overflow-hidden transition-colors hover:cursor-pointer"
                      disabled={searchCity === ""}
                      onClick={handleSearchCity}
                    >
                      <IoSearch className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="hidden md:flex gap-2">
                <ChangeViewButton />
                <SignButton />
              </div>
              <DropDownNavbarMenu />
            </div>
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="flex sm:hidden flex-col gap-2 mt-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex justify-center items-center gap-10 px-5">
                    <RoundButton
                      className="w-10 h-10 bg-myGreenExtraLight shadow-md text-2xl text-myGrayDark"
                      onClick={() => console.log("Calendar RoundButton")}
                    >
                      <IoCalendar className="text-myGrayDark" />
                    </RoundButton>
                    <RoundButton className="w-10 h-10 bg-myGreenExtraLight shadow-md text-3xl text-myGrayDark" onClick={() => setShowFilters(false)}>
                      <IoIosClose />
                    </RoundButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </Container>
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
