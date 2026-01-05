import { taskRepository } from "../repositories/task.repository";
import { columnRepository } from "../repositories/column.repository";
import { boardRepository } from "../repositories/board.repository";
import { AppError } from "../utils/AppError";
import { getIO } from "../lib/socket";

export const taskService = {
  createTask: async (userId: string, listId: string, title: string) => {
    const list = await columnRepository.findById(listId);
    if (!list) throw new AppError("List not found", 404);

    const hasAccess = await boardRepository.hasAccess(list.boardId, userId);
    if (!hasAccess)
      throw new AppError("Unauthorized access to this board", 403);

    const maxOrder = await taskRepository.findMaxOrder(listId);

    const newTask = await taskRepository.create(
      listId,
      title,
      maxOrder + 1,
      userId
    );

    getIO().to(`board:${list.boardId}`).emit("task:created", newTask);

    return newTask;
  },

  moveTask: async (
    userId: string,
    taskId: string,
    targetColumnId: string,
    newOrder: number
  ) => {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new AppError("Task not found", 404);

    const targetColumn = await columnRepository.findById(targetColumnId);
    if (!targetColumn) throw new AppError("Target column not found", 404);

    const taskBoardId = (task as any).column.boardId;
    const targetBoardId = targetColumn.boardId;

    if (taskBoardId !== targetBoardId)
      throw new AppError("Cannot move task to different board", 400);

    const hasAccess = await boardRepository.hasAccess(taskBoardId, userId);
    if (!hasAccess) throw new AppError("Unauthorized", 403);

    const updatedTask = await taskRepository.updatePosition(
      taskId,
      targetColumnId,
      newOrder
    );

    getIO().to(`board:${taskBoardId}`).emit("task:moved", {
      taskId,
      targetColumnId,
      newOrder,
      task: updatedTask,
    });

    return updatedTask;
  },

  updateTask: async (userId: string, taskId: string, data: any) => {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new AppError("Task not found", 404);

    const taskBoardId = (task as any).column.boardId;
    const hasAccess = await boardRepository.hasAccess(taskBoardId, userId);
    if (!hasAccess) throw new AppError("Unauthorized", 403);

    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.priority) updateData.priority = data.priority;
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    const updatedTask = await taskRepository.update(taskId, updateData);

    getIO().to(`board:${taskBoardId}`).emit("task:updated", updatedTask);

    return updatedTask;
  },

  getMyTasks: async (userId: string) => {
    const tasks = await taskRepository.findByAssignee(userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const classified = tasks.map((t: any) => {
      const isCompleted = t.column.title === "Done";

      let status = "active";
      if (isCompleted) {
        status = "completed";
      } else if (t.dueDate) {
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);

        if (due < today) status = "overdue";
        else if (due.getTime() === today.getTime()) status = "today";
        else status = "upcoming";
      }

      return {
        ...t,
        boardName: t.column.board.name,
        isCompleted,
        status,
      };
    });

    return classified;
  },

  assignTask: async (
    userId: string,
    taskId: string,
    assigneeId: string | null
  ) => {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new AppError("Task not found", 404);

    const boardId = (task as any).column.boardId;

    const requesterAccess = await boardRepository.hasAccess(boardId, userId);
    if (!requesterAccess) throw new AppError("Unauthorized", 403);

    if (assigneeId) {
      const isMember = await boardRepository.isMember(boardId, assigneeId);
      const board = await boardRepository.findRawById(boardId);
      const isOwner = board?.ownerId === assigneeId;

      if (!isMember && !isOwner) {
        throw new AppError("Assignee must be a member of the board", 400);
      }
    }

    const updatedTask = await taskRepository.updateAssignment(
      taskId,
      assigneeId
    );

    getIO().to(`board:${boardId}`).emit("task:updated", updatedTask);

    return updatedTask;
  },
};
