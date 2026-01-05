// 🔢 8️⃣ START: Use Real Data in Tasks Page
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { TaskRow } from "../components/tasks/TaskRow";
import { Icons } from "../components/ui/Icons";
import { boardService } from "../services/board.service";
import type { MyTask } from "../services/board.service";

interface TasksPageProps {}

export const TasksPage: React.FC<TasksPageProps> = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<MyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "today" | "upcoming" | "completed"
  >("all");

  // Fetch real tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await boardService.getMyTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to load tasks", error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const handleToggle = async (id: string) => {
    // Optimistic Toggle
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
    // Note: To persist this properly, we need to know the 'Done' column ID, which isn't easily available here without fetching board details.
    // For now, this is a visual toggle. Real persistence would require a specific 'completeTask' API or moving logic.
  };

  const getFilteredTasks = () => {
    if (filter === "completed") {
      return tasks.filter((t) => t.isCompleted);
    }

    const active = tasks.filter((t) => !t.isCompleted);

    if (filter === "today") {
      return active.filter(
        (t) => t.status === "today" || t.status === "overdue"
      );
    }
    if (filter === "upcoming") {
      return active.filter((t) => t.status === "upcoming");
    }
    return active;
  };

  const displayedTasks = getFilteredTasks();

  // Grouping for "All" view
  const overdueTasks =
    filter === "all"
      ? displayedTasks.filter((t) => t.status === "overdue")
      : [];
  const todayTasks =
    filter === "all" ? displayedTasks.filter((t) => t.status === "today") : [];
  const otherTasks =
    filter === "all"
      ? displayedTasks.filter(
          (t) => t.status !== "overdue" && t.status !== "today"
        )
      : displayedTasks;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const isViewEmpty = displayedTasks.length === 0;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-6 transition-colors">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              My Tasks
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
            {[
              { id: "all", label: "All Active" },
              { id: "today", label: "Today" },
              { id: "upcoming", label: "Upcoming" },
              { id: "completed", label: "Completed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
                  ${
                    filter === tab.id
                      ? "bg-gray-900 text-white shadow-sm dark:bg-gray-600 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10 min-h-[400px]">
          {isViewEmpty && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 transition-colors">
                <Icons.CheckSquare className="h-8 w-8 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                All caught up
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                No tasks found for this view.
              </p>
            </div>
          )}

          {!isViewEmpty && filter === "all" ? (
            <>
              {overdueTasks.length > 0 && (
                <section>
                  <header className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                    <Icons.Clock className="w-4 h-4" />
                    Overdue
                  </header>
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm px-4 transition-colors">
                    {overdueTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        isOverdue={true}
                      />
                    ))}
                  </div>
                </section>
              )}

              {todayTasks.length > 0 && (
                <section>
                  <header className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <span className="h-2 w-2 rounded-full bg-[#4F46E5] dark:bg-indigo-400"></span>
                    Due Today
                  </header>
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm px-4 transition-colors">
                    {todayTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        isToday={true}
                      />
                    ))}
                  </div>
                </section>
              )}

              {otherTasks.length > 0 && (
                <section>
                  <header className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Tasks
                  </header>
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm px-4 transition-colors">
                    {otherTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            // Flat list for other filters
            !isViewEmpty && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm px-4 transition-colors">
                {displayedTasks.map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={handleToggle} />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
// 🔢 8️⃣ END: Use Real Data in Tasks Page
