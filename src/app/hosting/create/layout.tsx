import { ReactNode } from "react";

export default function HostingCreateLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between">
      <div className="w-full max-w-3xl px-4 py-8">{children}</div>
    </main>
  );
}
