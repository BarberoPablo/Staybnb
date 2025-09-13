"use client";

import { ListingForm, useListingForm } from "@/store/useListingForm";
import Image from "next/image";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import PhotosUploadModal from "./components/PhotosUploadModal";
import { SortableImageGrid } from "./components/SortableImageGrid";
import Title from "./components/Title";

export type PreviewImage = {
  file: File | null;
  url: string;
};

export default function PhotosStep() {
  const images = useListingForm((state) => state.images);
  const setField = useListingForm((state) => state.setField);

  const handleSetField = (field: string, value: string[]) => {
    setField(field as keyof ListingForm, value);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {images.length === 0 && (
        <Title className="flex flex-col gap-2">
          <h1>Add some photos of your place.</h1>
          <p className="text-lg font-medium text-myGray">To start, you´ll need 5 photos. You can add more or make changes later.</p>
        </Title>
      )}

      <UploadPhotos images={images} handleSetField={handleSetField} />
    </div>
  );
}

export function UploadPhotos({ images, handleSetField }: { images: string[]; handleSetField: (field: string, value: string[]) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full">
      {images.length !== 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-myGrayDark">Upload at least 5 photos</h2>
              <p className="text-sm text-myGray">Drag a photo to reorder</p>
            </div>

            <button
              type="button"
              className="flex items-center justify-center w-11 h-11 rounded-full bg-myGreenExtraLight hover:bg-myGreen/20 transition-colors duration-200 hover:cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <IoMdAdd className="w-5 h-5 text-myGreenSemiBold" />
            </button>
          </div>

          <SortableImageGrid images={images} setField={handleSetField} setIsOpen={setIsOpen} />
        </>
      )}

      {images.length === 0 && (
        <div className="flex flex-col justify-center items-center h-[380px] border-2 border-dashed border-myGray/30 bg-myGreenExtraLight/30 rounded-xl gap-4">
          <Image src="https://i.postimg.cc/FHQPFG3C/c83b2a87-3be4-43c9-ad47-12dd2aee24c4.avif" alt="upload icon" priority width={182} height={182} />
          <button
            type="button"
            className="px-6 py-3 text-sm font-medium border border-myGreenSemiBold rounded-xl bg-white text-myGreenSemiBold hover:bg-myGreenSemiBold hover:text-white transition-all duration-200 hover:cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            Upload photos
          </button>
        </div>
      )}

      <PhotosUploadModal images={images} handleSetField={handleSetField} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
