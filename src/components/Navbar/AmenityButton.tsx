import { memo } from "react";
import { AmenityId } from "@/lib/constants/amenities";
import { lazy, Suspense } from "react";
import { FaSnowflake } from "react-icons/fa";

const AmenityIcon = lazy(() => import("@/components/icons/AmenityIcon"));

interface AmenityButtonProps {
  amenity: {
    id: AmenityId;
    name: string;
    icon: { name: string; library: string };
  };
  isSelected: boolean;
  onToggle: (amenityId: AmenityId) => void;
}

const AmenityButton = memo(({ amenity, isSelected, onToggle }: AmenityButtonProps) => {
  return (
    <button
      onClick={() => onToggle(amenity.id)}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left ${
        isSelected ? "border-myGreenSemiBold bg-myGreenSemiBold/5 text-myGreenSemiBold" : "border-gray-200 hover:border-gray-300 text-myGray"
      }`}
    >
      <div className={`flex-shrink-0 ${isSelected ? "text-myGreenSemiBold" : "text-gray-400"}`}>
        <Suspense fallback={<FaSnowflake className="w-5 h-5" />}>
          <AmenityIcon icon={amenity.icon} />
        </Suspense>
      </div>
      <span className="flex-1 font-medium">{amenity.name}</span>
      {isSelected && (
        <div className="flex-shrink-0 w-5 h-5 bg-myGreenSemiBold rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}
    </button>
  );
});

AmenityButton.displayName = "AmenityButton";

export default AmenityButton;
