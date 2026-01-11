import { api } from "../lib/axios";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  jobTitle?: string;
  avatarUrl?: string;
}

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>("/users/me");
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.put<UserProfile>("/users/me", data);
    return response.data;
  },

  uploadAvatar: async (url: string): Promise<{ avatarUrl: string }> => {
    const response = await api.post("/users/me/avatar", { avatarUrl: url });
    return response.data;
  },
};
