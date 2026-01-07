import { prisma } from "../lib/prisma";
import { Prisma, TeamInviteCode } from "../generated/prisma/client.js";

// Define a type that includes the Team relation
type InviteWithTeam = Prisma.TeamInviteCodeGetPayload<{
  include: { team: true };
}>;

export const teamInviteRepository = {
  create: async (
    teamId: string,
    code: string,
    expiresAt?: Date
  ): Promise<TeamInviteCode> => {
    return prisma.teamInviteCode.create({
      data: {
        teamId,
        code,
        expiresAt,
      },
    });
  },

  // FIX: Update return type to InviteWithTeam
  findByCode: async (code: string): Promise<InviteWithTeam | null> => {
    return prisma.teamInviteCode.findUnique({
      where: { code },
      include: { team: true },
    });
  },

  findActiveByTeamId: async (
    teamId: string
  ): Promise<TeamInviteCode | null> => {
    return prisma.teamInviteCode.findFirst({
      where: { teamId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Invalidate old codes for a team
  deleteByTeamId: async (teamId: string): Promise<void> => {
    await prisma.teamInviteCode.deleteMany({
      where: { teamId },
    });
  },
};
