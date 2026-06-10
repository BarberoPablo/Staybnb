"use server";

import { parseCreateProfile } from "@/lib/parsers/profile";
import { prisma } from "@/lib/prisma";
import { cleanString } from "@/lib/server-utils";
import { CreateProfile } from "@/lib/types/profile";
import { isValidUrl } from "@/lib/utils";
import { createClient } from "../../../supabase/server";
import { fetchUpdateUserProfile, fetchUserProfile } from "../../profile/profile.http";
import { UpdateProfile } from "../../profile/profile.schema";

export async function getProfile() {
  return fetchUserProfile();
}

export async function signUp(userData: CreateProfile) {
  try {
    const { firstName, lastName, avatarUrl, bio } = userData;

    const clean_first_name = cleanString(firstName);
    const clean_last_name = cleanString(lastName);
    const clean_bio = cleanString(bio);
    const clean_avatar_url = avatarUrl ? (isValidUrl(avatarUrl.trim()) ? avatarUrl.trim() : "") : "";

    if (!clean_first_name || !clean_last_name) {
      throw new Error("First name and last name are required and must be valid text.");
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      throw new Error("Not authenticated");
    }

    const parsedUserData = parseCreateProfile({
      firstName: clean_first_name,
      lastName: clean_last_name,
      avatarUrl: clean_avatar_url,
      bio: clean_bio,
    });

    const profile = await prisma.profiles.create({
      data: {
        id: user.id,
        first_name: parsedUserData.first_name,
        last_name: parsedUserData.last_name,
        avatar_url: parsedUserData.avatar_url,
        bio: parsedUserData.bio,
        role: "user",
      },
    });

    return { success: true, profile };
  } catch (error) {
    throw error;
  }
}

export async function updateProfile(profileData: UpdateProfile) {
  return fetchUpdateUserProfile(profileData);
}
