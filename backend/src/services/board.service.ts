import { boardRepository } from "../repositories/board.repository";
import { CreateBoardInput } from "../validators/board.schema";
import { AppError } from "../utils/AppError"; // Import AppError

export const boardService = {
  createBoard: async (userId: string, input: CreateBoardInput) => {
    const { name, description, template } = input;

    let initialColumns: { title: string; order: number }[] = [];

    if (template === "kanban") {
      initialColumns = [
        { title: "To Do", order: 0 },
        { title: "In Progress", order: 1 },
        { title: "Done", order: 2 },
      ];
    } else if (template === "tasks") {
      initialColumns = [{ title: "My Tasks", order: 0 }];
    }

    const board = await boardRepository.create(
      {
        name,
        description: description || "",
        template,
        owner: { connect: { id: userId } },
      },
      initialColumns
    );

    return board;
  },

  getBoardMembers: async (userId: string, boardId: string) => {
    // 1. Check Access
    const hasAccess = await boardRepository.hasAccess(boardId, userId);
    if (!hasAccess) throw new AppError("Unauthorized", 403);

    // 2. Fetch Members
    const members = await boardRepository.getMembers(boardId);

    // 3. Include Owner (since they aren't always in boardMembers table depending on logic, but usually should be handled.
    // For simplicity, we assume members table has invited people. Owner details might need separate fetch if not in members table.
    // Ideally, owner should be added to members table on creation, but let's fetch owner too just in case.)
    const board = await boardRepository.findRawById(boardId);

    // Determine the result list
    // Note: If you want the Owner to appear in the list, you might need to fetch the owner user details via a userRepository if not already in members.
    // For this specific request, let's return the members list.
    return members;
  },

  // NEW METHOD
  getBoard: async (userId: string, boardId: string) => {
    const board = await boardRepository.findById(boardId, userId);

    if (!board) {
      throw new AppError("Board not found", 404);
    }

    return board;
  },
  getUserBoards: async (userId: string) => {
    return boardRepository.findAllByUserId(userId);
  },
};
