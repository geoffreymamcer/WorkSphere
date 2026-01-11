import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { StatCard } from "../components/dashboard/StatCard";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { CreateBoardModal } from "../components/boards/CreateBoardModal";
import { Icons } from "../components/ui/Icons";
import { Button } from "../components/ui/Button";
import { boardService } from "../services/board.service";
import { dashboardService } from "../services/dashboard.service";
import type {
  ActiveBoard,
  DashboardStats,
} from "../services/dashboard.service";

interface DashboardPageProps {}

export const DashboardPage: React.FC<DashboardPageProps> = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [activeBoards, setActiveBoards] = useState<ActiveBoard[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [boardsData, statsData] = await Promise.all([
          dashboardService.getActiveBoards(),
          dashboardService.getStats(),
        ]);

        setActiveBoards(boardsData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreateBoard = async (data: {
    name: string;
    description: string;
    template: string;
  }) => {
    try {
      const newBoard = await boardService.create(data);
      navigate(`/boards/${newBoard.id}`);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const getInitials = (name: string | null, email: string) => {
    return (name || email).substring(0, 2).toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:truncate">
            Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Here's what's happening in your workspace today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate("/settings")}>
            <span className="flex items-center gap-2">
              <Icons.Settings className="w-4 h-4" />
              Customize
            </span>
          </Button>
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <span className="flex items-center gap-2">
              <Icons.Plus className="w-4 h-4" />
              New Board
            </span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-8 mb-8">
        <StatCard
          title="Active Projects"
          value={isLoading ? "-" : stats?.activeProjects ?? 0}
          icon={Icons.Kanban}
        />
        <StatCard
          title="Pending Tasks"
          value={isLoading ? "-" : stats?.pendingTasks ?? 0}
          icon={Icons.CheckSquare}
        />
        <StatCard
          title="Team Members"
          value={isLoading ? "-" : stats?.teamMembers ?? 0}
          icon={Icons.Users}
        />
        <StatCard
          title="Productivity"
          value={isLoading ? "-" : `${stats?.productivity ?? 0}%`}
          trend={stats?.productivity ? "Last 30 days" : undefined}
          trendUp={true} // Default green
          icon={Icons.LayoutGrid}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden transition-colors">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Active Boards
              </h3>
              <Button
                variant="ghost"
                className="!p-2 !h-auto text-sm"
                onClick={() => navigate("/boards")}
              >
                View all
              </Button>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-12 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : activeBoards.length > 0 ? (
                <table className="min-w-full whitespace-nowrap text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Project Name
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Due Date
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Members
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {activeBoards.map((board) => (
                      <tr
                        key={board.id}
                        onClick={() => navigate(`/boards/${board.id}`)}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {board.name}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                            ${
                              board.status === "IN_PROGRESS"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : board.status === "COMPLETED"
                                ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {board.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                          {board.dueDate ? (
                            new Date(board.dueDate).toLocaleDateString()
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex -space-x-2 overflow-hidden">
                            {board.members.slice(0, 4).map((member) => (
                              <div
                                key={member.id}
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-300"
                                title={member.name || member.email}
                              >
                                {getInitials(member.name, member.email)}
                              </div>
                            ))}
                            {board.members.length > 4 && (
                              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                +{board.members.length - 4}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <p>No active boards found.</p>
                  <Button
                    variant="ghost"
                    className="mt-2 text-sm text-indigo-600"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Create one now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 xl:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateBoard}
      />
    </DashboardLayout>
  );
};
