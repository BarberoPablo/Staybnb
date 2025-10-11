import { generateSEOMetadata } from "@/lib/seo";
import AuthGuard from "../auth/components/AuthGuard";
import ProfileLayout from "./components/ProfileLayout";

export const metadata = generateSEOMetadata({
  title: "My Profile",
  description: "Manage your profile, reservations, and favorites.",
  noIndex: true,
});

export default function ReservationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ProfileLayout>{children}</ProfileLayout>
    </AuthGuard>
  );
}
