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

export const boardService = {
  create: async (data: CreateBoardParams): Promise<Board> => {
    const response = await api.post<Board>("/boards", data);
    return response.data;
  },

  getById: async (id: string): Promise<Board> => {
    const response = await api.get<Board>(`/boards/${id}`);
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
};
