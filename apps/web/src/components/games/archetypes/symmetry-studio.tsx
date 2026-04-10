'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  FlipHorizontal2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type SymmetryType = 'vertical' | 'horizontal' | 'rotational'

interface PatternData {
  grid: boolean[][]
  symmetryType: SymmetryType
  size: number
  visibleHalf: boolean[][] // The half shown to the player
  expectedFull: boolean[][] // Complete correct grid
}

interface RoundResult {
  symmetryType: SymmetryType
  score: number
  correct: number
  total: number
}

interface SymmetryStudioProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Helpers ──────────────────────────────────────────────────

const TOTAL_ROUNDS = 5

function getGridSize(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 6
    case 'medium': return 8
    case 'hard': return 10
    case 'extreme': return 10
  }
}

function getSymmetryTypes(difficulty: GameDifficulty): SymmetryType[] {
  switch (difficulty) {
    case 'easy': return ['vertical']
    case 'medium': return ['vertical', 'horizontal']
    case 'hard': return ['vertical', 'horizontal', 'rotational']
    case 'extreme': return ['vertical', 'horizontal', 'rotational']
  }
}

function generatePattern(size: number, symmetryType: SymmetryType): PatternData {
  // Generate a random half and mirror it
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false),
  )

  const fillDensity = 0.35 + Math.random() * 0.2

  if (symmetryType === 'vertical') {
    // Fill left half randomly, mirror to right
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < Math.ceil(size / 2); c++) {
        grid[r][c] = Math.random() < fillDensity
      }
    }
    for (let r = 0; r < size; r++) {
      for (let c = Math.ceil(size / 2); c < size; c++) {
        grid[r][c] = grid[r][size - 1 - c]
      }
    }
  } else if (symmetryType === 'horizontal') {
    // Fill top half randomly, mirror to bottom
    for (let r = 0; r < Math.ceil(size / 2); r++) {
      for (let c = 0; c < size; c++) {
        grid[r][c] = Math.random() < fillDensity
      }
    }
    for (let r = Math.ceil(size / 2); r < size; r++) {
      for (let c = 0; c < size; c++) {
        grid[r][c] = grid[size - 1 - r][c]
      }
    }
  } else {
    // Rotational (180°): fill top-left quadrant, rotate
    for (let r = 0; r < Math.ceil(size / 2); r++) {
      for (let c = 0; c < size; c++) {
        grid[r][c] = Math.random() < fillDensity
      }
    }
    for (let r = Math.ceil(size / 2); r < size; r++) {
      for (let c = 0; c < size; c++) {
        grid[r][c] = grid[size - 1 - r][size - 1 - c]
      }
    }
  }

  // Create visible half (only show one half)
  const visibleHalf: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false),
  )
  const expectedFull: boolean[][] = grid.map((row) => [...row])

  if (symmetryType === 'vertical') {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < Math.ceil(size / 2); c++) {
        visibleHalf[r][c] = grid[r][c]
      }
    }
  } else if (symmetryType === 'horizontal') {
    for (let r = 0; r < Math.ceil(size / 2); r++) {
      for (let c = 0; c < size; c++) {
        visibleHalf[r][c] = grid[r][c]
      }
    }
  } else {
    for (let r = 0; r < Math.ceil(size / 2); r++) {
      for (let c = 0; c < size; c++) {
        visibleHalf[r][c] = grid[r][c]
      }
    }
  }

  return { grid, symmetryType, size, visibleHalf, expectedFull }
}

function isEditableCell(r: number, c: number, size: number, symmetryType: SymmetryType): boolean {
  if (symmetryType === 'vertical') return c >= Math.ceil(size / 2)
  if (symmetryType === 'horizontal') return r >= Math.ceil(size / 2)
  return r >= Math.ceil(size / 2) // rotational: fill bottom half
}

function scorePattern(
  playerGrid: boolean[][],
  expected: boolean[][],
  size: number,
  symmetryType: SymmetryType,
): { correct: number; total: number } {
  let correct = 0
  let total = 0
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isEditableCell(r, c, size, symmetryType)) {
        total++
        if (playerGrid[r][c] === expected[r][c]) correct++
      }
    }
  }
  return { correct, total }
}

// ─── Component ────────────────────────────────────────────────

export default function SymmetryStudio({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: SymmetryStudioProps) {
  const gridSize = getGridSize(difficulty)
  const symmetryTypes = getSymmetryTypes(difficulty)
  const maxScore = TOTAL_ROUNDS * 100

  const patterns = useMemo(
    () =>
      Array.from({ length: TOTAL_ROUNDS }, () => {
        const st = symmetryTypes[Math.floor(Math.random() * symmetryTypes.length)]
        return generatePattern(gridSize, st)
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridSize],
  )

  const [currentRound, setCurrentRound] = useState(0)
  const [playerGrid, setPlayerGrid] = useState<boolean[][]>(() =>
    patterns[0].visibleHalf.map((row) => [...row]),
  )
  const [results, setResults] = useState<RoundResult[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [showCorrect, setShowCorrect] = useState(false)

  const pattern = patterns[currentRound]

  const toggleCell = useCallback(
    (r: number, c: number) => {
      if (submitted || isPaused) return
      if (!isEditableCell(r, c, pattern.size, pattern.symmetryType)) return
      setPlayerGrid((prev) => {
        const next = prev.map((row) => [...row])
        next[r][c] = !next[r][c]
        return next
      })
    },
    [submitted, isPaused, pattern],
  )

  const handleSubmit = useCallback(() => {
    if (submitted) return
    setSubmitted(true)

    const { correct, total } = scorePattern(playerGrid, pattern.expectedFull, pattern.size, pattern.symmetryType)
    const score = total > 0 ? Math.round((correct / total) * 100) : 0
    const result: RoundResult = {
      symmetryType: pattern.symmetryType,
      score,
      correct,
      total,
    }
    const newResults = [...results, result]
    setResults(newResults)

    const totalScore = newResults.reduce((s, r) => s + r.score, 0)
    onScoreUpdate(totalScore, maxScore)
  }, [submitted, playerGrid, pattern, results, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (currentRound + 1 >= TOTAL_ROUNDS) {
      setGameFinished(true)
      const totalScore = results.reduce((s, r) => s + r.score, 0)
      onGameOver(totalScore, maxScore)
    } else {
      const nextRound = currentRound + 1
      setCurrentRound(nextRound)
      setPlayerGrid(patterns[nextRound].visibleHalf.map((row) => [...row]))
      setSubmitted(false)
      setShowCorrect(false)
    }
  }, [currentRound, results, maxScore, onGameOver, patterns])

  const totalScore = results.reduce((s, r) => s + r.score, 0)
  const lastResult = submitted && results.length > 0 ? results[results.length - 1] : null
  const cellSize = gridSize <= 6 ? 'h-9 w-9' : gridSize <= 8 ? 'h-7 w-7' : 'h-5 w-5'

  const symmetryLabel = pattern.symmetryType === 'vertical'
    ? 'Vertical Mirror ↔'
    : pattern.symmetryType === 'horizontal'
      ? 'Horizontal Mirror ↕'
      : 'Rotational 180°'

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
      {/* Round indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < currentRound && results[i]?.score >= 70 && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i < currentRound && results[i]?.score < 70 && 'border-amber-500/40 bg-amber-500/15 text-amber-400',
              i === currentRound && !gameFinished && 'border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
              i > currentRound && 'border-white/10 bg-white/5 text-white/20',
              i === currentRound && gameFinished && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
            )}
          >
            {i < results.length ? (
              results[i].score >= 70 ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
            ) : (
              i + 1
            )}
          </div>
        ))}
      </div>

      {!gameFinished && (
        <>
          {/* Symmetry type label */}
          <motion.div
            key={currentRound}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/5 px-4 py-1.5 text-sm font-semibold text-pink-300"
          >
            <FlipHorizontal2 className="h-4 w-4" />
            {symmetryLabel}
          </motion.div>

          <p className="text-xs text-white/40">Click cells in the empty half to complete the symmetrical pattern</p>

          {/* Grid */}
          <div
            className="inline-grid rounded-xl border border-white/10 bg-white/5 p-2"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: '2px' }}
          >
            {playerGrid.map((row, r) =>
              row.map((filled, c) => {
                const editable = isEditableCell(r, c, pattern.size, pattern.symmetryType)
                const isCorrectCell = submitted && showCorrect && editable && pattern.expectedFull[r][c]
                const isWrongCell = submitted && showCorrect && editable && playerGrid[r][c] !== pattern.expectedFull[r][c]

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => toggleCell(r, c)}
                    disabled={!editable || submitted}
                    className={cn(
                      cellSize,
                      'rounded-sm border transition-all',
                      // Non-editable (given half)
                      !editable && filled && 'border-violet-500/30 bg-violet-500/60',
                      !editable && !filled && 'border-white/5 bg-white/3',
                      // Editable cells
                      editable && !submitted && filled && 'cursor-pointer border-cyan-500/30 bg-cyan-500/50 hover:brightness-125',
                      editable && !submitted && !filled && 'cursor-pointer border-white/10 bg-white/5 hover:bg-white/15',
                      // After submit
                      editable && submitted && !showCorrect && filled && 'border-cyan-500/30 bg-cyan-500/50',
                      editable && submitted && !showCorrect && !filled && 'border-white/5 bg-white/3',
                      // Show correct overlay
                      isWrongCell && 'border-red-500/50 bg-red-500/30',
                      isCorrectCell && !playerGrid[r][c] && 'border-emerald-500/50 bg-emerald-500/20',
                    )}
                  />
                )
              }),
            )}
          </div>

          {/* Divider line indicator */}
          <p className="text-[10px] text-white/20">
            {pattern.symmetryType === 'vertical' ? 'Left = given | Right = your mirror' : 'Top = given | Bottom = your mirror'}
          </p>

          {/* Actions */}
          {!submitted ? (
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setPlayerGrid(patterns[currentRound].visibleHalf.map((row) => [...row]))
                }
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:bg-white/10"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-6 py-2.5 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20"
              >
                <CheckCircle2 className="h-4 w-4" />
                Check
              </button>
            </div>
          ) : lastResult ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-sm text-white/60">
                Accuracy: <span className={cn(
                  'font-bold',
                  lastResult.score >= 80 ? 'text-emerald-400' : lastResult.score >= 50 ? 'text-amber-400' : 'text-red-400',
                )}>
                  {lastResult.correct}/{lastResult.total}
                </span>
                — Score: <span className="font-bold text-violet-400">{lastResult.score}</span>/100
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCorrect(!showCorrect)}
                  className="text-xs text-white/30 hover:text-white/60 underline"
                >
                  {showCorrect ? 'Hide' : 'Show'} correct answer
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-6 py-2.5 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-500/20"
                >
                  {currentRound + 1 >= TOTAL_ROUNDS ? 'Finish' : 'Next Pattern'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ) : null}
        </>
      )}

      {/* Final Summary */}
      {gameFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h3 className="text-lg font-bold text-white">Session Complete!</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/40">Total Score</p>
              <p className="text-2xl font-bold text-violet-400">{totalScore}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/40">Max Possible</p>
              <p className="text-2xl font-bold text-cyan-400">{maxScore}</p>
            </div>
          </div>
          <div className="w-full space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm">
                <span className="text-white/60">
                  R{i + 1}: {r.symmetryType} ({r.correct}/{r.total})
                </span>
                <span className={cn(
                  'font-bold',
                  r.score >= 80 ? 'text-emerald-400' : r.score >= 50 ? 'text-amber-400' : 'text-red-400',
                )}>{r.score}/100</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
