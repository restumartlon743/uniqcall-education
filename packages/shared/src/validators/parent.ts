import { z } from 'zod';

export const sendHighFiveSchema = z.object({
  to_student_id: z.string().uuid(),
  message: z.string().max(200).trim().optional(),
});

export type SendHighFiveInput = z.infer<typeof sendHighFiveSchema>;

export const linkChildSchema = z.object({
  student_id: z.string().uuid().optional(),
  invite_code: z.string().min(1).max(50).optional(),
}).refine(
  (data) => data.student_id ?? data.invite_code,
  { message: 'Either student_id or invite_code is required' },
);

export type LinkChildInput = z.infer<typeof linkChildSchema>;

export const sendMessageToTeacherSchema = z.object({
  teacher_id: z.string().uuid(),
  student_id: z.string().uuid(),
  content: z.string().min(1).max(2000).trim(),
});

export type SendMessageToTeacherInput = z.infer<typeof sendMessageToTeacherSchema>;
