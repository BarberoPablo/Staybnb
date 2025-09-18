"use client";

import { createDraftListing } from "@/lib/api/server/api";
import { DraftListing } from "@/lib/types/draftListing";
import { hostingSteps } from "@/lib/types/hostingSteps";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaDollarSign, FaHome, FaMapMarkerAlt, FaPlus } from "react-icons/fa";

export default function CreateListingsMenu({ draftListings }: { draftListings: DraftListing[] }) {
  const router = useRouter();

  const handleCreateNewListing = async () => {
    try {
      const { success, id } = await createDraftListing();
      if (success) {
        router.push(`/hosting/create/listing/${id}/${hostingSteps[0]}`);
      } else {
        toast.error("Failed to create a new draft listing.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-myGrayDark mb-4">Create Your Listing</h1>
            <p className="text-lg text-myGray max-w-2xl mx-auto">
              Start hosting and share your space with travelers from around the world. Create a new listing or continue working on your drafts.
            </p>
          </div>
        </motion.div>

        {/* Create New Listing Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-12">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleCreateNewListing}
              className="group bg-myGreenSemiBold hover:bg-myGreenBold text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 text-lg font-semibold hover:cursor-pointer"
            >
              <FaPlus className="text-xl group-hover:rotate-90 transition-transform duration-300" />
              Create New Listing
            </button>
          </div>
        </motion.div>

        {/* Draft Listings Section */}
        {draftListings.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-myGrayDark mb-2">Continue Your Drafts</h2>
              <p className="text-myGray">Complete your listings to start hosting</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftListings.map((draft, i) => (
                <DraftListingCard key={draft.id} draft={draft} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {draftListings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-myGreenExtraLight rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHome className="text-2xl text-myGreenSemiBold" />
              </div>
              <h3 className="text-xl font-semibold text-myGrayDark mb-3">No Draft Listings Yet</h3>
              <p className="text-myGray mb-6">Start creating your first listing to begin your hosting journey.</p>
              <button
                onClick={handleCreateNewListing}
                className="bg-myGreenSemiBold hover:bg-myGreenBold text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 hover:cursor-pointer"
              >
                Create Your First Listing
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function DraftListingCard({ draft, index }: { draft: DraftListing; index: number }) {
  const router = useRouter();

  const totalSteps = hostingSteps.length;
  const currentStep = draft.currentStep || 0;
  const progress = Math.round((currentStep / totalSteps) * 100);

  // Formatea el nombre del step (camelCase → con espacio)
  const currentStepName = hostingSteps[currentStep]?.replace(/([a-z])([A-Z])/g, "$1 $2") || "Complete";

  const handleContinue = () => {
    const stepKey = hostingSteps[currentStep];
    router.push(`/hosting/create/listing/${draft.id}/${stepKey}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 5) * 0.1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative h-48 bg-gradient-to-br from-myGreenExtraLight to-myGreenLight">
        {draft.images && draft.images.length > 0 ? (
          <Image
            src={draft.images[0]}
            alt={draft.title || "Draft listing"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FaHome className="text-4xl text-myGray mx-auto mb-2" />
              <p className="text-sm text-myGray">No image yet</p>
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="text-sm font-semibold text-myGrayDark">{progress}%</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-myGrayDark mb-1">{draft.title || "Untitled Listing"}</h3>
          <div className="flex items-center gap-2 text-sm text-myGray">
            <FaMapMarkerAlt className="text-xs" />
            <span>{draft.location?.city && draft.location?.state ? `${draft.location.city}, ${draft.location.state}` : "Location not set"}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {draft.propertyType && (
            <div className="flex items-center gap-2 text-sm text-myGray">
              <FaHome className="text-xs" />
              <span className="capitalize">{draft.propertyType}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-myGray">
            <FaDollarSign className="text-xs" />
            <span>${draft.nightPrice ?? "0"}/night</span>
          </div>

          {draft.structure && (
            <div className="flex items-center gap-2 text-sm text-myGray">
              <FaCalendarAlt className="text-xs" />
              <span>
                {draft.structure.guests} guest{draft.structure.guests !== 1 ? "s" : ""} • {draft.structure.bedrooms} bedroom
                {draft.structure.bedrooms !== 1 ? "s" : ""} • {draft.structure.bathrooms} bathroom{draft.structure.bathrooms !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-myGrayDark">Last step checked</span>
            <span className="text-sm text-myGray capitalize">{currentStepName}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-myGreenSemiBold to-myGreenBold h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-myGreenSemiBold hover:bg-myGreenBold text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 group-hover:shadow-md hover:cursor-pointer"
        >
          {progress === 100 ? "Review & Publish" : "Continue Setup"}
        </button>
      </div>
    </motion.div>
  );
}
