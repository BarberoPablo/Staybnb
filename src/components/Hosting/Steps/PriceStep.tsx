"use client";

import React, { useEffect } from "react";
import Title from "./components/Title";
import { useListingForm } from "@/store/useListingForm";
import { useRef } from "react";

export default function PriceStep() {
  const nightPrice = useListingForm((state) => state.nightPrice);
  const setField = useListingForm((state) => state.setField);
  console.log({ nightPrice });
  const handleOnChange = (number: number) => {
    setField("nightPrice", number);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <Title className="flex flex-col gap-2">
        Now, set a weekday base price
        <p className="text-lg font-medium text-gray-500">You can change it anytime later.</p>
        {/* <p className="text-lg font-medium text-gray-500">Tip: $32. You’ll set a weekend price next.</p> */}
      </Title>
      <div className="flex justify-center items-center">
        <InputAutoWidth nightPrice={nightPrice} handleOnChange={handleOnChange} />
      </div>
    </div>
  );
}

const InputAutoWidth = ({ nightPrice, handleOnChange }: { nightPrice: number; handleOnChange: (number: number) => void }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Adjusts the width of the input when the value changes
  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      inputRef.current.style.width = `${spanRef.current.offsetWidth}px`;
    }
  }, [nightPrice]);

  const validateInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") return;
    const numberValue = Number(value);
    if (numberValue < 1 || !Number.isInteger(numberValue)) return;

    handleOnChange(numberValue);
  };

  return (
    <div className="flex justify-center items-center text-[120px]">
      <span className="font-bold text-center" onClick={() => inputRef.current?.focus()}>
        $
      </span>
      <label htmlFor="nightPrice" className="sr-only">
        Night price of your listing
      </label>
      <input
        id="nightPrice"
        name="nightPrice"
        type="number"
        step={1}
        min={1}
        max={99999}
        ref={inputRef}
        className="no-spinner font-bold text-center outline-none bg-transparent"
        onChange={validateInput}
        value={nightPrice}
        onKeyDown={(e) => {
          if (e.key === "-" || e.key === "e" || e.key === "," || e.key === ".") {
            e.preventDefault();
          }
        }}
        style={{ transition: "width 1s ease" }}
      />
      {/* Hidden span to measure the width */}
      <span
        ref={spanRef}
        className="font-bold text-center absolute opacity-0 pointer-events-none"
        style={{ position: "absolute", visibility: "hidden", whiteSpace: "pre" }}
        aria-hidden="true"
      >
        {nightPrice || "0"}
      </span>
    </div>
  );
};
