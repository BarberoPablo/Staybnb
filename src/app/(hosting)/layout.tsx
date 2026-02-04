import NavbarWrapper from "@/components/NavbarWrapper";
import { generateSEOMetadata } from "@/lib/seo";
import { requireUserWithProfile } from "../(site)/auth/components/requireUserWithProfile";

export const metadata = generateSEOMetadata({
  title: "Hosting Dashboard",
  description: "Manage your listings, reservations, and hosting settings.",
  noIndex: true,
});

export default async function HostingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUserWithProfile("/hosting");

  return (
    <>
      <header>
        <NavbarWrapper search={false} />
      </header>
      <main className="w-full flex-grow min-h-[calc(100vh-177px)] max-w-7xl mx-auto">{children}</main>
    </>
  );
}
