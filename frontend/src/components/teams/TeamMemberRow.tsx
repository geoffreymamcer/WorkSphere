import React from "react";
import { Icons } from "../ui/Icons";
// Import the interface from service to ensure type safety with API response
import type { TeamMember } from "../../services/team.service";

interface TeamMemberRowProps {
  member: TeamMember;
  canManage?: boolean;
}

export const TeamMemberRow: React.FC<TeamMemberRowProps> = ({
  member,
  canManage,
}) => {
  // Extract user details safely
  const { user, role } = member;
  const displayName = user.name || "Unnamed User";
  const displayEmail = user.email;

  const displayRole = role === "OWNER" || role === "ADMIN" ? "Admin" : "Member";
  const isAdmin = displayRole === "Admin";

  const initials = (displayName || displayEmail || "?")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white ring-2 ring-white dark:ring-gray-800 shadow-sm">
          {initials}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {displayName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {displayEmail}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`
            inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border border-transparent
            ${
              isAdmin
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700/30"
                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            }
        `}
        >
          {displayRole}
        </span>

        {canManage && (
          <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Icons.MoreHorizontal className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
