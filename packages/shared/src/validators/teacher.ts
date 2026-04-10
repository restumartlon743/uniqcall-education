import { z } from 'zod';

export const createClassSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  grade: z.number().int().min(10).max(12),
  academic_year: z
    .string()
    .regex(/^\d{4}\/\d{4}$/, 'Format: 2026/2027'),
  school_id: z.string().uuid(),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;

export const createTaskSchema = z.object({
  class_id: z.string().uuid(),
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  task_type: z.enum(['individual', 'group']),
  target_archetype: z
    .enum([
      'THINKER', 'ENGINEER', 'GUARDIAN', 'STRATEGIST',
      'CREATOR', 'SHAPER', 'STORYTELLER', 'PERFORMER',
      'HEALER', 'DIPLOMAT', 'EXPLORER', 'MENTOR', 'VISIONARY',
    ])
    .optional(),
  vark_adaptations: z
    .object({
      V: z.string().max(500),
      A: z.string().max(500),
      R: z.string().max(500),
      K: z.string().max(500),
    })
    .optional(),
  due_date: z.string().datetime().optional(),
  xp_reward: z.number().int().min(0).max(500).default(20),
  knowledge_field: z.enum(['ALAM', 'SOSIAL', 'HUMANIORA', 'AGAMA', 'SENI']).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const generateGroupsSchema = z.object({
  class_id: z.string().uuid(),
  group_size: z.number().int().min(2).max(8).default(4),
  strategy: z.enum(['balanced', 'similar', 'random']).default('balanced'),
});

export type GenerateGroupsInput = z.infer<typeof generateGroupsSchema>;

export const flagStudentSchema = z.object({
  student_id: z.string().uuid(),
  reason: z.string().min(1).max(500).trim(),
  severity: z.enum(['low', 'medium', 'high']).default('medium'),
});

export type FlagStudentInput = z.infer<typeof flagStudentSchema>;

export const reviewSubmissionSchema = z.object({
  submission_id: z.string().uuid(),
  score: z.number().min(0).max(100),
  feedback: z.string().max(2000).optional(),
  status: z.enum(['reviewed', 'revision_needed']),
});

export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;
