'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  TrendingUp,
  Timer,
  ArrowRight,
  CheckCircle2,
  XCircle,
  BarChart3,
  Globe,
  Star,
  Eye,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface TrendCandidate {
  id: string
  name: string
  sector: string
  growthPercent: number
  mentions: number
  momentum: 'rising' | 'stable' | 'declining'
  isCorrect: boolean
  explanation: string
}

interface TrendRound {
  id: string
  headline: string
  context: string
  candidates: TrendCandidate[]
}

interface RoundResult {
  round: number
  selected: string
  correct: string
  wasCorrect: boolean
  timeSpent: number
}

interface TrendSpotterProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const ALL_ROUNDS: TrendRound[] = [
  {
    id: 'r1',
    headline: 'Q3 Tech Sector Analysis',
    context: 'Consumer tech spending is shifting. Which trend will dominate next quarter?',
    candidates: [
      { id: 'r1a', name: 'Foldable Smartphones', sector: 'Hardware', growthPercent: 12, mentions: 3400, momentum: 'stable', isCorrect: false, explanation: 'Growth has plateaued as novelty fades.' },
      { id: 'r1b', name: 'AI-Powered Wearables', sector: 'Wearable Tech', growthPercent: 67, mentions: 8900, momentum: 'rising', isCorrect: true, explanation: 'Explosive growth with health-AI integration driving mass adoption.' },
      { id: 'r1c', name: 'VR Fitness', sector: 'Gaming', growthPercent: 22, mentions: 2100, momentum: 'rising', isCorrect: false, explanation: 'Growing but still a niche market segment.' },
      { id: 'r1d', name: 'Desktop PCs', sector: 'Hardware', growthPercent: -3, mentions: 1200, momentum: 'declining', isCorrect: false, explanation: 'Declining market with no signs of reversal.' },
    ],
  },
  {
    id: 'r2',
    headline: 'Green Energy Investment Report',
    context: 'Venture capital in clean energy is at an all-time high. Which sector has breakout potential?',
    candidates: [
      { id: 'r2a', name: 'Solid-State Batteries', sector: 'Energy Storage', growthPercent: 89, mentions: 12300, momentum: 'rising', isCorrect: true, explanation: 'Manufacturing breakthroughs are making mass production viable for the first time.' },
      { id: 'r2b', name: 'Traditional Solar Panels', sector: 'Solar', growthPercent: 8, mentions: 4500, momentum: 'stable', isCorrect: false, explanation: 'Mature technology with slow incremental improvements.' },
      { id: 'r2c', name: 'Hydrogen Fuel Cells', sector: 'Hydrogen', growthPercent: 31, mentions: 6700, momentum: 'rising', isCorrect: false, explanation: 'Infrastructure challenges still limit mainstream adoption.' },
      { id: 'r2d', name: 'Coal Carbon Capture', sector: 'Carbon', growthPercent: -8, mentions: 800, momentum: 'declining', isCorrect: false, explanation: 'Falling out of favor as renewables become cheaper.' },
    ],
  },
  {
    id: 'r3',
    headline: 'Social Media & Content Trends',
    context: 'Creator economy data shows shifting platform preferences among Gen Z.',
    candidates: [
      { id: 'r3a', name: 'Long-Form Podcasts', sector: 'Audio', growthPercent: 15, mentions: 5600, momentum: 'stable', isCorrect: false, explanation: 'Popular but saturated market with slow growth.' },
      { id: 'r3b', name: 'AI-Generated Content', sector: 'AI', growthPercent: 45, mentions: 15200, momentum: 'rising', isCorrect: false, explanation: 'High mentions but regulatory backlash is forming.' },
      { id: 'r3c', name: 'Interactive Live Shopping', sector: 'E-commerce', growthPercent: 78, mentions: 9800, momentum: 'rising', isCorrect: true, explanation: 'Combining entertainment with commerce — massive adoption in Asia expanding globally.' },
      { id: 'r3d', name: 'NFT Art Galleries', sector: 'Web3', growthPercent: -22, mentions: 1400, momentum: 'declining', isCorrect: false, explanation: 'Market correction after the hype cycle.' },
    ],
  },
  {
    id: 'r4',
    headline: 'Healthcare Innovation Tracker',
    context: 'FDA fast-tracking several new technologies. Which one is the next big thing?',
    candidates: [
      { id: 'r4a', name: 'Telemedicine 2.0', sector: 'Digital Health', growthPercent: 18, mentions: 4300, momentum: 'stable', isCorrect: false, explanation: 'Post-pandemic normalization has slowed growth.' },
      { id: 'r4b', name: 'CRISPR Therapeutics', sector: 'Biotech', growthPercent: 54, mentions: 7600, momentum: 'rising', isCorrect: false, explanation: 'Promising but still years from widespread clinical use.' },
      { id: 'r4c', name: 'AI Diagnostic Imaging', sector: 'MedTech', growthPercent: 92, mentions: 11400, momentum: 'rising', isCorrect: true, explanation: 'FDA approvals accelerating, hospital adoption at inflection point.' },
      { id: 'r4d', name: 'Fitness Supplements', sector: 'Wellness', growthPercent: 5, mentions: 2200, momentum: 'stable', isCorrect: false, explanation: 'Flat growth in a commoditized market.' },
    ],
  },
  {
    id: 'r5',
    headline: 'Education Disruption Index',
    context: 'EdTech valuations are rebounding. Where is the real growth?',
    candidates: [
      { id: 'r5a', name: 'MOOCs (Online Courses)', sector: 'EdTech', growthPercent: 4, mentions: 3100, momentum: 'declining', isCorrect: false, explanation: 'Market saturation with low completion rates.' },
      { id: 'r5b', name: 'Adaptive AI Tutoring', sector: 'AI Education', growthPercent: 83, mentions: 9200, momentum: 'rising', isCorrect: true, explanation: 'Personalized learning powered by AI is transforming classrooms globally.' },
      { id: 'r5c', name: 'VR Classrooms', sector: 'Immersive', growthPercent: 35, mentions: 4800, momentum: 'rising', isCorrect: false, explanation: 'Hardware costs still prohibit mass adoption in schools.' },
      { id: 'r5d', name: 'Digital Textbooks', sector: 'Publishing', growthPercent: 2, mentions: 1800, momentum: 'stable', isCorrect: false, explanation: 'Barely growing — institutions are slow to move away from print.' },
    ],
  },
  {
    id: 'r6',
    headline: 'Future of Food Report',
    context: 'Consumer preferences are rapidly shifting. Which food-tech trend is poised for mainstream?',
    candidates: [
      { id: 'r6a', name: 'Lab-Grown Meat', sector: 'FoodTech', growthPercent: 71, mentions: 10500, momentum: 'rising', isCorrect: true, explanation: 'Cost parity achieved — regulatory approvals opening major markets.' },
      { id: 'r6b', name: 'Meal Kit Delivery', sector: 'Logistics', growthPercent: -5, mentions: 3200, momentum: 'declining', isCorrect: false, explanation: 'Post-pandemic decline as people return to restaurants.' },
      { id: 'r6c', name: 'Insect Protein Bars', sector: 'Alt-Protein', growthPercent: 28, mentions: 2100, momentum: 'rising', isCorrect: false, explanation: 'Cultural barriers in Western markets remain significant.' },
      { id: 'r6d', name: 'Organic Farming', sector: 'Agriculture', growthPercent: 8, mentions: 4700, momentum: 'stable', isCorrect: false, explanation: 'Steady but slow — limited by scale and price premiums.' },
    ],
  },
  {
    id: 'r7',
    headline: 'Urban Mobility Forecast',
    context: 'City planners worldwide are rethinking transport. What will reshape commuting?',
    candidates: [
      { id: 'r7a', name: 'Electric Scooter Sharing', sector: 'Micromobility', growthPercent: 10, mentions: 2800, momentum: 'stable', isCorrect: false, explanation: 'Market consolidation underway — growth stalling.' },
      { id: 'r7b', name: 'Autonomous Ride-Hailing', sector: 'Autonomous', growthPercent: 64, mentions: 8700, momentum: 'rising', isCorrect: true, explanation: 'Successful pilot programs in 20+ cities driving rapid expansion.' },
      { id: 'r7c', name: 'Hyperloop Transit', sector: 'Infrastructure', growthPercent: 15, mentions: 3500, momentum: 'stable', isCorrect: false, explanation: 'Engineering challenges keep pushing timelines further.' },
      { id: 'r7d', name: 'Bike Lane Expansion', sector: 'Urban Planning', growthPercent: 12, mentions: 1900, momentum: 'rising', isCorrect: false, explanation: 'Positive but incremental — not a disruptive shift.' },
    ],
  },
  {
    id: 'r8',
    headline: 'Cybersecurity Threat Landscape',
    context: 'With cyber attacks up 300%, which defense technology will see explosive adoption?',
    candidates: [
      { id: 'r8a', name: 'Password Managers', sector: 'Security', growthPercent: 6, mentions: 2300, momentum: 'stable', isCorrect: false, explanation: 'Commoditized market with minimal differentiation.' },
      { id: 'r8b', name: 'Zero-Trust Architecture', sector: 'Enterprise', growthPercent: 76, mentions: 11800, momentum: 'rising', isCorrect: true, explanation: 'Government mandates and enterprise adoption creating unstoppable momentum.' },
      { id: 'r8c', name: 'Blockchain Identity', sector: 'Web3', growthPercent: 25, mentions: 3400, momentum: 'rising', isCorrect: false, explanation: 'Interesting but fragmented standards slow adoption.' },
      { id: 'r8d', name: 'Traditional Firewalls', sector: 'Legacy', growthPercent: -12, mentions: 900, momentum: 'declining', isCorrect: false, explanation: 'Being replaced by cloud-native solutions.' },
    ],
  },
  {
    id: 'r9',
    headline: 'Space Economy Briefing',
    context: 'Commercial space is booming. Which segment is ready for its breakout moment?',
    candidates: [
      { id: 'r9a', name: 'Space Tourism', sector: 'Tourism', growthPercent: 20, mentions: 5600, momentum: 'stable', isCorrect: false, explanation: 'Exclusive to ultra-wealthy — limited addressable market.' },
      { id: 'r9b', name: 'Satellite Internet', sector: 'Telecom', growthPercent: 85, mentions: 13200, momentum: 'rising', isCorrect: true, explanation: 'Connecting billions in underserved regions — massive government contracts incoming.' },
      { id: 'r9c', name: 'Asteroid Mining', sector: 'Mining', growthPercent: 8, mentions: 1700, momentum: 'stable', isCorrect: false, explanation: 'Decades away from commercial viability.' },
      { id: 'r9d', name: 'Space Debris Cleanup', sector: 'Services', growthPercent: 32, mentions: 3900, momentum: 'rising', isCorrect: false, explanation: 'Critical need but unclear revenue model.' },
    ],
  },
  {
    id: 'r10',
    headline: 'Retail & Commerce Evolution',
    context: 'Post-pandemic retail is transforming. Which model will redefine shopping?',
    candidates: [
      { id: 'r10a', name: 'Cashierless Stores', sector: 'Retail Tech', growthPercent: 38, mentions: 4800, momentum: 'rising', isCorrect: false, explanation: 'Growing but high implementation costs limit spread.' },
      { id: 'r10b', name: 'Social Commerce', sector: 'E-commerce', growthPercent: 72, mentions: 10900, momentum: 'rising', isCorrect: true, explanation: 'Gen Z spending directly through social media — bypassing traditional e-commerce.' },
      { id: 'r10c', name: 'Pop-Up Experiences', sector: 'Experiential', growthPercent: 15, mentions: 2600, momentum: 'stable', isCorrect: false, explanation: 'Niche strategy, not a systemic shift.' },
      { id: 'r10d', name: 'Subscription Boxes', sector: 'DTC', growthPercent: -8, mentions: 1500, momentum: 'declining', isCorrect: false, explanation: 'Subscriber fatigue driving widespread cancellations.' },
    ],
  },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { rounds: 3, timePerRound: 30, showMomentum: true, showMentions: true, showGrowth: true, maxScore: 300 }
    case 'medium':
      return { rounds: 5, timePerRound: 20, showMomentum: true, showMentions: true, showGrowth: true, maxScore: 500 }
    case 'hard':
      return { rounds: 7, timePerRound: 15, showMomentum: true, showMentions: false, showGrowth: true, maxScore: 700 }
    case 'extreme':
      return { rounds: 10, timePerRound: 10, showMomentum: false, showMentions: false, showGrowth: true, maxScore: 1000 }
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

// ─── Helpers ──────────────────────────────────────────────────

function getMomentumColor(m: 'rising' | 'stable' | 'declining') {
  switch (m) {
    case 'rising': return 'text-emerald-400'
    case 'stable': return 'text-amber-400'
    case 'declining': return 'text-red-400'
  }
}

function getMomentumLabel(m: 'rising' | 'stable' | 'declining') {
  switch (m) {
    case 'rising': return '↑ Rising'
    case 'stable': return '→ Stable'
    case 'declining': return '↓ Declining'
  }
}

function formatMentions(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

// ─── Component ────────────────────────────────────────────────

export default function TrendSpotter({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: TrendSpotterProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])

  const gameRounds = useMemo(() => {
    const shuffled = shuffle(ALL_ROUNDS)
    return shuffled.slice(0, config.rounds)
  }, [config.rounds])

  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'finished'>('playing')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(config.timePerRound)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<RoundResult[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const roundStartRef = useRef(Date.now())

  // Timer logic
  useEffect(() => {
    if (phase !== 'playing' || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    roundStartRef.current = Date.now()
    setTimeLeft(config.timePerRound)

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, phase, isPaused])

  const handleTimeout = useCallback(() => {
    if (phase !== 'playing') return
    const currentRound = gameRounds[round]
    const correct = currentRound.candidates.find((c) => c.isCorrect)!

    setResults((prev) => [...prev, {
      round,
      selected: 'timeout',
      correct: correct.id,
      wasCorrect: false,
      timeSpent: config.timePerRound,
    }])
    setPhase('feedback')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, phase, gameRounds, config.timePerRound])

  const handleSelect = useCallback((candidateId: string) => {
    if (phase !== 'playing' || isPaused) return
    if (timerRef.current) clearInterval(timerRef.current)

    setSelectedId(candidateId)
    const currentRound = gameRounds[round]
    const selected = currentRound.candidates.find((c) => c.id === candidateId)!
    const correct = currentRound.candidates.find((c) => c.isCorrect)!
    const timeSpent = Math.round((Date.now() - roundStartRef.current) / 1000)
    const wasCorrect = selected.isCorrect

    const roundScore = wasCorrect ? 100 : 0
    const newScore = score + roundScore
    setScore(newScore)
    onScoreUpdate(newScore, config.maxScore)

    setResults((prev) => [...prev, {
      round,
      selected: candidateId,
      correct: correct.id,
      wasCorrect,
      timeSpent,
    }])
    setPhase('feedback')
  }, [phase, isPaused, gameRounds, round, score, config.maxScore, onScoreUpdate])

  const handleNextRound = useCallback(() => {
    if (round + 1 >= config.rounds) {
      setPhase('finished')
      onGameOver(score, config.maxScore)
      return
    }
    setRound((r) => r + 1)
    setSelectedId(null)
    setPhase('playing')
  }, [round, config.rounds, config.maxScore, score, onGameOver])

  const currentRound = gameRounds[round]
  const correctCount = results.filter((r) => r.wasCorrect).length

  // ─── Finished Screen ─────────────────────────────────────────

  if (phase === 'finished') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500"
        >
          <TrendingUp className="h-10 w-10 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white">Analysis Complete!</h2>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-bold text-purple-400">{score}</p>
            <p className="text-xs text-gray-400">Total Score</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-bold text-cyan-400">{correctCount}/{config.rounds}</p>
            <p className="text-xs text-gray-400">Correct</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-bold text-amber-400">{Math.round((correctCount / config.rounds) * 100)}%</p>
            <p className="text-xs text-gray-400">Accuracy</p>
          </div>
        </div>

        <div className="w-full max-w-md space-y-2">
          <h3 className="text-sm font-semibold text-gray-300">Round Results</h3>
          {results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={cn(
                'flex items-center justify-between rounded-lg border p-3 text-sm',
                r.wasCorrect
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-red-500/30 bg-red-500/10 text-red-400'
              )}
            >
              <span>Round {i + 1}</span>
              <span className="flex items-center gap-1">
                {r.wasCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {r.wasCorrect ? 'Correct' : r.selected === 'timeout' ? 'Timed Out' : 'Wrong'}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  // ─── Main Game Screen ─────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          <span className="text-sm font-semibold text-gray-300">
            Round {round + 1}/{config.rounds}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Star className="h-4 w-4 text-amber-400" />
            <span className="font-mono text-white">{score}</span>
          </div>

          <div className={cn(
            'flex items-center gap-1 rounded-lg px-3 py-1 text-sm font-mono',
            timeLeft <= 5 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/10 text-white'
          )}>
            <Timer className="h-4 w-4" />
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${((round + (phase === 'feedback' ? 1 : 0)) / config.rounds) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {phase === 'playing' && (
          <motion.div
            key={`round-${round}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-4"
          >
            {/* Round Headline */}
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-bold text-purple-300">{currentRound.headline}</h3>
              </div>
              <p className="text-sm text-gray-400">{currentRound.context}</p>
              <p className="mt-2 text-xs text-cyan-400 flex items-center gap-1">
                <Eye className="h-3 w-3" /> Select the trend most likely to go mainstream
              </p>
            </div>

            {/* Trend Candidates */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {currentRound.candidates.map((candidate, i) => (
                <motion.button
                  key={candidate.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleSelect(candidate.id)}
                  className={cn(
                    'group relative flex flex-col gap-2 rounded-xl border p-4 text-left transition-all',
                    'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/10'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {candidate.name}
                    </h4>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-400">
                      {candidate.sector}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {config.showGrowth && (
                      <div className="flex items-center gap-1 text-xs">
                        <TrendingUp className="h-3 w-3 text-cyan-400" />
                        <span className={cn(
                          'font-mono',
                          candidate.growthPercent > 50 ? 'text-emerald-400'
                            : candidate.growthPercent > 0 ? 'text-amber-400'
                            : 'text-red-400'
                        )}>
                          {candidate.growthPercent > 0 ? '+' : ''}{candidate.growthPercent}%
                        </span>
                      </div>
                    )}

                    {config.showMentions && (
                      <div className="flex items-center gap-1 text-xs">
                        <Globe className="h-3 w-3 text-blue-400" />
                        <span className="text-gray-300">{formatMentions(candidate.mentions)} mentions</span>
                      </div>
                    )}

                    {config.showMomentum && (
                      <div className={cn('text-xs font-medium', getMomentumColor(candidate.momentum))}>
                        {getMomentumLabel(candidate.momentum)}
                      </div>
                    )}
                  </div>

                  {/* Growth bar */}
                  <div className="h-1 w-full rounded-full bg-white/10">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        candidate.growthPercent > 50 ? 'bg-emerald-500'
                          : candidate.growthPercent > 20 ? 'bg-cyan-500'
                          : candidate.growthPercent > 0 ? 'bg-amber-500'
                          : 'bg-red-500'
                      )}
                      style={{ width: `${Math.max(2, Math.min(100, candidate.growthPercent))}%` }}
                    />
                  </div>

                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-purple-500/30 transition-colors" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'feedback' && (
          <motion.div
            key={`feedback-${round}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-4"
          >
            {/* Result Banner */}
            <div className={cn(
              'rounded-xl border p-4 text-center',
              results[results.length - 1]?.wasCorrect
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : 'border-red-500/30 bg-red-500/10'
            )}>
              <div className="flex items-center justify-center gap-2">
                {results[results.length - 1]?.wasCorrect ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    <span className="text-lg font-bold text-emerald-400">Excellent Analysis!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-400" />
                    <span className="text-lg font-bold text-red-400">
                      {results[results.length - 1]?.selected === 'timeout' ? 'Time\'s Up!' : 'Not Quite Right'}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-400">+{results[results.length - 1]?.wasCorrect ? 100 : 0} points</p>
            </div>

            {/* Candidate breakdown */}
            <div className="space-y-2">
              {currentRound.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={cn(
                    'rounded-lg border p-3',
                    candidate.isCorrect
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : candidate.id === selectedId
                      ? 'border-red-500/30 bg-red-500/10'
                      : 'border-white/5 bg-white/5'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {candidate.isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      {candidate.id === selectedId && !candidate.isCorrect && <XCircle className="h-4 w-4 text-red-400" />}
                      <span className={cn(
                        'text-sm font-medium',
                        candidate.isCorrect ? 'text-emerald-400' : candidate.id === selectedId ? 'text-red-400' : 'text-gray-400'
                      )}>
                        {candidate.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">+{candidate.growthPercent}%</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{candidate.explanation}</p>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNextRound}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/25"
            >
              {round + 1 >= config.rounds ? 'See Results' : 'Next Round'}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
