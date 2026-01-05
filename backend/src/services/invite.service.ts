import crypto from "crypto";
import { inviteRepository } from "../repositories/invite.repository";
import { boardRepository } from "../repositories/board.repository";
import { AppError } from "../utils/AppError";

export const inviteService = {
  createInvite: async (ownerId: string, boardId: string, email: string) => {
    // 1. Verify Ownership
    const board = await boardRepository.findRawById(boardId);
    if (!board) throw new AppError("Board not found", 404);
    if (board.ownerId !== ownerId)
      throw new AppError("Only the owner can invite users", 403);

    // 2. Check for duplicate pending invite
    const existing = await inviteRepository.findPendingByEmail(boardId, email);
    if (existing) {
      // FIX: Instead of throwing error, return the existing invite so user can copy the token again
      return existing;
    }

    // 3. Generate Token (Short & Uppercase)
    const token = crypto.randomBytes(6).toString("hex").toUpperCase();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiry

    // 4. Create Invite
    return inviteRepository.create(boardId, email, token, expiresAt);
  },

  acceptInvite: async (userId: string, token: string) => {
    const cleanToken = token.trim().toUpperCase();

    // 1. Validate Token
    const invite = await inviteRepository.findByToken(cleanToken);

    if (!invite) throw new AppError("Invalid invite token", 404);
    if (invite.accepted) throw new AppError("Invite already accepted", 400);
    if (new Date() > invite.expiresAt)
      throw new AppError("Invite expired", 400);

    // 2. Prevent Owner self-invite
    if (invite.board.ownerId === userId)
      throw new AppError("You are already the owner", 400);

    // 3. Check if already a member
    const isMember = await boardRepository.isMember(invite.boardId, userId);
    if (isMember)
      throw new AppError("You are already a member of this board", 409);

    // 4. Add Member & Mark Accepted
    await boardRepository.addMember(invite.boardId, userId);
    await inviteRepository.markAccepted(invite.id);

    return { boardId: invite.boardId };
  },
};
