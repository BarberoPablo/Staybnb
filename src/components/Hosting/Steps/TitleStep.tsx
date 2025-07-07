"use client";

import React from "react";
import Title from "./components/Title";
import { useListingForm } from "@/store/useListingForm";

const maxLength = 32;

export default function TitleStep() {
  const title = useListingForm((state) => state.title);
  const setField = useListingForm((state) => state.setField);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setField("title", e.target.value);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <Title className="flex flex-col gap-2">
        Now, let´s give your house a title
        <p className="text-[18px] font-medium text-gray-500">Short titles work best. Have fun with it, you can always change it later.</p>
      </Title>

      <div className="">
        <label htmlFor="title" className="sr-only">
          Title of your listing
        </label>
        <textarea
          id="title"
          name="title"
          className="w-full min-h-40 text-2xl p-6 rounded-lg border border-gray-500"
          placeholder="Charming cabin with a mountain view"
          maxLength={maxLength}
          onChange={handleOnChange}
          value={title}
        />
        <span className="text-sm font-bold text-gray-500">
          {title.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}
