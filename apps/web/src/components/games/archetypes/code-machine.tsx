'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Play, RotateCcw, Trash2, CheckCircle2, XCircle, ArrowUp, ArrowRight,
  CornerDownRight, Repeat, AlertTriangle, Flag, Bot,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type CellType = 'empty' | 'wall' | 'start' | 'goal'
type Direction = 'up' | 'down' | 'left' | 'right'
type BlockType = 'FORWARD' | 'LEFT' | 'RIGHT' | 'LOOP_2' | 'LOOP_3' | 'IF_WALL_LEFT' | 'IF_WALL_RIGHT'

interface CodeBlock {
  id: number
  type: BlockType
  children?: CodeBlock[] // For loops and conditionals
}

interface Position {
  row: number
  col: number
}

interface RobotState {
  pos: Position
  dir: Direction
}

interface Maze {
  grid: CellType[][]
  start: Position
  goal: Position
  optimalBlocks: number
}

interface CodeMachineProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Maze Generation ──────────────────────────────────────────

function generateMazes(difficulty: GameDifficulty): Maze[] {
  switch (difficulty) {
    case 'easy':
      return [
        // Straight path right
        {
          grid: [
            ['wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'start', 'empty', 'empty', 'wall'],
            ['wall', 'wall', 'wall', 'empty', 'wall'],
            ['wall', 'empty', 'empty', 'goal', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall'],
          ],
          start: { row: 1, col: 1 },
          goal: { row: 3, col: 3 },
          optimalBlocks: 4,
        },
        {
          grid: [
            ['wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'start', 'empty', 'goal', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall'],
          ],
          start: { row: 1, col: 1 },
          goal: { row: 1, col: 3 },
          optimalBlocks: 2,
        },
        {
          grid: [
            ['wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'start', 'empty', 'empty', 'wall'],
            ['wall', 'wall', 'wall', 'empty', 'wall'],
            ['wall', 'wall', 'wall', 'goal', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall'],
          ],
          start: { row: 1, col: 1 },
          goal: { row: 3, col: 3 },
          optimalBlocks: 4,
        },
      ]
    case 'medium':
      return [
        {
          grid: [
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'start', 'empty', 'wall', 'empty', 'wall'],
            ['wall', 'wall', 'empty', 'wall', 'empty', 'wall'],
            ['wall', 'wall', 'empty', 'empty', 'empty', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'goal', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
          ],
          start: { row: 1, col: 1 },
          goal: { row: 4, col: 4 },
          optimalBlocks: 7,
        },
        {
          grid: [
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'start', 'empty', 'empty', 'empty', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'empty', 'wall'],
            ['wall', 'goal', 'empty', 'empty', 'empty', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
          ],
          start: { row: 1, col: 1 },
          goal: { row: 3, col: 1 },
          optimalBlocks: 6,
        },
        {
          grid: [
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'start', 'wall', 'empty', 'goal', 'wall'],
            ['wall', 'empty', 'wall', 'empty', 'wall', 'wall'],
            ['wall', 'empty', 'empty', 'empty', 'wall', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
          ],
          start: { row: 1, col: 1 },
          goal: { row: 1, col: 4 },
          optimalBlocks: 7,
        },
      ]
    case 'hard':
      return [
        {
          grid: [
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'start', 'empty', 'empty', 'empty', 'empty', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall'],
            ['wall', 'empty', 'empty', 'empty', 'wall', 'empty', 'wall'],
            ['wall', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall'],
            ['wall', 'empty', 'wall', 'empty', 'empty', 'goal', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
          ],
          start: { row: 1, col: 1 },
          goal: { row: 5, col: 5 },
          optimalBlocks: 9,
        },
        {
          grid: [
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'start', 'empty', 'wall', 'empty', 'empty', 'wall'],
            ['wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall'],
            ['wall', 'wall', 'empty', 'empty', 'empty', 'wall', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall'],
            ['wall', 'goal', 'empty', 'empty', 'empty', 'wall', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
          ],
          start: { row: 1, col: 1 },
          goal: { row: 5, col: 1 },
          optimalBlocks: 10,
        },
        {
          grid: [
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'start', 'empty', 'empty', 'wall', 'goal', 'wall'],
            ['wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall'],
            ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
            ['wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
          ],
          start: { row: 1, col: 1 },
          goal: { row: 1, col: 5 },
          optimalBlocks: 10,
        },
      ]
    case 'extreme':
      return [
        {
          grid: [
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'start', 'empty', 'empty', 'wall', 'empty', 'empty', 'wall'],
            ['wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall'],
            ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'wall'],
            ['wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'goal', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
          ],
          start: { row: 1, col: 1 },
          goal: { row: 6, col: 6 },
          optimalBlocks: 12,
        },
        {
          grid: [
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'start', 'wall', 'empty', 'empty', 'empty', 'wall', 'wall'],
            ['wall', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall'],
            ['wall', 'empty', 'wall', 'empty', 'wall', 'empty', 'empty', 'wall'],
            ['wall', 'empty', 'empty', 'empty', 'wall', 'wall', 'empty', 'wall'],
            ['wall', 'wall', 'wall', 'empty', 'empty', 'empty', 'empty', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'goal', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
          ],
          start: { row: 1, col: 1 },
          goal: { row: 6, col: 6 },
          optimalBlocks: 14,
        },
        {
          grid: [
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'start', 'empty', 'empty', 'empty', 'wall', 'empty', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall'],
            ['wall', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'wall'],
            ['wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall'],
            ['wall', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'wall'],
            ['wall', 'empty', 'empty', 'empty', 'wall', 'wall', 'goal', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
          ],
          start: { row: 1, col: 1 },
          goal: { row: 6, col: 6 },
          optimalBlocks: 15,
        },
      ]
  }
}

function getAvailableBlocks(difficulty: GameDifficulty): BlockType[] {
  switch (difficulty) {
    case 'easy':
      return ['FORWARD', 'LEFT', 'RIGHT']
    case 'medium':
      return ['FORWARD', 'LEFT', 'RIGHT', 'LOOP_2']
    case 'hard':
      return ['FORWARD', 'LEFT', 'RIGHT', 'LOOP_2', 'LOOP_3']
    case 'extreme':
      return ['FORWARD', 'LEFT', 'RIGHT', 'LOOP_2', 'LOOP_3', 'IF_WALL_LEFT', 'IF_WALL_RIGHT']
  }
}

function getMaxScore(difficulty: GameDifficulty): number {
  const mult = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : difficulty === 'hard' ? 2 : 3
  return Math.round(generateMazes(difficulty).length * 100 * mult)
}

const BLOCK_INFO: Record<BlockType, { label: string; color: string; icon: typeof ArrowUp }> = {
  FORWARD: { label: 'FORWARD', color: 'emerald', icon: ArrowUp },
  LEFT: { label: 'LEFT', color: 'amber', icon: CornerDownRight },
  RIGHT: { label: 'RIGHT', color: 'cyan', icon: ArrowRight },
  LOOP_2: { label: 'LOOP ×2', color: 'violet', icon: Repeat },
  LOOP_3: { label: 'LOOP ×3', color: 'purple', icon: Repeat },
  IF_WALL_LEFT: { label: 'IF WALL←', color: 'orange', icon: AlertTriangle },
  IF_WALL_RIGHT: { label: 'IF WALL→', color: 'rose', icon: AlertTriangle },
}

// ─── Execution Engine ─────────────────────────────────────────

function turnLeft(dir: Direction): Direction {
  const map: Record<Direction, Direction> = { up: 'left', left: 'down', down: 'right', right: 'up' }
  return map[dir]
}

function turnRight(dir: Direction): Direction {
  const map: Record<Direction, Direction> = { up: 'right', right: 'down', down: 'left', left: 'up' }
  return map[dir]
}

function moveForward(pos: Position, dir: Direction): Position {
  switch (dir) {
    case 'up': return { row: pos.row - 1, col: pos.col }
    case 'down': return { row: pos.row + 1, col: pos.col }
    case 'left': return { row: pos.row, col: pos.col - 1 }
    case 'right': return { row: pos.row, col: pos.col + 1 }
  }
}

function isWalkable(grid: CellType[][], pos: Position): boolean {
  if (pos.row < 0 || pos.row >= grid.length || pos.col < 0 || pos.col >= grid[0].length) return false
  return grid[pos.row][pos.col] !== 'wall'
}

function hasWallInDir(grid: CellType[][], pos: Position, checkDir: Direction): boolean {
  const checkPos = moveForward(pos, checkDir)
  return !isWalkable(grid, checkPos)
}

function executeBlocks(
  blocks: CodeBlock[],
  state: RobotState,
  grid: CellType[][],
  path: Position[],
  maxSteps: number,
): { finalState: RobotState; path: Position[]; reachedGoal: boolean } {
  let current = { ...state }
  let steps = 0

  function execute(blks: CodeBlock[]) {
    for (const block of blks) {
      if (steps > maxSteps) return

      switch (block.type) {
        case 'FORWARD': {
          const next = moveForward(current.pos, current.dir)
          if (isWalkable(grid, next)) {
            current = { ...current, pos: next }
            path.push({ ...next })
          }
          steps++
          break
        }
        case 'LEFT':
          current = { ...current, dir: turnLeft(current.dir) }
          steps++
          break
        case 'RIGHT':
          current = { ...current, dir: turnRight(current.dir) }
          steps++
          break
        case 'LOOP_2':
          for (let i = 0; i < 2 && steps <= maxSteps; i++) {
            execute(block.children || [])
          }
          break
        case 'LOOP_3':
          for (let i = 0; i < 3 && steps <= maxSteps; i++) {
            execute(block.children || [])
          }
          break
        case 'IF_WALL_LEFT':
          if (hasWallInDir(grid, current.pos, turnLeft(current.dir))) {
            execute(block.children || [])
          }
          steps++
          break
        case 'IF_WALL_RIGHT':
          if (hasWallInDir(grid, current.pos, turnRight(current.dir))) {
            execute(block.children || [])
          }
          steps++
          break
      }
    }
  }

  execute(blocks)

  const goal = grid.flatMap((row, r) => row.map((c, ci) => c === 'goal' ? { row: r, col: ci } : null)).filter(Boolean)[0]
  const reachedGoal = goal ? current.pos.row === goal.row && current.pos.col === goal.col : false

  return { finalState: current, path, reachedGoal }
}

function countBlocks(blocks: CodeBlock[]): number {
  let count = 0
  for (const b of blocks) {
    count++
    if (b.children) count += countBlocks(b.children)
  }
  return count
}

// ─── Component ────────────────────────────────────────────────

export default function CodeMachine({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: CodeMachineProps) {
  const mazes = useMemo(() => generateMazes(difficulty), [difficulty])
  const availableBlocks = getAvailableBlocks(difficulty)
  const maxScore = getMaxScore(difficulty)
  const mult = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : difficulty === 'hard' ? 2 : 3

  const [mazeIdx, setMazeIdx] = useState(0)
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([])
  const [nextId, setNextId] = useState(1)
  const [running, setRunning] = useState(false)
  const [animPath, setAnimPath] = useState<Position[]>([])
  const [animStep, setAnimStep] = useState(-1)
  const [robotDir, setRobotDir] = useState<Direction>('right')
  const [result, setResult] = useState<{ reached: boolean; message: string; score: number } | null>(null)
  const [scores, setScores] = useState<number[]>([])
  const [gameFinished, setGameFinished] = useState(false)
  const [editingLoop, setEditingLoop] = useState<number | null>(null)

  const animRef = useRef<ReturnType<typeof setTimeout>>()
  const maze = mazes[mazeIdx]

  const addBlock = useCallback((type: BlockType) => {
    if (isPaused || running || result) return

    const isLoop = type === 'LOOP_2' || type === 'LOOP_3'
    const isConditional = type === 'IF_WALL_LEFT' || type === 'IF_WALL_RIGHT'

    const block: CodeBlock = {
      id: nextId,
      type,
      children: (isLoop || isConditional) ? [] : undefined,
    }

    if (editingLoop !== null) {
      // Add as child of the loop/conditional
      setCodeBlocks((prev) => prev.map((b) =>
        b.id === editingLoop ? { ...b, children: [...(b.children || []), block] } : b,
      ))
    } else {
      setCodeBlocks((prev) => [...prev, block])
    }
    setNextId((n) => n + 1)
  }, [isPaused, running, result, nextId, editingLoop])

  const removeBlock = useCallback((blockId: number) => {
    if (isPaused || running || result) return
    setCodeBlocks((prev) => prev.filter((b) => b.id !== blockId).map((b) => ({
      ...b,
      children: b.children?.filter((c) => c.id !== blockId),
    })))
    if (editingLoop === blockId) setEditingLoop(null)
  }, [isPaused, running, result, editingLoop])

  const runCode = useCallback(() => {
    if (isPaused || codeBlocks.length === 0 || running) return

    const startState: RobotState = { pos: { ...maze.start }, dir: 'right' }
    const path: Position[] = [{ ...maze.start }]
    const { path: fullPath, reachedGoal } = executeBlocks(
      codeBlocks, startState, maze.grid, path, 100,
    )

    setAnimPath(fullPath)
    setRunning(true)
    setAnimStep(0)
    setRobotDir('right')

    // Animate step by step
    let step = 0
    const animate = () => {
      if (step < fullPath.length - 1) {
        step++
        setAnimStep(step)

        // Determine direction from movement
        if (step > 0) {
          const prev = fullPath[step - 1]
          const curr = fullPath[step]
          if (curr.row < prev.row) setRobotDir('up')
          else if (curr.row > prev.row) setRobotDir('down')
          else if (curr.col < prev.col) setRobotDir('left')
          else if (curr.col > prev.col) setRobotDir('right')
        }

        animRef.current = setTimeout(animate, 300)
      } else {
        // Done
        setRunning(false)

        const blockCount = countBlocks(codeBlocks)
        const optBonus = Math.max(0, (maze.optimalBlocks + 3 - blockCount) * 5)
        const baseScore = reachedGoal ? 60 + Math.min(40, optBonus) : 0
        const finalScore = Math.min(100, baseScore)

        setResult({
          reached: reachedGoal,
          message: reachedGoal
            ? `Goal reached! ${blockCount} blocks used (optimal: ${maze.optimalBlocks}). ${optBonus > 0 ? `Efficiency bonus: +${optBonus}` : ''}`
            : `Robot didn't reach the goal. Try a different sequence!`,
          score: finalScore,
        })

        if (reachedGoal) {
          const lvlScore = Math.round(finalScore * mult)
          setScores((prev) => {
            const ns = [...prev, lvlScore]
            const total = ns.reduce((a, b) => a + b, 0)
            onScoreUpdate(total, maxScore)
            return ns
          })
        }
      }
    }

    animRef.current = setTimeout(animate, 300)
  }, [isPaused, codeBlocks, running, maze, mult, maxScore, onScoreUpdate])

  useEffect(() => {
    return () => { if (animRef.current) clearTimeout(animRef.current) }
  }, [])

  const handleNext = useCallback(() => {
    if (mazeIdx + 1 >= mazes.length) {
      setGameFinished(true)
      const totalScore = scores.reduce((a, b) => a + b, 0)
      onGameOver(totalScore, maxScore)
    } else {
      setMazeIdx((m) => m + 1)
      setCodeBlocks([])
      setNextId(1)
      setAnimPath([])
      setAnimStep(-1)
      setResult(null)
      setEditingLoop(null)
    }
  }, [mazeIdx, mazes.length, scores, maxScore, onGameOver])

  const handleClear = useCallback(() => {
    setCodeBlocks([])
    setNextId(1)
    setAnimPath([])
    setAnimStep(-1)
    setResult(null)
    setEditingLoop(null)
  }, [])

  const CELL_SIZE = Math.min(48, 320 / maze.grid.length)

  // Direction arrow rotation
  const dirRotation: Record<Direction, string> = {
    up: 'rotate(-90deg)',
    right: 'rotate(0deg)',
    down: 'rotate(90deg)',
    left: 'rotate(180deg)',
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
      {/* Level indicator */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          {mazes.map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold',
                i < mazeIdx && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
                i === mazeIdx && !gameFinished && 'border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
                i > mazeIdx && 'border-white/10 bg-white/5 text-white/20',
              )}
            >
              {i < mazeIdx ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
            </div>
          ))}
        </div>
        <span className="text-xs text-white/40">
          Blocks: <span className="font-bold text-cyan-400">{countBlocks(codeBlocks)}</span>
          <span className="mx-1 text-white/20">|</span>
          Optimal: <span className="font-bold text-violet-400">{maze.optimalBlocks}</span>
        </span>
      </div>

      {!gameFinished && (
        <div className="flex w-full flex-col gap-4 md:flex-row">
          {/* Maze grid */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Maze</p>
            <div
              className="rounded-xl border border-white/10 bg-slate-900/50 p-2"
              style={{ width: maze.grid[0].length * CELL_SIZE + 16, height: maze.grid.length * CELL_SIZE + 16 }}
            >
              <div className="grid" style={{ gridTemplateColumns: `repeat(${maze.grid[0].length}, ${CELL_SIZE}px)` }}>
                {maze.grid.map((row, r) =>
                  row.map((cell, c) => {
                    const isAnimated = animStep >= 0 && animPath[animStep]?.row === r && animPath[animStep]?.col === c
                    const wasVisited = animPath.slice(0, animStep + 1).some((p) => p.row === r && p.col === c)
                    const isStart = cell === 'start'
                    const isGoal = cell === 'goal'

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={cn(
                          'flex items-center justify-center border border-white/5 transition-all',
                          cell === 'wall' && 'bg-slate-800',
                          cell !== 'wall' && 'bg-slate-900/30',
                          wasVisited && !isAnimated && 'bg-cyan-900/20',
                        )}
                        style={{ width: CELL_SIZE, height: CELL_SIZE }}
                      >
                        {isAnimated && (
                          <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            className="flex h-full w-full items-center justify-center"
                          >
                            <Bot
                              className="text-cyan-400"
                              style={{
                                width: CELL_SIZE * 0.6,
                                height: CELL_SIZE * 0.6,
                                transform: dirRotation[robotDir],
                              }}
                            />
                          </motion.div>
                        )}
                        {!isAnimated && isStart && animStep < 0 && (
                          <Bot
                            className="text-violet-400"
                            style={{ width: CELL_SIZE * 0.5, height: CELL_SIZE * 0.5 }}
                          />
                        )}
                        {isGoal && !isAnimated && (
                          <Flag
                            className={cn(
                              result?.reached ? 'text-emerald-400' : 'text-yellow-400',
                            )}
                            style={{ width: CELL_SIZE * 0.45, height: CELL_SIZE * 0.45 }}
                          />
                        )}
                        {isGoal && isAnimated && result?.reached && (
                          <motion.div
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 0.6 }}
                          >
                            <CheckCircle2
                              className="text-emerald-400"
                              style={{ width: CELL_SIZE * 0.5, height: CELL_SIZE * 0.5 }}
                            />
                          </motion.div>
                        )}
                      </div>
                    )
                  }),
                )}
              </div>
            </div>
          </div>

          {/* Code panel */}
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Code Blocks {editingLoop !== null && <span className="text-violet-400">(editing loop body)</span>}
            </p>

            {/* Block palette */}
            <div className="flex flex-wrap gap-1.5">
              {availableBlocks.map((type) => {
                const info = BLOCK_INFO[type]
                return (
                  <button
                    key={type}
                    onClick={() => addBlock(type)}
                    disabled={running || !!result}
                    className={cn(
                      `flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold transition-all`,
                      `border-${info.color}-500/30 bg-${info.color}-500/10 text-${info.color}-300`,
                      `hover:bg-${info.color}-500/20 disabled:opacity-30`,
                    )}
                    style={{
                      borderColor: `color-mix(in srgb, var(--tw-${info.color}-500, #8b5cf6) 30%, transparent)`,
                    }}
                  >
                    <info.icon className="h-3 w-3" />
                    {info.label}
                  </button>
                )
              })}
            </div>

            {/* Code stack */}
            <div className="min-h-[140px] rounded-xl border border-white/10 bg-slate-900/50 p-2">
              {codeBlocks.length === 0 ? (
                <p className="py-6 text-center text-xs text-white/20">Click blocks above to build your program</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {codeBlocks.map((block, i) => {
                    const info = BLOCK_INFO[block.type]
                    const isLoop = block.type.startsWith('LOOP') || block.type.startsWith('IF_')
                    const isEditing = editingLoop === block.id
                    return (
                      <div key={block.id}>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={cn(
                            'flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-semibold',
                            isEditing
                              ? 'border-violet-500/50 bg-violet-500/15 text-violet-300'
                              : 'border-white/10 bg-white/5 text-white/70',
                          )}
                        >
                          <span className="text-white/20 text-[10px] w-4">{i + 1}.</span>
                          <info.icon className="h-3 w-3 shrink-0" />
                          <span className="flex-1">{info.label}</span>
                          {isLoop && (
                            <button
                              onClick={() => setEditingLoop(isEditing ? null : block.id)}
                              className="rounded px-1 text-[10px] text-violet-400 hover:bg-violet-500/20"
                            >
                              {isEditing ? '✓' : `{${block.children?.length || 0}}`}
                            </button>
                          )}
                          <button
                            onClick={() => removeBlock(block.id)}
                            disabled={running || !!result}
                            className="text-white/30 hover:text-red-400 disabled:opacity-30"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </motion.div>
                        {/* Loop children */}
                        {isLoop && block.children && block.children.length > 0 && (
                          <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-violet-500/20 pl-2">
                            {block.children.map((child) => {
                              const ci = BLOCK_INFO[child.type]
                              return (
                                <div
                                  key={child.id}
                                  className="flex items-center gap-1 rounded border border-white/5 bg-white/3 px-1.5 py-1 text-[10px] font-semibold text-white/60"
                                >
                                  <ci.icon className="h-2.5 w-2.5" />
                                  {ci.label}
                                  <button
                                    onClick={() => removeBlock(child.id)}
                                    disabled={running || !!result}
                                    className="ml-auto text-white/20 hover:text-red-400 disabled:opacity-30"
                                  >
                                    <Trash2 className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Result message */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    'rounded-xl border px-3 py-2 text-center text-xs',
                    result.reached
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-red-500/30 bg-red-500/10 text-red-300',
                  )}
                >
                  {result.reached ? <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" /> : <XCircle className="mr-1 inline h-3.5 w-3.5" />}
                  {result.message}
                  {result.reached && <span className="ml-1 font-bold text-cyan-400">+{Math.round(result.score * mult)} pts</span>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                disabled={running}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/50 transition-all hover:border-white/20 disabled:opacity-30"
              >
                <RotateCcw className="h-3 w-3" />
                Clear
              </button>

              {!result?.reached ? (
                <button
                  onClick={runCode}
                  disabled={running || codeBlocks.length === 0}
                  className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-30"
                >
                  <Play className="h-3 w-3" />
                  {running ? 'Running…' : 'RUN'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 transition-all hover:bg-violet-500/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                >
                  {mazeIdx + 1 >= mazes.length ? 'Finish' : 'Next Level →'}
                </button>
              )}

              {result && !result.reached && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-all hover:bg-amber-500/20"
                >
                  <RotateCcw className="h-3 w-3" />
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Final summary */}
      {gameFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h3 className="text-lg font-bold text-white">Code Machine Complete!</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/40">Levels</p>
              <p className="text-2xl font-bold text-emerald-400">{scores.length}/{mazes.length}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/40">Score</p>
              <p className="text-2xl font-bold text-violet-400">{scores.reduce((a, b) => a + b, 0)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/40">Multiplier</p>
              <p className="text-2xl font-bold text-cyan-400">{mult}×</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
