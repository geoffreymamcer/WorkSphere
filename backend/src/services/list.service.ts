import { columnRepository } from "../repositories/column.repository";
import { boardRepository } from "../repositories/board.repository";
import { AppError } from "../utils/AppError";
import { getIO } from "../lib/socket";

export const listService = {
  createList: async (userId: string, boardId: string, name: string) => {
    const hasAccess = await boardRepository.hasAccess(boardId, userId);
    if (!hasAccess) throw new AppError("Board not found or unauthorized", 404);

    const maxOrder = await columnRepository.findMaxOrder(boardId);
    const newList = await columnRepository.create(boardId, name, maxOrder + 1);

    // Broadcast Event
    getIO().to(`board:${boardId}`).emit("list:created", newList);

    return newList;
  },

  updateList: async (userId: string, listId: string, name: string) => {
    const list = await columnRepository.findById(listId);
    if (!list) throw new AppError("List not found", 404);

    const hasAccess = await boardRepository.hasAccess(list.boardId, userId);
    if (!hasAccess) throw new AppError("Unauthorized", 403);

    const updatedList = await columnRepository.update(listId, { title: name });

    // Broadcast Event
    getIO().to(`board:${list.boardId}`).emit("list:updated", updatedList);

    return updatedList;
  },

  moveList: async (userId: string, listId: string, newOrder: number) => {
    const list = await columnRepository.findById(listId);
    if (!list) throw new AppError("List not found", 404);

    const hasAccess = await boardRepository.hasAccess(list.boardId, userId);
    if (!hasAccess) throw new AppError("Unauthorized", 403);

    const updatedList = await columnRepository.updateOrder(
      listId,
      list.boardId,
      newOrder
    );

    // Broadcast Event
    getIO().to(`board:${list.boardId}`).emit("list:moved", {
      listId,
      newOrder,
      list: updatedList,
    });

    return updatedList;
  },
};
