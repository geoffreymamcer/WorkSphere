import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client.js";

export const activityRepository = {
  create: async (data: Prisma.ActivityLogCreateInput) => {
    return prisma.activityLog.create({ data });
  },

  findRecentActivity: async (userId: string) => {
    return prisma.activityLog.findMany({
      where: {
        OR: [
          // 1. Actions performed by user
          { actorId: userId },
          // 2. Actions on boards user is a member/owner of
          {
            board: {
              OR: [
                { ownerId: userId },
                { members: { some: { userId } } },
                { team: { members: { some: { userId } } } },
              ],
            },
          },
          // 3. Actions on teams user is a member of
          {
            team: {
              members: { some: { userId } },
            },
          },
        ],
      },
      include: {
        actor: {
          select: { id: true, name: true, email: true },
        },
        board: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  },
};
