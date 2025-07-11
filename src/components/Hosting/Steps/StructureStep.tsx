"use client";

import { Structure } from "@/lib/types/listing";
import { ListingForm, useListingForm } from "@/store/useListingForm";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import Title from "./components/Title";

const structures: (keyof Structure)[] = ["guests", "bedrooms", "beds", "bathrooms"];
const MAX_QUANTITY = 20;

export default function StructureStep() {
  const structure = useListingForm((state) => state.structure);
  const setField = useListingForm((state) => state.setField);

  const handleClick = (key: keyof Structure, value: ListingForm[keyof ListingForm]) => {
    setField("structure", {
      ...structure,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <Title className="flex flex-col gap-2">
        <h1>Share some basics about your place</h1>
        <p className="text-lg font-medium text-gray-500">You´ll add more details later, like bed types..</p>
      </Title>

      <div>
        {structures.map((structureItem) => (
          <div key={structureItem}>
            <QuantitySelector text={structureItem} quantity={structure[structureItem]} onClick={handleClick} />
            <hr className="my-6 text-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

function QuantitySelector({
  text,
  quantity,
  onClick,
}: {
  text: keyof Structure;
  quantity: number;
  onClick: (key: keyof Structure, value: ListingForm[keyof ListingForm]) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-lg">
      <h3 className="capitalize">{text}</h3>
      <div className="flex items-center justify-center gap-4">
        <button
          className="h-9 w-9 text-[#B0B0B0] cursor-pointer hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed"
          disabled={quantity <= 0}
          style={{ backgroundColor: "transparent" }}
          onClick={() => onClick(text, quantity - 1)}
        >
          <CiCircleMinus className="h-full w-full" />
        </button>
        <span>{quantity}</span>
        <button
          className="h-9 w-9 text-[#B0B0B0] cursor-pointer hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed"
          disabled={quantity >= MAX_QUANTITY}
          style={{ backgroundColor: "transparent" }}
          onClick={() => onClick(text, quantity + 1)}
        >
          <CiCirclePlus className="h-full w-full" />
        </button>
      </div>
    </div>
  );
}
