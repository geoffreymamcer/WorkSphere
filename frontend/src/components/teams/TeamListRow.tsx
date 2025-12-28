import React from "react";
import { Icons } from "../ui/Icons";
import { Button } from "../ui/Button";

export interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  role: "Admin" | "Member" | "Viewer";
}

interface TeamListRowProps {
  team: Team;
  onClick: (id: string) => void;
}

export const TeamListRow: React.FC<TeamListRowProps> = ({ team, onClick }) => {
  return (
    <div
      onClick={() => onClick(team.id)}
      className="group relative flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200"
    >
      <div className="flex-1 min-w-0 pr-8">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors truncate">
            {team.name}
          </h3>
          <span
            className={`
            inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
            ${
              team.role === "Admin"
                ? "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700/30"
                : "bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600"
            }
          `}
          >
            {team.role === "Admin" && <Icons.Shield className="w-3 h-3 mr-1" />}
            {team.role}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
          {team.description}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Icons.Users className="w-4 h-4" />
          <span>{team.memberCount} members</span>
        </div>

        <div className="flex-shrink-0">
          <Button variant="secondary" className="!w-auto !py-2 !px-4">
            View Team
          </Button>
        </div>
      </div>
    </div>
  );
};
