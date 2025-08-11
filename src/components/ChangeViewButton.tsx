"use client";

import { usePathname, useRouter } from "next/navigation";

export default function ChangeViewButton() {
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
  return (
    <button
      className="px-4 py-2 text-sm font-medium text-myGrayDark bg-myGreenLight hover:bg-myGreen rounded-lg transition-colors"
      onClick={handleChangeMode}
    >
      Switch to {mode === "hosting" ? "traveling" : "hosting"}
    </button>
  );
}
