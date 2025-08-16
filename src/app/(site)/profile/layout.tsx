import AuthGuard from "../auth/components/AuthGuard";
import ProfileLayout from "./components/ProfileLayout";

export default function ReservationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ProfileLayout>{children}</ProfileLayout>
    </AuthGuard>
  );
}
