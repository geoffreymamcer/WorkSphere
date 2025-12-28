import React from "react";
import type { BoardTask } from "./BoardTaskCard";
import { Icons } from "../ui/Icons";
import { Button } from "../ui/Button";

interface BoardListColumn {
  id: string;
  title: string;
  tasks: BoardTask[];
}

interface BoardListViewProps {
  columns: BoardListColumn[];
  onTaskClick: (taskId: string) => void;
  onAddTask: (columnId: string, title: string) => void;
}

export const BoardListView: React.FC<BoardListViewProps> = ({
  columns,
  onTaskClick,
  onAddTask,
}) => {
  const [addingToCol, setAddingToCol] = React.useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = React.useState("");

  const handleSubmit = (e: React.FormEvent, columnId: string) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(columnId, newTaskTitle);
      setNewTaskTitle("");
      setAddingToCol(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="space-y-8">
        {columns.map((col) => (
          <div
            key={col.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
          >
            {/* Group Header */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                  {col.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium">
                  {col.tasks.length}
                </span>
              </div>
              <button
                onClick={() => setAddingToCol(col.id)}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xs font-medium flex items-center gap-1"
              >
                <Icons.Plus className="w-3.5 h-3.5" />
                Add Task
              </button>
            </div>

            {/* Tasks List */}
            <div>
              {col.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick(task.id)}
                  className="group flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
                >
                  {/* Status Circle */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      task.isCompleted
                        ? "bg-[#4F46E5] border-[#4F46E5]"
                        : "border-gray-300 dark:border-gray-600 group-hover:border-[#4F46E5] dark:group-hover:border-indigo-500"
                    }`}
                  >
                    {task.isCompleted && (
                      <Icons.Check className="w-3 h-3 text-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        task.isCompleted
                          ? "text-gray-500 line-through"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {task.assignee && <span>{task.assignee}</span>}
                      {task.dueDate && (
                        <span
                          className={`flex items-center gap-1 ${
                            new Date(task.dueDate) < new Date() &&
                            !task.isCompleted
                              ? "text-red-600"
                              : ""
                          }`}
                        >
                          <Icons.Calendar className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {task.tag && (
                        <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {task.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  {task.priority === "high" && (
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                      High
                    </div>
                  )}
                </div>
              ))}

              {/* Inline Add Task Form */}
              {addingToCol === col.id ? (
                <form
                  onSubmit={(e) => handleSubmit(e, col.id)}
                  className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800"
                >
                  <input
                    autoFocus
                    type="text"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] dark:bg-gray-900 dark:border-gray-600 dark:text-white mb-2"
                    placeholder="What needs to be done?"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      className="!w-auto !py-1.5 !px-3 !text-xs"
                    >
                      Add
                    </Button>
                    <button
                      type="button"
                      onClick={() => setAddingToCol(null)}
                      className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                col.tasks.length === 0 && (
                  <div
                    onClick={() => setAddingToCol(col.id)}
                    className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500 italic hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
                  >
                    No tasks in this list. Click to add one.
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
