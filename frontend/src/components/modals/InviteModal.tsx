import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Icons } from "../ui/Icons";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  entityType: "board" | "team";
  inviteCode: string;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  entityName,
  entityType,
  inviteCode,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Demo link generation
  const inviteLink = `https://worksphere.com/join/${inviteCode}`;

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
      <div className="space-y-6">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg flex items-start gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400">
            <Icons.Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
              Collaborate with your team
            </h4>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
              Share these credentials to give people access to{" "}
              <span className="font-bold">{entityName}</span>.
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
            Invitation codes expire in 7 days. You can regenerate them in
            settings.
          </p>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
