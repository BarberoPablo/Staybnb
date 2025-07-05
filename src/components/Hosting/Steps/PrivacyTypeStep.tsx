"use client";

import React from "react";
import Title from "./components/Title";
import { PrivacyType, useListingForm } from "@/store/useListingForm";
import { PiDoorOpenLight, PiHouseLineLight } from "react-icons/pi";
import { FaPeopleRoof } from "react-icons/fa6";

type Privacy = { type: PrivacyType; title: string; subtitle: string; icon: React.JSX.Element };

const privacyTypes: Privacy[] = [
  { type: "entire", title: "An entire place", subtitle: "Guests have the whole place to themselves.", icon: <PiHouseLineLight /> },
  { type: "private", title: "A room", subtitle: "Guests have their own room in a home, plus access to shared spaces.", icon: <PiDoorOpenLight /> },
  {
    type: "shared",
    title: "A shared room in a hostel",
    subtitle: "Guests sleep in a shared room in a professionally managed hostel with staff onsite 24/7.",
    icon: <FaPeopleRoof />,
  },
];

export default function PrivacyTypeStep() {
  const selected = useListingForm((state) => state.privacyType);
  const setField = useListingForm((state) => state.setField);

  const handleSelectPrivacy = (privacy: PrivacyType) => {
    setField("privacyType", privacy);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <Title>
        <h1>What type of place will guests have?</h1>
      </Title>
      <div className="flex flex-col gap-3">
        {privacyTypes.map((privacy) => (
          <PrivacyTypeButton key={privacy.type} privacy={privacy} selected={selected === privacy.type} onClick={handleSelectPrivacy} />
        ))}
      </div>
    </div>
  );
}

const PrivacyTypeButton = ({ privacy, selected, onClick }: { privacy: Privacy; selected: boolean; onClick: (privacy: PrivacyType) => void }) => {
  return (
    <button
      className={`flex flex-col flex-1 p-6 ${selected ? "border-2 border-foreground" : "border border-gray-300"}  rounded-xl`}
      onClick={() => onClick(privacy.type)}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start justify-center text-left">
          <h2 className="">{privacy.title}</h2>
          <p className="text-sm text-gray-500 max-w-[400px]">{privacy.subtitle}</p>
        </div>
        <div className="w-11 h-11 text-4xl font-medium">{privacy.icon}</div>
      </div>
    </button>
  );
};
