"use client";

import { useUser } from "@/hooks/useUser";
import { api } from "@/lib/api/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fullPath = window.location.pathname + window.location.search;
    if (!loading) {
      if (!user) {
        router.replace(`/auth?redirectTo=${encodeURIComponent(fullPath)}`);
      } else {
        // User authenticated, check if profile exists
        const checkProfile = async () => {
          try {
            const profile = await api.getProfile();

            if (profile) {
              setReady(true);
            } else {
              // Profile not found - not an error, redirect to profile-setup
              router.replace(`/auth/callback?redirectTo=${encodeURIComponent(fullPath)}`);
              return;
            }
          } catch (error) {
            console.error("Error checking profile:", error);
            router.replace(`/auth?error=getProfile&redirectTo=${encodeURIComponent(fullPath)}`);
          }
        };

        checkProfile();
      }
    }
  }, [user, loading, router]);

  if (!ready) return null;

  return <>{children}</>;
}
