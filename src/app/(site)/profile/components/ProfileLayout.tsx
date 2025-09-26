"use client";

import { basicButton } from "@/lib/styles";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { IoCalendar, IoCog, IoHeart, IoPerson } from "react-icons/io5";

type MenuItem = "profile" | "reservations" | "favorites" | "settings";

const menuItems = [
  { id: "profile" as MenuItem, label: "Profile", icon: IoPerson, href: "/profile" },
  { id: "reservations" as MenuItem, label: "Reservations", icon: IoCalendar, href: "/profile/reservations" },
  { id: "favorites" as MenuItem, label: "Favorites", icon: IoHeart, href: "/profile/favorites" },
  { id: "settings" as MenuItem, label: "Settings", icon: IoCog, href: "/profile/settings" },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState(pathname);

  const handleClickMenuButton = (href: string) => {
    setActiveSection(href);
    router.push(href);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 lg:py-10 min-h-screen bg-background max-w-7xl mx-auto pb-20 lg:pb-4 sm:pb-6 md:pb-8">
      <div className="flex gap-8 w-full">
        <motion.div
          className="hidden lg:block w-64 bg-myGreenExtraLight rounded-2xl p-6 shadow-sm border border-myGreenSemiBold/20 sticky top-10 self-start"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-myGrayDark mb-2">Profile</h2>
            <p className="text-myGray text-sm">Manage your account</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.href;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleClickMenuButton(item.href)}
                  className={`${basicButton} w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive ? "bg-myGreenSemiBold text-background shadow-md" : "text-myGrayDark hover:bg-myGreen hover:text-myGrayDark"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-background" : "text-myGray"}`} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </motion.div>

        <motion.div
          className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>

      <motion.div
        className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/80 backdrop-blur-md border-t border-gray-200/50 shadow-lg z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex justify-between items-center py-1 px-2 sm:py-2 sm:px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.href;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleClickMenuButton(item.href)}
                className={`flex flex-col items-center justify-center py-1 px-1 sm:py-2 sm:px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                  isActive ? "text-myGreenSemiBold" : "text-myGray hover:text-myGrayDark"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className={`w-4 h-4 sm:w-6 sm:h-6 mb-0.5 sm:mb-1 ${isActive ? "text-myGreenSemiBold" : "text-myGray"}`} />
                <span className="text-[10px] sm:text-xs font-medium truncate">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
