"use server";

import { cookies } from "next/headers";
import { apiClient } from "../client";
import { Profile, ProfileSchema, UpdateProfile } from "./profile.schema";

export async function fetchUserProfile(): Promise<Profile> {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.GET("/profiles/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (error) {
    throw new Error("Failed get user profile");
  }

  return ProfileSchema.parse(data);
}

export async function fetchUpdateUserProfile(updateData: UpdateProfile) {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.PATCH("/profiles/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
    body: {
      ...updateData,
    },
  });

  if (error) {
    throw new Error("Failed to update user profile");
  }

  if (!data) {
    throw new Error("No data returned");
  }

  return data;
}
