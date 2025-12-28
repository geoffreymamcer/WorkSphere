import React from "react";
import { Icons } from "../ui/Icons";

export interface Board {
  id: string;
  title: string;
  description?: string;
  lastUpdated: string;
  memberCount: number;
  isFavorite?: boolean;
  template?: "kanban" | "tasks" | "blank";
}

interface BoardCardProps {
  board: Board;
  onClick?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export const BoardCard: React.FC<BoardCardProps> = ({
  board,
  onClick,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={() => onClick?.(board.id)}
      className="group relative flex flex-col justify-between h-48 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] cursor-pointer transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-0.5"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors line-clamp-1 pr-2">
            {board.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(board.id);
            }}
            className="flex-shrink-0 p-0.5 -mt-0.5 -mr-1 text-gray-300 dark:text-gray-600 hover:text-yellow-400 dark:hover:text-yellow-400 hover:scale-110 transition-all focus:outline-none"
            aria-label={
              board.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Icons.Star
              className={`w-5 h-5 ${
                board.isFavorite ? "text-yellow-400 fill-yellow-400" : ""
              }`}
            />
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
          {board.description || "No description provided."}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
        <div className="flex items-center gap-1">
          <Icons.Clock className="w-3.5 h-3.5" />
          <span>{board.lastUpdated}</span>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300 font-medium">
          <Icons.Users className="w-3.5 h-3.5" />
          <span>{board.memberCount}</span>
        </div>
      </div>
    </div>
  );
};
