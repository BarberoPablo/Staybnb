import { CreateProfile, CreateProfileDB, Profile, ProfileDB } from "../types/profile";

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
    id: profileDB.id,
    first_name: profileDB.firstName,
    last_name: profileDB.lastName,
  };
}
