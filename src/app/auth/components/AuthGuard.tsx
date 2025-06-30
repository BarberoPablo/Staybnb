"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const fullPath = window.location.pathname + window.location.search;
        router.replace(`/auth?redirectTo=${encodeURIComponent(fullPath)}`);
      } else {
        setReady(true);
      }
    }
  }, [user, loading, router]);

  if (!ready) return null;

  return <>{children}</>;
}
