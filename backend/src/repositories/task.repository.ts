import { prisma } from "../lib/prisma";
import { Task } from "../generated/prisma/client.js";

export const taskRepository = {
  update: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      priority?: string;
      dueDate?: Date | null;
    }
  ): Promise<Task> => {
    return prisma.task.update({
      where: { id },
      data,
    });
  },

  findMaxOrder: async (columnId: string): Promise<number> => {
    const result = await prisma.task.aggregate({
      where: { columnId },
      _max: { order: true },
    });
    return result._max.order ?? -1;
  },

  create: async (
    columnId: string,
    title: string,
    order: number,
    assigneeId?: string
  ): Promise<Task> => {
    return prisma.task.create({
      data: {
        columnId,
        title,
        order,
        assigneeId,
      },
    });
  },

  findById: async (id: string): Promise<Task | null> => {
    return prisma.task.findUnique({
      where: { id },
      include: { column: { include: { board: true } } },
    });
  },

  findByAssignee: async (userId: string): Promise<any[]> => {
    return prisma.task.findMany({
      where: {
        assigneeId: userId,
      },
      include: {
        column: {
          include: {
            board: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    });
  },

  updatePosition: async (
    taskId: string,
    targetColumnId: string,
    newOrder: number
  ): Promise<Task> => {
    return prisma.$transaction(async (tx) => {
      const currentTask = await tx.task.findUnique({
        where: { id: taskId },
      });
      if (!currentTask) throw new Error("Task not found");

      const oldColumnId = currentTask.columnId;
      const oldOrder = currentTask.order;

      if (oldColumnId === targetColumnId) {
        if (newOrder > oldOrder) {
          await tx.task.updateMany({
            where: {
              columnId: targetColumnId,
              order: { gt: oldOrder, lte: newOrder },
              id: { not: taskId },
            },
            data: { order: { decrement: 1 } },
          });
        } else if (newOrder < oldOrder) {
          await tx.task.updateMany({
            where: {
              columnId: targetColumnId,
              order: { gte: newOrder, lt: oldOrder },
              id: { not: taskId },
            },
            data: { order: { increment: 1 } },
          });
        }
      } else {
        await tx.task.updateMany({
          where: {
            columnId: oldColumnId,
            order: { gt: oldOrder },
          },
          data: { order: { decrement: 1 } },
        });

        await tx.task.updateMany({
          where: {
            columnId: targetColumnId,
            order: { gte: newOrder },
          },
          data: { order: { increment: 1 } },
        });
      }

      return tx.task.update({
        where: { id: taskId },
        data: {
          columnId: targetColumnId,
          order: newOrder,
        },
      });
    });
  },
  updateAssignment: async (
    taskId: string,
    assigneeId: string | null
  ): Promise<Task> => {
    return prisma.task.update({
      where: { id: taskId },
      data: { assigneeId },
      include: { assignee: true },
    });
  },
};
