import React from "react";

export default function Tooltip({
  text,
  arrow = true,
  textStyle,
  containerStyle,
}: {
  text: string;
  arrow?: boolean;
  textStyle?: string;
  containerStyle?: string;
}) {
  return (
    <div className={`absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 ${containerStyle}`}>
      <span className={`bg-red-500 text-white text-md px-3 py-1 rounded shadow-lg whitespace-nowrap ${textStyle}`}>{text}</span>
      {arrow && <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-500" />}
    </div>
  );
}
