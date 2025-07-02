"use client";

import { logout } from "@/app/auth/components/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <button onClick={handleLogout} className="text-sm underline text-red-500">
      Logout
    </button>
  );
}
