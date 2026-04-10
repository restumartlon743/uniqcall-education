'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Palette,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Eye,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface HSL {
  h: number
  s: number
  l: number
}

interface Theme {
  name: string
  description: string
  idealPalette: HSL[]
  hueRange: [number, number]
}

interface RoundResult {
  theme: Theme
  playerPalette: HSL[]
  score: number
}

interface ColorHarmonizerProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const THEMES: Theme[] = [
  {
    name: 'Warm Sunset',
    description: 'Golden oranges, warm reds, and soft pinks',
    idealPalette: [
      { h: 20, s: 85, l: 55 }, { h: 35, s: 90, l: 60 }, { h: 350, s: 75, l: 55 },
      { h: 45, s: 80, l: 65 }, { h: 10, s: 70, l: 50 },
    ],
    hueRange: [0, 60],
  },
  {
    name: 'Ocean Calm',
    description: 'Deep blues, teals, and soft aquas',
    idealPalette: [
      { h: 200, s: 70, l: 45 }, { h: 180, s: 60, l: 50 }, { h: 210, s: 80, l: 55 },
      { h: 190, s: 65, l: 60 }, { h: 220, s: 50, l: 40 },
    ],
    hueRange: [170, 240],
  },
  {
    name: 'Forest Energy',
    description: 'Vibrant greens, earthy tones, and leaf accents',
    idealPalette: [
      { h: 120, s: 60, l: 40 }, { h: 90, s: 50, l: 50 }, { h: 150, s: 55, l: 45 },
      { h: 80, s: 45, l: 55 }, { h: 140, s: 65, l: 35 },
    ],
    hueRange: [70, 160],
  },
  {
    name: 'Royal Night',
    description: 'Deep purples, midnight blues, and gold accents',
    idealPalette: [
      { h: 270, s: 70, l: 40 }, { h: 250, s: 60, l: 35 }, { h: 280, s: 65, l: 50 },
      { h: 45, s: 80, l: 55 }, { h: 260, s: 55, l: 45 },
    ],
    hueRange: [240, 300],
  },
  {
    name: 'Cherry Blossom',
    description: 'Soft pinks, light magentas, and white tones',
    idealPalette: [
      { h: 330, s: 60, l: 70 }, { h: 340, s: 55, l: 75 }, { h: 320, s: 50, l: 65 },
      { h: 350, s: 45, l: 80 }, { h: 310, s: 40, l: 72 },
    ],
    hueRange: [300, 360],
  },
  {
    name: 'Desert Sand',
    description: 'Warm beiges, terracotta, and dusty rose',
    idealPalette: [
      { h: 30, s: 50, l: 60 }, { h: 15, s: 60, l: 55 }, { h: 40, s: 45, l: 65 },
      { h: 5, s: 40, l: 50 }, { h: 25, s: 55, l: 58 },
    ],
    hueRange: [0, 50],
  },
  {
    name: 'Neon City',
    description: 'Electric pinks, cyans, and vivid purples',
    idealPalette: [
      { h: 300, s: 90, l: 55 }, { h: 180, s: 95, l: 50 }, { h: 270, s: 85, l: 60 },
      { h: 330, s: 90, l: 55 }, { h: 200, s: 80, l: 55 },
    ],
    hueRange: [160, 340],
  },
]

const TOTAL_ROUNDS = 5

// ─── Helpers ──────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function hslToString(c: HSL): string {
  return `hsl(${c.h}, ${c.s}%, ${c.l}%)`
}

function getColorCount(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 3
    case 'medium': return 4
    case 'hard': return 5
    case 'extreme': return 5
  }
}

function hueDist(a: number, b: number): number {
  const d = Math.abs(a - b)
  return Math.min(d, 360 - d)
}

function colorDist(a: HSL, b: HSL): number {
  const hd = hueDist(a.h, b.h) / 180 // 0-1
  const sd = Math.abs(a.s - b.s) / 100
  const ld = Math.abs(a.l - b.l) / 100
  return Math.sqrt(hd * hd + sd * sd + ld * ld)
}

function scorePalette(player: HSL[], ideal: HSL[]): number {
  if (player.length === 0) return 0
  const count = Math.min(player.length, ideal.length)

  // Best-match scoring: for each ideal color, find closest player color
  let totalDist = 0
  const used = new Set<number>()
  for (let i = 0; i < count; i++) {
    let bestDist = Infinity
    let bestJ = 0
    for (let j = 0; j < player.length; j++) {
      if (used.has(j)) continue
      const d = colorDist(ideal[i], player[j])
      if (d < bestDist) {
        bestDist = d
        bestJ = j
      }
    }
    used.add(bestJ)
    totalDist += bestDist
  }

  const avgDist = totalDist / count
  // Max distance is ~1.73, score inversely
  const score = Math.max(0, 100 - Math.round(avgDist * 100))
  return score
}

// Generate palette swatches for picking
function generateSwatchGrid(): HSL[] {
  const swatches: HSL[] = []
  for (let h = 0; h < 360; h += 30) {
    for (const s of [40, 70, 90]) {
      for (const l of [35, 50, 65, 80]) {
        swatches.push({ h, s, l })
      }
    }
  }
  return swatches
}

// ─── Component ────────────────────────────────────────────────

export default function ColorHarmonizer({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: ColorHarmonizerProps) {
  const themes = useMemo(() => shuffle(THEMES).slice(0, TOTAL_ROUNDS), [])
  const swatches = useMemo(() => generateSwatchGrid(), [])
  const colorCount = getColorCount(difficulty)
  const maxScore = TOTAL_ROUNDS * 100

  const [currentRound, setCurrentRound] = useState(0)
  const [playerPalette, setPlayerPalette] = useState<HSL[]>([])
  const [results, setResults] = useState<RoundResult[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const theme = themes[currentRound]

  const handleSelectColor = useCallback(
    (color: HSL) => {
      if (submitted || isPaused) return
      setPlayerPalette((prev) => {
        // If already selected, remove
        const idx = prev.findIndex((c) => c.h === color.h && c.s === color.s && c.l === color.l)
        if (idx >= 0) return prev.filter((_, i) => i !== idx)
        if (prev.length >= colorCount) return prev
        return [...prev, color]
      })
    },
    [submitted, isPaused, colorCount],
  )

  const handleSubmit = useCallback(() => {
    if (submitted || playerPalette.length === 0) return
    setSubmitted(true)

    const ideal = theme.idealPalette.slice(0, colorCount)
    const score = scorePalette(playerPalette, ideal)
    const result: RoundResult = { theme, playerPalette, score }
    const newResults = [...results, result]
    setResults(newResults)

    const totalScore = newResults.reduce((s, r) => s + r.score, 0)
    onScoreUpdate(totalScore, maxScore)
  }, [submitted, playerPalette, theme, colorCount, results, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (currentRound + 1 >= TOTAL_ROUNDS) {
      setGameFinished(true)
      const totalScore = [...results].reduce((s, r) => s + r.score, 0)
      onGameOver(totalScore, maxScore)
    } else {
      setCurrentRound((r) => r + 1)
      setPlayerPalette([])
      setSubmitted(false)
      setShowPreview(false)
    }
  }, [currentRound, results, maxScore, onGameOver])

  const totalScore = results.reduce((s, r) => s + r.score, 0)
  const lastResult = submitted && results.length > 0 ? results[results.length - 1] : null

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
      {/* Round indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < currentRound && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === currentRound && !gameFinished && 'border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
              i > currentRound && 'border-white/10 bg-white/5 text-white/20',
              i === currentRound && gameFinished && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
            )}
          >
            {i < results.length ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </div>
        ))}
      </div>

      {!gameFinished && (
        <>
          {/* Theme Card */}
          <motion.div
            key={currentRound}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full flex-col items-center gap-2 rounded-xl border border-pink-500/20 bg-pink-500/5 p-5 text-center"
          >
            <Palette className="h-6 w-6 text-pink-400" />
            <h3 className="text-lg font-bold text-white">{theme.name}</h3>
            <p className="text-xs text-white/50">{theme.description}</p>
            <p className="text-[10px] uppercase tracking-wider text-white/30">
              Pick {colorCount} colors that match this mood
            </p>
          </motion.div>

          {/* Player Palette Preview */}
          <div className="flex items-center gap-2">
            <p className="text-xs text-white/40">Your palette:</p>
            <div className="flex gap-1.5">
              {Array.from({ length: colorCount }, (_, i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-lg border border-white/10"
                  style={{
                    backgroundColor: playerPalette[i] ? hslToString(playerPalette[i]) : 'rgba(255,255,255,0.05)',
                  }}
                />
              ))}
            </div>
            {playerPalette.length > 0 && !submitted && (
              <button
                onClick={() => setPlayerPalette([])}
                className="ml-2 text-xs text-white/30 hover:text-white/60"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Card Preview Toggle */}
          {playerPalette.length >= 2 && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60"
            >
              <Eye className="h-3.5 w-3.5" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          )}

          {/* Card Preview */}
          <AnimatePresence>
            {showPreview && playerPalette.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full overflow-hidden"
              >
                <div
                  className="mx-auto w-64 rounded-xl border p-4"
                  style={{
                    backgroundColor: hslToString(playerPalette[0]),
                    borderColor: playerPalette[1] ? hslToString(playerPalette[1]) : 'transparent',
                  }}
                >
                  <div
                    className="mb-2 h-3 w-24 rounded"
                    style={{ backgroundColor: playerPalette[1] ? hslToString(playerPalette[1]) : '#fff' }}
                  />
                  <div
                    className="mb-1 h-2 w-full rounded"
                    style={{ backgroundColor: playerPalette[2] ? hslToString(playerPalette[2]) : 'rgba(255,255,255,0.3)' }}
                  />
                  <div
                    className="h-2 w-3/4 rounded"
                    style={{ backgroundColor: playerPalette[2] ? hslToString(playerPalette[2]) : 'rgba(255,255,255,0.3)' }}
                  />
                  {playerPalette[3] && (
                    <div
                      className="mt-3 h-6 w-20 rounded-md"
                      style={{ backgroundColor: hslToString(playerPalette[3]) }}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swatch Grid */}
          <div className="max-h-52 w-full overflow-y-auto rounded-xl border border-white/10 bg-white/3 p-3">
            <div className="grid grid-cols-12 gap-1.5">
              {swatches.map((c, i) => {
                const isSelected = playerPalette.some(
                  (p) => p.h === c.h && p.s === c.s && p.l === c.l,
                )
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectColor(c)}
                    disabled={submitted}
                    className={cn(
                      'h-7 w-full rounded transition-all',
                      isSelected
                        ? 'ring-2 ring-white shadow-[0_0_8px_rgba(255,255,255,0.4)] scale-110 z-10'
                        : 'hover:scale-110 hover:ring-1 hover:ring-white/30',
                    )}
                    style={{ backgroundColor: hslToString(c) }}
                    title={`H:${c.h} S:${c.s} L:${c.l}`}
                  />
                )
              })}
            </div>
          </div>

          {/* Submit / Result */}
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={playerPalette.length === 0}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold transition-all',
                playerPalette.length > 0
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                  : 'cursor-not-allowed border-white/10 bg-white/5 text-white/25',
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              Submit Palette
            </button>
          ) : lastResult ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full flex-col items-center gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-xs text-white/40">Ideal palette</p>
                  <div className="flex gap-1 mt-1">
                    {theme.idealPalette.slice(0, colorCount).map((c, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-lg border border-white/20"
                        style={{ backgroundColor: hslToString(c) }}
                      />
                    ))}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-white/20 mt-4" />
                <div className="text-center">
                  <p className="text-xs text-white/40">Your palette</p>
                  <div className="flex gap-1 mt-1">
                    {playerPalette.map((c, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-lg border border-white/20"
                        style={{ backgroundColor: hslToString(c) }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/60">
                Harmony Score: <span className={cn(
                  'font-bold',
                  lastResult.score >= 70 ? 'text-emerald-400' : lastResult.score >= 40 ? 'text-amber-400' : 'text-red-400',
                )}>{lastResult.score}</span>/100
              </p>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-6 py-2.5 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-500/20"
              >
                {currentRound + 1 >= TOTAL_ROUNDS ? 'Finish' : 'Next Round'}
                <ArrowRight className="h-4 w-4" />
              </button>
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
                <div className="flex items-center gap-2">
                  <span className="text-white/60">R{i + 1}: {r.theme.name}</span>
                  <div className="flex gap-0.5">
                    {r.playerPalette.map((c, j) => (
                      <div
                        key={j}
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: hslToString(c) }}
                      />
                    ))}
                  </div>
                </div>
                <span className={cn(
                  'font-bold',
                  r.score >= 70 ? 'text-emerald-400' : r.score >= 40 ? 'text-amber-400' : 'text-red-400',
                )}>{r.score}/100</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
