'use client'

import type { ReactNode } from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArrowLeft, Pause, Play, RotateCcw, Trophy } from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'
import { ARCHETYPE_LABELS } from '@/lib/game-data'
import { getAccuracyPercent } from '@/lib/game-utils'
import { DifficultyBadge } from './shared/difficulty-badge'
import { GameTimer } from './shared/game-timer'
import { ScoreDisplay } from './shared/score-display'
import { XpPopup } from './shared/xp-popup'

interface GameShellProps {
  gameSlug: string
  gameName: string
  archetype: string
  difficulty: GameDifficulty
  onDifficultyChange: (d: GameDifficulty) => void
  score: number
  maxScore: number
  timeLimit?: number
  isGameOver: boolean
  onRestart: () => void
  onExit: () => void
  xpEarned: number
  children: ReactNode
}

const DIFFICULTIES: GameDifficulty[] = ['easy', 'medium', 'hard', 'extreme']

export function GameShell({
  gameName,
  archetype,
  difficulty,
  onDifficultyChange,
  score,
  maxScore,
  timeLimit,
  isGameOver,
  onRestart,
  onExit,
  xpEarned,
  children,
}: GameShellProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Timer control
  useEffect(() => {
    if (!isPaused && !isGameOver) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, isGameOver])

  // Reset timer on restart
  useEffect(() => {
    if (!isGameOver && elapsed === 0) {
      // fresh start
    }
  }, [isGameOver, elapsed])

  const handleRestart = useCallback(() => {
    setElapsed(0)
    setIsPaused(false)
    onRestart()
  }, [onRestart])

  const handleTimeUp = useCallback(() => {
    // Game should handle this via its own logic; we just stop the timer
  }, [])

  const accuracy = getAccuracyPercent(score, maxScore)
  const archetypeKey = archetype.toLowerCase() as Lowercase<string>

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col">
      {/* ── Header Bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0A0E27]/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button
            onClick={onExit}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          {/* Game info */}
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-white">{gameName}</h1>
            <span className={cn('text-xs', `text-${archetypeKey === 'thinker' ? 'violet' : 'purple'}-400`)}>
              {ARCHETYPE_LABELS[archetype as keyof typeof ARCHETYPE_LABELS] ?? archetype}
            </span>
          </div>

          {/* Difficulty selector */}
          <div className="ml-2 flex gap-1">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => onDifficultyChange(d)}
                className={cn(
                  'rounded-md px-2 py-0.5 text-xs font-medium transition-all',
                  d === difficulty
                    ? 'ring-1 ring-white/20'
                    : 'opacity-50 hover:opacity-80',
                )}
              >
                <DifficultyBadge difficulty={d} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* XP popup anchor */}
          <XpPopup xp={xpEarned} />

          {/* Score */}
          <ScoreDisplay score={score} maxScore={maxScore} />

          {/* Timer */}
          <GameTimer
            timeLimit={timeLimit}
            isRunning={!isPaused && !isGameOver}
            elapsed={elapsed}
            onTimeUp={handleTimeUp}
          />

          {/* Pause / Resume */}
          <button
            onClick={() => setIsPaused((p) => !p)}
            disabled={isGameOver}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5',
              'text-white/60 transition-colors hover:bg-white/10 hover:text-white',
              'disabled:pointer-events-none disabled:opacity-30',
            )}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* ── Game Content ───────────────────────────────────────── */}
      <div className="relative flex-1">
        {/* Pause overlay */}
        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0A0E27]/90 backdrop-blur-sm"
            >
              <Pause className="mb-4 h-12 w-12 text-purple-400" />
              <p className="text-lg font-bold text-white">Paused</p>
              <button
                onClick={() => setIsPaused(false)}
                className="mt-4 rounded-lg border border-purple-500/30 bg-purple-500/10 px-6 py-2 text-sm font-semibold text-purple-300 transition-colors hover:bg-purple-500/20"
              >
                Resume
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over overlay */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-[#0A0E27]/90 backdrop-blur-sm"
            >
              <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                {/* Trophy */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2, stiffness: 260, damping: 20 }}
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                >
                  <Trophy className="h-8 w-8 text-amber-400" />
                </motion.div>

                <h2 className="mb-1 text-xl font-bold text-white">Game Over!</h2>
                <p className="mb-6 text-sm text-white/50">{gameName}</p>

                {/* Stats grid */}
                <div className="mb-6 grid w-full grid-cols-3 gap-4">
                  <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="text-xs text-white/40">Score</span>
                    <span className="text-lg font-bold text-white">{score}/{maxScore}</span>
                  </div>
                  <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="text-xs text-white/40">Accuracy</span>
                    <span className="text-lg font-bold text-cyan-400">{accuracy}%</span>
                  </div>
                  <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="text-xs text-white/40">XP Earned</span>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: 'spring' }}
                      className="text-lg font-bold text-amber-400"
                    >
                      +{xpEarned}
                    </motion.span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-5 py-2.5 text-sm font-semibold text-purple-300 transition-all hover:bg-purple-500/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Play Again
                  </button>
                  <button
                    onClick={onExit}
                    className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Exit
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actual game */}
        <div className={cn('h-full p-4', (isPaused || isGameOver) && 'pointer-events-none blur-sm')}>
          {children}
        </div>
      </div>
    </div>
  )
}
