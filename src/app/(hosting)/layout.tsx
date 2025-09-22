import NavbarWrapper from "@/components/NavbarWrapper";
import AuthGuard from "../(site)/auth/components/AuthGuard";

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
