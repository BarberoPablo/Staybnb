"use client";

import { uploadFiles } from "@/lib/uploadthing";
import { useListingForm } from "@/store/useListingForm";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { PreviewImage } from "../PhotosStep";

export default function PhotosUploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const setField = useListingForm((state) => state.setField);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews = acceptedFiles.slice(0, 5 - previews.length).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setPreviews((prev) => [...prev, ...newPreviews]);
    },
    [previews]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: { "image/*": [] },
  });

  const handleUpload = async () => {
    if (previews.length === 0) {
      alert("Please add images first.");
      return;
    }
    try {
      setIsUploading(true);
      const filesToUpload = previews.map((img) => img.file).filter(Boolean) as File[];
      if (filesToUpload.length === 0) {
        alert("No files to upload.");
        return;
      }

      const response = await uploadFiles("imagesUploader", { files: filesToUpload });

      if (response) {
        const newImages = response.map((image) => image.ufsUrl);
        setField("images", newImages);
        setPreviews([]);
        alert("Upload completed!");
      }

      onClose();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed, try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (url: string) => {
    setPreviews((prevState) => prevState.filter((prev) => prev.url !== url));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel className="relative flex flex-col items-center text-center bg-white rounded-4xl sm:py-4 max-w-sm md:max-w-xl w-full max-h-[527px]">
          <DialogTitle className="flex items-center justify-between w-full px-4">
            <button className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100" onClick={open}>
              <IoMdClose className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h2 className="text-base font-bold">Upload your photos</h2>
              <h3 className="text-xs text-gray-500">{previews.length === 0 ? "No elements selected" : `${previews.length} elements selected`}</h3>
            </div>
            <button className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100" onClick={open}>
              <IoMdAdd className="w-5 h-5 text-gray-700" />
            </button>
          </DialogTitle>

          <section className={`w-full p-6 ${previews.length === 0 ? "block" : "hidden"}`}>
            <div
              {...getRootProps()}
              className={`flex flex-col justify-center items-center h-[250px] border border-dashed border-gray-400 bg-[#F7F7F7] rounded-xl gap-4 transition-all ${
                isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? <p className="text-gray-500">Drop the files here...</p> : <p className="text-gray-500">Drag & drop</p>}
              <button className="py-2.5 px-4 text-sm font-medium border border-foreground rounded-lg bg-background" onClick={open}>
                Search
              </button>
            </div>
          </section>

          <div className="p-6 grid grid-cols-2 gap-4 overflow-auto">
            {previews.map((preview) => (
              <div key={preview.url} className="relative rounded">
                <Image src={preview.url} alt="Preview" width={300} height={200} className="object-cover w-full h-48 rounded" />
                <button
                  onClick={() => handleRemove(preview.url)}
                  className="absolute top-1 right-1 bg-foreground text-background rounded-full px-2 py-2 text-xs shadow hover:bg-gray-900"
                >
                  <FaTrashAlt className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <hr className="text-gray-300 w-full" />

          <footer className="sticky bottom-0 left-0 mb-2.5 mt-4 px-6 flex justify-between w-full text-base font-medium bg-background ">
            <button onClick={onClose} className="px-4 py-2 rounded-md hover:bg-gray-100">
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-6 py-2 h-12 w-28 rounded-md bg-foreground text-white opacity-90 hover:opacity-100 disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </footer>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
