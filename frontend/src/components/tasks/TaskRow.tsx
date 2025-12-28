import React from "react";
import { Icons } from "../ui/Icons";

export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  boardName: string;
  dueDate: string; // ISO format YYYY-MM-DD
  priority: TaskPriority;
  isCompleted: boolean;
}

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  isOverdue?: boolean;
  isToday?: boolean;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onToggle,
  isOverdue = false,
  isToday = false,
}) => {
  return (
    <div
      className={`
      group flex items-center py-3 px-3 -mx-3 rounded-lg border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150
      ${task.isCompleted ? "opacity-60" : "opacity-100"}
    `}
    >
      {/* Checkbox Area */}
      <div className="flex-shrink-0 mr-4">
        <button
          onClick={() => onToggle(task.id)}
          className={`
            h-5 w-5 rounded border flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-[#4F46E5]
            ${
              task.isCompleted
                ? "bg-[#4F46E5] border-[#4F46E5]"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-[#4F46E5] dark:hover:border-indigo-400"
            }
          `}
          aria-label={
            task.isCompleted ? "Mark as incomplete" : "Mark as complete"
          }
        >
          {task.isCompleted && (
            <Icons.Check className="w-3.5 h-3.5 text-white" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span
            className={`
            text-sm font-medium truncate transition-all
            ${
              task.isCompleted
                ? "text-gray-500 dark:text-gray-500 line-through"
                : "text-gray-900 dark:text-white"
            }
          `}
          >
            {task.title}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
            {task.boardName}
          </span>
        </div>

        {/* Meta Data */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {/* Priority Indicator - Subtle */}
          {!task.isCompleted && (
            <div
              className="hidden sm:block"
              title={`Priority: ${task.priority}`}
            >
              {task.priority === "high" && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-50 dark:bg-red-900/30 text-xs font-medium text-red-700 dark:text-red-300 border border-transparent dark:border-red-900/20">
                  <Icons.Flag className="w-3 h-3" />
                  <span>High</span>
                </div>
              )}
              {task.priority === "medium" && (
                <Icons.Flag className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              )}
              {task.priority === "low" && (
                <Icons.Flag className="w-4 h-4 text-gray-200 dark:text-gray-600" />
              )}
            </div>
          )}

          {/* Date */}
          <div
            className={`
            flex items-center gap-1.5 text-xs font-medium whitespace-nowrap
            ${
              task.isCompleted
                ? "text-gray-400 dark:text-gray-500"
                : isOverdue
                ? "text-red-600 dark:text-red-400"
                : isToday
                ? "text-[#4F46E5] dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400"
            }
          `}
          >
            {!task.isCompleted && (
              <Icons.Calendar className="w-3.5 h-3.5 opacity-80" />
            )}
            <span>
              {isToday
                ? "Today"
                : new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
