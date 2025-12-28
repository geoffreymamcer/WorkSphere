import React from "react";
import { Icons } from "../ui/Icons";
import { Button } from "../ui/Button";

export type ViewMode = "board" | "list";

interface BoardHeaderProps {
  title: string;
  description?: string;
  teamName: string;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  onBack: () => void;
  onAddList?: () => void;
  onInvite?: () => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({
  title,
  description,
  teamName,
  viewMode,
  onViewChange,
  onBack,
  onAddList,
  onInvite,
}) => {
  return (
    <div className="flex flex-col border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        {/* Breadcrumb / Back */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
          <button
            onClick={onBack}
            className="hover:text-gray-900 dark:hover:text-white transition-colors flex items-center"
          >
            <Icons.ChevronLeft className="w-4 h-4 mr-1" />
            Boards
          </button>
          <span>/</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {teamName}
          </span>
        </div>

        {/* Title Row */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Icons.Star className="w-5 h-5" />
              </button>
            </div>
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
                {description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher */}
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => onViewChange("board")}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  viewMode === "board"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icons.Kanban className="w-4 h-4" />
                Board
              </button>
              <button
                onClick={() => onViewChange("list")}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icons.Menu className="w-4 h-4" />
                List
              </button>
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block" />

            {/* Avatars */}
            <div className="flex -space-x-2 mr-2">
              <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                AM
              </div>
              <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300">
                SC
              </div>
              <button
                onClick={onInvite}
                className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
                title="Invite Members"
              >
                <Icons.Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block" />

            {/* Actions */}
            <Button
              onClick={onInvite}
              className="!w-auto !bg-indigo-50 !text-indigo-700 hover:!bg-indigo-100 border-indigo-100 dark:!bg-indigo-900/30 dark:!text-indigo-300 dark:border-indigo-800 hidden sm:flex"
            >
              <Icons.Users className="w-4 h-4 mr-2" />
              Invite
            </Button>

            <Button variant="secondary" className="!w-auto hidden lg:flex">
              <Icons.Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>

            <Button onClick={onAddList} className="!w-auto">
              <Icons.Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add List</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
