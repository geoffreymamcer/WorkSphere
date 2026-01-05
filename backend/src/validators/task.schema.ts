import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
});

export const moveTaskSchema = z.object({
  columnId: z.string().uuid("Invalid column ID"),
  order: z.number().int().min(0, "Order must be 0 or greater"),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().datetime().optional().or(z.literal("")), // Accept ISO string or empty
});

export const assignTaskSchema = z.object({
  userId: z.string().uuid("Invalid user ID").nullable(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type AssignTaskInput = z.infer<typeof assignTaskSchema>;
