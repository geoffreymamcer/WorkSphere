// 🔢 1️⃣ START: Full BoardDetailPage with All Features
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
import { EditTaskModal } from "../components/modals/EditTaskModal";
import { boardService } from "../services/board.service";
import type { Board } from "../services/board.service";
import { socket, connectSocket } from "../lib/socket";

interface BoardDetailPageProps {}

export const BoardDetailPage: React.FC<BoardDetailPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- State ---
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("board");

  // --- Modals State ---
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // --- 1. Initial Data Fetch & Socket Setup ---
  useEffect(() => {
    const fetchBoard = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await boardService.getById(id);

        setBoard(data);
        setViewMode(data.template === "tasks" ? "list" : "board");

        // Map Backend Data to Frontend Format
        if (data.columns && data.columns.length > 0) {
          setColumns(
            data.columns.map((col: any) => ({
              id: col.id,
              title: col.title,
              tasks: (col.tasks || []).map((t: any) => ({
                id: t.id,
                title: t.title,
                description: t.description,
                priority: t.priority,
                dueDate: t.dueDate,
                isCompleted: col.title === "Done",
              })),
            }))
          );
        } else {
          setColumns([]);
        }

        // Connect Socket
        const token = localStorage.getItem("token");
        if (token) {
          connectSocket(token);
          socket.emit("join:board", id);
        }
      } catch (error) {
        console.error("Failed to fetch board:", error);
        setBoard(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoard();

    // Cleanup: Leave room
    return () => {
      if (id) socket.emit("leave:board", id);
    };
  }, [id]);

  // --- 2. Real-Time Event Listeners ---
  useEffect(() => {
    if (!socket) return;

    // Task Created
    socket.on("task:created", (newTask: any) => {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === newTask.columnId) {
            // Prevent duplicate if we added it optimistically already
            if (col.tasks.find((t: any) => t.id === newTask.id)) return col;

            const isDoneColumn = col.title === "Done";
            return {
              ...col,
              tasks: [...col.tasks, { ...newTask, isCompleted: isDoneColumn }],
            };
          }
          return col;
        })
      );
    });

    // Task Moved
    socket.on(
      "task:moved",
      ({ taskId, targetColumnId, newOrder, task }: any) => {
        setColumns((prev) => {
          const newCols = prev.map((col) => ({
            ...col,
            tasks: [...col.tasks],
          })); // Deep copy

          // Find Source
          let sourceCol: any = null;
          let taskIndex = -1;

          for (const col of newCols) {
            const idx = col.tasks.findIndex((t: any) => t.id === taskId);
            if (idx !== -1) {
              sourceCol = col;
              taskIndex = idx;
              break;
            }
          }

          if (!sourceCol) return prev; // Task not found locally

          // Remove from Source
          const [movedTask] = sourceCol.tasks.splice(taskIndex, 1);

          // Add to Target
          const targetCol = newCols.find((c) => c.id === targetColumnId);
          if (targetCol) {
            if (targetCol.title === "Done") movedTask.isCompleted = true;
            else if (targetCol.title !== "Done") movedTask.isCompleted = false;

            // Insert at position
            if (newOrder >= targetCol.tasks.length) {
              targetCol.tasks.push(movedTask);
            } else {
              targetCol.tasks.splice(newOrder, 0, movedTask);
            }
          }

          return newCols;
        });
      }
    );

    // Task Updated
    socket.on("task:updated", (updatedTask: any) => {
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: col.tasks.map((t: any) =>
            t.id === updatedTask.id ? { ...t, ...updatedTask } : t
          ),
        }))
      );
    });

    // List Created
    socket.on("list:created", (newList: any) => {
      setColumns((prev) => {
        if (prev.find((c) => c.id === newList.id)) return prev;
        return [...prev, { id: newList.id, title: newList.title, tasks: [] }];
      });
    });

    // List Moved
    socket.on("list:moved", ({ listId, newOrder }: any) => {
      setColumns((prev) => {
        const newCols = [...prev];
        const oldIndex = newCols.findIndex((c) => c.id === listId);
        if (oldIndex === -1) return prev;

        const [movedList] = newCols.splice(oldIndex, 1);
        newCols.splice(newOrder, 0, movedList);
        return newCols;
      });
    });

    // List Updated
    socket.on("list:updated", (updatedList: any) => {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === updatedList.id ? { ...col, title: updatedList.title } : col
        )
      );
    });

    return () => {
      socket.off("task:created");
      socket.off("task:moved");
      socket.off("task:updated");
      socket.off("list:created");
      socket.off("list:moved");
      socket.off("list:updated");
    };
  }, []);

  // --- Handlers: Creation ---

  const handleAddTask = async (columnId: string, title: string) => {
    try {
      const newTask = await boardService.addTask(columnId, title);
      // Optimistic Update
      const isDoneColumn =
        columns.find((c) => c.id === columnId)?.title === "Done";
      const frontendTask = {
        id: newTask.id,
        title: newTask.title,
        order: newTask.order,
        isCompleted: isDoneColumn,
      };

      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === columnId) {
            // Check for dupes in case socket beat us
            if (col.tasks.find((t: any) => t.id === newTask.id)) return col;
            return { ...col, tasks: [...col.tasks, frontendTask] };
          }
          return col;
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddList = async () => {
    try {
      if (!board) return;
      const newCol = await boardService.addList(board.id, "New List");
      setColumns((prev) => [
        ...prev,
        { id: newCol.id, title: newCol.title, tasks: [] },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  // --- Handlers: Edit ---

  const handleTaskClick = (taskId: string) => {
    let foundTask = null;
    for (const col of columns) {
      const t = col.tasks.find((task: any) => task.id === taskId);
      if (t) {
        foundTask = t;
        break;
      }
    }
    if (foundTask) {
      setSelectedTask(foundTask);
      setIsEditTaskOpen(true);
    }
  };

  const handleSaveTask = async (taskId: string, data: any) => {
    const newColumns = columns.map((col) => ({
      ...col,
      tasks: col.tasks.map((t: any) =>
        t.id === taskId ? { ...t, ...data } : t
      ),
    }));
    setColumns(newColumns);
    try {
      await boardService.updateTask(taskId, data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignTask = async (taskId: string, userId: string | null) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.map((t: any) =>
          t.id === taskId ? { ...t, assigneeId: userId } : t
        ),
      }))
    );

    try {
      await boardService.assignTask(taskId, userId);
    } catch (error) {
      console.error("Failed to assign task", error);
    }
  };

  const handleColumnTitleUpdate = async (
    columnId: string,
    newTitle: string
  ) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      )
    );
    try {
      await boardService.updateList(columnId, newTitle);
    } catch (error) {
      console.error(error);
    }
  };

  // --- Handlers: Drag & Drop (Columns) ---

  const onColumnDragStart = (e: React.DragEvent, columnId: string) => {
    e.dataTransfer.setData("type", "column");
    e.dataTransfer.setData("columnId", columnId);
  };

  const onColumnDrop = async (e: React.DragEvent, targetColumnId: string) => {
    const draggedColumnId = e.dataTransfer.getData("columnId");
    if (!draggedColumnId || draggedColumnId === targetColumnId) return;

    const newColumns = [...columns];
    const sourceIndex = newColumns.findIndex((c) => c.id === draggedColumnId);
    const targetIndex = newColumns.findIndex((c) => c.id === targetColumnId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const [removed] = newColumns.splice(sourceIndex, 1);
    newColumns.splice(targetIndex, 0, removed);
    setColumns(newColumns);

    try {
      await boardService.moveList(draggedColumnId, targetIndex);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Handlers: Drag & Drop (Tasks) ---

  const onTaskDragStart = (
    e: React.DragEvent,
    taskId: string,
    sourceColumnId: string
  ) => {
    e.stopPropagation(); // Stop column drag
    e.dataTransfer.setData("type", "task");
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

    const newColumns = columns.map((col) => ({
      ...col,
      tasks: [...col.tasks],
    }));
    const sourceCol = newColumns.find((c) => c.id === sourceColumnId);
    const targetCol = newColumns.find((c) => c.id === targetColumnId);
    if (!sourceCol || !targetCol) return;

    const taskIndex = sourceCol.tasks.findIndex((t: any) => t.id === taskId);
    if (taskIndex === -1) return;
    const [movedTask] = sourceCol.tasks.splice(taskIndex, 1);

    if (targetCol.title === "Done") movedTask.isCompleted = true;
    else if (targetCol.title !== "Done") movedTask.isCompleted = false;

    let newIndex = targetCol.tasks.length;
    if (targetTaskId) {
      const targetIndex = targetCol.tasks.findIndex(
        (t: any) => t.id === targetTaskId
      );
      if (targetIndex !== -1) {
        targetCol.tasks.splice(targetIndex, 0, movedTask);
        newIndex = targetIndex;
      } else {
        targetCol.tasks.push(movedTask);
      }
    } else {
      targetCol.tasks.push(movedTask);
    }

    setColumns(newColumns);
    try {
      await boardService.moveTask(taskId, targetColumnId, newIndex);
    } catch (error) {
      console.error(error);
      window.location.reload();
    }
  };

  const handleInvite = () => {
    if (!board) return;
    const code = `WS-${board.id.substring(0, 3)}-${Math.random()
      .toString(36)
      .substring(2, 5)}`.toUpperCase();
    setInviteCode(code);
    setIsInviteModalOpen(true);
  };

  // --- Render ---

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!board) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold">Board not found</h2>
          <button
            onClick={() => navigate("/boards")}
            className="mt-4 btn-primary"
          >
            Go to Boards
          </button>
        </div>
      </DashboardLayout>
    );
  }

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
                {columns.map((col) => (
                  <BoardColumn
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    tasks={col.tasks}
                    onAddTask={handleAddTask}
                    onTaskClick={handleTaskClick}
                    onTitleUpdate={handleColumnTitleUpdate}
                    onTaskDragStart={onTaskDragStart}
                    onTaskDrop={onTaskDrop}
                    onColumnDragStart={onColumnDragStart}
                    onColumnDrop={onColumnDrop}
                  />
                ))}
                <button
                  onClick={handleAddList}
                  className="flex-shrink-0 w-80 h-12 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 hover:border-[#4F46E5] transition-all"
                >
                  <Icons.Plus className="w-5 h-5" />
                  <span className="font-medium">Add another list</span>
                </button>
                <div className="w-2 flex-shrink-0" />
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <BoardListView
                columns={columns}
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTask}
              />
            </div>
          )}
        </div>

        {/* Modals */}
        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          entityName={board.name}
          entityType="board"
          boardId={board.id}
        />
        <EditTaskModal
          isOpen={isEditTaskOpen}
          onClose={() => setIsEditTaskOpen(false)}
          task={selectedTask}
          onSave={handleSaveTask}
          onAssign={handleAssignTask}
          boardId={board?.id}
        />
      </DashboardLayout>
    </div>
  );
};
