"use client";

import { PrivacyType } from "@/lib/types/listing";
import { useListingForm } from "@/store/useListingForm";
import React from "react";
import { FaPeopleRoof } from "react-icons/fa6";
import { PiDoorOpenLight, PiHouseLineLight } from "react-icons/pi";
import { SelectButton } from "./components/SelectButton";
import Title from "./components/Title";

type Privacy = { type: PrivacyType; title: string; subtitle: string; icon: React.JSX.Element };

const privacyTypes: Privacy[] = [
  {
    type: "Entire",
    title: "An entire place",
    subtitle: "Guests have the whole place to themselves.",
    icon: <PiHouseLineLight className="w-11 h-11 text-4xl font-medium" />,
  },
  {
    type: "Private",
    title: "A room",
    subtitle: "Guests have their own room in a home, plus access to shared spaces.",
    icon: <PiDoorOpenLight className="w-11 h-11 text-4xl font-medium" />,
  },
  {
    type: "Shared",
    title: "A shared room in a hostel",
    subtitle: "Guests sleep in a shared room in a professionally managed hostel with staff onsite 24/7.",
    icon: <FaPeopleRoof className="w-11 h-11 text-4xl font-medium" />,
  },
];

export default function PrivacyTypeStep() {
  const selected = useListingForm((state) => state.privacyType);
  const setField = useListingForm((state) => state.setField);

  const handleSelectPrivacy = (privacy: string) => {
    setField("privacyType", privacy as PrivacyType);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <Title>
        <h1>What type of place will guests have?</h1>
      </Title>
      <div className="flex flex-col gap-3">
        {privacyTypes.map((privacy) => (
          <SelectButton
            key={privacy.type}
            title={privacy.type}
            subtitle={privacy.subtitle}
            icon={privacy.icon}
            selected={selected === privacy.type}
            onClick={() => handleSelectPrivacy(privacy.type)}
          />
        ))}
      </div>
    </div>
  );
}
