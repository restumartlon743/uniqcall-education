'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Lightbulb,
  Timer,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Package,
  Users,
  AlertTriangle,
  Plus,
  X,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface ConstraintSet {
  material: string
  audience: string
  problem: string
}

interface RoundResult {
  constraints: ConstraintSet
  ideaName: string
  selectedFeatures: string[]
  score: number
  breakdown: { constraints: number; diversity: number; creativity: number; time: number }
}

interface IdeaFactoryProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data Pools ───────────────────────────────────────────────

const MATERIALS = [
  'Recycled Plastic', 'Bamboo', 'Smart Fabric', 'Graphene', 'Bio-foam',
  'Solar Film', 'Mushroom Leather', 'Cork', 'Algae Polymer', 'Titanium Alloy',
  'Hydrogel', 'Carbon Fiber', 'Beeswax', 'Magnetic Particles', 'LED Thread',
  'Compressed Air', 'Seaweed Extract',
]

const AUDIENCES = [
  'Elderly People', 'Students', 'Pet Owners', 'Remote Workers', 'Athletes',
  'Toddlers', 'Musicians', 'Farmers', 'Astronauts', 'Chefs',
  'Gamers', 'Hikers',
]

const PROBLEMS = [
  'Staying Hydrated', 'Reducing Food Waste', 'Better Sleep', 'Focus & Productivity',
  'Reducing Stress', 'Learning New Skills', 'Staying Organized', 'Saving Energy',
  'Improving Posture', 'Community Building', 'Time Management', 'Creative Block',
]

const FEATURES = [
  'Voice Control', 'Solar Powered', 'Foldable', 'App Connected', 'Waterproof',
  'Glow-in-the-Dark', 'Self-Cleaning', 'Temperature Sensing', 'Modular Design',
  'Biodegradable', 'AI-Assisted', 'Haptic Feedback', 'Noise Cancelling',
  'Lightweight', 'Color Changing', 'Wireless Charging', 'Adjustable Size',
  'Motion Tracking', 'Aromatherapy', 'Child-Safe', 'Emergency Alert',
]

const CREATIVITY_KEYWORDS = [
  'smart', 'auto', 'eco', 'nano', 'bio', 'flex', 'ultra', 'quantum',
  'zen', 'wave', 'pulse', 'aero', 'nova', 'pro', 'sync', 'boost',
  'max', 'flow', 'spark', 'glow', 'core', 'prime',
]

const TOTAL_ROUNDS = 3

// ─── Helpers ──────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getTimeLimit(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 90
    case 'medium': return 60
    case 'hard': return 45
    case 'extreme': return 30
  }
}

function getFeatureCount(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 3
    case 'medium': return 4
    case 'hard': return 5
    case 'extreme': return 6
  }
}

function generateConstraints(): ConstraintSet[] {
  const materials = shuffle(MATERIALS)
  const audiences = shuffle(AUDIENCES)
  const problems = shuffle(PROBLEMS)
  return Array.from({ length: TOTAL_ROUNDS }, (_, i) => ({
    material: materials[i % materials.length],
    audience: audiences[i % audiences.length],
    problem: problems[i % problems.length],
  }))
}

function scoreRound(
  constraints: ConstraintSet,
  ideaName: string,
  features: string[],
  timeRemaining: number,
  timeLimit: number,
): { total: number; breakdown: { constraints: number; diversity: number; creativity: number; time: number } } {
  const nameLower = ideaName.toLowerCase()
  const constraintWords = [
    constraints.material.toLowerCase(),
    constraints.audience.toLowerCase(),
    constraints.problem.toLowerCase(),
  ]

  // Constraint coverage: did idea name reference constraint themes?
  let constraintScore = 0
  constraintWords.forEach((w) => {
    const words = w.split(' ')
    if (words.some((word) => nameLower.includes(word.substring(0, 4)))) {
      constraintScore += 10
    } else {
      constraintScore += 5 // partial credit for submitting
    }
  })
  constraintScore = Math.min(constraintScore, 30)

  // Feature diversity: unique category spread
  const diversityScore = Math.min(features.length * 6, 30)

  // Creativity: keywords in name
  let creativityScore = 0
  CREATIVITY_KEYWORDS.forEach((kw) => {
    if (nameLower.includes(kw)) creativityScore += 5
  })
  creativityScore = Math.min(creativityScore + (ideaName.length > 5 ? 5 : 0), 20)

  // Time bonus
  const timeBonus = Math.round((timeRemaining / timeLimit) * 20)

  const total = constraintScore + diversityScore + creativityScore + timeBonus
  return {
    total: Math.min(total, 100),
    breakdown: {
      constraints: constraintScore,
      diversity: diversityScore,
      creativity: creativityScore,
      time: timeBonus,
    },
  }
}

// ─── Component ────────────────────────────────────────────────

export default function IdeaFactory({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: IdeaFactoryProps) {
  const constraintSets = useMemo(() => generateConstraints(), [])
  const featurePool = useMemo(() => shuffle(FEATURES), [])
  const timeLimit = getTimeLimit(difficulty)
  const maxFeatures = getFeatureCount(difficulty)
  const maxScore = TOTAL_ROUNDS * 100

  const [currentRound, setCurrentRound] = useState(0)
  const [ideaName, setIdeaName] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [roundResults, setRoundResults] = useState<RoundResult[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Timer
  useEffect(() => {
    if (submitted || gameFinished || isPaused) return
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
  }, [currentRound, submitted, gameFinished, isPaused])

  // Auto-submit on time out
  useEffect(() => {
    if (timeLeft === 0 && !submitted && !gameFinished) {
      handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

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
    if (submitted) return
    setSubmitted(true)
    if (timerRef.current) clearInterval(timerRef.current)

    const constraints = constraintSets[currentRound]
    const { total, breakdown } = scoreRound(constraints, ideaName || 'Unnamed', selectedFeatures, timeLeft, timeLimit)
    const result: RoundResult = {
      constraints,
      ideaName: ideaName || 'Unnamed',
      selectedFeatures,
      score: total,
      breakdown,
    }
    const newResults = [...roundResults, result]
    setRoundResults(newResults)

    const totalScore = newResults.reduce((s, r) => s + r.score, 0)
    onScoreUpdate(totalScore, maxScore)
  }, [submitted, constraintSets, currentRound, ideaName, selectedFeatures, timeLeft, timeLimit, roundResults, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (currentRound + 1 >= TOTAL_ROUNDS) {
      setGameFinished(true)
      const totalScore = roundResults.reduce((s, r) => s + r.score, 0)
      onGameOver(totalScore, maxScore)
    } else {
      setCurrentRound((r) => r + 1)
      setIdeaName('')
      setSelectedFeatures([])
      setTimeLeft(timeLimit)
      setSubmitted(false)
    }
  }, [currentRound, roundResults, maxScore, onGameOver, timeLimit])

  const constraints = constraintSets[currentRound]
  const totalScore = roundResults.reduce((s, r) => s + r.score, 0)
  const lastResult = submitted && roundResults.length > 0 ? roundResults[roundResults.length - 1] : null

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
      {/* Round & Timer */}
      <div className="flex w-full items-center justify-between">
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
              {i < roundResults.length ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
          ))}
        </div>

        {!gameFinished && !submitted && (
          <motion.div
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold',
              timeLeft <= 10
                ? 'border-red-500/40 bg-red-500/15 text-red-400'
                : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
            )}
            animate={timeLeft <= 10 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.6 }}
          >
            <Timer className="h-3.5 w-3.5" />
            {timeLeft}s
          </motion.div>
        )}
      </div>

      {!gameFinished && (
        <>
          {/* Constraint Cards */}
          <motion.div
            key={currentRound}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid w-full grid-cols-3 gap-3"
          >
            <div className="flex flex-col items-center gap-2 rounded-xl border border-pink-500/20 bg-pink-500/5 p-4 text-center">
              <Package className="h-5 w-5 text-pink-400" />
              <p className="text-[10px] uppercase tracking-wider text-white/40">Material</p>
              <p className="text-sm font-bold text-pink-300">{constraints.material}</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-center">
              <Users className="h-5 w-5 text-violet-400" />
              <p className="text-[10px] uppercase tracking-wider text-white/40">Audience</p>
              <p className="text-sm font-bold text-violet-300">{constraints.audience}</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <p className="text-[10px] uppercase tracking-wider text-white/40">Problem</p>
              <p className="text-sm font-bold text-amber-300">{constraints.problem}</p>
            </div>
          </motion.div>

          {/* Idea Name */}
          <div className="w-full">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/40">
              <Lightbulb className="mr-1 inline h-3 w-3" />
              Product Idea Name
            </label>
            <input
              type="text"
              value={ideaName}
              onChange={(e) => setIdeaName(e.target.value)}
              disabled={submitted}
              maxLength={60}
              placeholder="e.g., EcoSmart HydroFlex..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white placeholder-white/20 outline-none transition-all focus:border-violet-500/40 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] disabled:opacity-50"
            />
          </div>

          {/* Feature Pool */}
          <div className="w-full">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/40">
              Select up to {maxFeatures} Features
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
                        ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
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
              disabled={!ideaName.trim()}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold transition-all',
                ideaName.trim()
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'cursor-not-allowed border-white/10 bg-white/5 text-white/25',
              )}
            >
              <Sparkles className="h-4 w-4" />
              Submit Idea
            </button>
          ) : lastResult ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full flex-col items-center gap-3"
            >
              <div className="grid w-full grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Constraints', value: lastResult.breakdown.constraints, max: 30, color: 'text-pink-400' },
                  { label: 'Diversity', value: lastResult.breakdown.diversity, max: 30, color: 'text-cyan-400' },
                  { label: 'Creativity', value: lastResult.breakdown.creativity, max: 20, color: 'text-violet-400' },
                  { label: 'Time Bonus', value: lastResult.breakdown.time, max: 20, color: 'text-amber-400' },
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
          <h3 className="text-lg font-bold text-white">Idea Factory Complete!</h3>
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
            {roundResults.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm">
                <span className="text-white/60">R{i + 1}: &quot;{r.ideaName}&quot;</span>
                <span className="font-bold text-emerald-400">{r.score}/100</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
