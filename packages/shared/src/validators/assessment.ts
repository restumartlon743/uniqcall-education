import { z } from 'zod';

export const startAssessmentSchema = z.object({
  type: z.enum(['cognitive', 'vark']),
});

export type StartAssessmentInput = z.infer<typeof startAssessmentSchema>;

export const submitAnswerSchema = z.object({
  session_id: z.string().uuid(),
  question_id: z.string().uuid(),
  answer: z.string().min(1),
  time_spent_seconds: z.number().int().positive().max(600),
});

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;

export const completeAssessmentSchema = z.object({
  session_id: z.string().uuid(),
});

export type CompleteAssessmentInput = z.infer<typeof completeAssessmentSchema>;
