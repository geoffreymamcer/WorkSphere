import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input"; // Imported Input
import { Icons } from "../ui/Icons";
import { boardService } from "../../services/board.service";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  entityType: "board" | "team";
  boardId?: string; // We need ID to send the invite
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  entityName,
  entityType,
  boardId,
}) => {
  // State for Input Step
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // State for Success Step (Your existing UI)
  const [inviteCode, setInviteCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setInviteCode("");
      setError("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle Form Submit
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !boardId) return;

    setIsSubmitting(true);
    setError("");

    try {
      const result = await boardService.inviteUser(boardId, email);
      setInviteCode(result.token); // Switch to success view
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create invite");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inviteLink = `${window.location.origin}/join/${inviteCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invite to ${entityType === "board" ? "Board" : "Team"}`}
      maxWidth="max-w-md"
    >
      {!inviteCode ? (
        // --- STEP 1: EMAIL INPUT FORM ---
        <form onSubmit={handleSendInvite} className="space-y-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg flex items-start gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400">
              <Icons.Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                Invite Collaborators
              </h4>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                Enter an email address to generate a secure access code for{" "}
                <span className="font-bold">{entityName}</span>.
              </p>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <Input
            id="invite-email"
            type="email"
            label="Email Address"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Generate Invite
            </Button>
          </div>
        </form>
      ) : (
        // --- STEP 2: SUCCESS / CODE DISPLAY (Your Existing UI) ---
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full text-green-600 dark:text-green-400">
              <Icons.Check className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-200">
                Invite Created
              </h4>
              <p className="text-xs text-green-700 dark:text-green-300">
                Share the details below with <strong>{email}</strong>.
              </p>
            </div>
          </div>

          {/* Code Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Invitation Code
            </label>
            <div className="flex gap-2">
              <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center p-3 font-mono text-xl font-bold tracking-widest text-gray-900 dark:text-white select-all shadow-sm">
                {inviteCode}
              </div>
              <Button
                variant="secondary"
                className="!w-auto !px-4"
                onClick={handleCopyCode}
                title="Copy Code"
              >
                {copiedCode ? (
                  <Icons.Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Icons.Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Link Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Invitation Link
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  readOnly
                  value={inviteLink}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-3 text-sm text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-[#4F46E5] outline-none shadow-sm"
                />
              </div>
              <Button
                variant="secondary"
                className="!w-auto !px-4"
                onClick={handleCopyLink}
                title="Copy Link"
              >
                {copiedLink ? (
                  <Icons.Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Icons.Link className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-700 mt-6">
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mb-4">
              Invitation codes expire in 7 days.
            </p>
            <Button variant="ghost" onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
