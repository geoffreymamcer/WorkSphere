// 🔢 1️⃣ START: Full BoardDetailPage with Drag-and-Drop Persistence
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { BoardHeader } from "../components/board-view/BoardHeader";
import type { ViewMode } from "../components/board-view/BoardHeader";
import { BoardColumn } from "../components/board-view/BoardColumn";
import { BoardListView } from "../components/board-view/BoardListView";
import type { BoardTask } from "../components/board-view/BoardTaskCard";
import { Icons } from "../components/ui/Icons";
import { InviteModal } from "../components/modals/InviteModal";
import { boardService } from "../services/board.service";
import type { Board } from "../services/board.service";

interface BoardDetailPageProps {
  // No props needed as DashboardLayout handles auth internally
}

export const BoardDetailPage: React.FC<BoardDetailPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<
    { id: string; title: string; tasks: BoardTask[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  // Fetch Board Data
  useEffect(() => {
    const fetchBoard = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await boardService.getById(id);

        setBoard(data);
        setViewMode(data.template === "tasks" ? "list" : "board");

        if (data.columns && data.columns.length > 0) {
          setColumns(
            data.columns.map((col: any) => ({
              id: col.id,
              title: col.title,
              // Map backend task to frontend BoardTask
              tasks: (col.tasks || []).map((t: any) => ({
                id: t.id,
                title: t.title,
                // Simple logic: if in "Done" column, mark completed
                isCompleted: col.title === "Done",
                // You can add priority mapping here if backend supports it later
              })),
            }))
          );
        } else {
          setColumns([]);
        }
      } catch (error) {
        console.error("Failed to fetch board:", error);
        setBoard(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoard();
  }, [id]);

  // Loading State
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Not Found State
  if (!board) {
    return (
      <DashboardLayout>
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

  // --- Handlers ---

  const handleAddTask = async (columnId: string, title: string) => {
    try {
      // 1. Call API
      const newTask = await boardService.addTask(columnId, title);

      // 2. Optimistic Update
      const isDoneColumn =
        columns.find((c) => c.id === columnId)?.title === "Done";

      const frontendTask: BoardTask = {
        id: newTask.id,
        title: newTask.title,
        isCompleted: isDoneColumn,
      };

      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === columnId) {
            return { ...col, tasks: [...col.tasks, frontendTask] };
          }
          return col;
        })
      );
    } catch (error) {
      console.error("Failed to create task", error);
      alert("Failed to create task");
    }
  };

  const handleTaskClick = (taskId: string) => {
    console.log("Open task detail:", taskId);
  };

  const handleAddList = async () => {
    try {
      const title = "New List";
      if (!board.id) return;

      const newCol = await boardService.addList(board.id, title);

      setColumns([
        ...columns,
        { id: newCol.id, title: newCol.title, tasks: [] },
      ]);
    } catch (error) {
      console.error("Failed to add list", error);
    }
  };

  const handleInvite = () => {
    const code = `WS-${board.id.substring(0, 3)}-${Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase()}`.toUpperCase();
    setInviteCode(code);
    setIsInviteModalOpen(true);
  };

  // --- Drag and Drop Logic ---

  const onTaskDragStart = (
    e: React.DragEvent,
    taskId: string,
    sourceColumnId: string
  ) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumnId", sourceColumnId);
    e.dataTransfer.effectAllowed = "move";
  };

  const onTaskDrop = async (
    e: React.DragEvent,
    targetColumnId: string,
    targetTaskId?: string
  ) => {
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

    if (!taskId || !sourceColumnId) return;

    // 1. Create a deep copy for Optimistic UI Update
    const newColumns = columns.map((col) => ({
      ...col,
      tasks: [...col.tasks],
    }));

    const sourceCol = newColumns.find((c) => c.id === sourceColumnId);
    const targetCol = newColumns.find((c) => c.id === targetColumnId);

    if (!sourceCol || !targetCol) return;

    // Find and remove task from source
    const taskIndex = sourceCol.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;
    const [movedTask] = sourceCol.tasks.splice(taskIndex, 1);

    // Update 'isCompleted' based on target column
    if (targetCol.title === "Done") {
      movedTask.isCompleted = true;
    } else if (targetCol.title !== "Done" && movedTask.isCompleted) {
      movedTask.isCompleted = false;
    }

    // Calculate New Index (Order)
    let newIndex = targetCol.tasks.length; // Default to end of list

    if (targetTaskId) {
      const targetIndex = targetCol.tasks.findIndex(
        (t) => t.id === targetTaskId
      );
      if (targetIndex !== -1) {
        // Insert before target task
        targetCol.tasks.splice(targetIndex, 0, movedTask);
        newIndex = targetIndex;
      } else {
        targetCol.tasks.push(movedTask);
      }
    } else {
      // Dropped on column header or empty space
      targetCol.tasks.push(movedTask);
    }

    // 2. Update State Immediately (Optimistic)
    setColumns(newColumns);

    // 3. Persist to Backend
    try {
      await boardService.moveTask(taskId, targetColumnId, newIndex);
    } catch (error) {
      console.error("Failed to save move:", error);
      alert("Failed to save task position. The board will refresh.");
      // Revert changes by reloading or re-fetching
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <DashboardLayout fullWidth={true}>
        <div className="flex flex-col h-[calc(100vh-4rem)] -m-4 sm:-m-6 lg:-m-8">
          <BoardHeader
            title={board.name}
            description={board.description || ""}
            teamName="Private Board"
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
          entityName={board.name}
          entityType="board"
          inviteCode={inviteCode}
        />
      </DashboardLayout>
    </div>
  );
};
