import { taskRepository } from "../repositories/task.repository";
import { columnRepository } from "../repositories/column.repository";
import { AppError } from "../utils/AppError";

export const taskService = {
  createTask: async (userId: string, listId: string, title: string) => {
    const list = await columnRepository.findById(listId);

    if (!list) {
      throw new AppError("List not found", 404);
    }

    if (list.board.ownerId !== userId) {
      throw new AppError("Unauthorized access to this board", 403);
    }

    const maxOrder = await taskRepository.findMaxOrder(listId);
    const newOrder = maxOrder + 1;

    return taskRepository.create(listId, title, newOrder);
  },

  moveTask: async (
    userId: string,
    taskId: string,
    targetColumnId: string,
    newOrder: number
  ) => {
    // 1. Verify Task Exists
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    // 2. Verify Target Column Exists
    const targetColumn = await columnRepository.findById(targetColumnId);
    if (!targetColumn) {
      throw new AppError("Target column not found", 404);
    }

    // 3. Verify Ownership (via Board)
    // We cast to any because the repository include type might need explicit typing in a larger app,
    // but at runtime 'column.board' exists.
    const taskBoardId = (task as any).column.boardId;
    const targetBoardId = targetColumn.boardId;

    if (taskBoardId !== targetBoardId) {
      throw new AppError("Cannot move task to a different board", 400);
    }

    // Check if user owns the board
    const boardOwnerId = (task as any).column.board.ownerId;
    if (boardOwnerId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    // 4. Perform Move
    return taskRepository.updatePosition(taskId, targetColumnId, newOrder);
  },
};
