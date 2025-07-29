"use client";

import { logoUrl, windowWidth } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { SignButton } from "./SignButton";

export default function Navbar({ search = true }: { search?: boolean }) {
  const [searchCity, setSearchCity] = useState("");
  const [focusInput, setFocusInput] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const hosting = pathname.includes("/hosting");
  const fullWidth = !windowWidth.shortPath(pathname);

  const handleSearchCityInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCity(event.target.value);
  };

  const handleSearchCity = () => {
    router.push(`/search?city=${encodeURIComponent(searchCity.trim())}`);
    setSearchCity("");
  };

  return (
    <nav className="flex items-center justify-center py-4 border-b border-b-gray-100 bg-myGreenComplement">
      <motion.div
        className="flex items-center justify-center sticky top-0 sm:justify-between w-full px-12"
        initial={{ maxWidth: fullWidth ? windowWidth.full : windowWidth.short }}
        animate={{ maxWidth: fullWidth ? windowWidth.full : windowWidth.short }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        <div>
          <Link href={`${hosting ? "/hosting" : "/"}`}>
            <Image src={logoUrl} alt="logo" className="object-cover" width={80} height={63} />
          </Link>
        </div>
        {search && (
          <div className="flex items-center gap-2 h-10 border border-myGreenBold bg-myGreenLight rounded-full">
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="rounded-full p-2 text-sm focus:outline-none focus:bg-myGreen hover:bg-myGreen transition-colors duration-300"
              value={searchCity}
              name="searchCity"
              onChange={handleSearchCityInput}
              onFocus={() => setFocusInput(true)}
              onBlur={() => setFocusInput(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchCity();
              }}
            />
            <motion.button
              className="flex flex-row w-full h-full items-center justify-center font-medium rounded-full p-2 gap-2 bg-myGreenBold text-background overflow-hidden transition-colors hover:cursor-pointer"
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
          </div>
        )}

        <SignButton />
      </motion.div>
    </nav>
  );
}
