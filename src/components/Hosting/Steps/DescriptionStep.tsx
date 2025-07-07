"use client";

import React from "react";
import Title from "./components/Title";
import { useListingForm } from "@/store/useListingForm";

const maxLength = 500;

export default function DescriptionStep() {
  const description = useListingForm((state) => state.description);
  const setField = useListingForm((state) => state.setField);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setField("description", e.target.value);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <Title className="flex flex-col gap-2">
        Create your description
        <p className="text-lg font-medium text-gray-500">Share what makes your place special.</p>
      </Title>

      <div className="">
        <label htmlFor="description" className="sr-only">
          Description of your listing
        </label>
        <textarea
          id="description"
          name="description"
          className="w-full min-h-40 text-lg p-6 rounded-lg border border-gray-500"
          placeholder="Spacious loft in the heart of the city..."
          maxLength={maxLength}
          onChange={handleOnChange}
          value={description}
        />
        <span className="text-sm font-bold text-gray-500">
          {description.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}
