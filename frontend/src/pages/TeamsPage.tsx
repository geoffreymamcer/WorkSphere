import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { TeamListRow } from "../components/teams/TeamListRow";
import { TeamMemberRow } from "../components/teams/TeamMemberRow";
import { BoardCard } from "../components/boards/BoardCard";
import { Button } from "../components/ui/Button";
import { Icons } from "../components/ui/Icons";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { TextArea } from "../components/ui/TextArea";
import { JoinModal } from "../components/modals/JoinModal";
import { CreateBoardModal } from "../components/boards/CreateBoardModal";
import { teamService } from "../services/team.service";
import type { Team } from "../services/team.service";
import type { TeamMember } from "../services/team.service";
import { boardService } from "../services/board.service";
import type { Board } from "../services/board.service";

interface TeamsPageProps {}

// --- Sub-Component: Create Team Modal ---
const CreateTeamModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => Promise<void>;
}> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onCreate(name, description);
    setLoading(false);
    onClose();
    setName("");
    setDescription("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Team">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="team-name"
          label="Team Name"
          placeholder="e.g. Engineering"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextArea
          id="team-desc"
          label="Description"
          placeholder="What is this team for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Create Team
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// --- Main Component ---
export const TeamsPage: React.FC<TeamsPageProps> = () => {
  const navigate = useNavigate();

  // Data State
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamBoards, setTeamBoards] = useState<Board[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // UI State
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"boards" | "members">("boards");

  // Modals State
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);

  // 1. Fetch Teams on Mount
  useEffect(() => {
    const loadTeams = async () => {
      try {
        setIsLoading(true);
        const data = await teamService.getAll();
        setTeams(data);
      } catch (err) {
        console.error("Failed to load teams", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeams();
  }, []);

  // 2. Fetch Team Data (Boards or Members) when active team/tab changes
  useEffect(() => {
    if (!activeTeamId) return;

    const loadData = async () => {
      try {
        if (activeTab === "boards") {
          const boards = await teamService.getBoards(activeTeamId);
          setTeamBoards(boards);
        } else if (activeTab === "members") {
          const members = await teamService.getMembers(activeTeamId);
          setTeamMembers(members);

          // Check if Admin to load invite code
          const currentTeam = teams.find((t) => t.id === activeTeamId);
          if (currentTeam?.role === "Admin") {
            const inviteData = await teamService.getInviteCode(activeTeamId);
            setInviteCode(inviteData?.code || null);
          }
        }
      } catch (err) {
        console.error("Failed to load team data", err);
      }
    };
    loadData();
  }, [activeTeamId, activeTab, teams]); // Added teams dependency to ensure roles are loaded

  const activeTeam = teams.find((t) => t.id === activeTeamId);

  // --- Handlers ---

  const handleTeamClick = (id: string) => {
    setActiveTeamId(id);
    setActiveTab("boards");
  };

  const handleBack = () => {
    setActiveTeamId(null);
    setTeamBoards([]);
    setTeamMembers([]);
    setInviteCode(null);
  };

  const handleCreateTeam = async (name: string, description: string) => {
    try {
      const newTeam = await teamService.create(name, description);
      setTeams([newTeam, ...teams]);
      setActiveTeamId(newTeam.id);
    } catch (e) {
      console.error(e);
      alert("Failed to create team");
    }
  };

  const handleCreateBoard = async (data: {
    name: string;
    description: string;
    template: string;
  }) => {
    if (!activeTeamId) return;
    try {
      const newBoard = await boardService.create({
        ...data,
        teamId: activeTeamId,
      } as any);

      setTeamBoards([newBoard, ...teamBoards]);
      setIsCreateBoardModalOpen(false);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  // Implement Join Logic
  const handleJoinTeam = async (code: string) => {
    try {
      const result = await teamService.joinTeam(code);
      // Refresh teams list
      const updatedTeams = await teamService.getAll();
      setTeams(updatedTeams);
      setIsJoinModalOpen(false);
      setActiveTeamId(result.teamId); // Navigate to the new team
    } catch (error: any) {
      console.error(error);
      // Re-throw so the modal can display the error
      throw new Error(error.response?.data?.message || "Failed to join team");
    }
  };

  // Admin: Generate Code
  const handleGenerateCode = async () => {
    if (!activeTeamId) return;
    try {
      const result = await teamService.generateInviteCode(activeTeamId);
      setInviteCode(result.code);
    } catch (e) {
      console.error(e);
    }
  };

  // Admin: Copy Code
  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      alert("Invite code copied to clipboard!");
    }
  };

  return (
    <DashboardLayout>
      {!activeTeam ? (
        // --- ALL TEAMS VIEW ---
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Teams
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and manage your organization's teams.
              </p>
            </div>
            <div className="flex-shrink-0 flex gap-3">
              <Button
                variant="secondary"
                className="!w-auto"
                onClick={() => setIsJoinModalOpen(true)}
              >
                Join Team
              </Button>
              <Button
                className="!w-auto"
                onClick={() => setIsCreateTeamModalOpen(true)}
              >
                <span className="flex items-center gap-2">
                  <Icons.Plus className="w-4 h-4" />
                  Create Team
                </span>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : teams.length > 0 ? (
              teams.map((team) => (
                <TeamListRow
                  key={team.id}
                  team={team as any}
                  onClick={handleTeamClick}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
                <Icons.Users className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No teams yet
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Create a new team to start collaborating.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // --- SINGLE TEAM VIEW ---
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-8 pb-0 transition-colors">
            <button
              onClick={handleBack}
              className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
            >
              <Icons.ChevronLeft className="w-4 h-4 mr-1" /> Back to all teams
            </button>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {activeTeam.name}
                  </h2>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      activeTeam.role === "Admin"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700/30"
                        : "bg-gray-50 text-gray-600 dark:bg-gray-700"
                    }`}
                  >
                    {activeTeam.role}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
                  {activeTeam.description || "No description provided."}
                </p>
              </div>

              {activeTeam.role === "Admin" && (
                <Button variant="secondary" className="!w-auto">
                  <Icons.Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              )}
            </div>

            <div className="flex gap-8 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("boards")}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "boards"
                    ? "border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 dark:border-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                Boards
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "members"
                    ? "border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 dark:border-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                Members{" "}
                <span className="ml-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  {activeTeam.memberCount}
                </span>
              </button>
            </div>
          </div>

          <div className="w-full">
            {activeTab === "boards" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {teamBoards.map((board) => (
                  <BoardCard
                    key={board.id}
                    board={board as any}
                    onClick={() => navigate(`/boards/${board.id}`)}
                  />
                ))}

                {/* Create Board Card */}
                <button
                  onClick={() => setIsCreateBoardModalOpen(true)}
                  className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-[#4F46E5] dark:hover:border-indigo-500 hover:bg-indigo-50/10 dark:hover:bg-indigo-900/20 transition-colors group"
                >
                  <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-[#4F46E5] group-hover:text-white dark:group-hover:bg-indigo-500 transition-colors mb-3">
                    <Icons.Plus className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400">
                    Create new board
                  </span>
                </button>
              </div>
            )}

            {/* Render Members List */}
            {activeTab === "members" && (
              <div className="space-y-6">
                {/* Admin Invite Code Section */}
                {activeTeam.role === "Admin" && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                        Invite Code
                      </h4>
                      <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">
                        Share this code to let others join this team.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {inviteCode ? (
                        <>
                          <code className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-mono text-sm tracking-wider">
                            {inviteCode}
                          </code>
                          <Button
                            variant="secondary"
                            className="!w-auto !py-1.5"
                            onClick={handleCopyCode}
                          >
                            Copy
                          </Button>
                          <Button
                            variant="ghost"
                            className="!w-auto !py-1.5 !text-xs text-gray-500"
                            onClick={handleGenerateCode}
                          >
                            Regenerate
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="primary"
                          className="!w-auto !py-1.5"
                          onClick={handleGenerateCode}
                        >
                          Generate Code
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors max-w-4xl">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Team Members
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {teamMembers.length > 0 ? (
                      teamMembers.map((member) => (
                        <TeamMemberRow
                          key={member.id}
                          member={member}
                          canManage={activeTeam.role === "Admin"}
                        />
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No members found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoinTeam}
        type="team"
      />
      <CreateTeamModal
        isOpen={isCreateTeamModalOpen}
        onClose={() => setIsCreateTeamModalOpen(false)}
        onCreate={handleCreateTeam}
      />
      <CreateBoardModal
        isOpen={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        onCreate={handleCreateBoard}
      />
    </DashboardLayout>
  );
};
