"use client";

import { useListingForm } from "@/store/useListingForm";
import Image from "next/image";
import { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { IoAddSharp } from "react-icons/io5";
import PhotosUploadModal from "./components/PhotosUploadModal";
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
        <div className="flex items-center justify-between">
          <Title className="flex flex-col">
            <h1 className="text-[22px] ">Select at least 5 photos.</h1>
            <p className="text-base font-medium text-gray-500">Drag a photo to reorder</p>
          </Title>

          <button className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200" onClick={() => setIsOpen(true)}>
            <IoMdAdd className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}

      {images.length === 0 && (
        <div className="flex flex-col justify-center items-center h-[380px] border border-dashed border-gray-400 bg-[#F7F7F7] rounded-xl gap-4">
          <Image src="https://i.postimg.cc/FHQPFG3C/c83b2a87-3be4-43c9-ad47-12dd2aee24c4.avif" alt="upload icon" width={182} height={182} />
          <button className="py-2.5 px-4 text-sm font-medium border border-foreground rounded-lg bg-background" onClick={() => setIsOpen(true)}>
            Upload photos
          </button>
        </div>
      )}

      {images.length !== 0 && (
        <div className="relative grid grid-cols-2 gap-4 w-full h-full">
          <div className="absolute top-4 left-4 z-10 px-2 py-0.5 bg-background rounded-md">
            <span className="text-sm">Cover photo</span>
          </div>
          <PreviewImage url={images[0].url} className="col-span-2 h-[300px]" />

          {images.slice(1, 5).map((image) => (
            <PreviewImage key={image.url} url={image.url} className="col-span-1 h-[200px]" />
          ))}

          {Array.from({ length: 4 - images.length }).map((_, index) => (
            <div
              key={`placeholder number ${index}`}
              role="button"
              className="flex items-center justify-center col-span-1 h-[200px] rounded-xl bg-gray-100 hover:cursor-pointer hover:border-gray-500 hover:border-2"
              onClick={() => setIsOpen(true)}
            >
              <CiImageOn className="w-8 h-8 text-gray-500" />
            </div>
          ))}

          <AddImage handleClick={() => setIsOpen(true)} />
        </div>
      )}

      <PhotosUploadModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

function PreviewImage({ url, className }: { url: string; className?: string }) {
  const images = useListingForm((state) => state.images);
  const setField = useListingForm((state) => state.setField);

  const handleRemove = (url: string) => {
    setField(
      "images",
      images.filter((image) => image.url !== url)
    );
  };
  return (
    <div className={`relative ${className} rounded-xl bg-gray-100`}>
      <Image src={url} alt="listing main image" priority fill className="object-contain" sizes="100%" />
      <button
        onClick={() => handleRemove(url)}
        className="absolute top-1 right-1 bg-foreground text-background rounded-full px-2 py-2 text-xs shadow hover:bg-gray-900"
      >
        <FaTrashAlt className="w-4 h-4" />
      </button>
    </div>
  );
}

function AddImage({ handleClick }: { handleClick: () => void }) {
  return (
    <div
      role="button"
      onClick={handleClick}
      className="flex flex-col items-center justify-center col-span-1 h-[200px] rounded-xl bg-gray-100 hover:cursor-pointer hover:border-gray-500 hover:border-2"
    >
      <IoAddSharp className="w-8 h-8 text-gray-500" />
      <p className="text-sm text-gray-500">Add more</p>
    </div>
  );
}
