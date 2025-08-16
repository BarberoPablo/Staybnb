"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IoNotifications, IoShield, IoGlobe, IoMoon, IoSunny, IoEye, IoEyeOff, IoKey } from "react-icons/io5";

export default function SettingsSection() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
  });

  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy, value: any) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePasswordChange = () => {
    // Implement password functionality
    console.log("Password change requested");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-myGrayDark">Settings</h1>
        <p className="text-myGray mt-2">Manage your account preferences and privacy</p>
      </div>

      <motion.div
        className="bg-white border border-gray-200 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <IoNotifications className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-myGrayDark">Notifications</h2>
            <p className="text-myGray text-sm">Choose how you want to be notified</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <h3 className="font-medium text-myGrayDark capitalize">
                  {key === "push" ? "Push Notifications" : key === "sms" ? "SMS" : key === "marketing" ? "Marketing Emails" : "Email Notifications"}
                </h3>
                <p className="text-sm text-myGray">
                  {key === "push"
                    ? "Receive notifications on your device"
                    : key === "sms"
                    ? "Get updates via text message"
                    : key === "marketing"
                    ? "Receive promotional content"
                    : "Get important updates via email"}
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange(key as keyof typeof notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-myGreenBold" : "bg-gray-200"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="bg-white border border-gray-200 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <IoShield className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-myGrayDark">Privacy</h2>
            <p className="text-myGray text-sm">Control your profile visibility and data sharing</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="py-3 border-b border-gray-100">
            <label className="block text-sm font-medium text-myGray mb-2">Profile Visibility</label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenBold focus:border-transparent"
            >
              <option value="public">Public - Anyone can see your profile</option>
              <option value="friends">Friends Only - Only your connections can see</option>
              <option value="private">Private - Only you can see your profile</option>
            </select>
          </div>

          {Object.entries(privacy)
            .slice(1)
            .map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <h3 className="font-medium text-myGrayDark">
                    {key === "showEmail" ? "Show Email Address" : key === "showPhone" ? "Show Phone Number" : "Allow Direct Messages"}
                  </h3>
                  <p className="text-sm text-myGray">
                    {key === "showEmail"
                      ? "Display your email on your public profile"
                      : key === "showPhone"
                      ? "Display your phone number on your public profile"
                      : "Allow other users to send you direct messages"}
                  </p>
                </div>
                <button
                  onClick={() => handlePrivacyChange(key as keyof typeof privacy, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-myGreenBold" : "bg-gray-200"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
            ))}
        </div>
      </motion.div>

      <motion.div
        className="bg-white border border-gray-200 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <IoGlobe className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-myGrayDark">Appearance</h2>
            <p className="text-myGray text-sm">Customize how the app looks and feels</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-myGray mb-3">Theme</label>
            <div className="flex gap-3">
              {[
                { value: "light", icon: IoSunny, label: "Light" },
                { value: "dark", icon: IoMoon, label: "Dark" },
                { value: "auto", icon: IoGlobe, label: "Auto" },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value as "light" | "dark" | "auto")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    theme === value
                      ? "border-myGreenBold bg-myGreenBold text-background"
                      : "border-gray-300 text-myGrayDark hover:border-myGreenBold hover:bg-myGreenLight"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white border border-gray-200 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <IoKey className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-myGrayDark">Change Password</h2>
            <p className="text-myGray text-sm">Update your account password</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-myGray mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenBold focus:border-transparent"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-myGray hover:text-myGrayDark"
              >
                {showPassword ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-myGray mb-2">New Password</label>
            <input
              type="password"
              value={passwordData.new}
              onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenBold focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-myGray mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirm}
              onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenBold focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>

          <button onClick={handlePasswordChange} className="px-6 py-2 bg-myGreenBold text-background rounded-lg hover:bg-myGreenDark transition-colors">
            Update Password
          </button>
        </div>
      </motion.div>
    </div>
  );
}
