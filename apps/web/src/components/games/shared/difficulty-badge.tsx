'use client'

import { cn } from '@/lib/utils'
import type { GameDifficulty } from '@/lib/game-data'

const DIFFICULTY_COLORS: Record<GameDifficulty, { bg: string; text: string; glow: string }> = {
  easy: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    glow: 'shadow-[0_0_8px_rgba(16,185,129,0.3)]',
  },
  medium: {
    bg: 'bg-yellow-500/15',
    text: 'text-yellow-400',
    glow: 'shadow-[0_0_8px_rgba(234,179,8,0.3)]',
  },
  hard: {
    bg: 'bg-orange-500/15',
    text: 'text-orange-400',
    glow: 'shadow-[0_0_8px_rgba(249,115,22,0.3)]',
  },
  extreme: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.4)]',
  },
}

const LABELS: Record<GameDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  extreme: 'Extreme',
}

interface DifficultyBadgeProps {
  difficulty: GameDifficulty
  className?: string
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const colors = DIFFICULTY_COLORS[difficulty]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        'border-white/10 transition-colors',
        colors.bg,
        colors.text,
        colors.glow,
        className,
      )}
    >
      {LABELS[difficulty]}
    </span>
  )
}
