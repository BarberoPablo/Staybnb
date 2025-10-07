"use server";

import { parseProfileFromDB } from "@/lib/parsers/profile";
import { prisma } from "@/lib/prisma";
import { ProfileDB } from "@/lib/types/profile";
import { createClient } from "../../../supabase/server";
import { NotFoundError } from "../errors";

export async function getProfile() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      console.error("Auth error:", authErr, user);
      throw new NotFoundError();
    }

    const profile = await prisma.profiles.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!profile) {
      return null;
    }

    return parseProfileFromDB({ ...profile, email: user.email } as unknown as ProfileDB);
  } catch (error) {
    // If profile was not found, return null (not an error)
    if (error instanceof Error && error.message === "Profile not found") {
      return null;
    }
    throw error;
  }
}
