import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function HostingAuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return <>{children}</>;
}
