"use client";

import { api } from "@/lib/api/api";
import type { CreateProfile, Profile } from "@/lib/types/profile";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoCheckmark, IoClose, IoLocation, IoMail, IoPerson } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

export default function ProfileInfo() {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileDate] = useState<CreateProfile>({
    firstName: "",
    lastName: "",
    avatarUrl: "",
    bio: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const profile = await api.getProfile();

      if (profile) {
        setLoading(false);
        setUserProfile(profile);
        setProfileDate({
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.avatarUrl ?? "",
          bio: profile.bio ?? "",
        });
      }
    };

    fetchUser();
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (userProfile) {
      setProfileDate({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName || "",
        bio: userProfile.bio || "",
      });
      setIsEditing(false);
    }
  };

  if (loading && !userProfile) return <div>Loading...</div>;

  /* This should not happen, profileInfo should always be within a layout with AuthGuard */
  if (!userProfile) return <div>Profile not found, please log in</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-myGrayDark">Profile Information</h1>
        {!isEditing && (
          <motion.button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-myGreenBold text-background rounded-lg hover:bg-myGreenDark transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MdEdit className="w-4 h-4" />
            Edit Profile
          </motion.button>
        )}
      </div>

      {/* Profile Header */}
      <div className="flex items-center gap-6 p-6 bg-myGreenLight rounded-xl border border-myGreenBold/20">
        <div className="w-24 h-24 bg-myGreen rounded-full flex items-center justify-center">
          {userProfile.avatarUrl ? (
            <Image src={userProfile.avatarUrl} alt="Profile" width={96} height={96} className="rounded-full object-cover" />
          ) : (
            <IoPerson className="w-12 h-12 text-myGrayDark" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-myGrayDark">
            {userProfile.firstName && userProfile.lastName ? `${userProfile.firstName} ${userProfile.lastName}` : "Complete your profile"}
          </h2>
          <p className="text-myGray">Member since {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "..."}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-myGrayDark mb-4">Personal Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-myGray mb-2">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileDate({ ...profileData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenBold focus:border-transparent"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 rounded-lg text-myGrayDark">{userProfile.firstName || "Not provided"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-myGray mb-2">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileDate({ ...profileData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenBold focus:border-transparent"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 rounded-lg text-myGrayDark">{userProfile.lastName || "Not provided"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-myGray mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileDate({ ...profileData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenBold focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 rounded-lg text-myGrayDark">{userProfile.bio || "No bio provided"}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-myGrayDark mb-4">Account Details</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <IoMail className="w-5 h-5 text-myGray" />
              <div>
                <p className="text-sm text-myGray">Email</p>
                <p className="text-myGrayDark font-medium">{userProfile.id || "..."}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <IoPerson className="w-5 h-5 text-myGray" />
              <div>
                <p className="text-sm text-myGray">Role</p>
                <p className="text-myGrayDark font-medium capitalize">{userProfile.role || "..."}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <IoLocation className="w-5 h-5 text-myGray" />
              <div>
                <p className="text-sm text-myGray">Location</p>
                <p className="text-myGrayDark font-medium">Not specified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Actions */}
      {isEditing && (
        <motion.div
          className="flex gap-3 pt-4 border-t border-gray-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-myGreenBold text-background rounded-lg hover:bg-myGreenDark transition-colors"
          >
            <IoCheckmark className="w-4 h-4" />
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <IoClose className="w-4 h-4" />
            Cancel
          </button>
        </motion.div>
      )}
    </div>
  );
}
