"use client";

import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { getProfile } from "@/lib/api/server/endpoints/profile";
import { Profile } from "@/lib/types/profile";

export function useUserProfile() {
  const { user, loading: loadingUser } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (loadingUser) return;

    if (!user) {
      setProfile(null);
      setLoadingProfile(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setProfile(profile);
      } catch {
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user, loadingUser]);

  return {
    user,
    profile,
    loading: loadingUser || loadingProfile,
  };
}
