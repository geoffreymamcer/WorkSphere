import { z } from "zod";

export const createListSchema = z.object({
  name: z.string().min(1, "List name is required"),
});

export const updateListSchema = z.object({
  name: z.string().min(1, "List name is required"),
});

export const moveListSchema = z.object({
  newOrder: z.number().int().min(0),
});

export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
