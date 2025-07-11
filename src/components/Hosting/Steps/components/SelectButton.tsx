import React from "react";

export const SelectButton = ({
  title,
  subtitle,
  icon,
  selected,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.JSX.Element;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <button className={`flex flex-col flex-1 p-6 ${selected ? "border-2 border-foreground" : "border border-gray-300"}  rounded-xl`} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start justify-center text-left">
          <h2 className="capitalize">{title}</h2>
          <p className="text-sm text-gray-500 max-w-[400px]">{subtitle}</p>
        </div>
        <div className="">{icon}</div>
      </div>
    </button>
  );
};
