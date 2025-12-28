import React from "react";
import { Icons } from "../ui/Icons";

interface CreateBoardCardProps {
  onClick?: () => void;
}

export const CreateBoardCard: React.FC<CreateBoardCardProps> = ({
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center h-48 w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 hover:text-[#4F46E5] dark:hover:text-indigo-400 hover:border-[#4F46E5] dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
    >
      <div className="h-12 w-12 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-[#4F46E5] dark:group-hover:border-indigo-500 transition-all duration-200 mb-3">
        <Icons.Plus className="h-6 w-6" />
      </div>
      <span className="text-sm font-semibold">Create new board</span>
      <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        Start from scratch or use a template
      </span>
    </button>
  );
};
