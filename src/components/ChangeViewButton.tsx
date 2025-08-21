"use client";

import { MenuItem } from "@headlessui/react";
import { usePathname, useRouter } from "next/navigation";
import { FaHotel } from "react-icons/fa";
import { MdOutlineTravelExplore } from "react-icons/md";

export default function ChangeViewButton({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const mode = pathname.includes("hosting") ? "hosting" : "traveling";

  const handleChangeMode = () => {
    if (mode === "hosting") {
      router.push("/");
    } else {
      router.push("/hosting");
    }
  };

  if (isMobile) {
    return (
      <MenuItem>
        <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-myGreen/70" onClick={handleChangeMode}>
          {mode === "hosting" ? (
            <>
              <MdOutlineTravelExplore className="size-4 fill-GrayDark" />
              Switch to Traveling
            </>
          ) : (
            <>
              <FaHotel className="size-4 fill-GrayDark" />
              Switch to Hosting
            </>
          )}
        </button>
      </MenuItem>
    );
  }

  return (
    <button
      className="px-4 py-2 text-sm font-medium text-myGrayDark bg-myGreenExtraLight hover:bg-myGreen rounded-lg transition-colors"
      onClick={handleChangeMode}
    >
      Switch to {mode === "hosting" ? "traveling" : "hosting"}
    </button>
  );
}
