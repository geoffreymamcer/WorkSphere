import crypto from "crypto";
import { teamRepository } from "../repositories/team.repository";
import { boardRepository } from "../repositories/board.repository";
import { AppError } from "../utils/AppError";
import { teamInviteRepository } from "../repositories/team-invite.repository";

export const teamService = {
  createTeam: async (userId: string, name: string, description?: string) => {
    return teamRepository.create(userId, name, description);
  },

  getUserTeams: async (userId: string) => {
    const teams = await teamRepository.findAllByUserId(userId);
    return teams.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      memberCount: t.members.length,
      role: t.ownerId === userId ? "Admin" : "Member",
    }));
  },

  getTeam: async (userId: string, teamId: string) => {
    const team = await teamRepository.findById(teamId, userId);
    if (!team) throw new AppError("Team not found or unauthorized", 404);

    const isOwner = team.ownerId === userId;

    return {
      ...team,
      role: isOwner ? "Admin" : "Member",
      memberCount: team.members.length,
    };
  },

  getTeamBoards: async (userId: string, teamId: string) => {
    const isMember = await teamRepository.isMember(teamId, userId);
    if (!isMember)
      throw new AppError("Unauthorized access to team boards", 403);

    return boardRepository.findAllByTeamId(teamId);
  },

  getTeamMembers: async (userId: string, teamId: string) => {
    const isMember = await teamRepository.isMember(teamId, userId);
    if (!isMember)
      throw new AppError("Unauthorized access to team members", 403);

    return teamRepository.getMembers(teamId);
  },
  generateInviteCode: async (userId: string, teamId: string) => {
    const team = await teamRepository.findRawById(teamId);
    if (!team) throw new AppError("Team not found", 404);

    // Only owner can manage invites
    if (team.ownerId !== userId) throw new AppError("Unauthorized", 403);

    // Invalidate previous codes
    await teamInviteRepository.deleteByTeamId(teamId);

    // Generate new code (Short, Uppercase)
    const code = crypto.randomBytes(4).toString("hex").toUpperCase(); // 8 chars

    // Optional: Set expiry (e.g., 30 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return teamInviteRepository.create(teamId, code, expiresAt);
  },
  getInviteCode: async (userId: string, teamId: string) => {
    const team = await teamRepository.findRawById(teamId);
    if (!team) throw new AppError("Team not found", 404);
    if (team.ownerId !== userId) throw new AppError("Unauthorized", 403);

    const invite = await teamInviteRepository.findActiveByTeamId(teamId);
    return invite ? { code: invite.code } : null;
  },

  // NEW: Join Team
  joinTeamByCode: async (userId: string, code: string) => {
    const cleanCode = code.trim().toUpperCase();

    const invite = await teamInviteRepository.findByCode(cleanCode);
    if (!invite) throw new AppError("Invalid invite code", 404);

    if (invite.expiresAt && new Date() > invite.expiresAt) {
      throw new AppError("Invite code expired", 400);
    }

    // Check if already member
    const isMember = await teamRepository.isMember(invite.teamId, userId);
    if (isMember)
      throw new AppError("You are already a member of this team", 409);

    // Add member
    await teamRepository.addMember(invite.teamId, userId, "MEMBER");

    return { teamId: invite.teamId, name: invite.team.name };
  },
};
