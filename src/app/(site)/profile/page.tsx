"use client";

import { api } from "@/lib/api/api";
import type { Profile, UpdateProfile } from "@/lib/types/profile";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoCheckmark, IoClose, IoLocation, IoMail, IoPerson } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { SkeletonProfile } from "./components/SkeletonProfile";

export default function ProfileInfo() {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateProfile, setUpdateProfile] = useState<UpdateProfile>({});

  useEffect(() => {
    const fetchUser = async () => {
      const profile = await api.getProfile();

      if (profile) {
        setLoading(false);
        setUserProfile(profile);
        setUpdateProfile({
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.avatarUrl ?? "",
          bio: profile.bio ?? "",
        });
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.updateProfile(updateProfile);

      if (response.success) {
        toast.success("Profile information updated", { duration: 2000 });
        setUserProfile((prevState) => mergeProfile(prevState, updateProfile));
      } else {
        toast.error(response.message || "Error");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { duration: 4000 });
      } else {
        toast.error("Error at canceling", { duration: 4000 });
      }
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setUpdateProfile({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        bio: userProfile.bio || "",
        avatarUrl: userProfile.avatarUrl || "",
      });
      setIsEditing(false);
    }
  };

  if (loading && !userProfile) return <SkeletonProfile />;

  /* This should not happen, profileInfo should always be within a layout with AuthGuard */
  if (!userProfile) return <div>Profile not found, please log in</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between h-10">
        <h1 className="text-3xl font-bold text-myGrayDark">Profile Information</h1>
        {!isEditing && (
          <motion.button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-myGreenLight text-myGrayDark rounded-lg hover:bg-myGreen transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MdEdit className="w-4 h-4" />
            Edit Profile
          </motion.button>
        )}
      </div>

      {/* Profile Header */}
      <div className="flex items-center gap-6 p-6 bg-myGreenExtraLight rounded-xl border border-myGreenSemiBold/20">
        <div className="relative w-24 h-24 bg-myGreen rounded-full flex items-center justify-center">
          {isEditing && userProfile.avatarUrl ? (
            <button className="absolute w-24 h-24 rounded-full text-myGrayDark text-2xl hover:cursor-pointer z-10">Upload</button>
          ) : (
            <IoPerson className="w-12 h-12 text-myGrayDark" />
          )}
          {userProfile.avatarUrl ? (
            <Image
              src={userProfile.avatarUrl}
              alt="Profile"
              width={96}
              height={96}
              className={`rounded-full object-cover`}
              style={{ opacity: isEditing ? 0.5 : 1 }}
            />
          ) : (
            <IoPerson className="w-12 h-12 text-myGrayDark" style={{ opacity: isEditing ? 0.5 : 1 }} />
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
                  value={updateProfile.firstName}
                  onChange={(e) => setUpdateProfile({ ...updateProfile, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenSemiBold focus:border-transparent"
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
                  value={updateProfile.lastName}
                  onChange={(e) => setUpdateProfile({ ...updateProfile, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenSemiBold focus:border-transparent"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 rounded-lg text-myGrayDark">{userProfile.lastName || "Not provided"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-myGray mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={updateProfile.bio}
                  onChange={(e) => setUpdateProfile({ ...updateProfile, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenSemiBold focus:border-transparent"
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
            className="flex items-center gap-2 px-6 py-2 bg-myGreenSemiBold text-background rounded-lg hover:bg-myGreen transition-colors"
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

export function mergeProfile(prev: Profile | null, updates: UpdateProfile): Profile | null {
  if (!prev) return prev;

  return {
    ...prev,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...Object.fromEntries(Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)),
  };
}
