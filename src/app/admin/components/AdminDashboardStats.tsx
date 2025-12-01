"use client";

import { ListingStatus, ListingWithHost } from "@/lib/types/listing";
import { motion } from "framer-motion";
import { FaCheckCircle, FaClock, FaFileAlt, FaList, FaPauseCircle } from "react-icons/fa";

interface AdminDashboardStatsProps {
  listings: ListingWithHost[];
}

const STAT_CARDS = [
  {
    id: "total",
    label: "Total Listings",
    icon: FaList,
    color: "bg-blue-100 text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "pending",
    label: "Pending Review",
    icon: FaClock,
    color: "bg-orange-100 text-orange-600",
    bgColor: "bg-orange-50",
    status: "pending" as ListingStatus,
  },
  {
    id: "published",
    label: "Published",
    icon: FaCheckCircle,
    color: "bg-green-100 text-green-600",
    bgColor: "bg-green-50",
    status: "published" as ListingStatus,
  },
  {
    id: "paused",
    label: "Paused",
    icon: FaPauseCircle,
    color: "bg-yellow-100 text-yellow-600",
    bgColor: "bg-yellow-50",
    status: "paused" as ListingStatus,
  },
  {
    id: "draft",
    label: "Draft",
    icon: FaFileAlt,
    color: "bg-gray-100 text-gray-600",
    bgColor: "bg-gray-50",
    status: "draft" as ListingStatus,
  },
];

export default function AdminDashboardStats({ listings }: AdminDashboardStatsProps) {
  const stats = STAT_CARDS.map((card) => {
    if (card.id === "total") {
      return {
        ...card,
        count: listings.length,
      };
    }
    return {
      ...card,
      count: listings.filter((listing) => listing.status === card.status).length,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
