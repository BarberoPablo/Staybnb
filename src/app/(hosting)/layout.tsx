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
        <Navbar search={false} />
      </header>
      <main className="w-full flex-grow min-h-screen">{children}</main>
    </AuthGuard>
  );
}
