import { api } from "../lib/axios";

export interface CreateBoardParams {
  name: string;
  description: string;
  template: string;
}

export interface Task {
  id: string;
  title: string;
  order: number;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  assigneeId?: string | null;
  assignee?: { id: string; name: string | null; email: string };
}

export interface Column {
  id: string;
  title: string;
  order: number;
  tasks?: Task[];
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  template: string;
  createdAt: string;
  updatedAt: string;
  columns?: Column[];
}

export interface BoardMember {
  userId: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface MyTask extends Task {
  boardName: string;
  isCompleted: boolean;
  status: "overdue" | "today" | "upcoming" | "active" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
}

export const boardService = {
  create: async (data: CreateBoardParams): Promise<Board> => {
    const response = await api.post<Board>("/boards", data);
    return response.data;
  },

  getById: async (id: string): Promise<Board> => {
    const response = await api.get<Board>(`/boards/${id}`);
    return response.data;
  },

  getMembers: async (boardId: string): Promise<BoardMember[]> => {
    const response = await api.get<BoardMember[]>(`/boards/${boardId}/members`);
    return response.data;
  },

  getAll: async (): Promise<Board[]> => {
    const response = await api.get<Board[]>("/boards");
    return response.data;
  },

  addList: async (boardId: string, name: string): Promise<Column> => {
    const response = await api.post<Column>(`/boards/${boardId}/lists`, {
      name,
    });
    return response.data;
  },

  addTask: async (listId: string, title: string): Promise<Task> => {
    const response = await api.post<Task>(`/lists/${listId}/tasks`, { title });
    return response.data;
  },
  moveTask: async (
    taskId: string,
    targetColumnId: string,
    order: number
  ): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}/move`, {
      columnId: targetColumnId,
      order,
    });
    return response.data;
  },

  updateList: async (listId: string, name: string): Promise<Column> => {
    const response = await api.patch<Column>(`/lists/${listId}`, { name });
    return response.data;
  },

  moveList: async (listId: string, newOrder: number): Promise<Column> => {
    const response = await api.patch<Column>(`/lists/${listId}/move`, {
      newOrder,
    });
    return response.data;
  },

  updateTask: async (taskId: string, data: Partial<Task>): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}`, data);
    return response.data;
  },

  assignTask: async (taskId: string, userId: string | null): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}/assign`, {
      userId,
    });
    return response.data;
  },

  inviteUser: async (
    boardId: string,
    email: string
  ): Promise<{ token: string }> => {
    const response = await api.post(`/boards/${boardId}/invite`, { email });
    return response.data;
  },
  acceptInvite: async (token: string): Promise<{ boardId: string }> => {
    const response = await api.post(`/invites/${token}/accept`);
    return response.data;
  },
  getMyTasks: async (): Promise<MyTask[]> => {
    const response = await api.get<MyTask[]>("/tasks/my");
    return response.data;
  },
};
