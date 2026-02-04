import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireUserWithProfile(redirectTo?: string) {
  console.log("[AUTH] start");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("[AUTH] getUser result", {
    hasUser: !!user,
    userId: user?.id,
  });

  if (!user) {
    redirect(`/auth${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`);
  }

  const profile = await prisma.profiles.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    redirect(`/auth/callback${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`);
  }

  return {
    user,
    profile,
  };
}

export function buildRedirectQueryString(params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
