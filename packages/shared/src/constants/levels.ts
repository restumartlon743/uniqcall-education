export interface LevelDefinition {
  level: number;
  xp_required: number;
  title: string;
  unlock_description: string;
}

export const LEVELS: readonly LevelDefinition[] = [
  {
    level: 1,
    xp_required: 0,
    title: 'Newcomer',
    unlock_description: 'Basic dashboard',
  },
  {
    level: 2,
    xp_required: 100,
    title: 'Explorer',
    unlock_description: 'Career Quest access',
  },
  {
    level: 3,
    xp_required: 300,
    title: 'Learner',
    unlock_description: 'Peer group features',
  },
  {
    level: 4,
    xp_required: 600,
    title: 'Achiever',
    unlock_description: 'Advanced analytics',
  },
  {
    level: 5,
    xp_required: 1000,
    title: 'Master',
    unlock_description: 'Full Career Roadmap',
  },
  {
    level: 6,
    xp_required: 1500,
    title: 'Visionary',
    unlock_description: 'Mentor mode (help juniors)',
  },
  {
    level: 7,
    xp_required: 2500,
    title: 'Legend',
    unlock_description: 'Special avatar customization',
  },
] as const;

export const MAX_LEVEL = LEVELS[LEVELS.length - 1]!.level;
export const MAX_XP = LEVELS[LEVELS.length - 1]!.xp_required;
