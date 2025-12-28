import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { BoardGrid } from "../components/boards/BoardGrid";
import type { Board } from "../components/boards/BoardCard";
import { CreateBoardModal } from "../components/boards/CreateBoardModal";
import { JoinModal } from "../components/modals/JoinModal";
import { Button } from "../components/ui/Button";
import { Icons } from "../components/ui/Icons";

interface BoardsPageProps {
  onLogout: () => void;
  boards: Board[];
  onCreateBoard: (data: {
    name: string;
    description: string;
    template: string;
  }) => string;
  onToggleFavorite: (id: string) => void;
}

export const BoardsPage: React.FC<BoardsPageProps> = ({
  onLogout,
  boards,
  onCreateBoard,
  onToggleFavorite,
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const filteredBoards =
    filter === "all" ? boards : boards.filter((b) => b.isFavorite);

  const handleJoinBoard = async (code: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (code === "FAIL") {
          reject(new Error("This code has expired or is invalid."));
        } else if (code === "MEMBER") {
          reject(new Error("You are already a member of this board."));
        } else {
          // Success
          console.log(`Joined board with code: ${code}`);
          resolve();
        }
      }, 1000);
    });
  };

  const handleCreate = (data: {
    name: string;
    description: string;
    template: string;
  }) => {
    const newBoardId = onCreateBoard(data);
    navigate(`/boards/${newBoardId}`);
  };

  const handleBoardClick = (id: string) => {
    navigate(`/boards/${id}`);
  };

  return (
    <DashboardLayout onLogout={onLogout}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Workspace
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your projects and collaborate with your team.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="!w-auto"
              onClick={() => setIsJoinModalOpen(true)}
            >
              Join Board
            </Button>

            {/* Simple Filter Tabs */}
            <div className="flex p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-colors">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filter === "all"
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                All Boards
              </button>
              <button
                onClick={() => setFilter("favorites")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filter === "favorites"
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Favorites
              </button>
            </div>
          </div>
        </div>

        {/* Boards Grid */}
        <BoardGrid
          boards={filteredBoards}
          onCreateBoard={() => setIsCreateModalOpen(true)}
          onBoardClick={handleBoardClick}
          onToggleFavorite={onToggleFavorite}
        />

        {/* Empty State Helper */}
        {filteredBoards.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
            <div className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600">
              <Icons.Kanban className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No boards found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filter === "favorites"
                ? "You haven't starred any boards yet."
                : "Get started by creating a new board."}
            </p>
            {filter !== "favorites" && (
              <div className="mt-6">
                <Button
                  onClick={() => setFilter("all")}
                  variant="secondary"
                  className="max-w-xs mx-auto"
                >
                  View all boards
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoinBoard}
        type="board"
      />
    </DashboardLayout>
  );
};
