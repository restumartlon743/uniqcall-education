'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Timer,
  CheckCircle2,
  Eraser,
  RotateCcw,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface PixelPrecisionProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Helpers ──────────────────────────────────────────────────

const PALETTE_COLORS = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4',
  '#3B82F6', '#8B5CF6', '#EC4899', '#FFFFFF', '#64748B',
]

function getGridSize(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 8
    case 'medium': return 12
    case 'hard': return 16
    case 'extreme': return 16
  }
}

function getTimeLimit(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 120
    case 'medium': return 90
    case 'hard': return 60
    case 'extreme': return 45
  }
}

function getColorCount(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 6
    case 'medium': return 8
    case 'hard': return 10
    case 'extreme': return 10
  }
}

// Procedural pattern generators
type PatternFn = (row: number, col: number, size: number, colors: string[]) => string

const PATTERNS: PatternFn[] = [
  // Diagonal stripes
  (r, c, _s, colors) => colors[(r + c) % 3],
  // Checkerboard
  (r, c, _s, colors) => colors[(r + c) % 2],
  // Concentric rings
  (r, c, s, colors) => {
    const cx = Math.floor(s / 2)
    const dist = Math.max(Math.abs(r - cx), Math.abs(c - cx))
    return colors[dist % colors.length]
  },
  // Cross / plus
  (r, c, s, colors) => {
    const cx = Math.floor(s / 2)
    if (r === cx || c === cx) return colors[1]
    if (Math.abs(r - cx) === Math.abs(c - cx)) return colors[2]
    return colors[0]
  },
  // Letter H
  (r, c, s, colors) => {
    const third = Math.floor(s / 3)
    if (c < third || c >= s - third) return colors[1]
    if (r >= third && r < s - third) return colors[1]
    return colors[0]
  },
  // Diamond
  (r, c, s, colors) => {
    const cx = Math.floor(s / 2)
    if (Math.abs(r - cx) + Math.abs(c - cx) <= cx) return colors[1]
    return colors[0]
  },
  // Arrow right
  (r, c, s, colors) => {
    const mid = Math.floor(s / 2)
    if (c <= mid && Math.abs(r - mid) <= c) return colors[1]
    if (c > mid && r >= mid - 1 && r <= mid + 1) return colors[2]
    return colors[0]
  },
  // Border frame
  (r, c, s, colors) => {
    if (r === 0 || r === s - 1 || c === 0 || c === s - 1) return colors[1]
    if (r === 1 || r === s - 2 || c === 1 || c === s - 2) return colors[2]
    return colors[0]
  },
]

function generateReference(size: number, colorCount: number): string[][] {
  const colors = PALETTE_COLORS.slice(0, colorCount)
  const patternFn = PATTERNS[Math.floor(Math.random() * PATTERNS.length)]
  const grid: string[][] = []
  for (let r = 0; r < size; r++) {
    const row: string[] = []
    for (let c = 0; c < size; c++) {
      row.push(patternFn(r, c, size, colors))
    }
    grid.push(row)
  }
  return grid
}

function createEmptyGrid(size: number): (string | null)[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null))
}

function scoreGrid(player: (string | null)[][], reference: string[][]): number {
  const size = reference.length
  let matches = 0
  let total = 0
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      total++
      if (player[r][c] === reference[r][c]) matches++
    }
  }
  return Math.round((matches / total) * 100)
}

// ─── Component ────────────────────────────────────────────────

export default function PixelPrecision({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: PixelPrecisionProps) {
  const gridSize = getGridSize(difficulty)
  const timeLimit = getTimeLimit(difficulty)
  const colorCount = getColorCount(difficulty)
  const palette = useMemo(() => PALETTE_COLORS.slice(0, colorCount), [colorCount])
  const reference = useMemo(() => generateReference(gridSize, colorCount), [gridSize, colorCount])
  const maxScore = 100

  const [playerGrid, setPlayerGrid] = useState<(string | null)[][]>(() => createEmptyGrid(gridSize))
  const [selectedColor, setSelectedColor] = useState<string | null>(palette[0])
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [gameOver, setGameOver] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [isEraser, setIsEraser] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Timer
  useEffect(() => {
    if (gameOver || isPaused) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameOver, isPaused])

  // Auto-submit on time out
  useEffect(() => {
    if (timeLeft === 0 && !gameOver) {
      handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  const paintCell = useCallback(
    (r: number, c: number) => {
      if (gameOver || isPaused) return
      setPlayerGrid((prev) => {
        const next = prev.map((row) => [...row])
        next[r][c] = isEraser ? null : selectedColor
        return next
      })
    },
    [gameOver, isPaused, isEraser, selectedColor],
  )

  const handleSubmit = useCallback(() => {
    if (gameOver) return
    if (timerRef.current) clearInterval(timerRef.current)
    setGameOver(true)
    const score = scoreGrid(playerGrid, reference)
    setFinalScore(score)
    onScoreUpdate(score, maxScore)
    onGameOver(score, maxScore)
  }, [gameOver, playerGrid, reference, maxScore, onScoreUpdate, onGameOver])

  const handleClear = useCallback(() => {
    if (gameOver) return
    setPlayerGrid(createEmptyGrid(gridSize))
  }, [gameOver, gridSize])

  const cellSize = gridSize <= 8 ? 'h-7 w-7' : gridSize <= 12 ? 'h-5 w-5' : 'h-4 w-4'

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
      {/* Timer */}
      {!gameOver && (
        <motion.div
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold',
            timeLeft <= 15
              ? 'border-red-500/40 bg-red-500/15 text-red-400'
              : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
          )}
          animate={timeLeft <= 15 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.6 }}
        >
          <Timer className="h-3.5 w-3.5" />
          {timeLeft}s
        </motion.div>
      )}

      {/* Grids side by side */}
      <div className="flex flex-wrap items-start justify-center gap-6">
        {/* Reference */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Reference</p>
          <div
            className="inline-grid rounded-lg border border-white/10 bg-white/5 p-1"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: '1px' }}
          >
            {reference.map((row, r) =>
              row.map((color, c) => (
                <div
                  key={`ref-${r}-${c}`}
                  className={cn(cellSize, 'rounded-sm')}
                  style={{ backgroundColor: color }}
                />
              )),
            )}
          </div>
        </div>

        {/* Player Grid */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Your Canvas</p>
          <div
            className="inline-grid rounded-lg border border-violet-500/20 bg-white/5 p-1"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: '1px' }}
            onMouseLeave={() => setIsDragging(false)}
          >
            {playerGrid.map((row, r) =>
              row.map((color, c) => (
                <div
                  key={`p-${r}-${c}`}
                  className={cn(
                    cellSize,
                    'cursor-pointer rounded-sm border border-white/5 transition-colors hover:brightness-125',
                  )}
                  style={{ backgroundColor: color || 'rgba(255,255,255,0.03)' }}
                  onMouseDown={() => {
                    setIsDragging(true)
                    paintCell(r, c)
                  }}
                  onMouseEnter={() => {
                    if (isDragging) paintCell(r, c)
                  }}
                  onMouseUp={() => setIsDragging(false)}
                />
              )),
            )}
          </div>
        </div>
      </div>

      {/* Palette & Tools */}
      {!gameOver && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {palette.map((color) => (
            <button
              key={color}
              onClick={() => {
                setSelectedColor(color)
                setIsEraser(false)
              }}
              className={cn(
                'h-8 w-8 rounded-lg border-2 transition-all',
                selectedColor === color && !isEraser
                  ? 'scale-110 border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                  : 'border-white/20 hover:border-white/40',
              )}
              style={{ backgroundColor: color }}
            />
          ))}
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg border-2 transition-all',
              isEraser
                ? 'border-white bg-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                : 'border-white/20 bg-white/5 text-white/50 hover:border-white/40',
            )}
          >
            <Eraser className="h-4 w-4" />
          </button>
          <button
            onClick={handleClear}
            className="flex h-8 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white/50 hover:bg-white/10"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
        </div>
      )}

      {/* Submit / Result */}
      {!gameOver ? (
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-6 py-2.5 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20"
        >
          <CheckCircle2 className="h-4 w-4" />
          Submit
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h3 className="text-lg font-bold text-white">Result</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/40">Accuracy</p>
              <p className={cn(
                'text-3xl font-bold',
                finalScore >= 80 ? 'text-emerald-400' : finalScore >= 50 ? 'text-amber-400' : 'text-red-400',
              )}>
                {finalScore}%
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/40">Time Used</p>
              <p className="text-3xl font-bold text-cyan-400">{timeLimit - timeLeft}s</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
