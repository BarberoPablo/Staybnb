import { Listing } from "@/lib/types/listing";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";

export function HostListingCard({ listing, setSelectedListing, className }: { listing: Listing; setSelectedListing: () => void; className?: string }) {
  const router = useRouter();

  const handleSelectListing = (path: string) => {
    setSelectedListing();
    router.push(`/hosting/listings/${path}/${listing.id}`);
  };

  return (
    <div className={`flex relative justify-center w-60 h-60 ${className} rounded-4xl overflow-hidden`}>
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
    </div>
  );
}
