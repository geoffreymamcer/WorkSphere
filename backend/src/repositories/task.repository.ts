import { prisma } from "../lib/prisma";
import { Task } from "../generated/prisma/client.js";

export const taskRepository = {
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
    order: number
  ): Promise<Task> => {
    return prisma.task.create({
      data: {
        columnId,
        title,
        order,
      },
    });
  },

  findById: async (id: string): Promise<Task | null> => {
    return prisma.task.findUnique({
      where: { id },
      include: { column: { include: { board: true } } }, // Include relations for permission checks
    });
  },

  updatePosition: async (
    taskId: string,
    columnId: string,
    newOrder: number
  ): Promise<Task> => {
    return prisma.$transaction(async (tx) => {
      // 1. Shift existing tasks in the target column down to make space
      await tx.task.updateMany({
        where: {
          columnId,
          order: {
            gte: newOrder,
          },
          id: {
            not: taskId, // Don't shift self if already in column (though usually we move columns)
          },
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });

      // 2. Move the task to the new hole
      return tx.task.update({
        where: { id: taskId },
        data: {
          columnId,
          order: newOrder,
        },
      });
    });
  },
};
