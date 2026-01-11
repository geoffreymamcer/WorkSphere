import { dashboardRepository } from "../repositories/dashboard.repository";

export const dashboardService = {
  getActiveBoards: async (userId: string) => {
    const boards = await dashboardRepository.findActiveBoards(userId);

    return boards.map((board) => {
      const allMembers = [
        {
          id: board.owner.id,
          name: board.owner.name,
          email: board.owner.email,
        },
        ...board.members.map((m) => m.user),
      ];

      const uniqueMembers = Array.from(
        new Map(allMembers.map((m) => [m.id, m])).values()
      );

      return {
        id: board.id,
        name: board.name,
        status: board.status,
        dueDate: board.dueDate,
        members: uniqueMembers,
      };
    });
  },

  getStats: async (userId: string) => {
    return dashboardRepository.getStats(userId);
  },
};
