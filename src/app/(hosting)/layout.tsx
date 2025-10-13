import NavbarWrapper from "@/components/NavbarWrapper";
import { generateSEOMetadata } from "@/lib/seo";
import AuthGuard from "../(site)/auth/components/AuthGuard";

export const metadata = generateSEOMetadata({
  title: "Hosting Dashboard",
  description: "Manage your listings, reservations, and hosting settings.",
  noIndex: true,
});

export default function HostingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <header>
        <NavbarWrapper search={false} />
      </header>
      <main className="w-full flex-grow min-h-[calc(100vh-177px)] max-w-7xl mx-auto">{children}</main>
    </AuthGuard>
  );
}
