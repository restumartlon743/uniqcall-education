'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  CheckCircle2, XCircle, Play, RotateCcw, Trash2, DollarSign, Weight,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface Node {
  id: number
  x: number
  y: number
  anchored: boolean
}

type MaterialType = 'wood' | 'steel'

interface Beam {
  from: number
  to: number
  material: MaterialType
  stress: number
}

interface Level {
  leftAnchorY: number
  rightAnchorY: number
  gapWidth: number
  valleyDepth: number
  budget: number
  weightForce: number
  description: string
}

interface BridgeConstructorProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Constants ────────────────────────────────────────────────

const CANVAS_W = 700
const CANVAS_H = 400
const MATERIAL_COSTS: Record<MaterialType, number> = { wood: 10, steel: 25 }
const MATERIAL_STRENGTH: Record<MaterialType, number> = { wood: 50, steel: 120 }
const MATERIAL_COLORS: Record<MaterialType, { normal: string; stressed: string; broken: string }> = {
  wood: { normal: '#a3764f', stressed: '#f59e0b', broken: '#ef4444' },
  steel: { normal: '#94a3b8', stressed: '#f59e0b', broken: '#ef4444' },
}

function getLevels(difficulty: GameDifficulty): Level[] {
  switch (difficulty) {
    case 'easy':
      return [
        { leftAnchorY: 200, rightAnchorY: 200, gapWidth: 200, valleyDepth: 80, budget: 200, weightForce: 40, description: 'Short gap — generous budget' },
        { leftAnchorY: 200, rightAnchorY: 200, gapWidth: 260, valleyDepth: 100, budget: 250, weightForce: 45, description: 'Wider gap — plan your supports' },
        { leftAnchorY: 200, rightAnchorY: 220, gapWidth: 240, valleyDepth: 90, budget: 240, weightForce: 40, description: 'Uneven cliffs' },
      ]
    case 'medium':
      return [
        { leftAnchorY: 180, rightAnchorY: 180, gapWidth: 320, valleyDepth: 120, budget: 250, weightForce: 60, description: 'Wider span — budget carefully' },
        { leftAnchorY: 180, rightAnchorY: 210, gapWidth: 340, valleyDepth: 130, budget: 260, weightForce: 65, description: 'Steep descent to the right' },
        { leftAnchorY: 190, rightAnchorY: 190, gapWidth: 350, valleyDepth: 120, budget: 240, weightForce: 70, description: 'Heavy load — reinforce!' },
      ]
    case 'hard':
      return [
        { leftAnchorY: 160, rightAnchorY: 160, gapWidth: 420, valleyDepth: 160, budget: 280, weightForce: 80, description: 'Deep valley — need triangles' },
        { leftAnchorY: 150, rightAnchorY: 200, gapWidth: 400, valleyDepth: 170, budget: 260, weightForce: 85, description: 'Steep climb with heavy load' },
        { leftAnchorY: 170, rightAnchorY: 170, gapWidth: 440, valleyDepth: 150, budget: 260, weightForce: 90, description: 'Maximum efficiency required' },
      ]
    case 'extreme':
      return [
        { leftAnchorY: 140, rightAnchorY: 140, gapWidth: 500, valleyDepth: 200, budget: 300, weightForce: 100, description: 'Massive chasm' },
        { leftAnchorY: 130, rightAnchorY: 190, gapWidth: 480, valleyDepth: 210, budget: 280, weightForce: 110, description: 'Near impossible budget' },
        { leftAnchorY: 150, rightAnchorY: 150, gapWidth: 500, valleyDepth: 220, budget: 280, weightForce: 120, description: 'Master engineer challenge' },
      ]
  }
}

function getMaxScore(difficulty: GameDifficulty): number {
  const mult = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : difficulty === 'hard' ? 2 : 3
  return Math.round(getLevels(difficulty).length * 100 * mult)
}

function dist(a: Node, b: Node): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

// ─── Component ────────────────────────────────────────────────

export default function BridgeConstructor({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: BridgeConstructorProps) {
  const levels = getLevels(difficulty)
  const maxScore = getMaxScore(difficulty)
  const mult = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : difficulty === 'hard' ? 2 : 3

  const [levelIdx, setLevelIdx] = useState(0)
  const level = levels[levelIdx]

  // Compute layout positions
  const gapLeftX = (CANVAS_W - level.gapWidth) / 2
  const gapRightX = (CANVAS_W + level.gapWidth) / 2

  // Initial anchors
  const initAnchors = useCallback((): Node[] => [
    { id: 0, x: gapLeftX, y: level.leftAnchorY, anchored: true },
    { id: 1, x: gapRightX, y: level.rightAnchorY, anchored: true },
  ], [gapLeftX, gapRightX, level.leftAnchorY, level.rightAnchorY])

  const [nodes, setNodes] = useState<Node[]>(() => initAnchors())
  const [beams, setBeams] = useState<Beam[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>('wood')
  const [connectFrom, setConnectFrom] = useState<number | null>(null)
  const [mode, setMode] = useState<'node' | 'beam' | 'erase'>('node')
  const [testing, setTesting] = useState(false)
  const [testProgress, setTestProgress] = useState(0)
  const [testResult, setTestResult] = useState<{ passed: boolean; message: string; score: number } | null>(null)
  const [scores, setScores] = useState<number[]>([])
  const [gameFinished, setGameFinished] = useState(false)

  const animRef = useRef<number>(0)

  const totalCost = beams.reduce((s, b) => s + MATERIAL_COSTS[b.material], 0)

  const resetLevel = useCallback((idx: number) => {
    const lv = levels[idx]
    const glx = (CANVAS_W - lv.gapWidth) / 2
    const grx = (CANVAS_W + lv.gapWidth) / 2
    setNodes([
      { id: 0, x: glx, y: lv.leftAnchorY, anchored: true },
      { id: 1, x: grx, y: lv.rightAnchorY, anchored: true },
    ])
    setBeams([])
    setConnectFrom(null)
    setTesting(false)
    setTestProgress(0)
    setTestResult(null)
  }, [levels])

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (isPaused || testing || testResult || gameFinished) return
    if (mode !== 'node') return

    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * CANVAS_W
    const y = ((e.clientY - rect.top) / rect.height) * CANVAS_H

    // Only allow placing nodes in the gap area
    if (y < 80 || y > CANVAS_H - 40) return
    if (x < gapLeftX - 20 || x > gapRightX + 20) return

    setNodes((prev) => [...prev, { id: prev.length, x, y, anchored: false }])
  }, [isPaused, testing, testResult, gameFinished, mode, gapLeftX, gapRightX])

  const handleNodeClick = useCallback((nodeId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (isPaused || testing || testResult || gameFinished) return

    if (mode === 'erase' && !nodes.find((n) => n.id === nodeId)?.anchored) {
      setNodes((prev) => prev.filter((n) => n.id !== nodeId))
      setBeams((prev) => prev.filter((b) => b.from !== nodeId && b.to !== nodeId))
      return
    }

    if (mode !== 'beam') return

    if (connectFrom === null) {
      setConnectFrom(nodeId)
    } else {
      if (connectFrom !== nodeId) {
        // Check if beam already exists
        const exists = beams.some(
          (b) => (b.from === connectFrom && b.to === nodeId) || (b.from === nodeId && b.to === connectFrom),
        )
        if (!exists) {
          setBeams((prev) => [...prev, { from: connectFrom, to: nodeId, material: selectedMaterial, stress: 0 }])
        }
      }
      setConnectFrom(null)
    }
  }, [isPaused, testing, testResult, gameFinished, mode, connectFrom, beams, selectedMaterial, nodes])

  const runTest = useCallback(() => {
    if (isPaused || beams.length === 0) return

    setTesting(true)
    setTestProgress(0)
    setTestResult(null)

    // Reset stress
    setBeams((prev) => prev.map((b) => ({ ...b, stress: 0 })))

    // Simulate weight crossing
    let step = 0
    const totalSteps = 60
    const animate = () => {
      step++
      const progress = step / totalSteps
      setTestProgress(progress)

      // Weight position (interpolation from left to right anchor)
      const leftNode = nodes[0]
      const rightNode = nodes[1]
      const wx = leftNode.x + (rightNode.x - leftNode.x) * progress
      const wy = Math.min(leftNode.y, rightNode.y) + Math.abs(Math.sin(progress * Math.PI)) * 15

      // Calculate stress on each beam based on proximity to weight
      setBeams((prev) => prev.map((b) => {
        const nFrom = nodes.find((n) => n.id === b.from)!
        const nTo = nodes.find((n) => n.id === b.to)!
        const mx = (nFrom.x + nTo.x) / 2
        const my = (nFrom.y + nTo.y) / 2
        const d = Math.sqrt((mx - wx) ** 2 + (my - wy) ** 2)
        const beamLen = dist(nFrom, nTo)
        const loadFactor = level.weightForce * (1 / Math.max(d / 50, 0.5)) * (beamLen / 100)
        const strength = MATERIAL_STRENGTH[b.material]
        const stress = Math.min(1, loadFactor / strength)
        return { ...b, stress }
      }))

      if (step < totalSteps) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        // Evaluate final
        setBeams((prevBeams) => {
          const broken = prevBeams.filter((b) => b.stress > 0.9)
          const maxStress = Math.max(...prevBeams.map((b) => b.stress))

          const passed = broken.length === 0
          const budgetRatio = totalCost / level.budget
          const budgetBonus = budgetRatio < 1 ? Math.round((1 - budgetRatio) * 40) : 0
          const stressBonus = passed ? Math.round((1 - maxStress) * 30) : 0
          const baseScore = passed ? 40 + budgetBonus + stressBonus : Math.round(20 * (1 - broken.length / prevBeams.length))

          const finalScore = Math.min(100, Math.max(0, baseScore))

          setTestResult({
            passed,
            message: passed
              ? `Bridge holds! Max stress: ${Math.round(maxStress * 100)}%. ${budgetBonus > 0 ? `Budget bonus: +${budgetBonus}` : ''}`
              : `Bridge collapsed! ${broken.length} beam(s) failed.`,
            score: finalScore,
          })
          setTesting(false)

          if (passed) {
            const lvlScore = Math.round(finalScore * mult)
            setScores((prev) => {
              const ns = [...prev, lvlScore]
              const total = ns.reduce((a, b) => a + b, 0)
              onScoreUpdate(total, maxScore)
              return ns
            })
          }

          return prevBeams
        })
      }
    }

    animRef.current = requestAnimationFrame(animate)
  }, [isPaused, beams, nodes, level, totalCost, mult, maxScore, onScoreUpdate])

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current)
  }, [])

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
      {/* Level indicator */}
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
              )}
            >
              {i < levelIdx ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-white/40">
            <DollarSign className="mr-0.5 inline h-3 w-3" />
            Budget: <span className={cn('font-bold', totalCost > level.budget ? 'text-red-400' : 'text-cyan-400')}>{totalCost}/{level.budget}</span>
          </span>
          <span className="text-white/40">
            <Weight className="mr-0.5 inline h-3 w-3" />
            Weight: <span className="font-bold text-orange-400">{level.weightForce}</span>
          </span>
        </div>
      </div>

      <motion.p
        key={levelIdx}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-sm text-white/60"
      >
        {level.description}
      </motion.p>

      {!gameFinished && (
        <>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => { setMode('node'); setConnectFrom(null) }}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all',
                mode === 'node'
                  ? 'border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20',
              )}
            >
              + Node
            </button>
            <button
              onClick={() => { setMode('beam'); setConnectFrom(null) }}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all',
                mode === 'beam'
                  ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20',
              )}
            >
              ⟶ Beam
            </button>
            <button
              onClick={() => { setMode('erase'); setConnectFrom(null) }}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all',
                mode === 'erase'
                  ? 'border-red-500/50 bg-red-500/15 text-red-300'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20',
              )}
            >
              <Trash2 className="inline h-3 w-3" /> Erase
            </button>
            <span className="mx-2 h-4 w-px bg-white/10" />
            {(['wood', 'steel'] as MaterialType[]).map((mat) => (
              <button
                key={mat}
                onClick={() => setSelectedMaterial(mat)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize transition-all',
                  selectedMaterial === mat
                    ? mat === 'wood'
                      ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
                      : 'border-slate-400/50 bg-slate-400/15 text-slate-300'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20',
                )}
              >
                {mat} (${MATERIAL_COSTS[mat]})
              </button>
            ))}
          </div>

          {connectFrom !== null && (
            <p className="text-xs text-cyan-400 animate-pulse">Click another node to add beam…</p>
          )}

          {/* SVG Canvas */}
          <div className="relative rounded-xl border border-white/10 bg-slate-900/50 p-1">
            <svg
              width="100%"
              viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
              onClick={handleSvgClick}
              className="block max-h-[380px] cursor-crosshair"
            >
              {/* Sky gradient */}
              <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="valley" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
              <rect width={CANVAS_W} height={CANVAS_H} fill="url(#sky)" />

              {/* Valley/water */}
              <rect
                x={gapLeftX}
                y={Math.max(level.leftAnchorY, level.rightAnchorY) + 30}
                width={level.gapWidth}
                height={CANVAS_H}
                fill="url(#valley)"
                opacity={0.5}
              />

              {/* Left cliff */}
              <rect x={0} y={level.leftAnchorY} width={gapLeftX} height={CANVAS_H - level.leftAnchorY} fill="#334155" stroke="#475569" strokeWidth={1} />
              <line x1={0} y1={level.leftAnchorY} x2={gapLeftX} y2={level.leftAnchorY} stroke="#64748b" strokeWidth={2} />

              {/* Right cliff */}
              <rect x={gapRightX} y={level.rightAnchorY} width={CANVAS_W - gapRightX} height={CANVAS_H - level.rightAnchorY} fill="#334155" stroke="#475569" strokeWidth={1} />
              <line x1={gapRightX} y1={level.rightAnchorY} x2={CANVAS_W} y2={level.rightAnchorY} stroke="#64748b" strokeWidth={2} />

              {/* Beams */}
              {beams.map((beam, i) => {
                const nFrom = nodes.find((n) => n.id === beam.from)!
                const nTo = nodes.find((n) => n.id === beam.to)!
                const color = beam.stress > 0.9
                  ? MATERIAL_COLORS[beam.material].broken
                  : beam.stress > 0.5
                    ? MATERIAL_COLORS[beam.material].stressed
                    : MATERIAL_COLORS[beam.material].normal
                return (
                  <line
                    key={`beam-${i}`}
                    x1={nFrom.x}
                    y1={nFrom.y}
                    x2={nTo.x}
                    y2={nTo.y}
                    stroke={color}
                    strokeWidth={beam.material === 'steel' ? 4 : 3}
                    strokeLinecap="round"
                    opacity={beam.stress > 0.9 ? 0.5 : 1}
                  />
                )
              })}

              {/* Nodes */}
              {nodes.map((node) => (
                <g key={`node-${node.id}`} onClick={(e) => handleNodeClick(node.id, e)} className="cursor-pointer">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.anchored ? 8 : 6}
                    className={cn(
                      node.anchored ? 'fill-emerald-500 stroke-emerald-300' : 'fill-violet-500 stroke-violet-300',
                      connectFrom === node.id && 'fill-cyan-400 stroke-cyan-200',
                    )}
                    strokeWidth={2}
                  />
                  {node.anchored && (
                    <text x={node.x} y={node.y - 14} textAnchor="middle" className="fill-white/40 text-[9px]">
                      Anchor
                    </text>
                  )}
                </g>
              ))}

              {/* Weight indicator during test */}
              {testing && (
                <g>
                  <circle
                    cx={nodes[0].x + (nodes[1].x - nodes[0].x) * testProgress}
                    cy={Math.min(nodes[0].y, nodes[1].y) - 15 + Math.abs(Math.sin(testProgress * Math.PI)) * 10}
                    r={10}
                    className="fill-orange-500 stroke-orange-300"
                    strokeWidth={2}
                  />
                  <text
                    x={nodes[0].x + (nodes[1].x - nodes[0].x) * testProgress}
                    y={Math.min(nodes[0].y, nodes[1].y) - 15 + Math.abs(Math.sin(testProgress * Math.PI)) * 10 + 4}
                    textAnchor="middle"
                    className="fill-white text-[8px] font-bold"
                  >
                    W
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Result */}
          <AnimatePresence>
            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  'w-full rounded-xl border px-4 py-3 text-center text-sm',
                  testResult.passed
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-red-500/30 bg-red-500/10 text-red-300',
                )}
              >
                {testResult.passed ? <CheckCircle2 className="mr-1 inline h-4 w-4" /> : <XCircle className="mr-1 inline h-4 w-4" />}
                {testResult.message}
                {testResult.passed && <span className="ml-2 font-bold text-cyan-400">+{Math.round(testResult.score * mult)} pts</span>}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              disabled={testing}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/50 transition-all hover:border-white/20 hover:text-white/70 disabled:opacity-30"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>

            {!testResult?.passed ? (
              <button
                onClick={runTest}
                disabled={testing || beams.length === 0}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-6 py-2 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-30"
              >
                <Play className="h-3.5 w-3.5" />
                {testing ? 'Testing…' : 'Test Bridge'}
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
          <h3 className="text-lg font-bold text-white">Bridge Engineering Complete!</h3>
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
