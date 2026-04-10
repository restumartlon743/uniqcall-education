'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  FlaskConical,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Tag,
  Layers,
  Plus,
  X,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface RoundData {
  objects: string[]
}

interface RoundResult {
  objects: string[]
  inventionName: string
  category: string
  features: string[]
  score: number
  breakdown: { components: number; category: number; features: number; name: number }
}

interface InventionLabProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data Pools ───────────────────────────────────────────────

const OBJECTS = [
  'Spring', 'Solar Panel', 'Rubber Band', 'Magnet', 'Lens',
  'Propeller', 'Battery', 'Gyroscope', 'Pulley', 'Lever',
  'Gear', 'Whistle', 'Mirror', 'Antenna', 'Pump',
  'Sensor', 'Motor', 'Piston', 'Coil', 'Valve',
  'Chain', 'Bellows', 'Prism', 'Pendulum', 'Turbine',
  'Filter', 'Compass', 'Capacitor', 'Funnel', 'Timer',
  'Crank', 'Bearing', 'Nozzle',
]

const CATEGORIES = ['Tool', 'Toy', 'Device', 'Vehicle', 'Wearable', 'Appliance']

const FEATURES = [
  'Waterproof', 'Self-Powered', 'Voice Activated', 'Foldable', 'Glow Effect',
  'Temperature Control', 'Auto-Adjust', 'Magnetic Lock', 'Rechargeable', 'Modular',
  'Solar Charging', 'Motion Sensing', 'Night Vision', 'Shock Resistant', 'Lightweight',
  'Anti-Gravity', 'Holographic', 'Self-Repairing', 'Turbo Mode', 'Stealth',
  'Eco-Friendly', 'AI-Enhanced',
]

// Category-object affinity map for scoring
const CATEGORY_AFFINITY: Record<string, string[]> = {
  Tool: ['Lever', 'Gear', 'Pulley', 'Piston', 'Crank', 'Wrench', 'Filter', 'Nozzle', 'Pump', 'Valve'],
  Toy: ['Spring', 'Rubber Band', 'Gyroscope', 'Whistle', 'Pendulum', 'Propeller', 'Prism', 'Mirror'],
  Device: ['Sensor', 'Antenna', 'Battery', 'Capacitor', 'Motor', 'Timer', 'Lens', 'Coil'],
  Vehicle: ['Motor', 'Propeller', 'Turbine', 'Gear', 'Bearing', 'Piston', 'Chain', 'Pump'],
  Wearable: ['Sensor', 'Battery', 'Coil', 'Lens', 'Antenna', 'Magnet', 'Compass'],
  Appliance: ['Motor', 'Pump', 'Filter', 'Valve', 'Timer', 'Sensor', 'Bellows', 'Nozzle'],
}

// ─── Helpers ──────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getRoundCount(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 3
    case 'medium': return 3
    case 'hard': return 4
    case 'extreme': return 4
  }
}

function getObjectCount(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 3
    case 'medium': return 3
    case 'hard': return 4
    case 'extreme': return 4
  }
}

function getFeatureSlots(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 2
    case 'medium': return 3
    case 'hard': return 3
    case 'extreme': return 4
  }
}

function generateRounds(difficulty: GameDifficulty): RoundData[] {
  const count = getRoundCount(difficulty)
  const objCount = getObjectCount(difficulty)
  const shuffled = shuffle(OBJECTS)
  return Array.from({ length: count }, (_, i) => ({
    objects: shuffled.slice(i * objCount, i * objCount + objCount),
  }))
}

function scoreInvention(
  objects: string[],
  name: string,
  category: string,
  features: string[],
): { total: number; breakdown: { components: number; category: number; features: number; name: number } } {
  // Component usage: credit for having them all
  const components = objects.length > 0 ? 25 : 0

  // Category fit: how many objects have affinity  
  const affinityList = CATEGORY_AFFINITY[category] || []
  const matchCount = objects.filter((o) => affinityList.includes(o)).length
  const categoryScore = Math.round((matchCount / Math.max(objects.length, 1)) * 25) + 5

  // Features: credit per feature
  const featureScore = Math.min(features.length * 8, 30)

  // Name quality
  const nameScore = name.length >= 4 ? 15 : name.length >= 2 ? 8 : 0

  const total = Math.min(components + categoryScore + featureScore + nameScore, 100)
  return { total, breakdown: { components, category: categoryScore, features: featureScore, name: nameScore } }
}

// ─── Component ────────────────────────────────────────────────

export default function InventionLab({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: InventionLabProps) {
  const rounds = useMemo(() => generateRounds(difficulty), [difficulty])
  const featurePool = useMemo(() => shuffle(FEATURES), [])
  const totalRounds = rounds.length
  const maxFeatures = getFeatureSlots(difficulty)
  const maxScore = totalRounds * 100

  const [currentRound, setCurrentRound] = useState(0)
  const [inventionName, setInventionName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [results, setResults] = useState<RoundResult[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)

  const roundData = rounds[currentRound]

  const toggleFeature = useCallback(
    (f: string) => {
      if (submitted || isPaused) return
      setSelectedFeatures((prev) =>
        prev.includes(f) ? prev.filter((x) => x !== f) : prev.length < maxFeatures ? [...prev, f] : prev,
      )
    },
    [submitted, isPaused, maxFeatures],
  )

  const handleSubmit = useCallback(() => {
    if (submitted || !selectedCategory || !inventionName.trim()) return

    setSubmitted(true)
    const { total, breakdown } = scoreInvention(roundData.objects, inventionName, selectedCategory, selectedFeatures)
    const result: RoundResult = {
      objects: roundData.objects,
      inventionName,
      category: selectedCategory,
      features: selectedFeatures,
      score: total,
      breakdown,
    }
    const newResults = [...results, result]
    setResults(newResults)

    const totalScore = newResults.reduce((s, r) => s + r.score, 0)
    onScoreUpdate(totalScore, maxScore)
  }, [submitted, selectedCategory, inventionName, roundData, selectedFeatures, results, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (currentRound + 1 >= totalRounds) {
      setGameFinished(true)
      const totalScore = results.reduce((s, r) => s + r.score, 0)
      onGameOver(totalScore, maxScore)
    } else {
      setCurrentRound((r) => r + 1)
      setInventionName('')
      setSelectedCategory(null)
      setSelectedFeatures([])
      setSubmitted(false)
    }
  }, [currentRound, totalRounds, results, maxScore, onGameOver])

  const totalScore = results.reduce((s, r) => s + r.score, 0)
  const lastResult = submitted && results.length > 0 ? results[results.length - 1] : null

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
      {/* Round indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalRounds }, (_, i) => (
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
          {/* Objects */}
          <motion.div
            key={currentRound}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-white/40">
              <FlaskConical className="mr-1 inline h-3 w-3" />
              Combine these components into an invention
            </p>
            <div className="flex justify-center gap-3">
              {roundData.objects.map((obj) => (
                <div
                  key={obj}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3"
                >
                  <Layers className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm font-bold text-cyan-300">{obj}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category */}
          <div className="w-full">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/40">
              <Tag className="mr-1 inline h-3 w-3" />
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => !submitted && !isPaused && setSelectedCategory(cat)}
                  disabled={submitted}
                  className={cn(
                    'rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                    selectedCategory === cat
                      ? 'border-violet-500/40 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10',
                    submitted && 'opacity-50',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Invention Name */}
          <div className="w-full">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/40">
              <Sparkles className="mr-1 inline h-3 w-3" />
              Invention Name
            </label>
            <input
              type="text"
              value={inventionName}
              onChange={(e) => setInventionName(e.target.value)}
              disabled={submitted}
              maxLength={50}
              placeholder="e.g., SolarFlex Turbo Arm..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white placeholder-white/20 outline-none transition-all focus:border-violet-500/40 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] disabled:opacity-50"
            />
          </div>

          {/* Features */}
          <div className="w-full">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/40">
              Feature Tags
              <span className="ml-2 text-cyan-400">{selectedFeatures.length}/{maxFeatures}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {featurePool.map((f) => {
                const isSelected = selectedFeatures.includes(f)
                return (
                  <button
                    key={f}
                    onClick={() => toggleFeature(f)}
                    disabled={submitted}
                    className={cn(
                      'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                      isSelected
                        ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10',
                      submitted && 'opacity-50',
                    )}
                  >
                    {isSelected ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    {f}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit / Score */}
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!inventionName.trim() || !selectedCategory}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold transition-all',
                inventionName.trim() && selectedCategory
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'cursor-not-allowed border-white/10 bg-white/5 text-white/25',
              )}
            >
              <Sparkles className="h-4 w-4" />
              Submit Invention
            </button>
          ) : lastResult ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full flex-col items-center gap-3"
            >
              <div className="grid w-full grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Components', value: lastResult.breakdown.components, max: 25, color: 'text-cyan-400' },
                  { label: 'Category Fit', value: lastResult.breakdown.category, max: 30, color: 'text-violet-400' },
                  { label: 'Features', value: lastResult.breakdown.features, max: 30, color: 'text-pink-400' },
                  { label: 'Name', value: lastResult.breakdown.name, max: 15, color: 'text-amber-400' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-2">
                    <p className="text-[10px] text-white/40">{s.label}</p>
                    <p className={cn('text-lg font-bold', s.color)}>
                      {s.value}<span className="text-xs text-white/20">/{s.max}</span>
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/60">
                Round Score: <span className="font-bold text-emerald-400">{lastResult.score}</span>/100
              </p>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-6 py-2.5 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-500/20"
              >
                {currentRound + 1 >= totalRounds ? 'Finish' : 'Next Round'}
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
          <h3 className="text-lg font-bold text-white">Invention Lab Complete!</h3>
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
                <span className="text-white/60">R{i + 1}: &quot;{r.inventionName}&quot; ({r.category})</span>
                <span className="font-bold text-emerald-400">{r.score}/100</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
