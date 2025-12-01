"use client";

import { ListingWithHost } from "@/lib/types/listing";
import AdminDashboardStats from "./AdminDashboardStats";
import AdminListingsTable from "./listingsTable/AdminListingsTable";
//import AdminListingsTable from "./AdminListingsTable";

interface AdminDashboardProps {
  listings: ListingWithHost[];
}

export default function AdminDashboard({ listings }: AdminDashboardProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage all listings and monitor platform activity</p>
      </div>

      <AdminDashboardStats listings={listings} />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">All Listings</h2>
        <AdminListingsTable listings={listings} />
      </div>
    </div>
  );
}
