"use client";

import { basicButton } from "@/lib/styles";

export function GoBackButton() {
  return (
    <button
      className={`${basicButton} text-myGrayDark bg-myGreen hover:text-myGray hover:bg-myGreen  p-2 text-xl rounded-xl`}
      onClick={() => history.back()}
    >
      Go back
    </button>
  );
}
