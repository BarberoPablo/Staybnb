import { Suspense } from "react";
import Navbar from "./Navbar";

export default function NavbarWrapper({ search = true }: { search?: boolean }) {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <Navbar search={search} />
    </Suspense>
  );
}

function NavbarSkeleton() {
  return (
    <div className="w-full h-16 bg-white border-b border-gray-200 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
        <div className="w-64 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
