import { prisma } from "../lib/prisma";
import { Prisma, Board } from "../generated/prisma/client.js";

export const boardRepository = {
  create: async (
    data: Prisma.BoardCreateInput,
    initialColumns: { title: string; order: number }[] = []
  ): Promise<Board> => {
    return prisma.$transaction(async (tx) => {
      const board = await tx.board.create({
        data,
      });

      if (initialColumns.length > 0) {
        await tx.column.createMany({
          data: initialColumns.map((col) => ({
            ...col,
            boardId: board.id,
          })),
        });
      }

      return board;
    });
  },

  findById: async (id: string, userId: string): Promise<Board | null> => {
    return prisma.board.findUnique({
      where: {
        id,
        ownerId: userId,
      },
      include: {
        columns: {
          orderBy: {
            order: "asc",
          },
          include: {
            tasks: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });
  },
  findAllByUserId: async (userId: string): Promise<Board[]> => {
    return prisma.board.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
