'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Map,
  ArrowRight,
  Check,
  X,
  CheckCircle2,
  Star,
  Compass,
  Gem,
  Mountain,
  TreePine,
  Waves,
  Home,
  Flag,
  MapPin,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type CellType = 'empty' | 'mountain' | 'forest' | 'water' | 'village' | 'start' | 'treasure'

interface Clue {
  text: string
  type: 'direct' | 'relative' | 'triangulation'
}

interface TreasureHunt {
  id: string
  name: string
  grid: CellType[][]
  start: [number, number]
  treasure: [number, number]
  landmarks: { name: string; pos: [number, number]; type: CellType }[]
  clues: { easy: Clue[]; medium: Clue[]; hard: Clue[] }
}

interface GeoTrackerProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Helpers ──────────────────────────────────────────────────

function createEmptyGrid(): CellType[][] {
  return Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 'empty' as CellType))
}

function placeOnGrid(grid: CellType[][], r: number, c: number, type: CellType): CellType[][] {
  const g = grid.map((row) => [...row])
  g[r][c] = type
  return g
}

// ─── Data ─────────────────────────────────────────────────────

const CELL_RENDER: Record<CellType, { icon: LucideIcon | null; bg: string }> = {
  empty: { icon: null, bg: 'bg-[#0d1330]' },
  mountain: { icon: Mountain, bg: 'bg-stone-900/60' },
  forest: { icon: TreePine, bg: 'bg-emerald-950/40' },
  water: { icon: Waves, bg: 'bg-blue-950/40' },
  village: { icon: Home, bg: 'bg-amber-950/40' },
  start: { icon: Flag, bg: 'bg-cyan-900/30' },
  treasure: { icon: null, bg: 'bg-[#0d1330]' },
}

function buildHunt(
  id: string,
  name: string,
  landmarks: { name: string; pos: [number, number]; type: CellType }[],
  start: [number, number],
  treasure: [number, number],
  clues: { easy: Clue[]; medium: Clue[]; hard: Clue[] },
): TreasureHunt {
  let grid = createEmptyGrid()
  grid = placeOnGrid(grid, start[0], start[1], 'start')
  for (const lm of landmarks) {
    grid = placeOnGrid(grid, lm.pos[0], lm.pos[1], lm.type)
  }
  // treasure stays hidden
  return { id, name, grid, start, treasure, landmarks, clues }
}

const ALL_HUNTS: TreasureHunt[] = [
  buildHunt('h1', 'Mountain Gold',
    [
      { name: 'Eagle Peak', pos: [2, 3], type: 'mountain' },
      { name: 'Pine Valley', pos: [5, 7], type: 'forest' },
      { name: 'Blue Lake', pos: [7, 2], type: 'water' },
    ],
    [9, 0],
    [3, 6],
    {
      easy: [
        { text: 'Go 6 cells North from start', type: 'direct' },
        { text: 'Go 6 cells East', type: 'direct' },
      ],
      medium: [
        { text: 'Head North until you\'re level with Eagle Peak', type: 'relative' },
        { text: 'The treasure is 3 cells East of Eagle Peak', type: 'relative' },
      ],
      hard: [
        { text: 'The treasure is 1 row South of Eagle Peak', type: 'triangulation' },
        { text: 'The treasure is 1 column West of Pine Valley', type: 'triangulation' },
        { text: 'It\'s closer to Eagle Peak than to Blue Lake', type: 'triangulation' },
      ],
    },
  ),
  buildHunt('h2', 'Forest Secret',
    [
      { name: 'Old Oak', pos: [1, 1], type: 'forest' },
      { name: 'River Bend', pos: [4, 5], type: 'water' },
      { name: 'Hilltop', pos: [3, 8], type: 'mountain' },
      { name: 'Mill Village', pos: [8, 4], type: 'village' },
    ],
    [0, 0],
    [6, 5],
    {
      easy: [
        { text: 'Go 6 cells South from start', type: 'direct' },
        { text: 'Go 5 cells East', type: 'direct' },
      ],
      medium: [
        { text: 'The treasure is 2 rows South of River Bend', type: 'relative' },
        { text: 'The treasure is in the same column as River Bend', type: 'relative' },
      ],
      hard: [
        { text: 'It\'s between River Bend and Mill Village vertically', type: 'triangulation' },
        { text: 'Same column as River Bend', type: 'triangulation' },
        { text: 'It\'s 3 columns West of Hilltop', type: 'triangulation' },
      ],
    },
  ),
  buildHunt('h3', 'Coastal Treasure',
    [
      { name: 'Lighthouse', pos: [0, 9], type: 'village' },
      { name: 'Shipwreck Cove', pos: [5, 8], type: 'water' },
      { name: 'Cliff Face', pos: [3, 4], type: 'mountain' },
    ],
    [9, 9],
    [2, 7],
    {
      easy: [
        { text: 'Go 7 cells North from start', type: 'direct' },
        { text: 'Go 2 cells West', type: 'direct' },
      ],
      medium: [
        { text: 'The treasure is 2 rows South of the Lighthouse', type: 'relative' },
        { text: 'The treasure is 2 cells West of the Lighthouse', type: 'relative' },
      ],
      hard: [
        { text: 'It\'s closer to the Lighthouse than to Cliff Face', type: 'triangulation' },
        { text: 'The treasure is 3 rows North of Shipwreck Cove', type: 'triangulation' },
        { text: 'It\'s 1 column West of Shipwreck Cove', type: 'triangulation' },
      ],
    },
  ),
  buildHunt('h4', 'Desert Relic',
    [
      { name: 'Sand Dune', pos: [1, 5], type: 'mountain' },
      { name: 'Oasis', pos: [6, 3], type: 'water' },
      { name: 'Trading Post', pos: [4, 8], type: 'village' },
      { name: 'Palm Grove', pos: [8, 6], type: 'forest' },
    ],
    [0, 0],
    [5, 5],
    {
      easy: [
        { text: 'Go 5 cells South from start', type: 'direct' },
        { text: 'Go 5 cells East', type: 'direct' },
      ],
      medium: [
        { text: 'The treasure is in the same column as Sand Dune', type: 'relative' },
        { text: 'It\'s 1 row North of the Oasis', type: 'relative' },
      ],
      hard: [
        { text: 'It\'s directly between Sand Dune and Palm Grove on the column axis', type: 'triangulation' },
        { text: 'It\'s 2 columns East of the Oasis', type: 'triangulation' },
        { text: 'It\'s 1 row North and 3 columns West of Trading Post', type: 'triangulation' },
      ],
    },
  ),
  buildHunt('h5', 'Sunken City',
    [
      { name: 'Coral Arch', pos: [2, 2], type: 'water' },
      { name: 'Kelp Forest', pos: [6, 7], type: 'forest' },
      { name: 'Volcano Vent', pos: [8, 1], type: 'mountain' },
    ],
    [9, 5],
    [4, 4],
    {
      easy: [
        { text: 'Go 5 cells North from start', type: 'direct' },
        { text: 'Go 1 cell West', type: 'direct' },
      ],
      medium: [
        { text: 'The treasure is 2 rows South of Coral Arch', type: 'relative' },
        { text: 'It\'s 2 columns East of Coral Arch', type: 'relative' },
      ],
      hard: [
        { text: 'It\'s between Coral Arch and Kelp Forest diagonally', type: 'triangulation' },
        { text: 'It\'s 4 rows North of Volcano Vent', type: 'triangulation' },
        { text: 'It\'s 3 columns East of Volcano Vent', type: 'triangulation' },
      ],
    },
  ),
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { huntCount: 3, clueLevel: 'easy' as const, maxMoves: 20, pointsPerHunt: 100 }
    case 'medium':
      return { huntCount: 3, clueLevel: 'medium' as const, maxMoves: 15, pointsPerHunt: 150 }
    case 'hard':
      return { huntCount: 3, clueLevel: 'hard' as const, maxMoves: 12, pointsPerHunt: 200 }
    case 'extreme':
      return { huntCount: 3, clueLevel: 'hard' as const, maxMoves: 10, pointsPerHunt: 250 }
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

// ─── Component ────────────────────────────────────────────────

export default function GeoTracker({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: GeoTrackerProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const hunts = useMemo(() => shuffle(ALL_HUNTS).slice(0, config.huntCount), [config.huntCount])

  const [huntIndex, setHuntIndex] = useState(0)
  const [playerPos, setPlayerPos] = useState<[number, number]>(hunts[0]?.start || [0, 0])
  const [moveCount, setMoveCount] = useState(0)
  const [path, setPath] = useState<[number, number][]>([])
  const [huntScores, setHuntScores] = useState<{ found: boolean; moves: number; score: number }[]>([])
  const [phase, setPhase] = useState<'navigate' | 'result'>('navigate')
  const [gameFinished, setGameFinished] = useState(false)
  const [foundTreasure, setFoundTreasure] = useState(false)

  const currentHunt = hunts[huntIndex]
  const maxScore = hunts.length * config.pointsPerHunt
  const clues = currentHunt?.clues[config.clueLevel] || []

  const handleCellClick = useCallback((r: number, c: number) => {
    if (isPaused || phase !== 'navigate' || foundTreasure) return

    // Must be adjacent (including diagonal)
    const dr = Math.abs(r - playerPos[0])
    const dc = Math.abs(c - playerPos[1])
    if (dr > 1 || dc > 1 || (dr === 0 && dc === 0)) return

    const newPos: [number, number] = [r, c]
    setPlayerPos(newPos)
    setMoveCount((m) => m + 1)
    setPath((p) => [...p, newPos])

    // Check treasure
    if (r === currentHunt.treasure[0] && c === currentHunt.treasure[1]) {
      setFoundTreasure(true)
    }
  }, [isPaused, phase, foundTreasure, playerPos, currentHunt])

  const handleGiveUp = useCallback(() => {
    setFoundTreasure(false)
    finishHunt(false)
  }, [])

  const finishHunt = useCallback((found: boolean) => {
    const efficiency = found ? Math.max(0, 1 - (moveCount / (config.maxMoves * 2))) : 0
    const score = found ? Math.round(config.pointsPerHunt * (0.5 + 0.5 * efficiency)) : 0
    const newScores = [...huntScores, { found, moves: moveCount, score }]
    setHuntScores(newScores)
    setPhase('result')

    const totalSoFar = newScores.reduce((a, b) => a + b.score, 0)
    onScoreUpdate(totalSoFar, maxScore)
  }, [moveCount, config, huntScores, maxScore, onScoreUpdate])

  const handleConfirmTreasure = useCallback(() => {
    finishHunt(true)
  }, [finishHunt])

  const handleNext = useCallback(() => {
    if (huntIndex + 1 >= hunts.length) {
      setGameFinished(true)
      const finalScore = huntScores.reduce((a, b) => a + b.score, 0)
      onGameOver(finalScore, maxScore)
    } else {
      const nextHunt = hunts[huntIndex + 1]
      setHuntIndex((i) => i + 1)
      setPlayerPos(nextHunt.start)
      setMoveCount(0)
      setPath([])
      setFoundTreasure(false)
      setPhase('navigate')
    }
  }, [huntIndex, hunts, huntScores, maxScore, onGameOver])

  if (!currentHunt && !gameFinished) return null

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-5">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {hunts.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < huntIndex && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === huntIndex && !gameFinished && 'border-amber-500/50 bg-amber-500/15 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]',
              i > huntIndex && 'border-white/10 bg-white/5 text-white/20',
            )}
          >
            {i < huntScores.length ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </div>
        ))}
      </div>

      {gameFinished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8"
        >
          <Star className="h-12 w-12 text-amber-400" />
          <p className="text-xl font-bold text-white">Expedition Complete!</p>
          <p className="text-sm text-white/60">
            Total Score: {huntScores.reduce((a, b) => a + b.score, 0)} / {maxScore}
          </p>
          {huntScores.map((s, i) => (
            <div key={i} className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-xs text-white/60">Hunt {i + 1}: {hunts[i]?.name}</span>
              <div className="flex gap-3 text-xs">
                <span className={cn(s.found ? 'text-emerald-300' : 'text-red-400')}>{s.found ? <><Check className="mr-0.5 inline h-3 w-3" />Found</> : <><X className="mr-0.5 inline h-3 w-3" />Missed</>}</span>
                <span className="text-cyan-300">Moves: {s.moves}</span>
                <span className="font-bold text-amber-400">{s.score} pts</span>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHunt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full flex-col gap-4"
          >
            {/* Hunt info */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                  <Map className="h-4 w-4" />
                  Hunt {huntIndex + 1}: {currentHunt.name}
                </div>
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <span>Moves: {moveCount}</span>
                  <span>Max efficient: {config.maxMoves}</span>
                </div>
              </div>
            </div>

            {/* Clues */}
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Compass className="h-3 w-3" />
                Navigation Clues
              </div>
              <div className="mt-2 flex flex-col gap-1">
                {clues.map((clue, i) => (
                  <p key={i} className="text-xs text-white/70">
                    <span className="mr-1 text-cyan-400">{i + 1}.</span> {clue.text}
                  </p>
                ))}
              </div>
              {/* Landmark legend */}
              <div className="mt-3 flex flex-wrap gap-2">
                {currentHunt.landmarks.map((lm) => (
                  <span key={lm.name} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
                    {(() => { const Icon = CELL_RENDER[lm.type].icon; return Icon ? <Icon className="h-3 w-3 inline" /> : null; })()} {lm.name} ({lm.pos[0]},{lm.pos[1]})
                  </span>
                ))}
              </div>
            </div>

            {phase === 'navigate' && (
              <>
                {/* Grid */}
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#080b1f] p-2">
                  {/* Column headers */}
                  <div className="mb-1 flex">
                    <div className="h-5 w-7" />
                    {Array.from({ length: 10 }, (_, c) => (
                      <div key={c} className="flex h-5 w-8 items-center justify-center text-[9px] text-white/30">{c}</div>
                    ))}
                  </div>
                  {currentHunt.grid.map((row, r) => (
                    <div key={r} className="flex">
                      <div className="flex h-8 w-7 items-center justify-center text-[9px] text-white/30">{r}</div>
                      {row.map((cell, c) => {
                        const isPlayer = playerPos[0] === r && playerPos[1] === c
                        const isOnPath = path.some(([pr, pc]) => pr === r && pc === c)
                        const isTreasureRevealed = foundTreasure && currentHunt.treasure[0] === r && currentHunt.treasure[1] === c
                        const isAdj = Math.abs(r - playerPos[0]) <= 1 && Math.abs(c - playerPos[1]) <= 1 && !(r === playerPos[0] && c === playerPos[1])

                        return (
                          <button
                            key={c}
                            onClick={() => handleCellClick(r, c)}
                            className={cn(
                              'flex h-8 w-8 items-center justify-center border border-white/5 text-sm transition-all',
                              CELL_RENDER[cell].bg,
                              isPlayer && 'ring-2 ring-cyan-400 bg-cyan-900/40',
                              isOnPath && !isPlayer && 'bg-cyan-900/15',
                              isTreasureRevealed && 'ring-2 ring-amber-400 bg-amber-900/40',
                              isAdj && !foundTreasure && phase === 'navigate' && 'hover:bg-white/10 cursor-pointer',
                            )}
                          >
                            {isPlayer ? <MapPin className="h-4 w-4 text-cyan-300" /> : isTreasureRevealed ? <Gem className="h-4 w-4 text-amber-400" /> : (() => { const Icon = CELL_RENDER[cell].icon; return Icon ? <Icon className="h-4 w-4 text-white/40" /> : (isOnPath ? '·' : ''); })()}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {foundTreasure ? (
                    <button
                      onClick={handleConfirmTreasure}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-500"
                    >
                      <Gem className="h-4 w-4" />
                      Treasure Found! Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleGiveUp}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-900/30 px-5 py-2.5 text-sm font-bold text-red-300 transition-all hover:bg-red-900/50"
                    >
                      Give Up This Hunt
                    </button>
                  )}
                </div>
              </>
            )}

            {phase === 'result' && huntScores.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-300">
                    {huntScores[huntScores.length - 1].found ? 'Treasure Found!' : 'Hunt Failed'}
                  </span>
                  <span className="text-lg font-bold text-amber-400">{huntScores[huntScores.length - 1].score} pts</span>
                </div>
                <p className="text-xs text-white/50">
                  Moves used: {huntScores[huntScores.length - 1].moves} (efficient target: {config.maxMoves})
                </p>
                <p className="text-xs text-white/40">
                  Treasure was at ({currentHunt.treasure[0]}, {currentHunt.treasure[1]})
                </p>

                <button
                  onClick={handleNext}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-500"
                >
                  {huntIndex + 1 >= hunts.length ? 'Finish' : 'Next Hunt'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
