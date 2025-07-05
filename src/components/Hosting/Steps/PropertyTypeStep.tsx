"use client";

import { PropertyType, useListingForm } from "@/store/useListingForm";
import { MdCabin } from "react-icons/md";
import { PiBuildingApartmentLight, PiHouseLineLight, PiSailboatLight } from "react-icons/pi";

const propertyTypes: { image: React.JSX.Element; name: PropertyType }[] = [
  { image: <PiHouseLineLight />, name: "House" },
  { image: <PiBuildingApartmentLight />, name: "Apartment" },
  { image: <PiSailboatLight />, name: "Boat" },
  { image: <MdCabin />, name: "Cabin" },
];

export default function PropertyTypeStep() {
  // Specifying each prop to prevent re-renders
  const selected = useListingForm((state) => state.propertyType);
  const setField = useListingForm((state) => state.setField);

  const handleSelectStructure = (propertyType: PropertyType) => {
    setField("propertyType", propertyType);
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Which of these best describes your place?</h1>
      <div className="grid grid-cols-3 gap-4 w-full">
        {propertyTypes.map((property) => (
          <button
            key={property.name}
            className={`flex flex-col items-start justify-center p-4 h-24 ${
              selected === property.name ? "border-2 border-foreground" : "border border-gray-300"
            }  rounded-lg`}
            onClick={() => handleSelectStructure(property.name)}
          >
            <div className="w-11 h-11 text-4xl font-medium">{property.image}</div>
            <p className="text-sm font-medium">{property.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
