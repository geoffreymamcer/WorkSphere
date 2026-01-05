import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { BoardGrid } from "../components/boards/BoardGrid";
import { CreateBoardModal } from "../components/boards/CreateBoardModal";
import { JoinModal } from "../components/modals/JoinModal";
import { Button } from "../components/ui/Button";
import { Icons } from "../components/ui/Icons";
import { boardService } from "../services/board.service";

interface UIBoard {
  id: string;
  title: string;
  description?: string;
  lastUpdated: string;
  memberCount: number;
  isFavorite: boolean;
  template: "kanban" | "tasks" | "blank";
}

interface BoardsPageProps {
  onLogout?: () => void;
}

export const BoardsPage: React.FC<BoardsPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // State for fetching
  const [boards, setBoards] = useState<UIBoard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Boards on Mount
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setIsLoading(true);
        const data = await boardService.getAll();

        // Map Backend Data to UI Data
        const mappedBoards: UIBoard[] = data.map((b) => ({
          id: b.id,
          title: b.name,
          description: b.description || "No description",
          lastUpdated: new Date(b.createdAt).toLocaleDateString(),
          memberCount: 1,
          isFavorite: false,
          template: (b.template as UIBoard["template"]) || "blank",
        }));

        setBoards(mappedBoards);
      } catch (error) {
        console.error("Failed to load boards", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const filteredBoards =
    filter === "all" ? boards : boards.filter((b) => b.isFavorite);

  const handleJoinBoard = async (code: string) => {
    const result = await boardService.acceptInvite(code);

    // Navigate to the joined board
    navigate(`/boards/${result.boardId}`);
  };

  // Updated to receive the full board object from the modal
  const handleCreate = (newBoard: any) => {
    // Optimistic update or just navigate
    navigate(`/boards/${newBoard.id}`);
  };

  const handleBoardClick = (id: string) => {
    navigate(`/boards/${id}`);
  };

  // Dummy toggle since backend doesn't support favorites yet
  const handleToggleFavorite = (id: string) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b))
    );
  };

  return (
    <DashboardLayout>
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

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Boards Grid */}
            <BoardGrid
              boards={filteredBoards as any} // Casting for compatibility
              onCreateBoard={() => setIsCreateModalOpen(true)}
              onBoardClick={handleBoardClick}
              onToggleFavorite={handleToggleFavorite}
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
                      onClick={() => setIsCreateModalOpen(true)}
                      variant="primary"
                      className="max-w-xs mx-auto"
                    >
                      Create your first board
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
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
