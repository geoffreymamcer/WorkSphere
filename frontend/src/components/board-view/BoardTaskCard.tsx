import React from "react";
import { Icons } from "../ui/Icons";

export interface BoardTask {
  id: string;
  title: string;
  priority?: "high" | "medium" | "low";
  dueDate?: string;
  assignee?: string; // Initials or URL
  tag?: string;
  isCompleted?: boolean;
}

interface BoardTaskCardProps {
  task: BoardTask;
  onClick?: (id: string) => void;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, taskId: string) => void;
}

export const BoardTaskCard: React.FC<BoardTaskCardProps> = ({
  task,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <div
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, task.id)}
      onClick={() => onClick?.(task.id)}
      className={`
        group relative p-3 bg-white dark:bg-gray-800 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200
        ${
          task.isCompleted
            ? "border-gray-100 dark:border-gray-700 opacity-60"
            : "border-gray-200 dark:border-gray-700 hover:border-[#4F46E5] dark:hover:border-indigo-500 hover:shadow-md"
        }
      `}
    >
      {/* Priority & Tag Row */}
      <div className="flex items-center justify-between mb-2 pointer-events-none">
        <div className="flex gap-2">
          {task.priority === "high" && (
            <div
              className="w-8 h-1 rounded-full bg-red-500"
              title="High Priority"
            />
          )}
          {task.priority === "medium" && (
            <div
              className="w-8 h-1 rounded-full bg-yellow-400"
              title="Medium Priority"
            />
          )}
          {task.tag && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
              {task.tag}
            </span>
          )}
        </div>

        {/* Quick Actions (Visible on Hover) */}
        <div className="opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity p-0.5 pointer-events-auto">
          <Icons.MoreHorizontal className="w-4 h-4" />
        </div>
      </div>

      {/* Title */}
      <h4
        className={`text-sm font-medium mb-3 leading-snug pointer-events-none ${
          task.isCompleted
            ? "text-gray-500 line-through"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {task.title}
      </h4>

      {/* Footer: Date & Assignee */}
      <div className="flex items-center justify-between mt-auto pointer-events-none">
        <div
          className={`flex items-center gap-1.5 text-xs ${
            task.dueDate && new Date(task.dueDate) < new Date()
              ? "text-red-600 dark:text-red-400"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {task.dueDate && (
            <>
              <Icons.Clock className="w-3.5 h-3.5" />
              <span>
                {new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </>
          )}
        </div>

        {task.assignee && (
          <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-gray-800">
            {task.assignee}
          </div>
        )}
      </div>
    </div>
  );
};
