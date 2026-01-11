// 🔢 2️⃣ START: Dashboard Repository
import { prisma } from "../lib/prisma";

export const dashboardRepository = {
  findActiveBoards: async (userId: string) => {
    return prisma.board.findMany({
      where: {
        AND: [
          {
            OR: [
              { ownerId: userId },
              { members: { some: { userId } } },
              { team: { members: { some: { userId } } } },
            ],
          },
          {
            status: { not: "ARCHIVED" }, // Exclude archived
          },
        ],
      },
      select: {
        id: true,
        name: true,
        status: true,
        dueDate: true,
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          take: 5, // Fetch limited members for UI preview
        },
        owner: {
          // Also include owner as a member visually
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { dueDate: "asc" }, // Nearest due date first
        { updatedAt: "desc" },
      ],
      take: 10, // Limit to top 10 for dashboard view
    });
  },

  getStats: async (userId: string) => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return prisma.$transaction(async (tx) => {
      // 1. Active Projects (Boards)
      const activeProjects = await tx.board.count({
        where: {
          AND: [
            {
              OR: [
                { ownerId: userId },
                { members: { some: { userId } } },
                { team: { members: { some: { userId } } } },
              ],
            },
            { status: { not: "ARCHIVED" } },
          ],
        },
      });

      const pendingTasks = await tx.task.count({
        where: {
          assigneeId: userId,
          column: { title: { not: "Done" } },
        },
      });

      const userTeams = await tx.team.findMany({
        where: { members: { some: { userId } } },
        select: { id: true },
      });

      const teamIds = userTeams.map((t) => t.id);

      const teamMembers = await tx.teamMember.findMany({
        where: { teamId: { in: teamIds } },
        select: { userId: true },
        distinct: ["userId"],
      });

      const recentTasks = await tx.task.findMany({
        where: {
          assigneeId: userId,
          updatedAt: { gte: thirtyDaysAgo },
        },
        include: { column: true },
      });

      const totalRecent = recentTasks.length;
      const completedRecent = recentTasks.filter(
        (t) => t.column.title === "Done"
      ).length;

      const productivity =
        totalRecent > 0 ? Math.round((completedRecent / totalRecent) * 100) : 0;

      return {
        activeProjects,
        pendingTasks,
        teamMembers: teamMembers.length,
        productivity,
      };
    });
  },
};
