export type UserRole = "user" | "admin";

export type ProfileDB = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: UserRole;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProfile = {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio?: string;
};

export type CreateProfileDB = {
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
};

export type UpdateProfileDB = {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
};

export type UpdateProfile = {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
};

export type HostDB = {
  first_name: string;
  last_name: string;
  avatar_url: string;
};

export type Host = {
  firstName: string;
  lastName: string;
  avatarUrl: string;
};
