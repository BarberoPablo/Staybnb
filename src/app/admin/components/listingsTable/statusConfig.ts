import { ListingStatus } from "@/lib/types/listing";

export const STATUS_CONFIG: Record<ListingStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
  published: { label: "Published", className: "bg-green-100 text-green-800" },
  paused: { label: "Paused", className: "bg-yellow-100 text-yellow-800" },
  pending: { label: "Pending", className: "bg-orange-100 text-orange-800" },
};
