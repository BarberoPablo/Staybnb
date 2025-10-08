import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { ListingsMapProps } from "./ListingsMap";

const ListingsMapNoSSR = dynamic(() => import("./ListingsMap"), { ssr: false });

type DialogMapProps = ListingsMapProps & {
  open: boolean;
  onClose: () => void;
};

export default function DialogMap({ open, onClose, listings, locateListing, cityCenter, setListings, searchTriggered, onSearchComplete }: DialogMapProps) {
  const [mapKey, setMapKey] = useState(0);
  const [shouldRenderMap, setShouldRenderMap] = useState(false);

  // Force re-mount of the map component when dialog opens
  useEffect(() => {
    if (open) {
      // Delay rendering to ensure the dialog is fully mounted
      const timer = setTimeout(() => {
        setShouldRenderMap(true);
        setMapKey((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShouldRenderMap(false);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <Dialog static open={open} onClose={onClose} className="relative z-50">
          {/* Animated Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Dialog container */}
          <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
            <DialogPanel className="w-full max-w-[95vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl h-[95vh] sm:h-[90vh]">
              <motion.div
                aria-modal="true"
                role="dialog"
                aria-labelledby="map-with-listings"
                aria-describedby="dialog-description"
                className="flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full h-full overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4 bg-gradient-to-r from-myGreen/10 to-myGreenLight/10 border-b border-gray-200">
                  <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                    <DialogTitle
                      id="map-with-listings"
                      className="text-sm sm:text-base md:text-lg font-bold text-myGrayDark leading-tight truncate sm:whitespace-normal"
                    >
                      Explore Listings Map
                    </DialogTitle>
                    <span className="hidden xs:inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-myGreen text-myGrayDark">
                      {listings.length}
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 bg-white hover:bg-gray-100 active:bg-gray-200 rounded-full flex items-center justify-center text-myGray hover:text-myGrayDark transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                    aria-label="Close map dialog"
                  >
                    <IoClose className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Hidden description for screen readers */}
                <p id="dialog-description" className="sr-only">
                  Interactive map displaying {listings.length} listing{listings.length !== 1 ? "s" : ""}. Pan and zoom to explore different areas and click
                  on price markers to view listing details.
                </p>

                {/* Map container */}
                <div className="flex-1 w-full bg-gradient-to-br from-gray-50 to-white overflow-hidden relative">
                  {shouldRenderMap ? (
                    <ListingsMapNoSSR
                      key={mapKey}
                      listings={listings}
                      locateListing={locateListing}
                      setListings={setListings}
                      cityCenter={cityCenter}
                      searchTriggered={searchTriggered}
                      onSearchComplete={onSearchComplete}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-myGreen border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-myGray">Loading map...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer info bar (optional, for better UX) */}
                <div className="px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 border-t border-gray-200 flex items-center justify-center gap-2 text-xs sm:text-sm text-myGray">
                  <span className="font-medium">💡 Tip:</span>
                  <span className="hidden xs:inline">Pan and zoom to update results</span>
                  <span className="xs:hidden">Move map to update</span>
                </div>
              </motion.div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
