import Navbar from "@/components/Navbar";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <header>
        <Navbar />
      </header>
      <main className="flex-1 flex-grow overflow-auto flex flex-col items-center w-full h-full">{children}</main>
    </div>
  );
}
