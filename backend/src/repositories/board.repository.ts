import { prisma } from "../lib/prisma";
import { Prisma, Board, BoardMember } from "../generated/prisma/client.js";

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
    return prisma.board.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
          { team: { members: { some: { userId } } } },
        ],
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        columns: {
          orderBy: { order: "asc" },
          include: {
            tasks: {
              orderBy: { order: "asc" },
              include: {
                assignee: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
    });
  },
  getMembers: async (boardId: string) => {
    return prisma.boardMember.findMany({
      where: { boardId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  findAllByUserId: async (userId: string): Promise<Board[]> => {
    return prisma.board.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      orderBy: { createdAt: "desc" },
    });
  },

  addMember: async (
    boardId: string,
    userId: string,
    role: string = "MEMBER"
  ): Promise<BoardMember> => {
    return prisma.boardMember.create({
      data: {
        boardId,
        userId,
        role,
      },
    });
  },

  isMember: async (boardId: string, userId: string): Promise<boolean> => {
    const member = await prisma.boardMember.findFirst({
      where: {
        boardId: boardId,
        userId: userId,
      },
    });
    return !!member;
  },

  findRawById: async (id: string): Promise<Board | null> => {
    return prisma.board.findUnique({ where: { id } });
  },
  hasAccess: async (boardId: string, userId: string): Promise<boolean> => {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { ownerId: true, teamId: true },
    });

    if (!board) return false;

    if (board.ownerId === userId) return true;

    const isMember = await prisma.boardMember.count({
      where: { boardId, userId },
    });
    if (isMember > 0) return true;

    if (board.teamId) {
      const isTeamMember = await prisma.teamMember.count({
        where: { teamId: board.teamId, userId },
      });
      if (isTeamMember > 0) return true;
    }

    return false;
  },

  findAllByTeamId: async (teamId: string): Promise<Board[]> => {
    return prisma.board.findMany({
      where: { teamId },
      orderBy: { createdAt: "desc" },
    });
  },
};
