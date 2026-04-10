'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Building2,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  TreePine,
  Users,
  Cpu,
  Coins,
  Heart,
  AlertTriangle,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type Metric = 'population' | 'technology' | 'environment' | 'economy' | 'happiness'

interface PolicyOption {
  id: string
  name: string
  description: string
  effects: Partial<Record<Metric, number>>
  delayedEffects?: Partial<Record<Metric, number>> // activates next round on medium+
}

interface CityEvent {
  id: string
  name: string
  description: string
  effects: Partial<Record<Metric, number>>
}

interface FutureBuilderProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const METRIC_INFO: Record<Metric, { label: string; icon: typeof Users; color: string }> = {
  population: { label: 'Population', icon: Users, color: 'text-blue-400' },
  technology: { label: 'Technology', icon: Cpu, color: 'text-cyan-400' },
  environment: { label: 'Environment', icon: TreePine, color: 'text-emerald-400' },
  economy: { label: 'Economy', icon: Coins, color: 'text-amber-400' },
  happiness: { label: 'Happiness', icon: Heart, color: 'text-pink-400' },
}

const METRICS: Metric[] = ['population', 'technology', 'environment', 'economy', 'happiness']

const ALL_POLICIES: PolicyOption[] = [
  { id: 'p1', name: 'Green Energy Initiative', description: 'Invest in solar/wind farms across the city', effects: { environment: 15, economy: -5, technology: 5 }, delayedEffects: { economy: 10 } },
  { id: 'p2', name: 'Free Public Transport', description: 'Make all buses and trains free for citizens', effects: { happiness: 15, economy: -10, environment: 10 }, delayedEffects: { population: 5 } },
  { id: 'p3', name: 'AI Automation Program', description: 'Automate government services with AI', effects: { technology: 20, economy: 10, happiness: -5 }, delayedEffects: { happiness: -10 } },
  { id: 'p4', name: 'Urban Farming Network', description: 'Build vertical farms in every district', effects: { environment: 10, population: 5, economy: -5 }, delayedEffects: { happiness: 5 } },
  { id: 'p5', name: 'Tech Startup Tax Breaks', description: 'Offer zero taxes for new tech companies', effects: { economy: 15, technology: 10, environment: -5 }, delayedEffects: { population: 10 } },
  { id: 'p6', name: 'Universal Basic Income', description: 'Provide monthly income to all citizens', effects: { happiness: 20, economy: -15, population: 10 }, delayedEffects: { economy: -5 } },
  { id: 'p7', name: 'Nature Reserve Expansion', description: 'Double the size of city parks and reserves', effects: { environment: 20, happiness: 10, economy: -10 } },
  { id: 'p8', name: 'Space Research Center', description: 'Build a cutting-edge space research facility', effects: { technology: 20, economy: -10 }, delayedEffects: { economy: 15, happiness: 5 } },
  { id: 'p9', name: 'Affordable Housing Act', description: 'Build 10,000 new affordable housing units', effects: { population: 15, happiness: 10, economy: -10, environment: -5 } },
  { id: 'p10', name: 'Nuclear Fusion Plant', description: 'Invest in experimental fusion energy', effects: { technology: 15, economy: -15 }, delayedEffects: { environment: 20, economy: 20 } },
  { id: 'p11', name: 'Cultural Festival Month', description: 'Fund a month-long citywide arts festival', effects: { happiness: 15, economy: 5, environment: -3 } },
  { id: 'p12', name: 'Smart City Sensors', description: 'Install IoT sensors across all infrastructure', effects: { technology: 15, environment: 5, economy: -5 }, delayedEffects: { economy: 5 } },
  { id: 'p13', name: 'Industrial Expansion', description: 'Build new manufacturing zones outside the city', effects: { economy: 20, population: 10, environment: -15, happiness: -5 } },
  { id: 'p14', name: 'Water Recycling System', description: 'Implement citywide grey water recycling', effects: { environment: 15, technology: 5, economy: -5 } },
  { id: 'p15', name: 'Immigration Welcome Program', description: 'Active recruitment of skilled workers globally', effects: { population: 20, economy: 10, technology: 5, happiness: -5 } },
  { id: 'p16', name: 'Education Revolution', description: 'Fully fund personalized education for all ages', effects: { happiness: 10, technology: 10, economy: -10 }, delayedEffects: { economy: 10 } },
  { id: 'p17', name: 'Military Tech Development', description: 'Fund advanced defense technology research', effects: { technology: 15, economy: -10, happiness: -5 } },
  { id: 'p18', name: 'Car-Free City Center', description: 'Ban all vehicles from the city core', effects: { environment: 20, happiness: 10, economy: -10 } },
  { id: 'p19', name: 'Cryptocurrency Economy', description: 'Adopt blockchain for all city transactions', effects: { technology: 10, economy: 5, environment: -10 }, delayedEffects: { economy: 10 } },
  { id: 'p20', name: 'Healthcare For All', description: 'Provide free healthcare to every citizen', effects: { happiness: 20, population: 10, economy: -15 } },
  { id: 'p21', name: 'Demolish & Rebuild', description: 'Clear old districts for modern infrastructure', effects: { economy: 10, technology: 10, happiness: -15, environment: -10 } },
  { id: 'p22', name: 'Community Gardens Act', description: 'Convert vacant lots to community gardens', effects: { happiness: 10, environment: 10, economy: -3 } },
]

const ALL_EVENTS: CityEvent[] = [
  { id: 'ev1', name: '🌊 Coastal Flooding', description: 'Rising sea levels flood eastern districts', effects: { environment: -15, economy: -10, happiness: -10 } },
  { id: 'ev2', name: '🔬 Tech Breakthrough', description: 'Local lab discovers room-temp superconductor', effects: { technology: 20, economy: 10 } },
  { id: 'ev3', name: '📈 Population Boom', description: 'Baby boom generation enters the workforce', effects: { population: 20, economy: 5, environment: -5 } },
  { id: 'ev4', name: '🏭 Factory Fire', description: 'Major industrial complex catches fire', effects: { economy: -15, environment: -10 } },
  { id: 'ev5', name: '🎉 Cultural Renaissance', description: 'A wave of artistic creativity sweeps the city', effects: { happiness: 15, economy: 5 } },
  { id: 'ev6', name: '🌳 Reforestation Success', description: 'Planted trees from 10 years ago are thriving', effects: { environment: 15, happiness: 5 } },
  { id: 'ev7', name: '📉 Economic Recession', description: 'Global downturn impacts local businesses', effects: { economy: -20, happiness: -10 } },
  { id: 'ev8', name: '🤖 Robot Protest', description: 'Workers protest against automation taking jobs', effects: { happiness: -15, technology: -5 } },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { rounds: 5, policiesPerRound: 3, hasDelayedEffects: false, eventChance: 0.2, maxScore: 200 }
    case 'medium':
      return { rounds: 5, policiesPerRound: 3, hasDelayedEffects: true, eventChance: 0.3, maxScore: 250 }
    case 'hard':
      return { rounds: 5, policiesPerRound: 4, hasDelayedEffects: true, eventChance: 0.5, maxScore: 300 }
    case 'extreme':
      return { rounds: 5, policiesPerRound: 4, hasDelayedEffects: true, eventChance: 0.6, maxScore: 350 }
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

export default function FutureBuilder({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: FutureBuilderProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])

  // Per-round policy options
  const roundPolicies = useMemo(() => {
    const shuffled = shuffle(ALL_POLICIES)
    const result: PolicyOption[][] = []
    for (let i = 0; i < config.rounds; i++) {
      const start = (i * config.policiesPerRound) % shuffled.length
      result.push(shuffled.slice(start, start + config.policiesPerRound))
    }
    return result
  }, [config])

  // Per-round events
  const roundEvents = useMemo(() => {
    const shuffledEvents = shuffle(ALL_EVENTS)
    return Array.from({ length: config.rounds }, (_, i) =>
      Math.random() < config.eventChance ? shuffledEvents[i % shuffledEvents.length] : null,
    )
  }, [config])

  const [metrics, setMetrics] = useState<Record<Metric, number>>({
    population: 50,
    technology: 50,
    environment: 50,
    economy: 50,
    happiness: 50,
  })
  const [pendingDelayed, setPendingDelayed] = useState<Partial<Record<Metric, number>>[]>([])
  const [round, setRound] = useState(0)
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null)
  const [roundHistory, setRoundHistory] = useState<{ policy: string; event: string | null }[]>([])
  const [phase, setPhase] = useState<'choose' | 'event' | 'apply'>('choose')
  const [currentEvent, setCurrentEvent] = useState<CityEvent | null>(null)
  const [gameFinished, setGameFinished] = useState(false)

  const applyEffects = useCallback((effects: Partial<Record<Metric, number>>, current: Record<Metric, number>): Record<Metric, number> => {
    const result = { ...current }
    for (const [key, val] of Object.entries(effects)) {
      result[key as Metric] = Math.max(0, Math.min(100, result[key as Metric] + (val || 0)))
    }
    return result
  }, [])

  const handleChoosePolicy = useCallback(() => {
    if (isPaused || !selectedPolicy) return

    const policy = roundPolicies[round]?.find((p) => p.id === selectedPolicy)
    if (!policy) return

    let newMetrics = applyEffects(policy.effects, metrics)

    // Apply pending delayed effects
    const newPending: Partial<Record<Metric, number>>[] = []
    for (const delayed of pendingDelayed) {
      newMetrics = applyEffects(delayed, newMetrics)
    }

    // Queue this policy's delayed effects
    if (config.hasDelayedEffects && policy.delayedEffects) {
      newPending.push(policy.delayedEffects)
    }

    // Check for event
    const event = roundEvents[round]
    if (event) {
      newMetrics = applyEffects(event.effects, newMetrics)
      setCurrentEvent(event)
      setPhase('event')
    } else {
      setPhase('apply')
    }

    setMetrics(newMetrics)
    setPendingDelayed(newPending)
    setRoundHistory((prev) => [...prev, { policy: policy.name, event: event?.name || null }])

    // Score
    const avgMetric = METRICS.reduce((a, m) => a + newMetrics[m], 0) / METRICS.length
    const belowThreshold = METRICS.filter((m) => newMetrics[m] < 30).length
    const score = Math.max(0, Math.round(avgMetric * (config.maxScore / 100) - belowThreshold * 20))
    onScoreUpdate(score, config.maxScore)
  }, [isPaused, selectedPolicy, round, roundPolicies, metrics, pendingDelayed, config, roundEvents, applyEffects, onScoreUpdate])

  const handleNextRound = useCallback(() => {
    if (round + 1 >= config.rounds) {
      setGameFinished(true)
      const avgMetric = METRICS.reduce((a, m) => a + metrics[m], 0) / METRICS.length
      const belowThreshold = METRICS.filter((m) => metrics[m] < 30).length
      const finalScore = Math.max(0, Math.round(avgMetric * (config.maxScore / 100) - belowThreshold * 20))
      onGameOver(finalScore, config.maxScore)
    } else {
      setRound((r) => r + 1)
      setSelectedPolicy(null)
      setCurrentEvent(null)
      setPhase('choose')
    }
  }, [round, config, metrics, onGameOver])

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-5">
      {/* Round progress */}
      <div className="flex items-center gap-2">
        {Array.from({ length: config.rounds }, (_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < round && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === round && !gameFinished && 'border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
              i > round && 'border-white/10 bg-white/5 text-white/20',
              gameFinished && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
            )}
          >
            {i < round || gameFinished ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </div>
        ))}
      </div>

      {/* City Dashboard */}
      <div className="grid w-full grid-cols-5 gap-2">
        {METRICS.map((m) => {
          const info = METRIC_INFO[m]
          const Icon = info.icon
          const val = metrics[m]
          return (
            <div key={m} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <Icon className={cn('mx-auto h-5 w-5', info.color)} />
              <p className="mt-1 text-[10px] font-bold text-white/50">{info.label}</p>
              <p className={cn('text-lg font-bold', val < 30 ? 'text-red-400' : val < 50 ? 'text-amber-400' : 'text-emerald-400')}>
                {val}
              </p>
              <div className="mt-1 h-1.5 rounded-full bg-white/10">
                <div
                  className={cn('h-1.5 rounded-full transition-all', val < 30 ? 'bg-red-500' : val < 50 ? 'bg-amber-500' : 'bg-emerald-500')}
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {gameFinished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8"
        >
          <Star className="h-12 w-12 text-amber-400" />
          <p className="text-xl font-bold text-white">City Complete!</p>
          {METRICS.some((m) => metrics[m] < 30) && (
            <p className="text-xs text-red-400">
              <AlertTriangle className="mr-1 inline h-3 w-3" />
              Some metrics fell below 30 — penalty applied
            </p>
          )}
          <div className="flex flex-col gap-2 w-full">
            {roundHistory.map((h, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs">
                <span className="text-white/60">Round {i + 1}: {h.policy}</span>
                {h.event && <span className="text-amber-400">{h.event}</span>}
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={round}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full flex-col gap-4"
          >
            {phase === 'choose' && (
              <>
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-violet-300">
                    <Building2 className="h-4 w-4" />
                    Round {round + 1}: Choose a Policy
                  </div>
                  <p className="mt-1 text-xs text-white/50">Select one policy to enact this year. Each affects multiple city metrics.</p>
                </div>

                <div className="flex flex-col gap-2">
                  {roundPolicies[round]?.map((policy) => (
                    <button
                      key={policy.id}
                      onClick={() => !isPaused && setSelectedPolicy(policy.id)}
                      className={cn(
                        'rounded-xl border p-4 text-left transition-all',
                        selectedPolicy === policy.id
                          ? 'border-violet-500/40 bg-violet-500/15'
                          : 'border-white/10 bg-white/5 hover:border-white/20',
                      )}
                    >
                      <p className="text-xs font-bold text-white/80">{policy.name}</p>
                      <p className="mt-1 text-[10px] text-white/40">{policy.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(policy.effects).map(([key, val]) => (
                          <span key={key} className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', val! > 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300')}>
                            {METRIC_INFO[key as Metric].label}: {val! > 0 ? '+' : ''}{val}
                          </span>
                        ))}
                        {config.hasDelayedEffects && policy.delayedEffects && (
                          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-300">
                            ⏳ Delayed effects next round
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleChoosePolicy}
                  disabled={!selectedPolicy}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all',
                    selectedPolicy
                      ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:bg-violet-500'
                      : 'bg-white/5 text-white/30 cursor-not-allowed',
                  )}
                >
                  <Zap className="h-4 w-4" />
                  Enact Policy
                </button>
              </>
            )}

            {phase === 'event' && currentEvent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5"
              >
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-300">{currentEvent.name}</p>
                  <p className="mt-1 text-xs text-white/60">{currentEvent.description}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {Object.entries(currentEvent.effects).map(([key, val]) => (
                    <span key={key} className={cn('rounded-full px-3 py-1 text-xs font-bold', val! > 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300')}>
                      {METRIC_INFO[key as Metric].label}: {val! > 0 ? '+' : ''}{val}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setPhase('apply')}
                  className="mx-auto flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-amber-500"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {phase === 'apply' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
              >
                <p className="text-sm font-bold text-emerald-300">Round {round + 1} Complete</p>
                <p className="text-xs text-white/50">
                  Policy enacted: {roundPolicies[round]?.find((p) => p.id === selectedPolicy)?.name}
                  {currentEvent && ` | Event: ${currentEvent.name}`}
                </p>
                <button
                  onClick={handleNextRound}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:bg-violet-500"
                >
                  {round + 1 >= config.rounds ? 'See Final Results' : 'Next Round'}
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
