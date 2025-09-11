"use client";

import { UploadPhotos } from "@/components/Hosting/Steps/PhotosStep";
import { Controller, useFormContext } from "react-hook-form";
import { FaImages } from "react-icons/fa";

export default function ImagesSection() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-myGrayDark">
        <div className="w-8 h-8 bg-myGreenExtraLight rounded-full flex items-center justify-center">
          <FaImages className="w-4 h-4 text-myGreenSemiBold" />
        </div>
        Images
      </h3>
      <Controller
        control={control}
        name="images"
        render={({ field }) => (
          <UploadPhotos
            images={field.value || []}
            handleSetField={(_, value) => {
              field.onChange(value);
            }}
          />
        )}
      />
    </div>
  );
}
