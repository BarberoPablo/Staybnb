import NavbarWrapper from "@/components/NavbarWrapper";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <header>
        <NavbarWrapper />
      </header>
      <main className="flex-1 flex-grow overflow-auto flex flex-col items-center w-full h-full">{children}</main>
    </div>
  );
}
