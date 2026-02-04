import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireUserWithProfile(redirectTo?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
