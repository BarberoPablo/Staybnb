"use client";

import { logout } from "@/app/(site)/auth/components/auth";
import { useUser } from "@/hooks/useUser";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useRouter } from "nextjs-toploader/app";
import { FaHome, FaSignOutAlt, FaUser, FaUserCircle } from "react-icons/fa";
import { MdKeyboardArrowDown, MdOutlineLogin, MdOutlineTravelExplore } from "react-icons/md";

export function SignButton({ hosting }: { hosting: boolean }) {
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

  const handleHosting = () => {
    router.push("/hosting");
  };

  const handleTraveling = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="w-16 h-8 rounded-lg bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <button
        className={`flex items-center sm:gap-2 px-4 py-2 h-10 text-sm font-semibold rounded-full sm:rounded-lg text-myGrayDark bg-gradient-to-r from-myGreenLight to-myGreen hover:from-myGreen hover:to-myGreenLight transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer`}
        onClick={handleLogin}
      >
        <MdOutlineLogin className="w-4 h-4" />
        <span className="hidden sm:block">Sign in</span>
      </button>
    );
  }

  return (
    <Menu as="div" className="relative">
      <MenuButton className={`flex items-center gap-2 rounded-lg cursor-pointer p-1 group`}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm duration-200">
          <FaUser className="w-6 h-6 text-myGrayDark duration-200" />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-myGrayDark font-medium text-sm duration-200">Profile</span>
          <MdKeyboardArrowDown className="w-4 h-4 text-myGreenBold" />
        </div>
      </MenuButton>

      <MenuItems
        className={`absolute right-0 z-[9999] mt-2 w-64 origin-top-right rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 focus:outline-none`}
        transition
      >
        <div className="p-4">
          {/* Menu Items */}
          <div className="space-y-1">
            <MenuItem>
              {({ focus }) => (
                <button
                  className={`group flex w-full items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200 cursor-pointer ${
                    focus ? "bg-myGreenExtraLight/60 text-myGreenBold" : "hover:bg-myGreenExtraLight/40 text-myGrayDark"
                  }`}
                  onClick={handleProfile}
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-myGreen/60 to-myGreen rounded-xl flex items-center justify-center shadow-sm">
                    <FaUserCircle className="w-4 h-4 text-myGrayDark" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium">My Profile</span>
                    <p className="text-xs text-myGray group-hover:text-myGreenBold transition-colors">Manage your account</p>
                  </div>
                </button>
              )}
            </MenuItem>

            {!hosting && (
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={`group flex w-full items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200 cursor-pointer ${
                      focus ? "bg-myPurple/60 text-myPurpleBold" : "hover:bg-myPurple/40 text-myGrayDark"
                    }`}
                    onClick={handleHosting}
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-myGreenComplement to-myPurple rounded-xl flex items-center justify-center shadow-sm">
                      <FaHome className="w-4 h-4 text-myGrayDark" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-medium">Switch to Hosting</span>
                      <p className="text-xs text-myGray group-hover:text-myPurpleBold transition-colors">Manage your listings</p>
                    </div>
                  </button>
                )}
              </MenuItem>
            )}

            {hosting && (
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={`group flex w-full items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200 cursor-pointer ${
                      focus ? "bg-myPurple/60 text-myPurpleBold" : "hover:bg-myPurple/40 text-myGrayDark"
                    }`}
                    onClick={handleTraveling}
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-myGreenComplement to-myPurple rounded-xl flex items-center justify-center shadow-sm">
                      <MdOutlineTravelExplore className="w-4 h-4 text-myGrayDark" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-medium">Switch to Traveling</span>
                      <p className="text-xs text-myGray group-hover:text-myPurpleBold transition-colors">Browse and book stays</p>
                    </div>
                  </button>
                )}
              </MenuItem>
            )}

            <div className="pt-2">
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={`group flex w-full items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200 cursor-pointer ${
                      focus ? "bg-red-100 text-red-700" : "hover:bg-red-50 text-myGrayDark"
                    }`}
                    onClick={handleLogout}
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
                      <FaSignOutAlt className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-medium">Sign Out</span>
                      <p className="text-xs text-myGray group-hover:text-red-700 transition-colors">End your session</p>
                    </div>
                  </button>
                )}
              </MenuItem>
            </div>
          </div>
        </div>
      </MenuItems>
    </Menu>
  );
}
