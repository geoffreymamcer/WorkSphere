import React from "react";
import type { Board } from "./BoardCard";
import { BoardCard } from "./BoardCard";
import { CreateBoardCard } from "./CreateBoardCard";

interface BoardGridProps {
  boards: Board[];
  onCreateBoard: () => void;
  onBoardClick: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const BoardGrid: React.FC<BoardGridProps> = ({
  boards,
  onCreateBoard,
  onBoardClick,
  onToggleFavorite,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      <CreateBoardCard onClick={onCreateBoard} />
      {boards.map((board) => (
        <BoardCard
          key={board.id}
          board={board}
          onClick={onBoardClick}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};
