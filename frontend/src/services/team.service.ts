import { api } from "../lib/axios";
import type { Board } from "./board.service";

export interface Team {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  role: "Admin" | "Member";
}

export interface TeamMember {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export const teamService = {
  generateInviteCode: async (teamId: string): Promise<{ code: string }> => {
    const response = await api.post(`/teams/${teamId}/invite-code`);
    return response.data;
  },

  getInviteCode: async (teamId: string): Promise<{ code: string } | null> => {
    const response = await api.get(`/teams/${teamId}/invite-code`);
    return response.data;
  },

  joinTeam: async (code: string): Promise<{ teamId: string }> => {
    const response = await api.post("/teams/join", { code });
    return response.data;
  },
  create: async (name: string, description?: string): Promise<Team> => {
    const response = await api.post<Team>("/teams", { name, description });
    return response.data;
  },

  getAll: async (): Promise<Team[]> => {
    const response = await api.get<Team[]>("/teams");
    return response.data;
  },

  getById: async (teamId: string): Promise<Team> => {
    const response = await api.get<Team>(`/teams/${teamId}`);
    return response.data;
  },

  getBoards: async (teamId: string): Promise<Board[]> => {
    const response = await api.get<Board[]>(`/teams/${teamId}/boards`);
    return response.data;
  },
  getMembers: async (teamId: string): Promise<TeamMember[]> => {
    const response = await api.get<TeamMember[]>(`/teams/${teamId}/members`);
    return response.data;
  },
};
