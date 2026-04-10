'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Check, X, RotateCcw, Lightbulb, CheckCircle2, PartyPopper } from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type CellState = 'empty' | 'yes' | 'no'

interface Clue {
  text: string
  satisfied: boolean | null
}

interface Puzzle {
  categories: string[][]
  solution: number[][] // solution[catPairIdx][row] = col
  clues: Clue[]
  gridSize: number
}

interface LogicGridPuzzleProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Puzzle Generation ────────────────────────────────────────

const CATEGORY_POOLS = [
  ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'],
  ['Red', 'Blue', 'Green', 'Yellow', 'Purple'],
  ['Cat', 'Dog', 'Fish', 'Bird', 'Snake'],
  ['Pizza', 'Sushi', 'Pasta', 'Tacos', 'Salad'],
  ['Piano', 'Guitar', 'Drums', 'Violin', 'Flute'],
]

function getGridSize(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 3
    case 'medium': return 4
    case 'hard':
    case 'extreme': return 5
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateClues(
  categories: string[][],
  assignment: number[],
  size: number,
): Clue[] {
  const clues: Clue[] = []
  const cat0 = categories[0]
  const cat1 = categories[1]

  // Direct positive clue: "X has Y"
  const directIdx = Math.floor(Math.random() * size)
  clues.push({
    text: `${cat0[directIdx]} has ${cat1[assignment[directIdx]]}.`,
    satisfied: null,
  })

  // Negative clues: "X does NOT have Y"
  for (let i = 0; i < size; i++) {
    const wrongTargets = []
    for (let j = 0; j < size; j++) {
      if (j !== assignment[i]) wrongTargets.push(j)
    }
    if (wrongTargets.length > 0) {
      const pick = wrongTargets[Math.floor(Math.random() * wrongTargets.length)]
      clues.push({
        text: `${cat0[i]} does NOT have ${cat1[pick]}.`,
        satisfied: null,
      })
    }
  }

  // Relative clues: "X's item comes before Y's item alphabetically"
  if (size >= 3) {
    const idx1 = Math.floor(Math.random() * size)
    let idx2 = idx1
    while (idx2 === idx1) idx2 = Math.floor(Math.random() * size)
    const item1 = cat1[assignment[idx1]]
    const item2 = cat1[assignment[idx2]]
    if (item1 < item2) {
      clues.push({
        text: `${cat0[idx1]}'s item (${item1}) comes alphabetically before ${cat0[idx2]}'s item.`,
        satisfied: null,
      })
    } else {
      clues.push({
        text: `${cat0[idx2]}'s item (${item2}) comes alphabetically before ${cat0[idx1]}'s item.`,
        satisfied: null,
      })
    }
  }

  // "Either X has Y or Z has Y"
  if (size >= 3) {
    const targetCol = Math.floor(Math.random() * size)
    const correctRow = assignment.indexOf(targetCol)
    let wrongRow = correctRow
    while (wrongRow === correctRow) wrongRow = Math.floor(Math.random() * size)
    const pair = shuffle([cat0[correctRow], cat0[wrongRow]])
    clues.push({
      text: `Either ${pair[0]} or ${pair[1]} has ${cat1[targetCol]}.`,
      satisfied: null,
    })
  }

  return shuffle(clues).slice(0, size + Math.floor(size / 2))
}

function generatePuzzle(difficulty: GameDifficulty): Puzzle {
  const size = getGridSize(difficulty)
  const poolIndices = shuffle([0, 1, 2, 3, 4]).slice(0, 2)
  const categories = poolIndices.map((idx) => shuffle(CATEGORY_POOLS[idx]).slice(0, size))

  // Random 1-to-1 assignment: row i of cat0 maps to assignment[i] of cat1
  const assignment = shuffle(Array.from({ length: size }, (_, i) => i))

  // Build solution grid (for single cat pair): solution[row] = col
  const solution = [assignment]
  const clues = generateClues(categories, assignment, size)

  return { categories, solution, clues, gridSize: size }
}

// ─── Component ────────────────────────────────────────────────

export default function LogicGridPuzzle({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: LogicGridPuzzleProps) {
  const puzzle = useMemo(() => generatePuzzle(difficulty), [difficulty])
  const { categories, solution, clues, gridSize } = puzzle

  const [grid, setGrid] = useState<CellState[][]>(() =>
    Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => 'empty' as CellState),
    ),
  )
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const totalCells = gridSize * gridSize

  const cycleCell = useCallback(
    (row: number, col: number) => {
      if (checked || isPaused) return
      setGrid((prev) => {
        const next = prev.map((r) => [...r])
        const current = next[row][col]
        next[row][col] =
          current === 'empty' ? 'yes' : current === 'yes' ? 'no' : 'empty'
        return next
      })
    },
    [checked, isPaused],
  )

  const handleCheck = useCallback(() => {
    let correct = 0
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const expected = solution[0][r] === c ? 'yes' : 'no'
        if (grid[r][c] === expected) correct++
      }
    }
    setCorrectCount(correct)
    setChecked(true)
    onScoreUpdate(correct, totalCells)
    onGameOver(correct, totalCells)
  }, [grid, gridSize, solution, totalCells, onScoreUpdate, onGameOver])

  const handleReset = useCallback(() => {
    setGrid(
      Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => 'empty' as CellState),
      ),
    )
    setChecked(false)
    setCorrectCount(0)
  }, [gridSize])

  // Auto-fill "no" for row/col when a "yes" is placed
  useEffect(() => {
    setGrid((prev) => {
      const next = prev.map((r) => [...r])
      let changed = false
      for (let r = 0; r < gridSize; r++) {
        const yesCol = next[r].findIndex((c) => c === 'yes')
        if (yesCol !== -1) {
          for (let c = 0; c < gridSize; c++) {
            if (c !== yesCol && next[r][c] === 'empty') {
              next[r][c] = 'no'
              changed = true
            }
          }
          for (let rr = 0; rr < gridSize; rr++) {
            if (rr !== r && next[rr][yesCol] === 'empty') {
              next[rr][yesCol] = 'no'
              changed = true
            }
          }
        }
      }
      return changed ? next : prev
    })
  }, [grid, gridSize])

  const filledCount = grid.flat().filter((c) => c !== 'empty').length

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-lg font-bold text-white">
          Match each <span className="text-violet-400">{categories[0][0].charAt(0).toUpperCase() === categories[0][0].charAt(0) ? 'person' : 'item'}</span> to their <span className="text-cyan-400">attribute</span>
        </h2>
        <p className="mt-1 text-xs text-white/40">
          Click cells to cycle: empty → ✓ → ✗ → empty
        </p>
      </motion.div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
        >
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="border border-white/10 bg-white/5 p-3 text-xs font-semibold text-white/40">
                  {gridSize}×{gridSize}
                </th>
                {categories[1].map((item, c) => (
                  <th
                    key={c}
                    className="border border-white/10 bg-white/5 p-3 text-center text-xs font-semibold text-cyan-400"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories[0].map((rowLabel, r) => (
                <tr key={r}>
                  <td className="border border-white/10 bg-white/5 p-3 text-xs font-semibold text-violet-400">
                    {rowLabel}
                  </td>
                  {categories[1].map((_, c) => {
                    const state = grid[r][c]
                    const isCorrect =
                      checked && state === (solution[0][r] === c ? 'yes' : 'no')
                    const isWrong = checked && !isCorrect && state !== 'empty'

                    return (
                      <td
                        key={c}
                        onClick={() => cycleCell(r, c)}
                        className={cn(
                          'relative h-12 w-12 cursor-pointer border border-white/10 text-center transition-all sm:h-14 sm:w-14',
                          !checked && 'hover:bg-white/10',
                          state === 'yes' && !checked && 'bg-emerald-500/15',
                          state === 'no' && !checked && 'bg-red-500/10',
                          isCorrect && 'bg-emerald-500/20',
                          isWrong && 'bg-red-500/20',
                          checked && 'cursor-default',
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {state === 'yes' && (
                            <motion.div
                              key="yes"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="flex items-center justify-center"
                            >
                              <Check className="h-5 w-5 text-emerald-400" />
                            </motion.div>
                          )}
                          {state === 'no' && (
                            <motion.div
                              key="no"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="flex items-center justify-center"
                            >
                              <X className="h-5 w-5 text-red-400" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {checked && (
                          <div
                            className={cn(
                              'absolute -right-1 -top-1 h-3 w-3 rounded-full',
                              isCorrect ? 'bg-emerald-400' : 'bg-red-400',
                            )}
                          />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Clues Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:w-80"
        >
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <Lightbulb className="h-4 w-4 text-amber-400" />
            Clues
          </h3>
          <ul className="space-y-2">
            {clues.map((clue, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="rounded-lg border border-white/5 bg-white/3 px-3 py-2 text-xs leading-relaxed text-white/70"
              >
                <span className="mr-2 font-bold text-violet-400">{i + 1}.</span>
                {clue.text}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Progress & Actions */}
      <div className="flex flex-col items-center gap-3">
        {/* Fill progress */}
        <div className="flex items-center gap-2 text-xs text-white/40">
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${(filledCount / totalCells) * 100}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
          </div>
          <span>
            {filledCount}/{totalCells} filled
          </span>
        </div>

        <div className="flex gap-3">
          {!checked ? (
            <>
              <button
                onClick={handleCheck}
                className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <CheckCircle2 className="h-4 w-4" />
                Check Solution
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                onClick={() => setShowHint((h) => !h)}
                className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/20"
              >
                <Lightbulb className="h-4 w-4" />
                Hint
              </button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-center"
            >
              <p className="text-sm font-bold text-white">
                {correctCount}/{totalCells} cells correct
              </p>
              <p className="mt-1 text-xs text-white/40">
                {correctCount === totalCells
                  ? <><PartyPopper className="mr-1 inline h-4 w-4 text-amber-400" /> Perfect!</>
                  : `${Math.round((correctCount / totalCells) * 100)}% accuracy`}
              </p>
            </motion.div>
          )}
        </div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && !checked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-300/80"
            >
              <Lightbulb className="mr-1 inline h-3 w-3 text-amber-400" /> Start with the direct statements — mark those cells ✓ first,
              then eliminate the rest of that row and column with ✗.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
