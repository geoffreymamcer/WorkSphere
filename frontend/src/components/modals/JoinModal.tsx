import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Icons } from "../ui/Icons";
export interface EntityPreview {
  name: string;
  description?: string;
  memberCount?: number;
  role?: string;
}

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string) => Promise<void>;
  type: "team" | "board";
  entityDetails?: EntityPreview;
  defaultCode?: string;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  type,
  entityDetails,
  defaultCode = "",
}) => {
  const [code, setCode] = useState(defaultCode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCode(defaultCode);
      setError("");
      setIsLoading(false);
      setIsSuccess(false);
    }
  }, [isOpen, defaultCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setError("Please enter a valid invitation code.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await onJoin(code);
      setIsSuccess(true);
      // Close after a brief success state
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid invitation code. Please try again."
      );
      setIsLoading(false);
    }
  };

  const typeLabel = type === "team" ? "Team" : "Board";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Join ${typeLabel}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Entity Preview Section (Optional) */}
        {entityDetails ? (
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                {entityDetails.name}
              </h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-700/30">
                {entityDetails.role || "Member"}
              </span>
            </div>
            {entityDetails.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                {entityDetails.description}
              </p>
            )}
            {entityDetails.memberCount !== undefined && (
              <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                <Icons.Users className="w-3.5 h-3.5 mr-1.5" />
                {entityDetails.memberCount} members
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Enter the invitation code provided by your administrator to join an
            existing {type}.
          </div>
        )}

        {/* Code Input */}
        <div>
          <Input
            id="invitation-code"
            label="Invitation Code"
            placeholder="e.g., WS-8294-XK"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              if (error) setError("");
            }}
            error={error}
            autoFocus={!entityDetails} // Auto-focus if we aren't distracting with entity details
            disabled={isLoading || isSuccess}
            maxLength={20}
            className="uppercase tracking-wider font-mono"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading || isSuccess}
            className="!w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!code.trim() || isSuccess}
            className="!w-auto min-w-[100px]"
          >
            {isSuccess ? "Joined!" : "Join"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
