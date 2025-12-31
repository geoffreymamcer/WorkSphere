import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Button } from "../ui/Button";
import { Icons } from "../ui/Icons";
import { boardService } from "../../services/board.service";

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Updated signature to return the full board object
  onCreate: (board: any) => void;
}

const TEMPLATES = [
  {
    id: "blank",
    label: "Blank Board",
    icon: Icons.LayoutGrid,
    description: "Start from scratch",
  },
  {
    id: "kanban",
    label: "Kanban",
    icon: Icons.Kanban,
    description: "To Do, Doing, Done",
  },
  {
    id: "tasks",
    label: "Task List",
    icon: Icons.CheckSquare,
    description: "Simple list view",
  },
];

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setSelectedTemplate("blank");
      setError("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Board name is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // 1. Call Backend
      const newBoard = await boardService.create({
        name,
        description,
        template: selectedTemplate,
      });

      // 2. Pass result up to parent
      onCreate(newBoard);
      onClose();
    } catch (err: any) {
      console.error("Failed to create board:", err);
      // Handle Validation Errors
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create board. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Board">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md">
            {error}
          </div>
        )}

        <Input
          id="board-name"
          label="Board Name"
          placeholder="e.g., Q4 Product Roadmap"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          error={error}
          autoFocus
        />

        <TextArea
          id="board-description"
          label="Description (Optional)"
          placeholder="What is this board for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Choose a Template
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template.id)}
                className={`
                  relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 text-center
                  ${
                    selectedTemplate === template.id
                      ? "border-[#4F46E5] bg-indigo-50/50 dark:bg-indigo-900/20 text-[#4F46E5] dark:text-indigo-400"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }
                `}
              >
                <template.icon
                  className={`w-6 h-6 mb-2 ${
                    selectedTemplate === template.id
                      ? "text-[#4F46E5] dark:text-indigo-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
                <span className="text-sm font-semibold">{template.label}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {template.description}
                </span>

                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 text-[#4F46E5] dark:text-indigo-400">
                    <div className="w-2 h-2 rounded-full bg-[#4F46E5] dark:bg-indigo-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="!w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!name.trim()}
            className="!w-auto min-w-[120px]"
          >
            Create Board
          </Button>
        </div>
      </form>
    </Modal>
  );
};
