"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useUserProfile();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  console.log(user, profile, loading);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth?redirectTo=/admin");
      return;
    }

    if (!profile) {
      router.replace("/auth/callback?redirectTo=/admin");
      return;
    }

    // perfil pero no admin
    if (profile.role !== "admin") {
      router.replace("/");
      return;
    }

    setReady(true);
  }, [loading, user, profile, router]);
  if (!ready) return null;

  return <>{children}</>;
}
