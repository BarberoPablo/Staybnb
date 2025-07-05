"use client";

import Title from "./components/Title";
import dynamic from "next/dynamic";

const MapLocationNoSSR = dynamic(() => import("./components/MapLocation"), { ssr: false });

export default function LocationStep() {
  return (
    <div>
      <Title>
        <h1>Where´s your place located?</h1>
      </Title>
      <MapLocationNoSSR />
    </div>
  );
}
