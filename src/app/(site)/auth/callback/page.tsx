"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({
          access_token,
          refresh_token,
        })
        .then(() => {
          router.replace("/");
        })
        .catch(() => {
          router.replace("/auth?loginError=session");
        });
    } else {
      setTimeout(() => {
        router.replace("/auth?loginError=callback");
      }, 2000);
    }
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl font-semibold mb-2">Verifying your account...</h1>
      <p>You’ll be redirected shortly.</p>
    </main>
  );
}
