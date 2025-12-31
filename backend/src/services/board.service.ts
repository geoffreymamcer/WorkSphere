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
