import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { boardService } from "../../services/board.service";
import type { BoardMember } from "../../services/board.service";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onSave: (taskId: string, data: any) => Promise<void>;
  onAssign: (taskId: string, userId: string | null) => Promise<void>;
  boardId?: string; // Add boardId to fetch members
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
  onAssign,
  boardId,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [members, setMembers] = useState<BoardMember[]>([]);

  // Fetch members when modal opens
  useEffect(() => {
    if (isOpen && boardId) {
      const fetchMembers = async () => {
        try {
          const data = await boardService.getMembers(boardId);
          setMembers(data);
        } catch (error) {
          console.error("Failed to load members", error);
        }
      };
      fetchMembers();
    }
  }, [isOpen, boardId]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "medium");
      const dateStr = task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "";
      setDueDate(dateStr);
      setAssigneeId(task.assigneeId || null);
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(task.id, {
        title,
        description,
        priority,
        dueDate: dueDate || null,
      });

      if (assigneeId !== task.assigneeId) {
        await onAssign(task.id, assigneeId);
      }

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="task-title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Updated Assignment UI */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Assignee
          </label>
          <select
            value={assigneeId || ""}
            onChange={(e) => setAssigneeId(e.target.value || null)}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-10 px-3"
          >
            <option value="">Unassigned</option>
            <option value={user?.id}>Assign to Me (Owner)</option>

            {members.length > 0 && (
              <optgroup label="Board Members">
                {members.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.user.name || m.user.email} ({m.role})
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <TextArea
          id="task-desc"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <Input
            id="task-due"
            type="date"
            label="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
