import ImageWithFallback from "@/components/ImageWithFallback";
import type { ListingWithHost } from "@/lib/types/listing";

export default function ListingTitleCell({ listing }: { listing: ListingWithHost }) {
  return (
    <div className="relative flex items-center gap-3">
      {listing.images && listing.images.length > 0 && (
        <ImageWithFallback src={listing.images[0]} alt={listing.title} className="w-16 h-16 object-cover rounded-lg" height={64} width={64} />
      )}
      <div>
        <div className="font-medium text-gray-900 truncate max-w-[130px]" title={listing.title}>
          {listing.title}
        </div>
        <div className="text-xs text-gray-500">{listing.propertyType}</div>
      </div>
    </div>
  );
}
