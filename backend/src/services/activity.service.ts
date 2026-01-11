// 🔢 3️⃣ START: Activity Service
import { activityRepository } from "../repositories/activity.repository";

export const activityService = {
  // Helper to log any activity
  logActivity: async (
    actorId: string,
    type: string,
    entityType: "BOARD" | "TASK" | "TEAM",
    entityId: string,
    context: { boardId?: string; teamId?: string; metadata?: any }
  ) => {
    // Fire and forget (don't await if performance critical, but for data integrity await is safer)
    await activityRepository.create({
      type,
      entityType,
      entityId,
      actor: { connect: { id: actorId } },
      ...(context.boardId && { board: { connect: { id: context.boardId } } }),
      ...(context.teamId && { team: { connect: { id: context.teamId } } }),
      metadata: context.metadata || {},
    });
  },

  getRecentActivity: async (userId: string) => {
    const logs = await activityRepository.findRecentActivity(userId);

    // Format for frontend
    return logs.map((log) => {
      let description = "";
      const meta = log.metadata as any;

      switch (log.type) {
        case "CREATE_BOARD":
          description = `created board "${meta?.boardName || "New Board"}"`;
          break;
        case "CREATE_TASK":
          description = `added task "${meta?.taskTitle}" to ${meta?.columnName}`;
          break;
        case "MOVE_TASK":
          description = `moved task "${meta?.taskTitle}" to ${meta?.toColumn}`;
          break;
        case "UPDATE_TASK":
          description = `updated task "${meta?.taskTitle}"`;
          break;
        case "JOIN_TEAM":
          description = `joined team`;
          break;
        case "JOIN_BOARD":
          description = `joined board "${meta?.boardName}"`;
          break;
        default:
          description = "performed an action";
      }

      return {
        id: log.id,
        actor: log.actor,
        description,
        boardName: log.board?.name,
        createdAt: log.createdAt,
        type: log.type,
      };
    });
  },
};
// 🔢 3️⃣ END: Activity Service
