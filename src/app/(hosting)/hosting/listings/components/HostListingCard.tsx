import { Listing } from "@/lib/types/listing";
import { motion } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";

export function HostListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  const params = useParams();
  const listingId = Number(params.id);

  const handleSelectListing = (path: string) => {
    router.push(`/hosting/listings/${path}/${listing.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className={`flex relative justify-center w-60 h-60 rounded-4xl overflow-hidden ${listingId === listing.id ? "border-2" : ""}`}
    >
      <Image src={listing.images[0]} alt="listing main image" priority fill className="object-cover" sizes="100%" />
      <div className="absolute flex flex-col gap-2 top-2 right-2">
        <button
          className={`p-1 border-2 border-foreground rounded-full backdrop-blur-xs text-foreground hover:cursor-pointer opacity-70 hover:opacity-100`}
          onClick={() => handleSelectListing("edit")}
        >
          <MdOutlineEdit className="w-6 h-6" />
        </button>
        <button
          className={`p-1 border-2 border-foreground rounded-full backdrop-blur-xs text-foreground hover:cursor-pointer opacity-70 hover:opacity-100`}
          onClick={() => handleSelectListing("reservations")}
        >
          <FaRegCalendarAlt className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
}
