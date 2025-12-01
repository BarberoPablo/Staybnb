import ImageWithFallback from "@/components/ImageWithFallback";
import type { ListingWithHost } from "@/lib/types/listing";
import { FaUserCircle } from "react-icons/fa";

export default function HostCell({ host }: { host: ListingWithHost["host"] }) {
  return (
    <div className="relative flex items-center gap-2">
      {host.avatarUrl ? (
        <ImageWithFallback
          src={host.avatarUrl}
          alt={`${host.firstName} ${host.lastName}`}
          className="w-8 h-8 rounded-full object-cover"
          height={64}
          width={64}
          fallbackIcon={<FaUserCircle className="w-8 h-8 text-myGrayDark" />}
        />
      ) : (
        <FaUserCircle className="w-8 h-8 text-myGrayDark" />
      )}

      <div>
        <div className="text-gray-900">
          {host.firstName} {host.lastName}
        </div>
        {host.email && <div className="text-xs text-gray-500">{host.email}</div>}
      </div>
    </div>
  );
}
