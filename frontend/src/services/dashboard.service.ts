import { api } from "../lib/axios";

export interface DashboardMember {
  id: string;
  name: string | null;
  email: string;
}

export interface DashboardStats {
  activeProjects: number;
  pendingTasks: number;
  teamMembers: number;
  productivity: number;
}

export interface ActiveBoard {
  id: string;
  name: string;
  status: "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
  dueDate: string | null;
  members: DashboardMember[];
}

export interface ActivityItem {
  id: string;
  actor: { name: string | null; email: string };
  description: string;
  boardName?: string;
  createdAt: string;
  type: string;
}

export const dashboardService = {
  getActiveBoards: async (): Promise<ActiveBoard[]> => {
    const response = await api.get<ActiveBoard[]>("/dashboard/active-boards");
    return response.data;
  },
  getRecentActivity: async (): Promise<ActivityItem[]> => {
    const response = await api.get<ActivityItem[]>(
      "/dashboard/recent-activity"
    );
    return response.data;
  },
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>("/dashboard/stats");
    return response.data;
  },
};
