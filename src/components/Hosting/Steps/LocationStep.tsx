"use client";

import { Location } from "@/lib/types/listing";
import { useListingForm } from "@/store/useListingForm";
import dynamic from "next/dynamic";
import Title from "./components/Title";

const MapLocationNoSSR = dynamic(() => import("./components/MapLocation"), { ssr: false });

export default function LocationStep() {
  const lat = useListingForm((store) => store.location.lat);
  const lng = useListingForm((store) => store.location.lng);
  const formattedLocation = useListingForm((store) => store.location.formatted);
  const setField = useListingForm((store) => store.setField);

  const handleChangeLocation = (address: Location) => {
    setField("location", address);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <Title>
        <h1>Where´s your place located?</h1>
      </Title>
      <MapLocationNoSSR lat={lat} lng={lng} formattedLocation={formattedLocation} handleChangeLocation={handleChangeLocation} />
    </div>
  );
}
