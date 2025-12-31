import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
});

export const moveTaskSchema = z.object({
  columnId: z.string().uuid("Invalid column ID"),
  order: z.number().int().min(0, "Order must be 0 or greater"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
