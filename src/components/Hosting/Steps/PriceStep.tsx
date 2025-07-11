"use client";

import { useListingForm } from "@/store/useListingForm";
import { InputAutoWidth } from "./components/InputAutoWidth";
import Title from "./components/Title";

export default function PriceStep() {
  const nightPrice = useListingForm((state) => state.nightPrice);
  const setField = useListingForm((state) => state.setField);

  const handleOnChange = (number: number) => {
    setField("nightPrice", number);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <Title className="flex flex-col gap-2">
        Now, set a weekday base price
        <p className="text-lg font-medium text-gray-500">You can change it anytime later.</p>
      </Title>
      <div className="flex justify-center items-center">
        <InputAutoWidth nightPrice={nightPrice} handleOnChange={handleOnChange} />
      </div>
    </div>
  );
}
