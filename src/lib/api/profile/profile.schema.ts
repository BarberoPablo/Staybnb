import { components } from "@/types/api";
import { z } from "zod";

type ProfileRole = components["schemas"]["MeResponseDto"]["role"];
export type UpdateProfile = components["schemas"]["UpdateProfileDto"];

export const USER_ROLES = ["USER", "ADMIN"] as const satisfies readonly ProfileRole[];

export const ProfileSchema = z.object({
  id: z.string(),
  role: z.enum(USER_ROLES),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;
