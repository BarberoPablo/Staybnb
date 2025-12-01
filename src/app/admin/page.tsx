import { getAllListingsWithHost } from "@/lib/api/server/endpoints/listings";
import AdminDashboard from "./components/AdminDashboard";

export default async function AdminPage() {
  const listings = await getAllListingsWithHost();

  return <AdminDashboard listings={listings} />;
}
