import { columnRepository } from "../repositories/column.repository";
import { boardRepository } from "../repositories/board.repository";
import { AppError } from "../utils/AppError";

export const listService = {
  createList: async (userId: string, boardId: string, name: string) => {
    // 1. Verify Board Ownership
    const board = await boardRepository.findById(boardId, userId);
    if (!board) {
      throw new AppError("Board not found or unauthorized", 404);
    }

    // 2. Determine Position
    const maxOrder = await columnRepository.findMaxOrder(boardId);
    const newOrder = maxOrder + 1;

    // 3. Create List
    return columnRepository.create(boardId, name, newOrder);
  },
};
