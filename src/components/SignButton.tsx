"use client";

import { logout } from "@/app/(site)/auth/components/auth";
import { useUser } from "@/hooks/useUser";
import { basicButton } from "@/lib/supabase/styles";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

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

  const handleProfile = async () => {
    router.push("/profile");
  };

  if (loading) return <button className="w-20 rounded-lg overflow-hidden bg-gray-100 animate-pulse"></button>;

  return user ? (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLogout}
        className="w-20 px-4 py-2 text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
      >
        Logout
      </button>

      <button onClick={handleProfile} className={`${basicButton}`}>
        <FaUserCircle className="rounded-full text-4xl text-myGreenDark bg-white hover:bg-myGreen transition-colors duration-200" />
      </button>
    </div>
  ) : (
    <button
      className="w-20 px-4 py-2 text-sm font-medium rounded-lg text-myGrayDark bg-myGreenLight hover:bg-myGreen transition-colors duration-200"
      onClick={handleLogin}
    >
      Login
    </button>
  );
}
