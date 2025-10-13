"use client";

import { editListing } from "@/lib/api/server/endpoints/listings";
import { editListingSchema } from "@/lib/schemas/editListingSchema";
import { EditListing, Listing } from "@/lib/types/listing";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import AmenitiesSection from "./AmenitiesSection";
import BasicInfoSection from "./BasicInfoSection";
import GuestLimitsSection from "./GuestLimitsSection";
import ImagesSection from "./ImagesSection";
import LocationSection from "./LocationSection";
import PromotionsSection from "./PromotionsSection";
import StructureSection from "./StructureSection";

const sections = [
  <BasicInfoSection key="basic-info" />,
  <StructureSection key="structure" />,
  <GuestLimitsSection key="guest-limits" />,
  <LocationSection key="location" />,
  <ImagesSection key="images" />,
  <PromotionsSection key="promotions" />,
  <AmenitiesSection key="amenities" />,
];

export default function EditListingForm({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const methods = useForm<EditListing>({
    mode: "onChange",
    resolver: zodResolver(editListingSchema),
    shouldUnregister: false,
    defaultValues: {
      title: listing.title,
      description: listing.description,
      nightPrice: listing.nightPrice,
      propertyType: listing.propertyType,
      privacyType: listing.privacyType,
      checkInTime: listing.checkInTime,
      checkOutTime: listing.checkOutTime,
      minCancelDays: listing.minCancelDays,
      promotions: listing.promotions,
      images: listing.images,
      structure: listing.structure,
      guestLimits: listing.guestLimits,
      location: listing.location,
      amenities: listing.amenities,
    },
  });

  const {
    handleSubmit,
    setFocus,
    formState: { errors, isValid },
  } = methods;

  // Prevent Enter key from triggering form submission
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onSubmit = async (data: EditListing) => {
    if (!isValid) {
      const firstErrorField = Object.keys(errors)[0] as keyof EditListing;
      setFocus(firstErrorField);
      return;
    }

    setSaving(true);
    try {
      await editListing(listing.id, data);
      toast.success("Listing updated successfully!");
      setTimeout(() => {
        router.push("/hosting/listings");
      }, 2000);
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    router.push("/hosting/listings");
  };

  return (
    <div className="w-full p-2 sm:px-12 py-10 ">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-8">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-gray-200 hover:bg-myGray/5 transition-all duration-200 hover:cursor-pointer"
        >
          <FaArrowLeft className="w-4 h-4 text-myGrayDark" />
          <span className="text-myGrayDark font-medium">Back to Listings</span>
        </button>

        <div className="text-center mt-8 sm:mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">Edit Listing</h1>
          <p className="text-lg text-myGray max-w-2xl mx-auto">Update your listing information and settings</p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-8 shadow-lg border border-gray-200">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {sections.map((section, index) => (
                <div key={index}>
                  {section}
                  {index < sections.length - 1 && <div className="mt-8 border-t border-gray-200" />}
                </div>
              ))}

              <div className="mt-8 flex justify-center md:justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center w-50 gap-2 px-8 py-4 rounded-xl bg-myGreenSemiBold text-white font-semibold hover:bg-myGreenBold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </motion.div>
    </div>
  );
}
