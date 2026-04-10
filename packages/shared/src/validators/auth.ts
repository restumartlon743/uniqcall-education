import { z } from 'zod';

export const roleSelectionSchema = z.object({
  role: z.enum(['student', 'teacher', 'parent', 'admin']),
  school_code: z.string().min(1).max(20).optional(),
  invite_code: z.string().min(1).max(50).optional(),
});

export type RoleSelectionInput = z.infer<typeof roleSelectionSchema>;

export const profileCreateSchema = z.object({
  full_name: z.string().min(2).max(100).trim(),
  role: z.enum(['student', 'teacher', 'parent', 'admin']),
  school_id: z.string().uuid(),
});

export type ProfileCreateInput = z.infer<typeof profileCreateSchema>;

export const loginCallbackSchema = z.object({
  code: z.string().min(1),
  state: z.string().optional(),
});

export type LoginCallbackInput = z.infer<typeof loginCallbackSchema>;
