"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IoPerson, IoCalendar, IoHeart, IoCog } from "react-icons/io5";
import { Container } from "@/app/(site)/components/Container";
import ProfileInfo from "./components/ProfileInfo";
import ReservationsSection from "./components/ReservationsSection";
import FavoritesSection from "./components/FavoritesSection";
import { basicButton } from "@/lib/supabase/styles";
//import SettingsSection from "./components/SettingsSection";

type MenuItem = "profile" | "reservations" | "favorites" | "settings";

const menuItems = [
  { id: "profile" as MenuItem, label: "Profile", icon: IoPerson },
  { id: "reservations" as MenuItem, label: "Reservations", icon: IoCalendar },
  { id: "favorites" as MenuItem, label: "Favorites", icon: IoHeart },
  { id: "settings" as MenuItem, label: "Settings", icon: IoCog },
];

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<MenuItem>("profile");

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileInfo />;
      case "reservations":
        return <ReservationsSection />;
      case "favorites":
        return <FavoritesSection />;
      /* case "settings":
        return <SettingsSection />; */
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Container className="flex gap-8 py-8">
        {/* Left Sidebar */}
        <motion.div
          className="w-64 bg-myGreenLight rounded-2xl p-6 shadow-sm border border-myGreenBold/20"
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
              const isActive = activeSection === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`${basicButton} w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive ? "bg-myGreenBold text-background shadow-md" : "text-myGrayDark hover:bg-myGreen hover:text-myGrayDark"
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
          {renderContent()}
        </motion.div>
      </Container>
    </div>
  );
}
