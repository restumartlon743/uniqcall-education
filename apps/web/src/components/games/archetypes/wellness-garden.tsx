'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Flower2,
  ArrowRight,
  Star,
  Droplets,
  Sun,
  Leaf,
  AlertCircle,
  TreeDeciduous,
  Sprout,
  Flower,
  Skull,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface DayEvent {
  text: string
  hint: string
  idealAllocation: { water: number; sunlight: number; nutrients: number }
  difficulty: 'easy' | 'medium' | 'hard'
}

interface WellnessGardenProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const ALL_EVENTS: DayEvent[] = [
  // Easy: clear hints
  { text: 'You feel exhausted after a long day of school.', hint: 'Rest sounds like a good idea.', idealAllocation: { water: 5, sunlight: 2, nutrients: 3 }, difficulty: 'easy' },
  { text: 'Big test tomorrow! You need to study.', hint: 'Activity and focus will help you prepare.', idealAllocation: { water: 2, sunlight: 6, nutrients: 2 }, difficulty: 'easy' },
  { text: 'Your friend invited you to hang out after school.', hint: 'Social time recharges you.', idealAllocation: { water: 2, sunlight: 2, nutrients: 6 }, difficulty: 'easy' },
  { text: 'You couldn\'t sleep well last night.', hint: 'Prioritize rest today.', idealAllocation: { water: 6, sunlight: 2, nutrients: 2 }, difficulty: 'easy' },
  { text: 'Your sports team has an important practice today.', hint: 'Time to get active!', idealAllocation: { water: 2, sunlight: 5, nutrients: 3 }, difficulty: 'easy' },
  { text: 'You\'ve been alone all week — feeling isolated.', hint: 'Reach out to friends or family.', idealAllocation: { water: 2, sunlight: 2, nutrients: 6 }, difficulty: 'easy' },
  { text: 'You feel great today — balanced and happy!', hint: 'Keep things balanced.', idealAllocation: { water: 3, sunlight: 4, nutrients: 3 }, difficulty: 'easy' },
  // Medium: subtle hints
  { text: 'Your body feels sore and you have a slight headache.', hint: '', idealAllocation: { water: 5, sunlight: 2, nutrients: 3 }, difficulty: 'medium' },
  { text: 'You have a presentation next week and feel unprepared.', hint: '', idealAllocation: { water: 2, sunlight: 5, nutrients: 3 }, difficulty: 'medium' },
  { text: 'Your friend seems upset but hasn\'t said why.', hint: '', idealAllocation: { water: 2, sunlight: 3, nutrients: 5 }, difficulty: 'medium' },
  { text: 'You\'ve been scrolling social media all evening and feel drained.', hint: '', idealAllocation: { water: 5, sunlight: 3, nutrients: 2 }, difficulty: 'medium' },
  { text: 'Your family is planning a weekend trip.', hint: '', idealAllocation: { water: 3, sunlight: 3, nutrients: 4 }, difficulty: 'medium' },
  // Hard: contradictory pressures
  { text: 'You\'re exhausted, but your team needs you for practice AND your friend needs emotional support.', hint: '', idealAllocation: { water: 4, sunlight: 3, nutrients: 3 }, difficulty: 'hard' },
  { text: 'You slept well but feel socially drained. There\'s a study group meeting today.', hint: '', idealAllocation: { water: 2, sunlight: 4, nutrients: 4 }, difficulty: 'hard' },
  { text: 'You\'ve been over-exercising and ignoring friends. Tomorrow is a big exam.', hint: '', idealAllocation: { water: 4, sunlight: 2, nutrients: 4 }, difficulty: 'hard' },
  { text: 'Everything feels overwhelming — school, friends, and you haven\'t slept properly.', hint: '', idealAllocation: { water: 5, sunlight: 2, nutrients: 3 }, difficulty: 'hard' },
  { text: 'Your parents want family time, your friends want to hang out, and you have homework.', hint: '', idealAllocation: { water: 2, sunlight: 4, nutrients: 4 }, difficulty: 'hard' },
]

const RESOURCE_CONFIG = [
  { key: 'water' as const, label: 'Water (Rest)', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500', barBg: 'bg-blue-500/20' },
  { key: 'sunlight' as const, label: 'Sunlight (Activity)', icon: Sun, color: 'text-amber-400', bg: 'bg-amber-500', barBg: 'bg-amber-500/20' },
  { key: 'nutrients' as const, label: 'Nutrients (Social)', icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-500', barBg: 'bg-emerald-500/20' },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { days: 7, pool: ['easy'] as const, pointsPerDay: 10, showHints: true }
    case 'medium':
      return { days: 7, pool: ['easy', 'medium'] as const, pointsPerDay: 10, showHints: false }
    case 'hard':
    case 'extreme':
      return { days: 7, pool: ['easy', 'medium', 'hard'] as const, pointsPerDay: 10, showHints: false }
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

function getPlantStage(health: number): ReactNode {
  if (health >= 80) return <TreeDeciduous className="h-8 w-8 text-emerald-400" />
  if (health >= 60) return <Leaf className="h-8 w-8 text-emerald-400" />
  if (health >= 40) return <Sprout className="h-8 w-8 text-yellow-400" />
  if (health >= 20) return <Flower className="h-8 w-8 text-red-400" />
  return <Skull className="h-8 w-8 text-red-500" />
}

function getPlantLabel(health: number): string {
  if (health >= 80) return 'Thriving'
  if (health >= 60) return 'Healthy'
  if (health >= 40) return 'Okay'
  if (health >= 20) return 'Wilting'
  return 'Withered'
}

// ─── Component ────────────────────────────────────────────────

export default function WellnessGarden({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: WellnessGardenProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const events = useMemo(() => {
    const pool = ALL_EVENTS.filter((e) => (config.pool as readonly string[]).includes(e.difficulty))
    return shuffle(pool).slice(0, config.days)
  }, [config])

  const [day, setDay] = useState(0)
  const [allocation, setAllocation] = useState({ water: 3, sunlight: 4, nutrients: 3 })
  const [plantHealth, setPlantHealth] = useState({ water: 50, sunlight: 50, nutrients: 50 })
  const [history, setHistory] = useState<{ day: number; health: typeof plantHealth; score: number }[]>([])
  const [phase, setPhase] = useState<'allocate' | 'result'>('allocate')
  const [finished, setFinished] = useState(false)

  const maxScore = config.days * config.pointsPerDay

  const totalAlloc = allocation.water + allocation.sunlight + allocation.nutrients

  const adjustAllocation = useCallback(
    (resource: 'water' | 'sunlight' | 'nutrients', delta: number) => {
      if (isPaused || phase !== 'allocate') return
      setAllocation((prev) => {
        const newVal = Math.max(0, Math.min(10, prev[resource] + delta))
        const others = Object.entries(prev)
          .filter(([k]) => k !== resource)
          .reduce((s, [, v]) => s + v, 0)
        if (newVal + others > 10) return prev
        return { ...prev, [resource]: newVal }
      })
    },
    [isPaused, phase],
  )

  const handleSubmitDay = useCallback(() => {
    if (totalAlloc > 10) return
    const currentEvent = events[day]

    // Calculate how close allocation is to ideal
    const newHealth = { ...plantHealth }
    for (const res of RESOURCE_CONFIG) {
      const ideal = currentEvent.idealAllocation[res.key]
      const actual = allocation[res.key]
      const diff = Math.abs(ideal - actual)

      // Each resource changes based on allocation
      let change = 0
      if (diff === 0) change = 10
      else if (diff <= 1) change = 5
      else if (diff <= 2) change = 0
      else if (diff <= 3) change = -5
      else change = -10

      // Too much of one thing is bad (overwatering)
      if (actual >= 7) change -= 5

      newHealth[res.key] = Math.max(0, Math.min(100, newHealth[res.key] + change))
    }

    const avgHealth = Math.round((newHealth.water + newHealth.sunlight + newHealth.nutrients) / 3)
    const dayScore = Math.round((avgHealth / 100) * config.pointsPerDay)

    setPlantHealth(newHealth)
    const newHistory = [...history, { day, health: { ...newHealth }, score: dayScore }]
    setHistory(newHistory)
    setPhase('result')

    const totalScore = newHistory.reduce((a, b) => a + b.score, 0)
    onScoreUpdate(totalScore, maxScore)
  }, [totalAlloc, events, day, plantHealth, allocation, config.pointsPerDay, history, maxScore, onScoreUpdate])

  const handleNextDay = useCallback(() => {
    if (day + 1 >= events.length) {
      setFinished(true)
      const totalScore = history.reduce((a, b) => a + b.score, 0)
      onGameOver(totalScore, maxScore)
    } else {
      setDay((d) => d + 1)
      setAllocation({ water: 3, sunlight: 4, nutrients: 3 })
      setPhase('allocate')
    }
  }, [day, events.length, history, maxScore, onGameOver])

  const currentEvent = events[day]
  const avgHealth = Math.round((plantHealth.water + plantHealth.sunlight + plantHealth.nutrients) / 3)

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
      {/* Day indicators */}
      <div className="flex items-center gap-1.5">
        {events.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-bold transition-all',
              i < day && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === day && !finished && 'border-green-500/50 bg-green-500/15 text-green-300 shadow-[0_0_8px_rgba(34,197,94,0.3)]',
              i > day && 'border-white/10 bg-white/5 text-white/20',
            )}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Garden visualization */}
      <div className="flex w-full items-end justify-center gap-6 rounded-xl border border-green-500/20 bg-gradient-to-b from-[#0A1A0A] to-[#0A0E27] p-6" style={{ minHeight: 140 }}>
        {RESOURCE_CONFIG.map((res) => {
          const health = plantHealth[res.key]
          return (
            <div key={res.key} className="flex flex-col items-center gap-2">
              <span>{getPlantStage(health)}</span>
              <div className="flex flex-col items-center">
                <span className={cn('text-[10px] font-bold', res.color)}>{res.label.split(' ')[0]}</span>
                <span className={cn('text-[10px]', health >= 60 ? 'text-emerald-400' : health >= 40 ? 'text-yellow-400' : 'text-red-400')}>
                  {getPlantLabel(health)}
                </span>
              </div>
              {/* Health bar */}
              <div className={cn('h-1.5 w-16 rounded-full', res.barBg)}>
                <motion.div
                  className={cn('h-1.5 rounded-full', res.bg)}
                  animate={{ width: `${health}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-xs text-white/40">
        Overall Garden Health: <span className={cn('font-bold', avgHealth >= 60 ? 'text-emerald-400' : avgHealth >= 40 ? 'text-yellow-400' : 'text-red-400')}>{avgHealth}%</span>
      </div>

      {finished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8"
        >
          <Star className="h-12 w-12 text-amber-400" />
          <p className="text-xl font-bold text-white">Garden Season Complete!</p>
          <div className="flex gap-8">
            {RESOURCE_CONFIG.map((res) => (
              <div key={res.key} className="flex flex-col items-center">
                <span>{getPlantStage(plantHealth[res.key])}</span>
                <span className={cn('text-xs font-bold', res.color)}>{plantHealth[res.key]}%</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-white/60">
            Final Score: {history.reduce((a, b) => a + b.score, 0)} / {maxScore}
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full flex-col gap-4"
          >
            {/* Day event */}
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-green-300">
                <Flower2 className="h-4 w-4" />
                Day {day + 1} of {events.length}
              </div>
              <p className="mt-2 text-sm text-white/80">{currentEvent.text}</p>
              {config.showHints && currentEvent.hint && (
                <p className="mt-1 flex items-center gap-1 text-xs text-green-300/60">
                  <AlertCircle className="h-3 w-3" />
                  {currentEvent.hint}
                </p>
              )}
            </div>

            {phase === 'allocate' && (
              <>
                <p className="text-xs text-white/40">
                  Allocate 10 hours across rest, activity, and social time. (Used: {totalAlloc}/10)
                </p>

                <div className="flex flex-col gap-3">
                  {RESOURCE_CONFIG.map((res) => {
                    const Icon = res.icon
                    return (
                      <div key={res.key} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                        <Icon className={cn('h-5 w-5', res.color)} />
                        <span className={cn('w-28 text-xs font-bold', res.color)}>{res.label}</span>
                        <button
                          onClick={() => adjustAllocation(res.key, -1)}
                          disabled={allocation[res.key] <= 0}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-white/60 transition-all hover:bg-white/10 disabled:opacity-30"
                        >
                          −
                        </button>
                        <div className="flex-1">
                          <div className={cn('flex h-3 rounded-full', res.barBg)}>
                            <motion.div
                              className={cn('h-3 rounded-full', res.bg)}
                              animate={{ width: `${(allocation[res.key] / 10) * 100}%` }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                        </div>
                        <span className={cn('w-6 text-center text-sm font-bold', res.color)}>{allocation[res.key]}</span>
                        <button
                          onClick={() => adjustAllocation(res.key, 1)}
                          disabled={totalAlloc >= 10}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-white/60 transition-all hover:bg-white/10 disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={handleSubmitDay}
                  disabled={totalAlloc > 10}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all',
                    totalAlloc <= 10
                      ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:bg-green-500'
                      : 'bg-white/5 text-white/30 cursor-not-allowed',
                  )}
                >
                  <Flower2 className="h-4 w-4" />
                  End Day
                </button>
              </>
            )}

            {phase === 'result' && history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-300">Day Complete!</span>
                  <span className="text-lg font-bold text-amber-400">{history[history.length - 1].score} pts</span>
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  {RESOURCE_CONFIG.map((res) => {
                    const ideal = currentEvent.idealAllocation[res.key]
                    const actual = allocation[res.key]
                    const diff = Math.abs(ideal - actual)
                    return (
                      <div key={res.key} className="flex items-center gap-2">
                        <span className={cn('w-28', res.color)}>{res.label}:</span>
                        <span className="text-white/60">You: {actual}</span>
                        <span className={cn(diff <= 1 ? 'text-emerald-400' : diff <= 2 ? 'text-yellow-400' : 'text-red-400')}>
                          {diff === 0 ? '✓ Perfect' : diff <= 1 ? '~ Close' : `✗ Ideal: ${ideal}`}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={handleNextDay}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all hover:bg-green-500"
                >
                  {day + 1 >= events.length ? 'Finish Season' : 'Next Day'}
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
