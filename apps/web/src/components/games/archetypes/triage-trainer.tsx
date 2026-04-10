'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  Star,
  Timer,
  AlertTriangle,
  GripVertical,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type Severity = 'critical' | 'urgent' | 'moderate' | 'minor'

interface TriageCase {
  id: string
  name: string
  age: number
  description: string
  symptoms: string[]
  severity: Severity
  correctOrder: number
  category: 'medical' | 'social' | 'counselor'
}

interface RoundData {
  cases: TriageCase[]
}

interface TriageTrainerProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<Severity, { color: string; label: string; bg: string }> = {
  critical: { color: 'text-red-400', label: 'Critical', bg: 'bg-red-500/10 border-red-500/30' },
  urgent: { color: 'text-orange-400', label: 'Urgent', bg: 'bg-orange-500/10 border-orange-500/30' },
  moderate: { color: 'text-yellow-400', label: 'Moderate', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  minor: { color: 'text-green-400', label: 'Minor', bg: 'bg-green-500/10 border-green-500/30' },
}

const ALL_CASES: TriageCase[] = [
  // Medical
  { id: 'mc1', name: 'Patient A', age: 45, description: 'Collapsed in the waiting room, not breathing.', symptoms: ['No pulse', 'Unconscious', 'Blue lips'], severity: 'critical', correctOrder: 1, category: 'medical' },
  { id: 'mc2', name: 'Patient B', age: 30, description: 'Severe allergic reaction after eating peanuts.', symptoms: ['Swelling throat', 'Difficulty breathing', 'Hives'], severity: 'critical', correctOrder: 1, category: 'medical' },
  { id: 'mc3', name: 'Patient C', age: 12, description: 'Fell off bicycle and has a deep gash on leg.', symptoms: ['Heavy bleeding', 'Visible bone', 'Screaming in pain'], severity: 'urgent', correctOrder: 2, category: 'medical' },
  { id: 'mc4', name: 'Patient D', age: 67, description: 'Chest tightness and pain radiating to left arm.', symptoms: ['Chest pain', 'Sweating', 'Nausea'], severity: 'critical', correctOrder: 1, category: 'medical' },
  { id: 'mc5', name: 'Patient E', age: 22, description: 'Twisted ankle during a soccer game.', symptoms: ['Swollen ankle', 'Can bear some weight', 'Bruising'], severity: 'minor', correctOrder: 4, category: 'medical' },
  { id: 'mc6', name: 'Patient F', age: 8, description: 'High fever for 3 days, lethargic.', symptoms: ['39.5°C fever', 'Drowsy', 'Not eating'], severity: 'urgent', correctOrder: 2, category: 'medical' },
  { id: 'mc7', name: 'Patient G', age: 55, description: 'Cut finger while cooking; bleeding controlled.', symptoms: ['Small laceration', 'Bleeding stopped', 'Pain'], severity: 'minor', correctOrder: 4, category: 'medical' },
  // Social work
  { id: 'sw1', name: 'Case: Maya', age: 7, description: 'Found wandering alone at night, appears neglected.', symptoms: ['Dirty clothes', 'Hungry', 'No parent in sight'], severity: 'critical', correctOrder: 1, category: 'social' },
  { id: 'sw2', name: 'Case: Family B', age: 0, description: 'Family reported for suspected domestic violence.', symptoms: ['Bruises on child', 'Parent aggressive at door', 'Child withdrawn'], severity: 'critical', correctOrder: 1, category: 'social' },
  { id: 'sw3', name: 'Case: Teen C', age: 16, description: 'Runaway teen found sleeping in a park.', symptoms: ['No belongings', 'Refuses to go home', 'Signs of distress'], severity: 'urgent', correctOrder: 2, category: 'social' },
  { id: 'sw4', name: 'Case: Elder D', age: 78, description: 'Elderly person requesting help with utilities paperwork.', symptoms: ['Confused by forms', 'Otherwise healthy', 'Has housing'], severity: 'minor', correctOrder: 4, category: 'social' },
  { id: 'sw5', name: 'Case: Parent E', age: 34, description: 'Single parent struggling to afford groceries.', symptoms: ['Employed part-time', 'Kids fed but parent skipping meals', 'Asking for food bank referral'], severity: 'moderate', correctOrder: 3, category: 'social' },
  // School counselor
  { id: 'sc1', name: 'Student: Ali', age: 14, description: 'Expressed thoughts of self-harm in an essay.', symptoms: ['Wrote about wanting to disappear', 'Grades dropping', 'Isolating'], severity: 'critical', correctOrder: 1, category: 'counselor' },
  { id: 'sc2', name: 'Student: Beth', age: 16, description: 'Reports being cyberbullied, afraid to come to school.', symptoms: ['Crying in office', 'Screenshots of threats', 'Missed 5 days'], severity: 'urgent', correctOrder: 2, category: 'counselor' },
  { id: 'sc3', name: 'Student: Carlos', age: 11, description: 'Wants to discuss college options for future planning.', symptoms: ['Good grades', 'Interested in STEM', 'No urgency'], severity: 'minor', correctOrder: 4, category: 'counselor' },
  { id: 'sc4', name: 'Student: Dana', age: 15, description: 'Caught vaping in bathroom, first offense.', symptoms: ['Apologetic', 'No substance abuse history', 'Needs conversation'], severity: 'moderate', correctOrder: 3, category: 'counselor' },
  { id: 'sc5', name: 'Student: Eli', age: 13, description: 'Parents divorcing, acting out in class.', symptoms: ['Disruptive behavior', 'Angry outbursts', 'Previously well-behaved'], severity: 'urgent', correctOrder: 2, category: 'counselor' },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { casesPerRound: 4, rounds: 3, timeLimit: 45 }
    case 'medium':
      return { casesPerRound: 5, rounds: 3, timeLimit: 30 }
    case 'hard':
      return { casesPerRound: 5, rounds: 3, timeLimit: 20 }
    case 'extreme':
      return { casesPerRound: 6, rounds: 3, timeLimit: 15 }
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

function buildRounds(config: ReturnType<typeof getConfig>): RoundData[] {
  const categories: Array<'medical' | 'social' | 'counselor'> = ['medical', 'social', 'counselor']
  return categories.map((cat) => {
    const pool = ALL_CASES.filter((c) => c.category === cat)
    const selected = shuffle(pool).slice(0, config.casesPerRound)
    // Assign correct order by severity
    const sorted = [...selected].sort((a, b) => {
      const order: Record<Severity, number> = { critical: 0, urgent: 1, moderate: 2, minor: 3 }
      return order[a.severity] - order[b.severity]
    })
    sorted.forEach((c, i) => { c.correctOrder = i + 1 })
    return { cases: shuffle(selected) }
  })
}

// ─── Component ────────────────────────────────────────────────

export default function TriageTrainer({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: TriageTrainerProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const rounds = useMemo(() => buildRounds(config), [config])

  const [roundIndex, setRoundIndex] = useState(0)
  const [order, setOrder] = useState<string[]>(() => rounds[0].cases.map((c) => c.id))
  const [timeLeft, setTimeLeft] = useState(config.timeLimit)
  const [phase, setPhase] = useState<'sort' | 'result'>('sort')
  const [roundScores, setRoundScores] = useState<number[]>([])
  const [finished, setFinished] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentRound = rounds[roundIndex]
  const maxScorePerRound = 100
  const maxScore = rounds.length * maxScorePerRound

  // Timer
  useEffect(() => {
    if (phase !== 'sort' || isPaused || finished) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, isPaused, finished, roundIndex])

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && phase === 'sort') {
      handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  const handleSubmit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)

    // Calculate score: weighted by position importance
    const cases = currentRound.cases
    const sorted = [...cases].sort((a, b) => {
      const order_: Record<Severity, number> = { critical: 0, urgent: 1, moderate: 2, minor: 3 }
      return order_[a.severity] - order_[b.severity]
    })
    const correctIds = sorted.map((c) => c.id)

    let score = 0
    const total = order.length
    order.forEach((id, idx) => {
      const correctIdx = correctIds.indexOf(id)
      const distance = Math.abs(idx - correctIdx)
      // Weight: first positions worth more
      const weight = total - idx
      if (distance === 0) score += weight * 2
      else if (distance === 1) score += weight
    })

    const maxWeighted = Array.from({ length: total }, (_, i) => (total - i) * 2).reduce((a, b) => a + b, 0)
    const roundScore = Math.round((score / maxWeighted) * maxScorePerRound)

    const newScores = [...roundScores, roundScore]
    setRoundScores(newScores)
    setPhase('result')

    const totalScore = newScores.reduce((a, b) => a + b, 0)
    onScoreUpdate(totalScore, maxScore)
  }, [currentRound, order, roundScores, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (roundIndex + 1 >= rounds.length) {
      setFinished(true)
      const final = roundScores.reduce((a, b) => a + b, 0)
      onGameOver(final, maxScore)
    } else {
      const nextIdx = roundIndex + 1
      setRoundIndex(nextIdx)
      setOrder(rounds[nextIdx].cases.map((c) => c.id))
      setTimeLeft(config.timeLimit)
      setPhase('sort')
    }
  }, [roundIndex, rounds, roundScores, maxScore, config.timeLimit, onGameOver])

  const categoryLabel = ['Medical ER', 'Social Work', 'School Counselor'][roundIndex] ?? 'Triage'
  const timerPercent = (timeLeft / config.timeLimit) * 100

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
      {/* Round indicators */}
      <div className="flex items-center gap-2">
        {rounds.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < roundIndex && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === roundIndex && !finished && 'border-red-500/50 bg-red-500/15 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]',
              i > roundIndex && 'border-white/10 bg-white/5 text-white/20',
            )}
          >
            {i < roundScores.length ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </div>
        ))}
      </div>

      {finished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8"
        >
          <Star className="h-12 w-12 text-amber-400" />
          <p className="text-xl font-bold text-white">Triage Complete!</p>
          <p className="text-sm text-white/60">
            Total: {roundScores.reduce((a, b) => a + b, 0)} / {maxScore}
          </p>
          {roundScores.map((s, i) => (
            <div key={i} className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-xs text-white/60">Round {i + 1}: {['Medical ER', 'Social Work', 'School Counselor'][i]}</span>
              <span className="font-bold text-amber-400 text-xs">{s} / {maxScorePerRound}</span>
            </div>
          ))}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={roundIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full flex-col gap-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-red-400" />
                <span className="text-sm font-bold text-red-300">Round {roundIndex + 1}: {categoryLabel}</span>
              </div>
              {phase === 'sort' && (
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-white/40" />
                  <div className="relative h-2 w-24 rounded-full bg-white/10">
                    <motion.div
                      className={cn(
                        'absolute left-0 top-0 h-2 rounded-full',
                        timerPercent > 50 ? 'bg-emerald-500' : timerPercent > 25 ? 'bg-yellow-500' : 'bg-red-500',
                      )}
                      animate={{ width: `${timerPercent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className={cn('text-xs font-bold', timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white/60')}>
                    {timeLeft}s
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-white/40">
              <AlertTriangle className="mr-1 inline h-3 w-3" />
              Drag cases to reorder — most urgent first!
            </p>

            {phase === 'sort' && (
              <Reorder.Group axis="y" values={order} onReorder={setOrder} className="flex flex-col gap-2">
                {order.map((id, idx) => {
                  const c = currentRound.cases.find((x) => x.id === id)!
                  return (
                    <Reorder.Item
                      key={id}
                      value={id}
                      className="cursor-grab rounded-xl border border-white/10 bg-white/5 p-4 active:cursor-grabbing"
                      whileDrag={{ scale: 1.02, boxShadow: '0 0 20px rgba(139,92,246,0.2)' }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 pt-1">
                          <GripVertical className="h-4 w-4 text-white/20" />
                          <span className="text-xs font-bold text-violet-400">#{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white/80">{c.name}</span>
                            <span className="text-xs text-white/30">Age {c.age}</span>
                          </div>
                          <p className="mt-1 text-xs text-white/60">{c.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {c.symptoms.map((s) => (
                              <span key={s} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Reorder.Item>
                  )
                })}
              </Reorder.Group>
            )}

            {phase === 'sort' && (
              <button
                onClick={handleSubmit}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all hover:bg-red-500"
              >
                <Stethoscope className="h-4 w-4" />
                Submit Triage Order
              </button>
            )}

            {phase === 'result' && roundScores.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-300">Round Scored!</span>
                  <span className="text-lg font-bold text-amber-400">{roundScores[roundScores.length - 1]} / {maxScorePerRound}</span>
                </div>

                {/* Show correct order */}
                <div className="flex flex-col gap-2">
                  {(() => {
                    const sorted = [...currentRound.cases].sort((a, b) => {
                      const o: Record<Severity, number> = { critical: 0, urgent: 1, moderate: 2, minor: 3 }
                      return o[a.severity] - o[b.severity]
                    })
                    return sorted.map((c, i) => {
                      const playerIdx = order.indexOf(c.id)
                      const isCorrect = playerIdx === i
                      return (
                        <div key={c.id} className={cn('flex items-center gap-3 rounded-lg border p-3 text-xs', SEVERITY_CONFIG[c.severity].bg)}>
                          <span className={cn('font-bold', isCorrect ? 'text-emerald-400' : 'text-red-400')}>
                            {isCorrect ? '✓' : `✗ You: #${playerIdx + 1}`}
                          </span>
                          <span className="font-bold text-white/60">#{i + 1}</span>
                          <span className={cn('font-bold', SEVERITY_CONFIG[c.severity].color)}>[{SEVERITY_CONFIG[c.severity].label}]</span>
                          <span className="text-white/60">{c.name}: {c.description.slice(0, 60)}…</span>
                        </div>
                      )
                    })
                  })()}
                </div>

                <button
                  onClick={handleNext}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all hover:bg-red-500"
                >
                  {roundIndex + 1 >= rounds.length ? 'Finish' : 'Next Round'}
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
