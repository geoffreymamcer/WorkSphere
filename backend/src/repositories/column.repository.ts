import { prisma } from "../lib/prisma";
import { Column } from "../generated/prisma/client.js";

export const columnRepository = {
  findById: async (id: string) => {
    return prisma.column.findUnique({
      where: { id },
      include: { board: true },
    });
  },

  findMaxOrder: async (boardId: string): Promise<number> => {
    const result = await prisma.column.aggregate({
      where: { boardId },
      _max: { order: true },
    });
    return result._max.order ?? -1;
  },

  create: async (
    boardId: string,
    title: string,
    order: number
  ): Promise<Column> => {
    return prisma.column.create({
      data: { boardId, title, order },
    });
  },

  update: async (id: string, data: { title: string }): Promise<Column> => {
    return prisma.column.update({
      where: { id },
      data,
    });
  },

  updateOrder: async (
    id: string,
    boardId: string,
    newOrder: number
  ): Promise<Column> => {
    return prisma.$transaction(async (tx) => {
      // 1. Get the current order of the column we are moving
      const currentColumn = await tx.column.findUnique({
        where: { id },
      });

      if (!currentColumn) {
        throw new Error("Column not found");
      }

      const oldOrder = currentColumn.order;

      // 2. Shift other columns based on direction
      if (newOrder > oldOrder) {
        // MOVING DOWN/RIGHT (e.g., 0 -> 2)
        // Shift items between old and new positions to the LEFT (-1)
        await tx.column.updateMany({
          where: {
            boardId,
            order: {
              gt: oldOrder,
              lte: newOrder,
            },
            id: { not: id },
          },
          data: {
            order: { decrement: 1 },
          },
        });
      } else if (newOrder < oldOrder) {
        // MOVING UP/LEFT (e.g., 2 -> 0)
        // Shift items between new and old positions to the RIGHT (+1)
        await tx.column.updateMany({
          where: {
            boardId,
            order: {
              gte: newOrder,
              lt: oldOrder,
            },
            id: { not: id },
          },
          data: {
            order: { increment: 1 },
          },
        });
      }

      // 3. Update the target column to its new position
      return tx.column.update({
        where: { id },
        data: { order: newOrder },
      });
    });
  },
};
