import NavbarWrapper from "@/components/NavbarWrapper";
import AdminGuard from "./components/AdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex flex-col min-h-screen">
        <header>
          <NavbarWrapper search={false} />
        </header>
        <main className="flex-1 flex-grow flex flex-col items-center w-full">{children}</main>
      </div>
    </AdminGuard>
  );
}
