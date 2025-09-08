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
    <div className="w-full px-12 py-10 min-h-screen bg-background max-w-[1250px]">
      <div className="flex gap-8 w-full">
        {/* Left Sidebar */}
        <motion.div
          className="w-64 bg-myGreenExtraLight rounded-2xl p-6 shadow-sm border border-myGreenSemiBold/20"
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

        {/* Main Content */}
        <motion.div
          className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
