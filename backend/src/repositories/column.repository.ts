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
      data: {
        boardId,
        title,
        order,
      },
    });
  },
};
