import { z } from "zod";

export const createBoardSchema = z.object({
  name: z.string().min(1, "Board name is required").max(100, "Name too long"),
  description: z.string().optional(),
  template: z.enum(["kanban", "tasks", "blank"]),
  teamId: z.string().uuid().optional(),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
