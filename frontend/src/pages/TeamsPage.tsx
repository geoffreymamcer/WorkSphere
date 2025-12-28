import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { TeamListRow } from "../components/teams/TeamListRow";
import type { Team } from "../components/teams/TeamListRow";
import { TeamMemberRow } from "../components/teams/TeamMemberRow";
import type { TeamMember } from "../components/teams/TeamMemberRow";
import { BoardCard } from "../components/boards/BoardCard";
import type { Board } from "../components/boards/BoardCard";
import { Button } from "../components/ui/Button";
import { Icons } from "../components/ui/Icons";
import { JoinModal } from "../components/modals/JoinModal";

interface TeamsPageProps {
  onLogout: () => void;
}

const DUMMY_TEAMS: Team[] = [
  {
    id: "t1",
    name: "Product Engineering",
    description: "Core product development and infrastructure",
    memberCount: 14,
    role: "Admin",
  },
  {
    id: "t2",
    name: "Marketing & Growth",
    description: "Brand, content, and performance marketing",
    memberCount: 8,
    role: "Member",
  },
  {
    id: "t3",
    name: "Design System",
    description: "Maintaining the visual language and UX patterns",
    memberCount: 5,
    role: "Member",
  },
];

const DUMMY_MEMBERS: TeamMember[] = [
  {
    id: "m1",
    name: "Alex Morgan",
    email: "alex@worksphere.com",
    role: "Admin",
  },
  {
    id: "m2",
    name: "Sarah Chen",
    email: "sarah@worksphere.com",
    role: "Member",
  },
  { id: "m3", name: "Mike Ross", email: "mike@worksphere.com", role: "Member" },
  {
    id: "m4",
    name: "James Doe",
    email: "james@worksphere.com",
    role: "Viewer",
  },
];

const DUMMY_TEAM_BOARDS: Board[] = [
  {
    id: "b1",
    title: "Q4 Sprint",
    description: "Main sprint board for current quarter objectives",
    lastUpdated: "2h ago",
    memberCount: 12,
  },
  {
    id: "b2",
    title: "Backlog",
    description: "Feature requests and technical debt",
    lastUpdated: "2d ago",
    memberCount: 12,
  },
  {
    id: "b3",
    title: "Release Planning",
    description: "Coordination for upcoming v2.0 launch",
    lastUpdated: "1w ago",
    memberCount: 8,
  },
];

export const TeamsPage: React.FC<TeamsPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"boards" | "members">("boards");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const activeTeam = DUMMY_TEAMS.find((t) => t.id === activeTeamId);

  const handleTeamClick = (id: string) => {
    setActiveTeamId(id);
    setActiveTab("boards");
  };

  const handleBack = () => {
    setActiveTeamId(null);
  };

  const handleJoinTeam = async (code: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (code === "FAIL") {
          reject(new Error("This code has expired or is invalid."));
        } else if (code === "MEMBER") {
          reject(new Error("You are already a member of this team."));
        } else {
          console.log(`Joined team with code: ${code}`);
          resolve();
        }
      }, 1000);
    });
  };

  return (
    <DashboardLayout onLogout={onLogout} fullWidth={true}>
      {!activeTeam && (
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
              <Button className="!w-auto">
                <span className="flex items-center gap-2">
                  <Icons.Plus className="w-4 h-4" />
                  Create Team
                </span>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {DUMMY_TEAMS.map((team) => (
              <TeamListRow
                key={team.id}
                team={team}
                onClick={handleTeamClick}
              />
            ))}
          </div>

          {DUMMY_TEAMS.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
              <Icons.Users className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No teams yet
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Join an existing team or create a new one to get started.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTeam && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-8 pb-0 transition-colors">
            <button
              onClick={handleBack}
              className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
            >
              <Icons.ChevronLeft className="w-4 h-4 mr-1" />
              Back to all teams
            </button>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {activeTeam.name}
                  </h2>
                  <span
                    className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${
                          activeTeam.role === "Admin"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700/30"
                            : "bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600"
                        }
                      `}
                  >
                    {activeTeam.role}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
                  {activeTeam.description}
                </p>
              </div>

              {activeTeam.role === "Admin" && (
                <div className="flex-shrink-0">
                  <Button variant="secondary" className="!w-auto">
                    <Icons.Settings className="w-4 h-4 mr-2" />
                    Team Settings
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-8 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("boards")}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "boards"
                    ? "border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 dark:border-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                }`}
              >
                Boards
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "members"
                    ? "border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 dark:border-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                }`}
              >
                Members{" "}
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                  {activeTeam.memberCount}
                </span>
              </button>
            </div>
          </div>

          <div className="w-full">
            {activeTab === "boards" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {DUMMY_TEAM_BOARDS.map((board) => (
                  <BoardCard
                    key={board.id}
                    board={board}
                    onClick={() => navigate(`/boards/${board.id}`)}
                  />
                ))}
                <button className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-[#4F46E5] dark:hover:border-indigo-500 hover:bg-indigo-50/10 dark:hover:bg-indigo-900/20 transition-colors group">
                  <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-[#4F46E5] group-hover:text-white dark:group-hover:bg-indigo-500 transition-colors mb-3">
                    <Icons.Plus className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400">
                    Create new board
                  </span>
                </button>
              </div>
            )}

            {activeTab === "members" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors max-w-4xl">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Team Members
                  </h3>
                  {activeTeam.role === "Admin" && (
                    <button className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] dark:text-indigo-400 dark:hover:text-indigo-300">
                      + Invite people
                    </button>
                  )}
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {DUMMY_MEMBERS.map((member) => (
                    <TeamMemberRow
                      key={member.id}
                      member={member}
                      canManage={activeTeam.role === "Admin"}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoinTeam}
        type="team"
      />
    </DashboardLayout>
  );
};
