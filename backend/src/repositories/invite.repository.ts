// 🔢 1️⃣ START: Fix findByToken Return Type
import { prisma } from "../lib/prisma";
import { Prisma, BoardInvite } from "../generated/prisma/client.js";

// Define a type that includes the Board relation
type InviteWithBoard = Prisma.BoardInviteGetPayload<{
  include: { board: true };
}>;

export const inviteRepository = {
  create: async (
    boardId: string,
    email: string,
    token: string,
    expiresAt: Date
  ): Promise<BoardInvite> => {
    return prisma.boardInvite.create({
      data: {
        boardId,
        email,
        token,
        expiresAt,
      },
    });
  },

  // FIX: Updated return type from 'BoardInvite' to 'InviteWithBoard'
  findByToken: async (token: string): Promise<InviteWithBoard | null> => {
    return prisma.boardInvite.findUnique({
      where: { token },
      include: { board: true }, // This data was being fetched but hidden by TS types
    });
  },

  markAccepted: async (id: string): Promise<BoardInvite> => {
    return prisma.boardInvite.update({
      where: { id },
      data: { accepted: true },
    });
  },

  findPendingByEmail: async (boardId: string, email: string) => {
    return prisma.boardInvite.findFirst({
      where: {
        boardId,
        email,
        accepted: false,
        expiresAt: { gt: new Date() },
      },
    });
  },
};
