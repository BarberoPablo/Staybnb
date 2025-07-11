"use client";

import { useEffect, useRef } from "react";

export function InputAutoWidth({
  nightPrice,
  handleOnChange,
  editable = true,
}: {
  nightPrice: number;
  handleOnChange: (number: number) => void;
  editable?: boolean;
}) {
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
    <div className={`flex justify-center items-center text-[120px] ${!editable && "hover:cursor-not-allowed"}`}>
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
        disabled={!editable}
        step={1}
        min={1}
        max={99999}
        ref={inputRef}
        className={`no-spinner font-bold text-center outline-none bg-transparent ${!editable && "hover:cursor-not-allowed"}`}
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
}
