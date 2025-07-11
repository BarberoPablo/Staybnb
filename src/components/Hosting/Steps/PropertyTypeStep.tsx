"use client";

import { PropertyType } from "@/lib/types/listing";
import { useListingForm } from "@/store/useListingForm";
import { MdCabin } from "react-icons/md";
import { PiBuildingApartmentLight, PiHouseLineLight, PiSailboatLight } from "react-icons/pi";
import Title from "./components/Title";

const propertyTypes: { icon: React.JSX.Element; name: PropertyType }[] = [
  { icon: <PiHouseLineLight />, name: "House" },
  { icon: <PiBuildingApartmentLight />, name: "Apartment" },
  { icon: <PiSailboatLight />, name: "Boat" },
  { icon: <MdCabin />, name: "Cabin" },
];

export default function PropertyTypeStep() {
  const selected = useListingForm((state) => state.propertyType);
  const setField = useListingForm((state) => state.setField);

  const handleSelectStructure = (propertyType: PropertyType) => {
    setField("propertyType", propertyType);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <Title>Which of these best describes your place?</Title>
      <div className="grid grid-cols-3 gap-4 w-full">
        {propertyTypes.map((property) => (
          <button
            key={property.name}
            className={`flex flex-col items-start justify-center p-4 h-24 ${
              selected === property.name ? "border-2 border-foreground" : "border border-gray-300"
            }  rounded-lg`}
            onClick={() => handleSelectStructure(property.name)}
          >
            <div className="w-11 h-11 text-4xl font-medium">{property.icon}</div>
            <p className="text-sm font-medium">{property.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
