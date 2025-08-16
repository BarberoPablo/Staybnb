import { CreateProfile, CreateProfileDB, Profile, ProfileDB, UpdateProfile, UpdateProfileDB } from "../types/profile";

export function parseProfileFromDB(profileDB: ProfileDB): Profile {
  return {
    id: profileDB.id,
    firstName: profileDB.first_name,
    lastName: profileDB.last_name,
    avatarUrl: profileDB.avatar_url,
    role: profileDB.role,
    bio: profileDB.bio,
    createdAt: new Date(profileDB.created_at),
    updatedAt: new Date(profileDB.updated_at),
  };
}

export function parseCreateProfile(profileDB: CreateProfile): CreateProfileDB {
  return {
    first_name: profileDB.firstName,
    last_name: profileDB.lastName,
    avatar_url: profileDB.avatarUrl ?? "",
    bio: profileDB.bio ?? "",
  };
}

export function parseUpdateProfile(updateProfile: UpdateProfile): UpdateProfileDB {
  return {
    first_name: updateProfile.firstName,
    last_name: updateProfile.lastName,
    avatar_url: updateProfile.avatarUrl,
    bio: updateProfile.bio,
  };
}
