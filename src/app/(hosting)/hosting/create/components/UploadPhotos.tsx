"use client";

import Image from "next/image";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import PhotosUploadModal from "./PhotosUploadModal";
import { SortableImageGrid } from "./SortableImageGrid";

export type PreviewImage = {
  file: File | null;
  url: string;
};

export function UploadPhotos({ images, handleSetField }: { images: string[]; handleSetField: (field: string, value: string[]) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full">
      {images.length !== 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-myGrayDark">Upload at least 3 photos</h2>
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
          <Image src="https://j1l1utk0xl.ufs.sh/f/8xgIemAiVMedBPus5j8iugbL1RUJaXQCp9yjPztFcZs3mIG2" alt="upload icon" priority width={182} height={182} />
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
