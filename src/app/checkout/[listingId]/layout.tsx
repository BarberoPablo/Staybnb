import AuthGuard from "@/app/auth/components/AuthGuard";
import React from "react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
