import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { TaskRow } from "../components/tasks/TaskRow";
import type { Task } from "../components/tasks/TaskRow";
import { Icons } from "../components/ui/Icons";

interface TasksPageProps {
  onLogout: () => void;
}

const TODAY_STR = "2023-10-25";

const DUMMY_TASKS: Task[] = [
  {
    id: "1",
    title: "Review Q4 Budget Proposal",
    boardName: "Finance Review",
    dueDate: "2023-10-23",
    priority: "high",
    isCompleted: false,
  },
  {
    id: "2",
    title: "Update Client Slide Deck",
    boardName: "Sales Pipeline",
    dueDate: "2023-10-24",
    priority: "medium",
    isCompleted: false,
  },
  {
    id: "3",
    title: "Team Sync Agenda",
    boardName: "Weekly Operations",
    dueDate: "2023-10-25",
    priority: "medium",
    isCompleted: false,
  },
  {
    id: "4",
    title: "Submit Expense Report",
    boardName: "Admin",
    dueDate: "2023-10-25",
    priority: "low",
    isCompleted: false,
  },
  {
    id: "5",
    title: "Draft Newsletter Content",
    boardName: "Marketing",
    dueDate: "2023-10-25",
    priority: "high",
    isCompleted: false,
  },
  {
    id: "6",
    title: "Prepare for Design Critique",
    boardName: "Website Redesign",
    dueDate: "2023-10-27",
    priority: "medium",
    isCompleted: false,
  },
  {
    id: "7",
    title: "Quarterly Goals Review",
    boardName: "Executive",
    dueDate: "2023-10-30",
    priority: "high",
    isCompleted: false,
  },
  {
    id: "8",
    title: "Update dependencies",
    boardName: "Tech Debt",
    dueDate: "2023-10-20",
    priority: "low",
    isCompleted: true,
  },
];

export const TasksPage: React.FC<TasksPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(DUMMY_TASKS);
  const [filter, setFilter] = useState<
    "all" | "today" | "upcoming" | "completed"
  >("all");

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const getGroupedTasks = () => {
    let filtered = tasks;

    if (filter === "completed") {
      filtered = tasks.filter((t) => t.isCompleted);
    } else {
      filtered = tasks.filter((t) => !t.isCompleted);
    }

    if (filter === "today") {
      filtered = filtered.filter((t) => t.dueDate === TODAY_STR);
    } else if (filter === "upcoming") {
      filtered = filtered.filter((t) => t.dueDate > TODAY_STR);
    }

    const overdue = filtered.filter((t) => t.dueDate < TODAY_STR);
    const today = filtered.filter((t) => t.dueDate === TODAY_STR);
    const upcoming = filtered.filter((t) => t.dueDate > TODAY_STR);
    const noDate = filtered.filter((t) => !t.dueDate);

    return { overdue, today, upcoming, noDate };
  };

  const groups = getGroupedTasks();
  const isViewEmpty =
    groups.overdue.length === 0 &&
    groups.today.length === 0 &&
    groups.upcoming.length === 0 &&
    groups.noDate.length === 0;

  return (
    <DashboardLayout onLogout={onLogout}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-6 transition-colors">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              My Tasks
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {new Date(TODAY_STR).toLocaleDateString("en-US", {
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
                {filter === "completed"
                  ? "You haven't completed any tasks yet."
                  : "No tasks found for this view. Enjoy your day!"}
              </p>
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="mt-4 text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View all tasks
                </button>
              )}
            </div>
          )}

          {!isViewEmpty && (
            <>
              {groups.overdue.length > 0 && (
                <section>
                  <header className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                    <Icons.Clock className="w-4 h-4" />
                    Overdue
                  </header>
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm px-4 transition-colors">
                    {groups.overdue.map((task) => (
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

              {groups.today.length > 0 && (
                <section>
                  <header className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <span className="h-2 w-2 rounded-full bg-[#4F46E5] dark:bg-indigo-400"></span>
                    Due Today
                  </header>
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm px-4 transition-colors">
                    {groups.today.map((task) => (
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

              {groups.upcoming.length > 0 && (
                <section>
                  <header className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Upcoming
                  </header>
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm px-4 transition-colors">
                    {groups.upcoming.map((task) => (
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
