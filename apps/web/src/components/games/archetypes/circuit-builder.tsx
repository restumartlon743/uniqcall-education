'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Zap, Battery, Lightbulb, ToggleLeft, CircuitBoard,
  Trash2, CheckCircle2, RotateCcw, Minus,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type ComponentType = 'battery' | 'led' | 'wire' | 'switch' | 'resistor'
type CellState = { type: ComponentType; rotation: number } | null

interface Wire {
  from: { row: number; col: number }
  to: { row: number; col: number }
}

interface Level {
  gridSize: number
  description: string
  requiredComponents: ComponentType[]
  minComponents: number
  maxBudget: number
}

interface CircuitBuilderProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Difficulty Config ────────────────────────────────────────

function getLevels(difficulty: GameDifficulty): Level[] {
  switch (difficulty) {
    case 'easy':
      return [
        { gridSize: 4, description: 'Connect battery to LED (simple loop)', requiredComponents: ['battery', 'led'], minComponents: 2, maxBudget: 8 },
        { gridSize: 4, description: 'Light up two LEDs from one battery', requiredComponents: ['battery', 'led', 'led'], minComponents: 3, maxBudget: 10 },
        { gridSize: 4, description: 'Battery → Wire → LED loop', requiredComponents: ['battery', 'wire', 'led'], minComponents: 3, maxBudget: 10 },
      ]
    case 'medium':
      return [
        { gridSize: 5, description: 'Add a switch to control the LED', requiredComponents: ['battery', 'switch', 'led'], minComponents: 3, maxBudget: 10 },
        { gridSize: 5, description: 'Battery → Resistor → LED with switch', requiredComponents: ['battery', 'resistor', 'switch', 'led'], minComponents: 4, maxBudget: 12 },
        { gridSize: 5, description: 'Two LEDs in series with a resistor', requiredComponents: ['battery', 'resistor', 'led', 'led'], minComponents: 4, maxBudget: 14 },
      ]
    case 'hard':
      return [
        { gridSize: 6, description: 'Parallel circuit: two LED branches', requiredComponents: ['battery', 'led', 'led', 'resistor', 'resistor'], minComponents: 5, maxBudget: 14 },
        { gridSize: 6, description: 'Complex: switch controls one branch only', requiredComponents: ['battery', 'switch', 'led', 'led', 'resistor'], minComponents: 5, maxBudget: 16 },
        { gridSize: 6, description: 'Full circuit with all components', requiredComponents: ['battery', 'switch', 'resistor', 'led', 'led'], minComponents: 5, maxBudget: 16 },
      ]
    case 'extreme':
      return [
        { gridSize: 7, description: 'Triple parallel LED circuit', requiredComponents: ['battery', 'led', 'led', 'led', 'resistor', 'resistor', 'resistor'], minComponents: 7, maxBudget: 18 },
        { gridSize: 7, description: 'Switch-gated multi-branch', requiredComponents: ['battery', 'switch', 'switch', 'led', 'led', 'resistor'], minComponents: 6, maxBudget: 18 },
        { gridSize: 7, description: 'Master circuit challenge', requiredComponents: ['battery', 'switch', 'resistor', 'resistor', 'led', 'led', 'led'], minComponents: 7, maxBudget: 20 },
      ]
  }
}

function getMaxScore(difficulty: GameDifficulty): number {
  const mult = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : difficulty === 'hard' ? 2 : 3
  return Math.round(getLevels(difficulty).length * 100 * mult)
}

const COMPONENT_COSTS: Record<ComponentType, number> = {
  battery: 3,
  led: 2,
  wire: 1,
  switch: 2,
  resistor: 2,
}

const COMPONENT_LABELS: Record<ComponentType, string> = {
  battery: 'Battery',
  led: 'LED',
  wire: 'Wire',
  switch: 'Switch',
  resistor: 'Resistor',
}

const PALETTE: ComponentType[] = ['battery', 'led', 'wire', 'switch', 'resistor']

function ComponentIcon({ type, className }: { type: ComponentType; className?: string }) {
  switch (type) {
    case 'battery': return <Battery className={className} />
    case 'led': return <Lightbulb className={className} />
    case 'wire': return <Minus className={className} />
    case 'switch': return <ToggleLeft className={className} />
    case 'resistor': return <CircuitBoard className={className} />
  }
}

// ─── Circuit Validation ───────────────────────────────────────

function validateCircuit(
  grid: CellState[][],
  wires: Wire[],
  level: Level,
): { valid: boolean; message: string; score: number } {
  const placed: ComponentType[] = []
  let batteryPos: { row: number; col: number } | null = null
  const ledPositions: { row: number; col: number }[] = []

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const cell = grid[r][c]
      if (cell) {
        placed.push(cell.type)
        if (cell.type === 'battery') batteryPos = { row: r, col: c }
        if (cell.type === 'led') ledPositions.push({ row: r, col: c })
      }
    }
  }

  if (!batteryPos) return { valid: false, message: 'No battery placed!', score: 0 }
  if (ledPositions.length === 0) return { valid: false, message: 'No LED placed!', score: 0 }

  // Check required components
  const reqCount: Record<string, number> = {}
  for (const c of level.requiredComponents) reqCount[c] = (reqCount[c] || 0) + 1
  const placedCount: Record<string, number> = {}
  for (const c of placed) placedCount[c] = (placedCount[c] || 0) + 1

  for (const [comp, count] of Object.entries(reqCount)) {
    if ((placedCount[comp] || 0) < count) {
      return { valid: false, message: `Need at least ${count} ${COMPONENT_LABELS[comp as ComponentType]}(s)`, score: 0 }
    }
  }

  // Build adjacency graph from wires and adjacent components
  const adj = new Map<string, Set<string>>()
  const key = (r: number, c: number) => `${r},${c}`

  const addEdge = (a: string, b: string) => {
    if (!adj.has(a)) adj.set(a, new Set())
    if (!adj.has(b)) adj.set(b, new Set())
    adj.get(a)!.add(b)
    adj.get(b)!.add(a)
  }

  // Wires form connections
  for (const w of wires) {
    if (grid[w.from.row]?.[w.from.col] && grid[w.to.row]?.[w.to.col]) {
      addEdge(key(w.from.row, w.from.col), key(w.to.row, w.to.col))
    }
  }

  // Adjacent components are connected
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (!grid[r][c]) continue
      const neighbors = [
        [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1],
      ]
      for (const [nr, nc] of neighbors) {
        if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && grid[nr][nc]) {
          addEdge(key(r, c), key(nr, nc))
        }
      }
    }
  }

  // BFS from battery to check connectivity to LEDs
  const visited = new Set<string>()
  const queue = [key(batteryPos.row, batteryPos.col)]
  visited.add(queue[0])

  while (queue.length > 0) {
    const current = queue.shift()!
    for (const neighbor of adj.get(current) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
      }
    }
  }

  const connectedLeds = ledPositions.filter((p) => visited.has(key(p.row, p.col)))
  if (connectedLeds.length === 0) {
    return { valid: false, message: 'LEDs not connected to battery! Add wires or place components adjacent.', score: 0 }
  }

  // Check if circuit forms a loop (battery is reachable from itself via a cycle)
  // Simplified: check that battery has at least 2 connections (potential loop)
  const batteryKey = key(batteryPos.row, batteryPos.col)
  const batteryNeighbors = adj.get(batteryKey)?.size || 0
  if (batteryNeighbors < 2 && placed.length > 2) {
    return { valid: false, message: 'Circuit not complete — create a loop back to the battery!', score: 0 }
  }

  // Score calculation
  const totalCost = placed.reduce((s, c) => s + COMPONENT_COSTS[c], 0)
  const budgetBonus = Math.max(0, level.maxBudget - totalCost) * 5
  const minBonus = placed.length <= level.minComponents ? 20 : Math.max(0, (level.minComponents + 2 - placed.length) * 5)
  const baseScore = 60 + budgetBonus + minBonus

  return {
    valid: true,
    message: `Circuit works! ${connectedLeds.length} LED(s) lit. ${budgetBonus > 0 ? `Budget bonus: +${budgetBonus}` : ''}`,
    score: Math.min(100, baseScore),
  }
}

// ─── Component ────────────────────────────────────────────────

export default function CircuitBuilder({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: CircuitBuilderProps) {
  const levels = getLevels(difficulty)
  const maxScore = getMaxScore(difficulty)
  const mult = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : difficulty === 'hard' ? 2 : 3

  const [levelIdx, setLevelIdx] = useState(0)
  const [grid, setGrid] = useState<CellState[][]>(() =>
    Array.from({ length: levels[0].gridSize }, () => Array(levels[0].gridSize).fill(null)),
  )
  const [wires, setWires] = useState<Wire[]>([])
  const [selectedTool, setSelectedTool] = useState<ComponentType | 'eraser' | null>(null)
  const [wireStart, setWireStart] = useState<{ row: number; col: number } | null>(null)
  const [result, setResult] = useState<{ valid: boolean; message: string; score: number } | null>(null)
  const [scores, setScores] = useState<number[]>([])
  const [gameFinished, setGameFinished] = useState(false)
  const [showCircuitLit, setShowCircuitLit] = useState(false)

  const level = levels[levelIdx]

  const totalSpent = grid.flat().filter(Boolean).reduce((s, c) => s + COMPONENT_COSTS[c!.type], 0)

  const resetLevel = useCallback((lvlIdx: number) => {
    const sz = levels[lvlIdx].gridSize
    setGrid(Array.from({ length: sz }, () => Array(sz).fill(null)))
    setWires([])
    setSelectedTool(null)
    setWireStart(null)
    setResult(null)
    setShowCircuitLit(false)
  }, [levels])

  const handleCellClick = useCallback((row: number, col: number) => {
    if (isPaused || result?.valid || gameFinished) return

    if (selectedTool === 'eraser') {
      setGrid((prev) => {
        const next = prev.map((r) => [...r])
        next[row][col] = null
        return next
      })
      setWires((prev) => prev.filter(
        (w) => !(w.from.row === row && w.from.col === col) && !(w.to.row === row && w.to.col === col),
      ))
      return
    }

    if (selectedTool === 'wire') {
      if (!wireStart) {
        if (grid[row][col]) {
          setWireStart({ row, col })
        }
      } else {
        if (grid[row][col] && (wireStart.row !== row || wireStart.col !== col)) {
          setWires((prev) => [...prev, { from: wireStart, to: { row, col } }])
        }
        setWireStart(null)
      }
      return
    }

    if (selectedTool) {
      const tool = selectedTool
      setGrid((prev) => {
        const next = prev.map((r) => [...r])
        next[row][col] = next[row][col]?.type === tool ? null : { type: tool, rotation: 0 }
        return next
      })
    }
  }, [isPaused, result, gameFinished, selectedTool, wireStart, grid])

  const handleValidate = useCallback(() => {
    if (isPaused) return
    const res = validateCircuit(grid, wires, level)
    setResult(res)
    if (res.valid) {
      setShowCircuitLit(true)
      const levelScore = Math.round(res.score * mult)
      const newScores = [...scores, levelScore]
      setScores(newScores)
      const totalScore = newScores.reduce((a, b) => a + b, 0)
      onScoreUpdate(totalScore, maxScore)
    }
  }, [isPaused, grid, wires, level, mult, scores, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (levelIdx + 1 >= levels.length) {
      setGameFinished(true)
      const totalScore = scores.reduce((a, b) => a + b, 0)
      onGameOver(totalScore, maxScore)
    } else {
      const nextIdx = levelIdx + 1
      setLevelIdx(nextIdx)
      resetLevel(nextIdx)
    }
  }, [levelIdx, levels.length, scores, maxScore, onGameOver, resetLevel])

  const handleClear = useCallback(() => {
    resetLevel(levelIdx)
  }, [levelIdx, resetLevel])

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
      {/* Level header */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          {levels.map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold',
                i < levelIdx && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
                i === levelIdx && !gameFinished && 'border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
                i > levelIdx && 'border-white/10 bg-white/5 text-white/20',
                i === levelIdx && gameFinished && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              )}
            >
              {i < levelIdx ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-white/40">Budget: <span className={cn('font-bold', totalSpent > level.maxBudget ? 'text-red-400' : 'text-cyan-400')}>{totalSpent}/{level.maxBudget}</span></span>
        </div>
      </div>

      {/* Level description */}
      <motion.p
        key={levelIdx}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-sm font-medium text-white/60"
      >
        <Zap className="mr-1 inline h-3.5 w-3.5 text-yellow-400" />
        {level.description}
      </motion.p>

      {!gameFinished && (
        <>
          {/* Palette */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PALETTE.map((comp) => (
              <button
                key={comp}
                onClick={() => setSelectedTool(selectedTool === comp ? null : comp)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all',
                  selectedTool === comp
                    ? 'border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20',
                )}
              >
                <ComponentIcon type={comp} className="h-3.5 w-3.5" />
                {COMPONENT_LABELS[comp]}
                <span className="text-white/30">({COMPONENT_COSTS[comp]})</span>
              </button>
            ))}
            <button
              onClick={() => setSelectedTool(selectedTool === 'eraser' ? null : 'eraser')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all',
                selectedTool === 'eraser'
                  ? 'border-red-500/50 bg-red-500/15 text-red-300'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20',
              )}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eraser
            </button>
          </div>

          {wireStart && (
            <p className="text-xs text-cyan-400 animate-pulse">Click another component to connect wire…</p>
          )}

          {/* SVG Grid Board */}
          <div className="relative rounded-xl border border-white/10 bg-slate-900/50 p-2">
            <svg
              width={level.gridSize * 60 + 20}
              height={level.gridSize * 60 + 20}
              viewBox={`0 0 ${level.gridSize * 60 + 20} ${level.gridSize * 60 + 20}`}
              className="block"
            >
              {/* Grid dots */}
              {Array.from({ length: level.gridSize }, (_, r) =>
                Array.from({ length: level.gridSize }, (_, c) => (
                  <circle
                    key={`dot-${r}-${c}`}
                    cx={c * 60 + 40}
                    cy={r * 60 + 40}
                    r={2}
                    className="fill-white/10"
                  />
                )),
              )}

              {/* Wires */}
              {wires.map((w, i) => (
                <line
                  key={`wire-${i}`}
                  x1={w.from.col * 60 + 40}
                  y1={w.from.row * 60 + 40}
                  x2={w.to.col * 60 + 40}
                  y2={w.to.row * 60 + 40}
                  stroke={showCircuitLit ? '#22d3ee' : '#6366f1'}
                  strokeWidth={showCircuitLit ? 3 : 2}
                  strokeLinecap="round"
                  opacity={showCircuitLit ? 1 : 0.6}
                >
                  {showCircuitLit && (
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" />
                  )}
                </line>
              ))}

              {/* Cell hitboxes + components */}
              {Array.from({ length: level.gridSize }, (_, r) =>
                Array.from({ length: level.gridSize }, (_, c) => {
                  const cell = grid[r][c]
                  const cx = c * 60 + 40
                  const cy = r * 60 + 40
                  const isWireStartCell = wireStart?.row === r && wireStart?.col === c
                  return (
                    <g key={`cell-${r}-${c}`} onClick={() => handleCellClick(r, c)} className="cursor-pointer">
                      <rect
                        x={cx - 25}
                        y={cy - 25}
                        width={50}
                        height={50}
                        rx={8}
                        className={cn(
                          'transition-all',
                          cell ? 'fill-violet-500/10 stroke-violet-500/30' : 'fill-transparent stroke-transparent hover:fill-white/5 hover:stroke-white/10',
                          isWireStartCell && 'fill-cyan-500/20 stroke-cyan-500/50',
                        )}
                        strokeWidth={1}
                      />
                      {cell && (
                        <>
                          {cell.type === 'battery' && (
                            <>
                              <rect x={cx - 12} y={cy - 10} width={24} height={20} rx={3} className={showCircuitLit ? 'fill-yellow-500/40 stroke-yellow-400' : 'fill-yellow-500/20 stroke-yellow-500/50'} strokeWidth={1.5} />
                              <text x={cx} y={cy + 4} textAnchor="middle" className="fill-yellow-300 text-[9px] font-bold">BAT</text>
                            </>
                          )}
                          {cell.type === 'led' && (
                            <>
                              <circle cx={cx} cy={cy} r={12} className={showCircuitLit ? 'fill-cyan-400/50 stroke-cyan-300' : 'fill-cyan-500/15 stroke-cyan-500/40'} strokeWidth={1.5} />
                              {showCircuitLit && <circle cx={cx} cy={cy} r={16} className="fill-transparent stroke-cyan-400/30" strokeWidth={2}>
                                <animate attributeName="r" values="14;18;14" dur="1.5s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite" />
                              </circle>}
                              <text x={cx} y={cy + 3} textAnchor="middle" className="fill-cyan-200 text-[8px] font-bold">LED</text>
                            </>
                          )}
                          {cell.type === 'wire' && (
                            <line x1={cx - 14} y1={cy} x2={cx + 14} y2={cy} stroke={showCircuitLit ? '#22d3ee' : '#94a3b8'} strokeWidth={2} strokeLinecap="round" />
                          )}
                          {cell.type === 'switch' && (
                            <>
                              <rect x={cx - 14} y={cy - 8} width={28} height={16} rx={4} className="fill-green-500/15 stroke-green-500/40" strokeWidth={1.5} />
                              <text x={cx} y={cy + 4} textAnchor="middle" className="fill-green-300 text-[7px] font-bold">SW</text>
                            </>
                          )}
                          {cell.type === 'resistor' && (
                            <>
                              <rect x={cx - 14} y={cy - 6} width={28} height={12} rx={2} className="fill-orange-500/15 stroke-orange-500/40" strokeWidth={1.5} />
                              <text x={cx} y={cy + 3} textAnchor="middle" className="fill-orange-300 text-[7px] font-bold">RES</text>
                            </>
                          )}
                        </>
                      )}
                    </g>
                  )
                }),
              )}
            </svg>
          </div>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'w-full rounded-xl border px-4 py-3 text-center text-sm',
                  result.valid
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-red-500/30 bg-red-500/10 text-red-300',
                )}
              >
                {result.valid ? <CheckCircle2 className="mr-1 inline h-4 w-4" /> : <Zap className="mr-1 inline h-4 w-4" />}
                {result.message}
                {result.valid && <span className="ml-2 font-bold text-cyan-400">+{Math.round(result.score * mult)} pts</span>}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/50 transition-all hover:border-white/20 hover:text-white/70"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>

            {!result?.valid ? (
              <button
                onClick={handleValidate}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-6 py-2 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Zap className="h-3.5 w-3.5" />
                Test Circuit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-6 py-2 text-xs font-semibold text-violet-300 transition-all hover:bg-violet-500/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                {levelIdx + 1 >= levels.length ? 'Finish' : 'Next Level →'}
              </button>
            )}
          </div>
        </>
      )}

      {/* Final summary */}
      {gameFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h3 className="text-lg font-bold text-white">All Circuits Complete!</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/40">Levels</p>
              <p className="text-2xl font-bold text-emerald-400">{scores.length}/{levels.length}</p>
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
