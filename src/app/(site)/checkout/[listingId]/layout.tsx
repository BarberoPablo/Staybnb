import React from "react";
import { requireUserWithProfile } from "../../auth/components/requireUserWithProfile";

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  await requireUserWithProfile("/checkout");

  return <>{children}</>;
}
