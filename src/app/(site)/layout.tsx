import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "./components/Footer";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavbarWrapper />
      </header>
      <main className="flex-1 flex-grow flex flex-col items-center w-full">{children}</main>
      <Footer />
    </div>
  );
}
