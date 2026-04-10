import { LEVELS } from '../constants/levels';

/**
 * Calculates the current level for a given total XP amount.
 * Returns the highest level whose xp_required threshold has been met.
 */
export function calculateLevel(totalXp: number): number {
  let level = 1;
  for (const def of LEVELS) {
    if (totalXp >= def.xp_required) {
      level = def.level;
    } else {
      break;
    }
  }
  return level;
}

/**
 * Calculates remaining XP needed to reach the next level.
 * Returns 0 if already at max level.
 */
export function xpToNextLevel(totalXp: number): number {
  const currentLevel = calculateLevel(totalXp);
  const nextLevelDef = LEVELS.find((l) => l.level === currentLevel + 1);
  if (!nextLevelDef) return 0;
  return Math.max(0, nextLevelDef.xp_required - totalXp);
}

/**
 * Returns the title string for a given level number.
 */
export function levelTitle(level: number): string {
  const def = LEVELS.find((l) => l.level === level);
  return def?.title ?? 'Unknown';
}

/**
 * Returns the XP threshold required for a given level.
 */
export function xpRequiredForLevel(level: number): number {
  const def = LEVELS.find((l) => l.level === level);
  return def?.xp_required ?? 0;
}

/**
 * Returns a progress object useful for UI level progress bars.
 */
export function levelProgress(totalXp: number) {
  const current = calculateLevel(totalXp);
  const currentDef = LEVELS.find((l) => l.level === current)!;
  const nextDef = LEVELS.find((l) => l.level === current + 1);

  const xpInCurrentLevel = totalXp - currentDef.xp_required;
  const xpNeededForNext = nextDef
    ? nextDef.xp_required - currentDef.xp_required
    : 0;
  const percentage = xpNeededForNext > 0
    ? Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100))
    : 100;

  return {
    level: current,
    title: currentDef.title,
    total_xp: totalXp,
    xp_in_level: xpInCurrentLevel,
    xp_for_next: xpNeededForNext,
    xp_remaining: Math.max(0, xpNeededForNext - xpInCurrentLevel),
    percentage,
    is_max: !nextDef,
  };
}
