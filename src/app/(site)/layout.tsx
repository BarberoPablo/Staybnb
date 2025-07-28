import Navbar from "@/components/Navbar";
import { Container } from "./components/Container";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="flex flex-col items-center justify-center w-full flex-grow">
        <Container>{children}</Container>
      </main>
    </>
  );
}
