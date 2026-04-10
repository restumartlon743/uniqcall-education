'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Rocket,
  ArrowRight,
  TrendingUp,
  Users,
  Heart,
  DollarSign,
  AlertTriangle,
  Zap,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface Allocation {
  hiring: number
  marketing: number
  rnd: number
  operations: number
}

interface Metrics {
  revenue: number
  users: number
  morale: number
  cash: number
}

interface RandomEvent {
  title: string
  description: string
  choices: { label: string; effect: (m: Metrics, a: Allocation) => Metrics }[]
}

interface StartupSimulatorProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

function getStartingBudget(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 500000
    case 'medium': return 300000
    case 'hard': return 200000
    case 'extreme': return 150000
  }
}

function getMultiplier(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 1
    case 'medium': return 1.5
    case 'hard': return 2
    case 'extreme': return 3
  }
}

const TOTAL_QUARTERS = 4

const EVENTS: RandomEvent[] = [
  {
    title: 'Competitor Launches!',
    description: 'A well-funded competitor just launched a similar product. How do you respond?',
    choices: [
      {
        label: 'Double down on R&D',
        effect: (m) => ({
          ...m,
          users: Math.round(m.users * 0.9),
          revenue: Math.round(m.revenue * 0.95),
          morale: Math.min(100, m.morale + 5),
        }),
      },
      {
        label: 'Aggressive marketing push',
        effect: (m) => ({
          ...m,
          users: Math.round(m.users * 1.15),
          cash: m.cash - 20000,
          morale: Math.max(0, m.morale - 5),
        }),
      },
    ],
  },
  {
    title: 'Viral Moment!',
    description: 'Your product was featured by a popular influencer. Capitalize on it!',
    choices: [
      {
        label: 'Scale servers (Operations)',
        effect: (m) => ({
          ...m,
          users: Math.round(m.users * 1.3),
          cash: m.cash - 15000,
          morale: Math.min(100, m.morale + 3),
        }),
      },
      {
        label: 'Launch premium tier',
        effect: (m) => ({
          ...m,
          revenue: Math.round(m.revenue * 1.25),
          users: Math.round(m.users * 1.1),
        }),
      },
    ],
  },
  {
    title: 'Key Employee Leaving',
    description: 'Your lead engineer got an offer from a big tech company.',
    choices: [
      {
        label: 'Counter-offer with equity',
        effect: (m) => ({
          ...m,
          morale: Math.min(100, m.morale + 10),
          cash: m.cash - 25000,
        }),
      },
      {
        label: 'Let them go, hire replacement',
        effect: (m) => ({
          ...m,
          morale: Math.max(0, m.morale - 15),
          cash: m.cash - 10000,
        }),
      },
    ],
  },
  {
    title: 'Regulation Change',
    description: 'New data privacy regulations require compliance updates.',
    choices: [
      {
        label: 'Full compliance overhaul',
        effect: (m) => ({
          ...m,
          cash: m.cash - 30000,
          morale: Math.min(100, m.morale + 5),
          users: Math.round(m.users * 1.05),
        }),
      },
      {
        label: 'Minimum compliance',
        effect: (m) => ({
          ...m,
          cash: m.cash - 10000,
          morale: Math.max(0, m.morale - 5),
          users: Math.round(m.users * 0.95),
        }),
      },
    ],
  },
  {
    title: 'Partnership Opportunity',
    description: 'A major platform wants to integrate your product.',
    choices: [
      {
        label: 'Accept partnership',
        effect: (m) => ({
          ...m,
          users: Math.round(m.users * 1.4),
          revenue: Math.round(m.revenue * 1.15),
          morale: Math.min(100, m.morale + 3),
        }),
      },
      {
        label: 'Stay independent',
        effect: (m) => ({
          ...m,
          morale: Math.min(100, m.morale + 8),
          revenue: Math.round(m.revenue * 1.05),
        }),
      },
    ],
  },
  {
    title: 'Server Outage!',
    description: 'Your service went down for 6 hours due to infrastructure issues.',
    choices: [
      {
        label: 'Invest in cloud migration',
        effect: (m) => ({
          ...m,
          cash: m.cash - 35000,
          morale: Math.max(0, m.morale - 5),
          users: Math.round(m.users * 0.98),
        }),
      },
      {
        label: 'Quick fix and apologize',
        effect: (m) => ({
          ...m,
          cash: m.cash - 5000,
          users: Math.round(m.users * 0.9),
          morale: Math.max(0, m.morale - 10),
        }),
      },
    ],
  },
  {
    title: 'Talent Market Boom',
    description: 'Several talented engineers are available for hiring.',
    choices: [
      {
        label: 'Hire aggressively',
        effect: (m) => ({
          ...m,
          cash: m.cash - 40000,
          morale: Math.min(100, m.morale + 10),
          revenue: Math.round(m.revenue * 1.1),
        }),
      },
      {
        label: 'Hire selectively',
        effect: (m) => ({
          ...m,
          cash: m.cash - 15000,
          morale: Math.min(100, m.morale + 5),
        }),
      },
    ],
  },
  {
    title: 'Economic Downturn',
    description: 'The market is slowing down. Investors are cautious.',
    choices: [
      {
        label: 'Cut costs aggressively',
        effect: (m) => ({
          ...m,
          cash: m.cash + 20000,
          morale: Math.max(0, m.morale - 15),
          users: Math.round(m.users * 0.9),
        }),
      },
      {
        label: 'Maintain course, weather the storm',
        effect: (m) => ({
          ...m,
          cash: m.cash - 20000,
          morale: Math.max(0, m.morale - 5),
        }),
      },
    ],
  },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function formatMoney(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
}

function computeQuarter(metrics: Metrics, allocation: Allocation, budget: number): Metrics {
  const spend = budget * 0.25 // Spend per quarter
  const hiringBudget = spend * (allocation.hiring / 100)
  const marketingBudget = spend * (allocation.marketing / 100)
  const rndBudget = spend * (allocation.rnd / 100)
  const opsBudget = spend * (allocation.operations / 100)

  const userGrowth = 1 + (marketingBudget / spend) * 0.3 + (rndBudget / spend) * 0.1
  const revenueGrowth = 1 + (marketingBudget / spend) * 0.15 + (rndBudget / spend) * 0.2
  const moraleChange = (hiringBudget / spend) * 10 + (opsBudget / spend) * 5 - 5

  return {
    users: Math.round(metrics.users * userGrowth),
    revenue: Math.round(metrics.revenue * revenueGrowth),
    morale: Math.max(0, Math.min(100, metrics.morale + moraleChange)),
    cash: Math.round(metrics.cash - spend),
  }
}

function computeValuation(metrics: Metrics): number {
  // Simple valuation: revenue * multiplier + user value + morale bonus
  return Math.round(
    metrics.revenue * 5 +
    metrics.users * 10 +
    metrics.morale * 500 +
    Math.max(0, metrics.cash) * 0.5,
  )
}

// ─── Component ────────────────────────────────────────────────

export default function StartupSimulator({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: StartupSimulatorProps) {
  const startingBudget = getStartingBudget(difficulty)
  const multiplier = getMultiplier(difficulty)
  const maxScore = 100 * multiplier

  const events = useMemo(() => shuffle(EVENTS).slice(0, TOTAL_QUARTERS), [])

  const [quarter, setQuarter] = useState(0)
  const [phase, setPhase] = useState<'allocate' | 'event' | 'review' | 'done'>('allocate')
  const [allocation, setAllocation] = useState<Allocation>({ hiring: 25, marketing: 25, rnd: 25, operations: 25 })
  const [metrics, setMetrics] = useState<Metrics>({
    revenue: 10000,
    users: 100,
    morale: 70,
    cash: startingBudget,
  })
  const [_history, setHistory] = useState<Metrics[]>([])
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)

  const normalizeAllocation = useCallback((key: keyof Allocation, value: number) => {
    setAllocation((prev) => {
      const newAlloc = { ...prev, [key]: value }
      const total = newAlloc.hiring + newAlloc.marketing + newAlloc.rnd + newAlloc.operations
      if (total > 100) {
        // Scale others down proportionally
        const otherKeys = (['hiring', 'marketing', 'rnd', 'operations'] as const).filter((k) => k !== key)
        const otherTotal = otherKeys.reduce((sum, k) => sum + newAlloc[k], 0)
        const excess = total - 100
        if (otherTotal > 0) {
          for (const k of otherKeys) {
            newAlloc[k] = Math.max(0, Math.round(newAlloc[k] - (newAlloc[k] / otherTotal) * excess))
          }
        }
      }
      return newAlloc
    })
  }, [])

  const handleSubmitAllocation = useCallback(() => {
    if (isPaused) return
    // Apply quarter
    const newMetrics = computeQuarter(metrics, allocation, startingBudget)
    setMetrics(newMetrics)
    setHistory((prev) => [...prev, newMetrics])
    setPhase('event')
  }, [isPaused, metrics, allocation, startingBudget])

  const handleEventChoice = useCallback(
    (choiceIdx: number) => {
      if (isPaused) return
      setSelectedChoice(choiceIdx)
    },
    [isPaused],
  )

  const handleConfirmEvent = useCallback(() => {
    if (selectedChoice === null || isPaused) return
    const event = events[quarter]
    const newMetrics = event.choices[selectedChoice].effect(metrics, allocation)
    setMetrics(newMetrics)
    setSelectedChoice(null)
    setPhase('review')

    const valuation = computeValuation(newMetrics)
    const scoreRatio = Math.min(1, valuation / 1000000)
    const score = Math.round(scoreRatio * 100 * multiplier)
    onScoreUpdate(score, maxScore)
  }, [selectedChoice, isPaused, events, quarter, metrics, allocation, multiplier, maxScore, onScoreUpdate])

  const handleNextQuarter = useCallback(() => {
    if (quarter + 1 >= TOTAL_QUARTERS) {
      setPhase('done')
      const valuation = computeValuation(metrics)
      const scoreRatio = Math.min(1, valuation / 1000000)
      const finalScore = Math.round(scoreRatio * 100 * multiplier)
      onGameOver(finalScore, maxScore)
    } else {
      setQuarter((q) => q + 1)
      setPhase('allocate')
    }
  }, [quarter, metrics, multiplier, maxScore, onGameOver])

  const currentEvent = events[quarter]
  const valuation = computeValuation(metrics)

  const sliders: { key: keyof Allocation; label: string; color: string; icon: React.ReactNode }[] = [
    { key: 'hiring', label: 'Hiring', color: 'bg-violet-500', icon: <Users className="h-3.5 w-3.5" /> },
    { key: 'marketing', label: 'Marketing', color: 'bg-cyan-500', icon: <TrendingUp className="h-3.5 w-3.5" /> },
    { key: 'rnd', label: 'R&D', color: 'bg-amber-500', icon: <Zap className="h-3.5 w-3.5" /> },
    { key: 'operations', label: 'Operations', color: 'bg-emerald-500', icon: <Heart className="h-3.5 w-3.5" /> },
  ]

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
      {/* Quarter indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_QUARTERS }, (_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-20 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < quarter && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === quarter && phase !== 'done' && 'border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
              i > quarter && 'border-white/10 bg-white/5 text-white/20',
              i === quarter && phase === 'done' && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
            )}
          >
            Q{i + 1}
          </div>
        ))}
      </div>

      {/* Metrics dashboard */}
      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard icon={<DollarSign className="h-4 w-4 text-emerald-400" />} label="Revenue" value={formatMoney(metrics.revenue)} />
        <MetricCard icon={<Users className="h-4 w-4 text-cyan-400" />} label="Users" value={metrics.users.toLocaleString()} />
        <MetricCard icon={<Heart className="h-4 w-4 text-pink-400" />} label="Morale" value={`${Math.round(metrics.morale)}%`} />
        <MetricCard icon={<DollarSign className="h-4 w-4 text-amber-400" />} label="Cash" value={formatMoney(metrics.cash)} />
      </div>

      {/* Valuation */}
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-6 py-2 text-center">
        <p className="text-[10px] uppercase tracking-wider text-violet-400/60">Company Valuation</p>
        <p className="text-xl font-bold text-violet-300">{formatMoney(valuation)}</p>
      </div>

      {phase === 'allocate' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full flex-col gap-4"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-white/40">
            Allocate Q{quarter + 1} Budget ({formatMoney(startingBudget * 0.25)})
          </p>

          {sliders.map((s) => (
            <div key={s.key} className="flex items-center gap-3">
              <div className="flex w-24 items-center gap-1.5 text-xs font-semibold text-white/60">
                {s.icon}
                {s.label}
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={allocation[s.key]}
                onChange={(e) => normalizeAllocation(s.key, parseInt(e.target.value))}
                disabled={isPaused}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-violet-500"
              />
              <span className="w-10 text-right text-xs font-bold text-white/80">
                {allocation[s.key]}%
              </span>
            </div>
          ))}

          <p className={cn(
            'text-center text-xs font-semibold',
            allocation.hiring + allocation.marketing + allocation.rnd + allocation.operations <= 100
              ? 'text-emerald-400/60'
              : 'text-red-400',
          )}>
            Total: {allocation.hiring + allocation.marketing + allocation.rnd + allocation.operations}%
          </p>

          <button
            onClick={handleSubmitAllocation}
            disabled={isPaused}
            className="mx-auto flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-6 py-2.5 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Rocket className="h-4 w-4" />
            Execute Quarter
          </button>
        </motion.div>
      )}

      {phase === 'event' && currentEvent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full flex-col items-center gap-4"
        >
          <div className="w-full rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              {currentEvent.title}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{currentEvent.description}</p>
          </div>

          <div className="flex w-full flex-col gap-3">
            {currentEvent.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleEventChoice(i)}
                className={cn(
                  'rounded-xl border px-5 py-3 text-left text-sm font-medium transition-all',
                  selectedChoice === i
                    ? 'border-violet-500/50 bg-violet-500/15 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'border-white/10 bg-white/5 text-white/70 hover:border-violet-500/20 hover:bg-violet-500/5',
                )}
              >
                {choice.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleConfirmEvent}
            disabled={selectedChoice === null || isPaused}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold transition-all',
              selectedChoice !== null
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                : 'cursor-not-allowed border-white/10 bg-white/5 text-white/25',
            )}
          >
            Confirm Decision
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {phase === 'review' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full flex-col items-center gap-4"
        >
          <div className="w-full rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 text-sm font-bold text-white/80">Q{quarter + 1} Results</p>
            <p className="text-xs text-white/60">
              Revenue grew to {formatMoney(metrics.revenue)}, you now have {metrics.users.toLocaleString()} users,
              team morale is at {Math.round(metrics.morale)}%, and {formatMoney(metrics.cash)} cash remaining.
            </p>
          </div>

          <button
            onClick={handleNextQuarter}
            className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-6 py-2.5 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-500/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            {quarter + 1 >= TOTAL_QUARTERS ? 'See Final Results' : `Start Q${quarter + 2}`}
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
      <div className="mb-1 flex items-center justify-center">{icon}</div>
      <p className="text-lg font-bold text-white/90">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-white/40">{label}</p>
    </div>
  )
}
