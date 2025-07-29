import Navbar from "@/components/Navbar";
import { Container } from "./components/Container";

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
      <main className="flex-grow overflow-auto flex flex-col items-center w-full">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
