"use client";

import { logout } from "@/app/(site)/auth/components/auth";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

export function SignButton() {
  const router = useRouter();
  const { user, loading } = useUser();

  const handleLogin = () => {
    router.push("/auth");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) return <button className="w-20 rounded-lg overflow-hidden bg-gray-100 animate-pulse"></button>;

  return user ? (
    <button
      onClick={handleLogout}
      className="w-20 px-4 py-2 text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
    >
      Logout
    </button>
  ) : (
    <button
      className="w-20 px-4 py-2 text-sm font-medium rounded-lg text-myGrayDark bg-myGreenLight hover:bg-myGreen transition-colors duration-200"
      onClick={handleLogin}
    >
      Login
    </button>
  );
}
