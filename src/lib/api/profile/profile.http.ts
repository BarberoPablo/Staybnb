"use server";

import { cookies } from "next/headers";
import { apiClient } from "../client";
import { Profile, ProfileSchema } from "./profile.schema";

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
