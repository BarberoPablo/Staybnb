export type UserRole = "user" | "admin";

export type ProfileDB = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProfile = {
  id: string;
  firstName: string;
  lastName: string;
};

export type CreateProfileDB = {
  id: string;
  first_name: string;
  last_name: string;
};
