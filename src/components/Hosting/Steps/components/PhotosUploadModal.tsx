"use client";

import { uploadFiles } from "@/lib/uploadthing";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { PreviewImage } from "../PhotosStep";

export default function PhotosUploadModal({
  images,
  handleSetField,
  isOpen,
  onClose,
}: {
  images: string[];
  handleSetField: (field: string, value: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
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
      toast.error("Please add images first.");
      return;
    }
    try {
      setIsUploading(true);
      const filesToUpload = previews.map((img) => img.file).filter(Boolean) as File[];
      if (filesToUpload.length === 0) {
        toast.error("No files to upload.");
        return;
      }

      const response = await uploadFiles("imagesUploader", { files: filesToUpload });

      if (response) {
        const newImages = response.map((image) => image.ufsUrl);
        handleSetField("images", [...images, ...newImages]);
        setPreviews([]);
        toast.success("Upload completed!");
      }

      onClose();
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed, try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (url: string) => {
    setPreviews((prevState) => prevState.filter((prev) => prev.url !== url));
  };

  // Prevent closing when uploading
  const handleClose = () => {
    if (!isUploading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative flex flex-col bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <DialogTitle className="flex items-center justify-between w-full px-6 py-4 border-b border-myGray/20">
            <button
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
                isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-myGray/10 hover:cursor-pointer"
              }`}
              onClick={handleClose}
              disabled={isUploading}
            >
              <IoMdClose className="w-5 h-5 text-myGrayDark" />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-myGrayDark">Upload your photos</h2>
              <p className="text-sm text-myGray">{previews.length === 0 ? "No elements selected" : `${previews.length} elements selected`}</p>
            </div>
            <button
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
                isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-myGray/10 hover:cursor-pointer"
              }`}
              onClick={open}
              disabled={isUploading}
            >
              <IoMdAdd className="w-5 h-5 text-myGreenSemiBold" />
            </button>
          </DialogTitle>

          <section className={`w-full p-6 ${previews.length === 0 ? "block" : "hidden"}`}>
            <div
              {...getRootProps()}
              className={`flex flex-col justify-center items-center h-[250px] border-2 border-dashed rounded-xl gap-4 transition-all duration-200 ${
                isDragActive
                  ? "border-myGreenSemiBold bg-myGreenExtraLight/50"
                  : "border-myGray/30 bg-myGreenExtraLight/30 hover:border-myGreenSemiBold hover:bg-myGreenExtraLight/50"
              } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
            >
              <input {...getInputProps()} disabled={isUploading} />
              {isDragActive ? (
                <p className="text-myGreenSemiBold font-medium">Drop the files here...</p>
              ) : (
                <p className="text-myGray">Drag & drop your images here</p>
              )}
              <button
                className="px-6 py-3 text-sm font-medium border border-myGreenSemiBold rounded-xl bg-white text-myGreenSemiBold hover:bg-myGreenSemiBold hover:text-white transition-all duration-200 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={open}
                disabled={isUploading}
              >
                Choose Files
              </button>
            </div>
          </section>

          <div className="p-6 grid grid-cols-2 gap-4 overflow-auto flex-1">
            {previews.map((preview) => (
              <div key={preview.url} className="relative group rounded-xl overflow-hidden">
                <Image src={preview.url} alt="Preview" width={300} height={200} className="object-cover w-full h-48" />
                <button
                  onClick={() => handleRemove(preview.url)}
                  className={`absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 text-xs shadow-lg hover:bg-red-600 transition-colors duration-200 ${
                    isUploading ? "opacity-0 cursor-not-allowed" : "opacity-0 group-hover:opacity-100 hover:cursor-pointer"
                  }`}
                  disabled={isUploading}
                >
                  <FaTrashAlt className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-myGray/20 px-6 py-4 flex justify-between items-center bg-myGray/5">
            <button
              onClick={handleClose}
              className={`px-6 py-3 text-sm font-medium text-myGrayDark border border-myGray/30 rounded-xl transition-colors duration-200 ${
                isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-myGray/10 hover:cursor-pointer"
              }`}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading || previews.length === 0}
              className="flex items-center justify-center px-6 py-3 text-sm font-medium rounded-xl bg-myGreenSemiBold text-white hover:bg-myGreenBold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:cursor-pointer"
            >
              {isUploading ? (
                <>
                  <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                `Upload ${previews.length} photo${previews.length !== 1 ? "s" : ""}`
              )}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
