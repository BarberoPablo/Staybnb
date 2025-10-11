import { generateSEOMetadata } from "@/lib/seo";
import ActionCards from "./components/ActionCards";
import Dashboard from "./components/Dashboard";
import Stats from "./components/Stats";

export const metadata = generateSEOMetadata({
  title: "Hosting Dashboard",
  description: "Manage your vacation rental listings and reservations.",
  noIndex: true,
});

export default function Hosting() {
  return (
    <div className="px-12 py-10 w-full">
      <Dashboard />

      <ActionCards />

      <Stats />
    </div>
  );
}
