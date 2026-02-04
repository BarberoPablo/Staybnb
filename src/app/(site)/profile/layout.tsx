import { generateSEOMetadata } from "@/lib/seo";
import { requireUserWithProfile } from "../auth/components/requireUserWithProfile";
import ProfileLayout from "./components/ProfileLayout";

export const metadata = generateSEOMetadata({
  title: "My Profile",
  description: "Manage your profile, reservations, and favorites.",
  noIndex: true,
});

export default async function ReservationsLayout({ children }: { children: React.ReactNode }) {
  await requireUserWithProfile("/profile");

  return <ProfileLayout>{children}</ProfileLayout>;
}
