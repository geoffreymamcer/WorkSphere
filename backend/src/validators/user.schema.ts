import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  jobTitle: z.string().optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
