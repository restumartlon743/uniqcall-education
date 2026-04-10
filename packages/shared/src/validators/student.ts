import { z } from 'zod';

export const studentProfileSchema = z.object({
  full_name: z.string().min(2).max(100).trim(),
  class_id: z.string().uuid().optional(),
  avatar_url: z.string().url().optional(),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;

export const completeDailyMissionSchema = z.object({
  mission_id: z.string().uuid(),
});

export type CompleteDailyMissionInput = z.infer<typeof completeDailyMissionSchema>;
