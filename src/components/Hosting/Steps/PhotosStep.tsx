"use client";

import { useListingForm } from "@/store/useListingForm";
import Image from "next/image";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import PhotosUploadModal from "./components/PhotosUploadModal";
import { SortableImageGrid } from "./components/SortableImageGrid";
import Title from "./components/Title";

export default function PhotosStep() {
  const [isOpen, setIsOpen] = useState(false);
  const images = useListingForm((state) => state.images);

  return (
    <div className="flex flex-col gap-8 w-full">
      {images.length === 0 && (
        <Title className="flex flex-col gap-2">
          <h1>Add some photos of your place.</h1>
          <p className="text-lg font-medium text-gray-500">To start, you´ll need 5 photos. You can add more or make changes later.</p>
        </Title>
      )}

      {images.length !== 0 && (
        <>
          <div className="flex items-center justify-between">
            <Title className="flex flex-col">
              <h1 className="text-[22px] ">Select at least 5 photos.</h1>
              <p className="text-base font-medium text-gray-500">Drag a photo to reorder</p>
            </Title>

            <button className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200" onClick={() => setIsOpen(true)}>
              <IoMdAdd className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <SortableImageGrid setIsOpen={setIsOpen} />
        </>
      )}

      {images.length === 0 && (
        <div className="flex flex-col justify-center items-center h-[380px] border border-dashed border-gray-400 bg-[#F7F7F7] rounded-xl gap-4">
          <Image src="https://i.postimg.cc/FHQPFG3C/c83b2a87-3be4-43c9-ad47-12dd2aee24c4.avif" alt="upload icon" priority width={182} height={182} />
          <button className="py-2.5 px-4 text-sm font-medium border border-foreground rounded-lg bg-background" onClick={() => setIsOpen(true)}>
            Upload photos
          </button>
        </div>
      )}

      <PhotosUploadModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
