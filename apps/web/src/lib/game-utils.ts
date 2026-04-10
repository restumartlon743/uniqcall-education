import type { GameDifficulty } from './game-data'

// ─── XP Calculation ───────────────────────────────────────────

const DIFFICULTY_MULTIPLIERS: Record<GameDifficulty, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
  extreme: 3.0,
}

export function calculateXP(params: {
  baseXP: number
  accuracy: number // 0–100
  difficulty: GameDifficulty
  streakDays: number
}): number {
  const { baseXP, accuracy, difficulty, streakDays } = params

  // Accuracy multiplier: 0.5 at 0%, 1.0 at 50%, 1.5 at 100%
  const accuracyMultiplier = 0.5 + (accuracy / 100)

  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty]

  // Streak bonus: +10% per day, max +50%
  const streakBonus = 1 + Math.min(streakDays * 0.1, 0.5)

  return Math.round(baseXP * accuracyMultiplier * difficultyMultiplier * streakBonus)
}

// ─── Score helpers ────────────────────────────────────────────

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function getAccuracyPercent(score: number, maxScore: number): number {
  if (maxScore === 0) return 0
  return Math.round((score / maxScore) * 100)
}
