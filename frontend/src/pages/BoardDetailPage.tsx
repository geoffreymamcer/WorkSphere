import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { BoardHeader } from "../components/board-view/BoardHeader";
import type { ViewMode } from "../components/board-view/BoardHeader";
import { BoardColumn } from "../components/board-view/BoardColumn";
import { BoardListView } from "../components/board-view/BoardListView";
import type { BoardTask } from "../components/board-view/BoardTaskCard";
import { Icons } from "../components/ui/Icons";
import type { Board } from "../components/boards/BoardCard";
import { InviteModal } from "../components/modals/InviteModal";

interface BoardDetailPageProps {
  onLogout: () => void;
  boards: Board[];
}

// Initial Mock Columns for a Standard Kanban Board
const DEFAULT_KANBAN_COLUMNS = [
  {
    id: "c1",
    title: "To Do",
    tasks: [
      {
        id: "t1",
        title: "Research competitor analysis",
        priority: "high",
        tag: "Strategy",
        dueDate: "2023-11-15",
        assignee: "AM",
      },
      {
        id: "t2",
        title: "Draft initial wireframes",
        priority: "medium",
        dueDate: "2023-11-20",
        assignee: "SC",
      },
    ] as BoardTask[],
  },
  {
    id: "c2",
    title: "In Progress",
    tasks: [
      {
        id: "t3",
        title: "Set up project repository",
        priority: "high",
        tag: "Dev",
        assignee: "MR",
      },
    ] as BoardTask[],
  },
  {
    id: "c3",
    title: "Review",
    tasks: [
      {
        id: "t4",
        title: "Update dependency packages",
        priority: "low",
        tag: "Maintenance",
        dueDate: "2023-10-25",
        assignee: "JD",
        isCompleted: false,
      },
    ] as BoardTask[],
  },
  {
    id: "c4",
    title: "Done",
    tasks: [
      {
        id: "t5",
        title: "Project kickoff meeting",
        tag: "Meeting",
        isCompleted: true,
      },
    ] as BoardTask[],
  },
];

export const BoardDetailPage: React.FC<BoardDetailPageProps> = ({
  onLogout,
  boards,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const board = boards.find((b) => b.id === id);

  // Initialize columns logic
  const getInitialColumns = () => {
    if (!board) return [];
    if (board.id === "1") return DEFAULT_KANBAN_COLUMNS;

    switch (board.template) {
      case "blank":
        return [];
      case "tasks":
        return [
          { id: "c1", title: "To Do", tasks: [] },
          { id: "c2", title: "Done", tasks: [] },
        ];
      case "kanban":
      default:
        return [
          { id: "c1", title: "To Do", tasks: [] },
          { id: "c2", title: "In Progress", tasks: [] },
          { id: "c3", title: "Review", tasks: [] },
          { id: "c4", title: "Done", tasks: [] },
        ];
    }
  };

  const [columns, setColumns] = useState(getInitialColumns);
  const [viewMode, setViewMode] = useState<ViewMode>(
    board?.template === "tasks" ? "list" : "board"
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  // Reset state when board changes
  useEffect(() => {
    if (board) {
      setColumns(getInitialColumns());
      setViewMode(board.template === "tasks" ? "list" : "board");
    }
  }, [board?.id]);

  if (!board) {
    return (
      <DashboardLayout onLogout={onLogout}>
        <div className="flex items-center justify-center h-full py-20">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Board not found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              The board you are looking for does not exist or you don't have
              access.
            </p>
            <button
              onClick={() => navigate("/boards")}
              className="mt-4 px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
            >
              Go to Boards
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleAddTask = (columnId: string, title: string) => {
    const isDoneColumn =
      columns.find((c) => c.id === columnId)?.title === "Done";
    const newTask: BoardTask = {
      id: Date.now().toString(),
      title,
      isCompleted: isDoneColumn,
    };

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === columnId) {
          return { ...col, tasks: [...col.tasks, newTask] };
        }
        return col;
      })
    );
  };

  const handleTaskClick = (taskId: string) => {
    console.log("Open task detail:", taskId);
  };

  const handleAddList = () => {
    const newColumn = {
      id: `c-${Date.now()}`,
      title: "New List",
      tasks: [],
    };
    setColumns([...columns, newColumn]);
  };

  const handleInvite = () => {
    const code = `WS-${board.id.substring(0, 3)}-${Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase()}`.toUpperCase();
    setInviteCode(code);
    setIsInviteModalOpen(true);
  };

  const onTaskDragStart = (
    e: React.DragEvent,
    taskId: string,
    sourceColumnId: string
  ) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumnId", sourceColumnId);
    e.dataTransfer.effectAllowed = "move";
  };

  const onTaskDrop = (
    e: React.DragEvent,
    targetColumnId: string,
    targetTaskId?: string
  ) => {
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

    if (!taskId || !sourceColumnId) return;

    const newColumns = columns.map((col) => ({
      ...col,
      tasks: [...col.tasks],
    }));

    const sourceCol = newColumns.find((c) => c.id === sourceColumnId);
    const targetCol = newColumns.find((c) => c.id === targetColumnId);

    if (!sourceCol || !targetCol) return;

    const taskIndex = sourceCol.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;
    const [movedTask] = sourceCol.tasks.splice(taskIndex, 1);

    if (targetCol.title === "Done") {
      movedTask.isCompleted = true;
    } else {
      movedTask.isCompleted = false;
    }

    if (targetTaskId) {
      const targetIndex = targetCol.tasks.findIndex(
        (t) => t.id === targetTaskId
      );
      if (targetIndex !== -1) {
        targetCol.tasks.splice(targetIndex, 0, movedTask);
      } else {
        targetCol.tasks.push(movedTask);
      }
    } else {
      targetCol.tasks.push(movedTask);
    }

    setColumns(newColumns);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <DashboardLayout onLogout={onLogout} fullWidth={true}>
        <div className="flex flex-col h-[calc(100vh-4rem)] -m-4 sm:-m-6 lg:-m-8">
          <BoardHeader
            title={board.title}
            description={board.description}
            teamName="Product Engineering"
            onBack={() => navigate("/boards")}
            viewMode={viewMode}
            onViewChange={setViewMode}
            onAddList={handleAddList}
            onInvite={handleInvite}
          />

          {viewMode === "board" ? (
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div className="h-full px-4 sm:px-6 lg:px-8 py-6 flex gap-6 min-w-max">
                {columns.length === 0 ? (
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="text-center">
                      <Icons.Kanban className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        This board is empty
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Add your first list to get started.
                      </p>
                      <button
                        onClick={handleAddList}
                        className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
                      >
                        Add List
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {columns.map((col) => (
                      <BoardColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        tasks={col.tasks}
                        onAddTask={handleAddTask}
                        onTaskClick={handleTaskClick}
                        onTaskDragStart={onTaskDragStart}
                        onTaskDrop={onTaskDrop}
                      />
                    ))}

                    <button
                      onClick={handleAddList}
                      className="flex-shrink-0 w-80 h-12 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-[#4F46E5] dark:hover:border-indigo-500 hover:text-[#4F46E5] dark:hover:text-indigo-400 hover:bg-indigo-50/10 dark:hover:bg-indigo-900/20 transition-all"
                    >
                      <Icons.Plus className="w-5 h-5" />
                      <span className="font-medium">Add another list</span>
                    </button>

                    <div className="w-2 flex-shrink-0" />
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {columns.length === 0 ? (
                <div className="flex items-center justify-center w-full h-full py-20">
                  <div className="text-center">
                    <Icons.Menu className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      This board is empty
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Add a section to start adding tasks.
                    </p>
                    <button
                      onClick={handleAddList}
                      className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
                    >
                      Add Section
                    </button>
                  </div>
                </div>
              ) : (
                <BoardListView
                  columns={columns}
                  onTaskClick={handleTaskClick}
                  onAddTask={handleAddTask}
                />
              )}
            </div>
          )}
        </div>

        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          entityName={board.title}
          entityType="board"
          inviteCode={inviteCode}
        />
      </DashboardLayout>
    </div>
  );
};
