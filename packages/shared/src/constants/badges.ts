import type { BadgeCategory } from '../types/enums';

export interface BadgeDefinition {
  code: string;
  name: string;
  description: string;
  category: BadgeCategory;
  xp_reward: number;
  trigger_condition: { type: string; value?: number; module?: number };
}

export const BADGES: readonly BadgeDefinition[] = [
  // ─── Cognitive Mastery (4) ─────────────────────────────────
  {
    code: 'DEEP_DIVER',
    name: 'Deep Diver',
    description: 'Completed 3 cognitive assessment modules',
    category: 'cognitive',
    xp_reward: 50,
    trigger_condition: { type: 'assessment_modules_completed', value: 3 },
  },
  {
    code: 'LOGIC_MASTER',
    name: 'Logic Master',
    description: 'Scored above 80% on analytical module',
    category: 'cognitive',
    xp_reward: 75,
    trigger_condition: { type: 'module_score_above', module: 1, value: 80 },
  },
  {
    code: 'PATTERN_SEEKER',
    name: 'Pattern Seeker',
    description: 'Completed all 7 cognitive modules',
    category: 'cognitive',
    xp_reward: 100,
    trigger_condition: { type: 'assessment_modules_completed', value: 7 },
  },
  {
    code: 'VARK_EXPLORER',
    name: 'VARK Explorer',
    description: 'Completed the VARK learning style assessment',
    category: 'cognitive',
    xp_reward: 50,
    trigger_condition: { type: 'vark_assessment_complete' },
  },

  // ─── Learning Streak (4) ──────────────────────────────────
  {
    code: 'FIRST_FLAME',
    name: 'First Flame',
    description: 'Maintained a 3-day learning streak',
    category: 'streak',
    xp_reward: 25,
    trigger_condition: { type: 'streak', value: 3 },
  },
  {
    code: 'SEVEN_DAY_WARRIOR',
    name: '7-Day Warrior',
    description: 'Maintained a 7-day learning streak',
    category: 'streak',
    xp_reward: 50,
    trigger_condition: { type: 'streak', value: 7 },
  },
  {
    code: 'FORTNIGHT_HERO',
    name: 'Fortnight Hero',
    description: 'Maintained a 14-day learning streak',
    category: 'streak',
    xp_reward: 100,
    trigger_condition: { type: 'streak', value: 14 },
  },
  {
    code: 'MONTHLY_CHAMPION',
    name: 'Monthly Champion',
    description: 'Maintained a 30-day learning streak',
    category: 'streak',
    xp_reward: 200,
    trigger_condition: { type: 'streak', value: 30 },
  },

  // ─── Project Achievement (4) ──────────────────────────────
  {
    code: 'BUILDER',
    name: 'Builder',
    description: 'Submitted first project task',
    category: 'project',
    xp_reward: 50,
    trigger_condition: { type: 'tasks_submitted', value: 1 },
  },
  {
    code: 'INNOVATOR',
    name: 'Innovator',
    description: 'Received top marks on a project submission',
    category: 'project',
    xp_reward: 100,
    trigger_condition: { type: 'task_score_above', value: 90 },
  },
  {
    code: 'PRESENTER',
    name: 'Presenter',
    description: 'Completed 5 group project tasks',
    category: 'project',
    xp_reward: 75,
    trigger_condition: { type: 'group_tasks_completed', value: 5 },
  },
  {
    code: 'PROLIFIC',
    name: 'Prolific',
    description: 'Submitted 10 tasks across any category',
    category: 'project',
    xp_reward: 100,
    trigger_condition: { type: 'tasks_submitted', value: 10 },
  },

  // ─── Peer Recognition (4) ─────────────────────────────────
  {
    code: 'TEAM_PLAYER',
    name: 'Team Player',
    description: 'Participated in 3 peer group activities',
    category: 'peer',
    xp_reward: 50,
    trigger_condition: { type: 'group_activities', value: 3 },
  },
  {
    code: 'MOTIVATOR',
    name: 'Motivator',
    description: 'Sent 10 high fives to peers',
    category: 'peer',
    xp_reward: 50,
    trigger_condition: { type: 'high_fives_sent', value: 10 },
  },
  {
    code: 'SYNERGIZER',
    name: 'Synergizer',
    description: 'Member of a group with synergy score above 80',
    category: 'peer',
    xp_reward: 75,
    trigger_condition: { type: 'group_synergy_above', value: 80 },
  },
  {
    code: 'POPULAR',
    name: 'Popular',
    description: 'Received 20 high fives from others',
    category: 'peer',
    xp_reward: 75,
    trigger_condition: { type: 'high_fives_received', value: 20 },
  },

  // ─── Career Explorer (4) ──────────────────────────────────
  {
    code: 'PATHFINDER',
    name: 'Pathfinder',
    description: 'Completed first career quest node',
    category: 'career',
    xp_reward: 50,
    trigger_condition: { type: 'quest_nodes_completed', value: 1 },
  },
  {
    code: 'DREAMER',
    name: 'Dreamer',
    description: 'Explored 3 different career fields',
    category: 'career',
    xp_reward: 75,
    trigger_condition: { type: 'career_fields_explored', value: 3 },
  },
  {
    code: 'ROADMAP_READY',
    name: 'Roadmap Ready',
    description: 'Generated a complete career roadmap',
    category: 'career',
    xp_reward: 100,
    trigger_condition: { type: 'career_roadmap_generated' },
  },
  {
    code: 'QUEST_MASTER',
    name: 'Quest Master',
    description: 'Completed 10 career quest nodes',
    category: 'career',
    xp_reward: 150,
    trigger_condition: { type: 'quest_nodes_completed', value: 10 },
  },
] as const;

export const BADGE_BY_CODE = Object.fromEntries(
  BADGES.map((b) => [b.code, b]),
) as Record<string, BadgeDefinition>;
