import React from "react";
import { Icons } from "../ui/Icons";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Member" | "Viewer";
  avatarUrl?: string;
}

interface TeamMemberRowProps {
  member: TeamMember;
  canManage?: boolean;
}

export const TeamMemberRow: React.FC<TeamMemberRowProps> = ({
  member,
  canManage,
}) => {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center gap-4">
        {/* Avatar / Initials */}
        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            member.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {member.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {member.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`
            inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border border-transparent
            ${
              member.role === "Admin"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700/30"
                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            }
        `}
        >
          {member.role}
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
