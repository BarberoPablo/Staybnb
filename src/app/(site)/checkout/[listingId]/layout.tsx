import AuthGuard from "@/app/(site)/auth/components/AuthGuard";
import React from "react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
