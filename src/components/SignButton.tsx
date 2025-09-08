"use client";

import { logout } from "@/app/(site)/auth/components/auth";
import { useUser } from "@/hooks/useUser";
import { basicButton } from "@/lib/styles";
import { MenuItem } from "@headlessui/react";
import { useRouter } from "nextjs-toploader/app";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineLogin, MdOutlineLogout } from "react-icons/md";

export function SignButton({ isMobile = false }: { isMobile?: boolean }) {
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

  if (isMobile) {
    return user ? (
      <div>
        <MenuItem>
          <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-myGreen/70" onClick={handleProfile}>
            <FaUserCircle className="size-4 fill-GrayDark" />
            Profile
          </button>
        </MenuItem>
        <MenuItem>
          <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-myGreen/70" onClick={handleLogout}>
            <MdOutlineLogout className="size-4 fill-GrayDark" />
            Logout
          </button>
        </MenuItem>
      </div>
    ) : (
      <MenuItem>
        <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-myGreen/70" onClick={handleLogin}>
          <MdOutlineLogin className="size-4 fill-GrayDark" />
          Login
        </button>
      </MenuItem>
    );
  }

  return user ? (
    <div className="flex items-center gap-2">
      <button
        className="w-20 px-4 py-2 text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200 hover:cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </button>

      <button className={`${basicButton}`} onClick={handleProfile}>
        <FaUserCircle className="rounded-full text-4xl text-myGreen bg-white hover:bg-myGreenExtraLight transition-colors duration-200" />
      </button>
    </div>
  ) : (
    <button
      className="w-20 px-4 py-2 text-sm font-medium rounded-lg text-myGrayDark bg-myGreenExtraLight hover:bg-myGreen transition-colors duration-200 hover:cursor-pointer"
      onClick={handleLogin}
    >
      Login
    </button>
  );
}
