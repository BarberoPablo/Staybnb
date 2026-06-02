"use server";

import { parseCreateProfile } from "@/lib/parsers/profile";
import { prisma } from "@/lib/prisma";
import { cleanString } from "@/lib/server-utils";
import { CreateProfile, UpdateProfileDB } from "@/lib/types/profile";
import { isValidUrl } from "@/lib/utils";
import { createClient } from "../../../supabase/server";
import { fetchUserProfile } from "../../profile/profile.http";

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

export async function updateProfile(profileData: Partial<UpdateProfileDB>) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      throw new Error("Not authenticated");
    }

    const allowedKeys: (keyof UpdateProfileDB)[] = ["first_name", "last_name", "avatar_url", "bio"];
    const body: Partial<UpdateProfileDB> = {};

    for (const key of allowedKeys) {
      const value = profileData[key];

      if (typeof value === "string") {
        if (key === "avatar_url") {
          const clean_avatar_url = isValidUrl(value.trim()) ? value.trim() : "";
          if (clean_avatar_url) {
            body.avatar_url = clean_avatar_url;
          }
        } else {
          if (value.trim().length > 0) {
            body[key] = cleanString(value);
          }
        }
      }
    }

    const profile = await prisma.profiles.update({
      where: {
        id: user.id,
      },
      data: body,
    });

    return { success: true, data: profile };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Error updating profile" };
  }
}
