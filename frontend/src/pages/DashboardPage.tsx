// 🔢 1️⃣ START: Full DashboardPage Code
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { StatCard } from "../components/dashboard/StatCard";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { CreateBoardModal } from "../components/boards/CreateBoardModal";
import { Icons } from "../components/ui/Icons";
import { Button } from "../components/ui/Button";
import { boardService } from "../services/board.service";

interface DashboardPageProps {
  // onLogout is handled by DashboardLayout internally via context
}

export const DashboardPage: React.FC<DashboardPageProps> = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // FIX: Handle API call here instead of inside the modal
  const handleCreateBoard = async (data: {
    name: string;
    description: string;
    template: string;
  }) => {
    try {
      const newBoard = await boardService.create(data);
      // Navigate immediately to the new board
      navigate(`/boards/${newBoard.id}`);
    } catch (e) {
      console.error(e);
      // Re-throw to let the modal know (if modal handled errors)
      // or handle error display here
      throw e;
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header Actions */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-8 mb-8">
        <StatCard
          title="Active Projects"
          value="12"
          trend="+2.5%"
          trendUp={true}
          icon={Icons.Kanban}
        />
        <StatCard
          title="Pending Tasks"
          value="48"
          trend="-4%"
          trendUp={true}
          icon={Icons.CheckSquare}
        />
        <StatCard title="Team Members" value="24" icon={Icons.Users} />
        <StatCard
          title="Productivity"
          value="94%"
          trend="+12%"
          trendUp={true}
          icon={Icons.LayoutGrid}
        />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Left Column (2/3 on lg, 3/4 on xl) - Active Boards List */}
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

            {/* 
              NOTE: This table currently uses static data for visual purposes.
              To make this dynamic, you would fetch boards using boardService.getAll() 
              inside a useEffect here, similar to BoardsPage.tsx.
            */}
            <div className="overflow-x-auto">
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
                  {[
                    {
                      name: "Website Redesign",
                      status: "In Progress",
                      date: "Oct 24, 2023",
                      members: 4,
                    },
                    {
                      name: "Mobile App",
                      status: "Review",
                      date: "Nov 12, 2023",
                      members: 8,
                    },
                    {
                      name: "Marketing Campaign",
                      status: "Planning",
                      date: "Dec 01, 2023",
                      members: 3,
                    },
                    {
                      name: "Internal Tools",
                      status: "In Progress",
                      date: "Oct 30, 2023",
                      members: 2,
                    },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {row.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                          ${
                            row.status === "In Progress"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : row.status === "Review"
                              ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {row.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2 overflow-hidden">
                          {[...Array(row.members)].slice(0, 4).map((_, i) => (
                            <div
                              key={i}
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-300"
                            >
                              {String.fromCharCode(65 + i)}
                            </div>
                          ))}
                          {row.members > 4 && (
                            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-medium text-gray-500 dark:text-gray-400">
                              +{row.members - 4}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 on lg, 1/4 on xl) - Activity */}
        <div className="lg:col-span-1 xl:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      {/* Modals */}
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateBoard}
      />
    </DashboardLayout>
  );
};
