import { prisma } from "../lib/prisma";
import { Prisma, Team, TeamMember } from "../generated/prisma/client.js";

type TeamWithMembers = Prisma.TeamGetPayload<{
  include: { members: { include: { user: true } } };
}>;

type TeamWithMemberCounts = Prisma.TeamGetPayload<{
  include: { members: { select: { userId: true } } };
}>;

export const teamRepository = {
  create: async (
    userId: string,
    name: string,
    description?: string
  ): Promise<Team> => {
    return prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: { name, description, ownerId: userId },
      });
      await tx.teamMember.create({
        data: { teamId: team.id, userId, role: "OWNER" },
      });
      return team;
    });
  },

  findAllByUserId: async (userId: string): Promise<TeamWithMemberCounts[]> => {
    return prisma.team.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        members: { select: { userId: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: async (
    teamId: string,
    userId: string
  ): Promise<TeamWithMembers | null> => {
    return prisma.team.findFirst({
      where: {
        id: teamId,
        members: { some: { userId } },
      },
      include: {
        members: { include: { user: true } },
      },
    });
  },

  findRawById: async (id: string): Promise<Team | null> => {
    return prisma.team.findUnique({ where: { id } });
  },

  isMember: async (teamId: string, userId: string): Promise<boolean> => {
    const count = await prisma.teamMember.count({
      where: { teamId, userId },
    });
    return count > 0;
  },

  getMembers: async (teamId: string) => {
    return prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { role: "asc" },
    });
  },
  addMember: async (
    teamId: string,
    userId: string,
    role: string = "MEMBER"
  ): Promise<TeamMember> => {
    return prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role,
      },
    });
  },
};
