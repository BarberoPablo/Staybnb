import Navbar from "@/components/Navbar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="w-full mt-2 flex-grow px-5">{children}</main>
    </>
  );
}
