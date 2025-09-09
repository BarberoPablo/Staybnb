import Navbar from "@/components/Navbar";
import AuthGuard from "../(site)/auth/components/AuthGuard";

export default function HostingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <header>
        <Navbar />
      </header>
      <main className="w-full flex-grow bg-gradient-to-br from-myGreenComplement to-white min-h-screen">{children}</main>
    </AuthGuard>
  );
}
