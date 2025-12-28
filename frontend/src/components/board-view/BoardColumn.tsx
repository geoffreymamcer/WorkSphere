import React, { useState } from "react";
import type { BoardTask } from "./BoardTaskCard";
import { BoardTaskCard } from "./BoardTaskCard";
import { Icons } from "../ui/Icons";
import { Button } from "../ui/Button";

interface BoardColumnProps {
  id: string;
  title: string;
  tasks: BoardTask[];
  onAddTask: (columnId: string, title: string) => void;
  onTaskClick: (taskId: string) => void;
  onTaskDragStart: (
    e: React.DragEvent,
    taskId: string,
    columnId: string
  ) => void;
  onTaskDrop: (
    e: React.DragEvent,
    targetColumnId: string,
    targetTaskId?: string
  ) => void;
}

export const BoardColumn: React.FC<BoardColumnProps> = ({
  id,
  title,
  tasks,
  onAddTask,
  onTaskClick,
  onTaskDragStart,
  onTaskDrop,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(id, newTaskTitle);
      setNewTaskTitle("");
      setIsAdding(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // If we drop directly on the column, we assume appending to the end
    // Check if the drop target was the column itself or the empty area
    onTaskDrop(e, id);
  };

  return (
    <div
      className={`
        flex-shrink-0 w-72 md:w-80 2xl:w-96 max-h-full flex flex-col rounded-xl border transition-colors duration-200
        ${
          isDragOver
            ? "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-300 dark:border-indigo-500/50"
            : "bg-gray-100 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="p-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200">
            {title}
          </h3>
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
            {tasks.length}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsAdding(true)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Icons.Plus className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Icons.MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tasks List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2 min-h-[2rem]">
        {tasks.map((task) => (
          <BoardTaskCard
            key={task.id}
            task={task}
            onClick={onTaskClick}
            onDragStart={(e, taskId) => onTaskDragStart(e, taskId, id)}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Stop bubbling to column
            }}
            onDrop={(e, taskId) => {
              e.preventDefault();
              e.stopPropagation(); // Stop bubbling to column
              setIsDragOver(false);
              onTaskDrop(e, id, taskId);
            }}
          />
        ))}

        {tasks.length === 0 && !isAdding && (
          <div className="h-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400 dark:text-gray-600 pointer-events-none">
            Empty list
          </div>
        )}

        {isAdding && (
          <form onSubmit={handleSubmit} className="mt-2">
            <textarea
              autoFocus
              className="w-full p-3 text-sm rounded-lg border-2 border-[#4F46E5] dark:border-indigo-500 shadow-sm focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              placeholder="Enter a title for this card..."
              rows={3}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
                if (e.key === "Escape") {
                  setIsAdding(false);
                }
              }}
            />
            <div className="flex items-center gap-2 mt-2">
              <Button type="submit" className="!w-auto !py-1.5 !px-3 !text-xs">
                Add Card
              </Button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Add Task Footer (Hidden while adding) */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="mx-2 mb-2 p-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-left"
        >
          <Icons.Plus className="w-4 h-4" />
          Add a task...
        </button>
      )}
    </div>
  );
};
