'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  CalendarCheck,
  CheckCircle2,
  Star,
  TrendingUp,
  AlertTriangle,
  Hash,
  FlaskConical,
  PenTool,
  Palette,
  PersonStanding,
  Target,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type Subject = 'Math' | 'Science' | 'Language' | 'Art' | 'PE'
type TimeSlot = 'morning' | 'afternoon' | 'evening'
type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

interface StudentProfile {
  id: string
  name: string
  icon: LucideIcon
  strengths: Subject[]
  weaknesses: Subject[]
  availableSlots: Partial<Record<Day, TimeSlot[]>>
  goal: string
  maxSubjectsPerDay: number
}

interface StudyPlanDesignerProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIME_SLOTS: TimeSlot[] = ['morning', 'afternoon', 'evening']
const SUBJECTS: Subject[] = ['Math', 'Science', 'Language', 'Art', 'PE']

const SUBJECT_INFO: Record<Subject, { icon: LucideIcon; color: string }> = {
  Math: { icon: Hash, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  Science: { icon: FlaskConical, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  Language: { icon: PenTool, color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  Art: { icon: Palette, color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  PE: { icon: PersonStanding, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
}

const SLOT_LABELS: Record<TimeSlot, string> = {
  morning: 'AM',
  afternoon: 'PM',
  evening: 'Eve',
}

const ALL_FULL_SLOTS: Record<Day, TimeSlot[]> = {
  Mon: ['morning', 'afternoon', 'evening'],
  Tue: ['morning', 'afternoon', 'evening'],
  Wed: ['morning', 'afternoon', 'evening'],
  Thu: ['morning', 'afternoon', 'evening'],
  Fri: ['morning', 'afternoon', 'evening'],
  Sat: ['morning', 'afternoon', 'evening'],
  Sun: ['morning', 'afternoon', 'evening'],
}

const ALL_PROFILES: StudentProfile[] = [
  {
    id: 'p1', name: 'Alex Kim', icon: User,
    strengths: ['Science', 'PE'], weaknesses: ['Math'],
    availableSlots: ALL_FULL_SLOTS, goal: 'Improve math grade from C to B',
    maxSubjectsPerDay: 2,
  },
  {
    id: 'p2', name: 'Maya Patel', icon: User,
    strengths: ['Language', 'Art'], weaknesses: ['Science', 'Math'],
    availableSlots: { Mon: ['afternoon', 'evening'], Tue: ['morning', 'afternoon', 'evening'], Wed: ['afternoon', 'evening'], Thu: ['morning', 'afternoon', 'evening'], Fri: ['afternoon'], Sat: ['morning', 'afternoon', 'evening'], Sun: ['morning', 'afternoon'] },
    goal: 'Pass science and boost math skills',
    maxSubjectsPerDay: 2,
  },
  {
    id: 'p3', name: 'Leo Santos', icon: User,
    strengths: ['Math'], weaknesses: ['Language', 'Art', 'Science'],
    availableSlots: { Mon: ['morning', 'afternoon'], Tue: ['morning', 'afternoon'], Wed: ['morning', 'afternoon'], Thu: ['morning', 'afternoon', 'evening'], Fri: ['morning'], Sat: ['morning', 'afternoon', 'evening'], Sun: ['afternoon', 'evening'] },
    goal: 'Balance out all weak subjects before exams',
    maxSubjectsPerDay: 2,
  },
  {
    id: 'p4', name: 'Sara Chen', icon: User,
    strengths: ['Science', 'Math', 'Language'], weaknesses: ['PE'],
    availableSlots: ALL_FULL_SLOTS, goal: 'Maintain grades and improve fitness',
    maxSubjectsPerDay: 2,
  },
  {
    id: 'p5', name: 'David Okafor', icon: User,
    strengths: ['Art', 'PE'], weaknesses: ['Math', 'Language'],
    availableSlots: { Mon: ['afternoon', 'evening'], Tue: ['afternoon', 'evening'], Wed: ['afternoon', 'evening'], Thu: ['afternoon', 'evening'], Fri: ['afternoon', 'evening'], Sat: ['morning', 'afternoon'], Sun: ['morning', 'afternoon'] },
    goal: 'Catch up on math and language before finals',
    maxSubjectsPerDay: 2,
  },
  {
    id: 'p6', name: 'Rina Tanaka', icon: User,
    strengths: ['Language'], weaknesses: ['Science', 'Math'],
    availableSlots: { Mon: ['morning', 'evening'], Tue: ['morning', 'evening'], Wed: ['morning', 'evening'], Thu: ['morning', 'evening'], Fri: ['morning'], Sat: ['morning', 'afternoon', 'evening'], Sun: ['afternoon', 'evening'] },
    goal: 'Score above average in science and math',
    maxSubjectsPerDay: 2,
  },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { maxWeaknesses: 1, hasTimeConflict: false, pointsMax: 100 }
    case 'medium':
      return { maxWeaknesses: 2, hasTimeConflict: false, pointsMax: 150 }
    case 'hard':
    case 'extreme':
      return { maxWeaknesses: 3, hasTimeConflict: true, pointsMax: 200 }
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

export default function StudyPlanDesigner({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: StudyPlanDesignerProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const profile = useMemo(() => {
    const filtered = ALL_PROFILES.filter((p) => p.weaknesses.length <= config.maxWeaknesses)
    return shuffle(filtered)[0] || ALL_PROFILES[0]
  }, [config.maxWeaknesses])

  type SlotKey = `${Day}-${TimeSlot}`
  const [assignments, setAssignments] = useState<Record<SlotKey, Subject | null>>({} as Record<SlotKey, Subject | null>)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [phase, setPhase] = useState<'plan' | 'simulate' | 'result'>('plan')
  const [simulationResult, setSimulationResult] = useState<{
    weaknessImprovement: Record<Subject, number>
    strengthMaintenance: Record<Subject, number>
    overloadPenalty: number
    balanceBonus: number
    totalScore: number
  } | null>(null)

  const availableSlotKeys = useMemo(() => {
    const keys: SlotKey[] = []
    for (const day of DAYS) {
      const slots = profile.availableSlots[day] || []
      for (const slot of slots) {
        keys.push(`${day}-${slot}` as SlotKey)
      }
    }
    return keys
  }, [profile])

  const handleAssign = useCallback((day: Day, slot: TimeSlot) => {
    if (isPaused || phase !== 'plan' || !selectedSubject) return
    const key: SlotKey = `${day}-${slot}`
    if (!availableSlotKeys.includes(key)) return

    // Check max subjects per day
    const dayAssignments = new Set<Subject>()
    for (const s of TIME_SLOTS) {
      const k: SlotKey = `${day}-${s}`
      const existing = assignments[k]
      if (existing && k !== key) dayAssignments.add(existing)
    }
    dayAssignments.add(selectedSubject)
    if (dayAssignments.size > profile.maxSubjectsPerDay) return

    setAssignments((prev) => ({ ...prev, [key]: selectedSubject }))
  }, [isPaused, phase, selectedSubject, availableSlotKeys, assignments, profile.maxSubjectsPerDay])

  const handleClearSlot = useCallback((day: Day, slot: TimeSlot) => {
    if (isPaused || phase !== 'plan') return
    const key: SlotKey = `${day}-${slot}`
    setAssignments((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [isPaused, phase])

  const handleSimulate = useCallback(() => {
    // Count hours per subject
    const subjectHours: Record<Subject, number> = { Math: 0, Science: 0, Language: 0, Art: 0, PE: 0 }
    for (const [, sub] of Object.entries(assignments)) {
      if (sub) subjectHours[sub]++
    }

    // Calculate weakness improvement (weak subjects need 2× time)
    const weaknessImprovement: Record<Subject, number> = {} as Record<Subject, number>
    for (const weak of profile.weaknesses) {
      const hours = subjectHours[weak]
      const needed = 4 // Need at least 4 slots for meaningful improvement
      weaknessImprovement[weak] = Math.min(100, Math.round((hours / needed) * 100))
    }

    // Calculate strength maintenance
    const strengthMaintenance: Record<Subject, number> = {} as Record<Subject, number>
    for (const strong of profile.strengths) {
      const hours = subjectHours[strong]
      strengthMaintenance[strong] = hours >= 1 ? 100 : 50
    }

    // Overload penalty: check if any day has > maxSubjectsPerDay different subjects
    let overloadPenalty = 0
    for (const day of DAYS) {
      const daySubs = new Set<Subject>()
      for (const slot of TIME_SLOTS) {
        const k: SlotKey = `${day}-${slot}`
        const s = assignments[k]
        if (s) daySubs.add(s)
      }
      if (daySubs.size > profile.maxSubjectsPerDay) overloadPenalty += 10
    }

    // Balance bonus: all weaknesses have some time
    const allWeakCovered = profile.weaknesses.every((w) => subjectHours[w] >= 2)
    const balanceBonus = allWeakCovered ? 20 : 0

    // Total score
    const weakAvg = profile.weaknesses.length > 0
      ? Object.values(weaknessImprovement).reduce((a, b) => a + b, 0) / profile.weaknesses.length
      : 100
    const strongAvg = profile.strengths.length > 0
      ? Object.values(strengthMaintenance).reduce((a, b) => a + b, 0) / profile.strengths.length
      : 100

    const rawScore = (weakAvg * 0.6 + strongAvg * 0.2 + balanceBonus) - overloadPenalty
    const totalScore = Math.max(0, Math.min(config.pointsMax, Math.round(rawScore / 100 * config.pointsMax)))

    const result = { weaknessImprovement, strengthMaintenance, overloadPenalty, balanceBonus, totalScore }
    setSimulationResult(result)
    setPhase('simulate')
    onScoreUpdate(totalScore, config.pointsMax)
  }, [assignments, profile, config, onScoreUpdate])

  const handleFinish = useCallback(() => {
    if (!simulationResult) return
    setPhase('result')
    onGameOver(simulationResult.totalScore, config.pointsMax)
  }, [simulationResult, config, onGameOver])

  const assignedCount = Object.values(assignments).filter(Boolean).length

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-5">
      {/* Student Profile Card */}
      <div className="w-full rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex items-center gap-3">
          {(() => { const Icon = profile.icon; return <Icon className="h-7 w-7 text-amber-300" />; })()}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-amber-300" />
              <span className="text-sm font-bold text-amber-300">{profile.name}</span>
            </div>
            <p className="mt-1 text-xs text-white/60"><Target className="h-3 w-3 inline mr-1" />{profile.goal}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.strengths.map((s) => (
                <span key={s} className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300"><CheckCircle2 className="mr-0.5 inline h-3 w-3" />{s}</span>
              ))}
              {profile.weaknesses.map((w) => (
                <span key={w} className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] text-red-300"><AlertTriangle className="mr-0.5 inline h-3 w-3" />{w} (needs 2× time)</span>
              ))}
            </div>
          </div>
          <div className="text-right text-[10px] text-white/40">
            <p>Max {profile.maxSubjectsPerDay} subjects/day</p>
            <p>{assignedCount} slots filled</p>
          </div>
        </div>
      </div>

      {phase === 'plan' && (
        <>
          {/* Subject palette */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Select subject:</span>
            {SUBJECTS.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={cn(
                  'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all',
                  selectedSubject === sub
                    ? SUBJECT_INFO[sub].color + ' shadow-lg'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20',
                )}
              >
                {(() => { const Icon = SUBJECT_INFO[sub].icon; return <Icon className="h-3 w-3 inline" />; })()} {sub}
              </button>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-[#080b1f] p-3">
            <div className="min-w-[620px]">
              {/* Header */}
              <div className="mb-2 grid grid-cols-8 gap-1">
                <div className="p-1" />
                {DAYS.map((day) => (
                  <div key={day} className="p-1 text-center text-[10px] font-bold text-white/50">{day}</div>
                ))}
              </div>

              {/* Rows */}
              {TIME_SLOTS.map((slot) => (
                <div key={slot} className="mb-1 grid grid-cols-8 gap-1">
                  <div className="flex items-center p-1 text-[10px] text-white/40">{SLOT_LABELS[slot]}</div>
                  {DAYS.map((day) => {
                    const key: SlotKey = `${day}-${slot}`
                    const isAvailable = availableSlotKeys.includes(key)
                    const assigned = assignments[key]
                    return (
                      <button
                        key={key}
                        onClick={() => assigned ? handleClearSlot(day, slot) : handleAssign(day, slot)}
                        disabled={!isAvailable}
                        className={cn(
                          'flex h-12 items-center justify-center rounded-lg border text-xs transition-all',
                          !isAvailable && 'border-white/5 bg-white/2 text-white/10 cursor-not-allowed',
                          isAvailable && !assigned && 'border-white/10 bg-white/5 hover:border-white/20 cursor-pointer',
                          assigned && SUBJECT_INFO[assigned].color + ' border',
                        )}
                      >
                        {assigned ? (
                          <span className="text-[10px] font-bold">{(() => { const Icon = SUBJECT_INFO[assigned].icon; return <Icon className="h-3 w-3 inline" />; })()} {assigned}</span>
                        ) : isAvailable ? (
                          <span className="text-[10px] text-white/20">+</span>
                        ) : (
                          <span className="text-[10px] text-white/10">—</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-white/30">
            <AlertTriangle className="h-3 w-3" />
            Click a subject, then click an empty slot to assign. Click an assigned slot to clear.
          </div>

          <button
            onClick={handleSimulate}
            disabled={assignedCount < 3}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all',
              assignedCount >= 3
                ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:bg-amber-500'
                : 'bg-white/5 text-white/30 cursor-not-allowed',
            )}
          >
            <TrendingUp className="h-4 w-4" />
            Run 4-Week Simulation
          </button>
        </>
      )}

      {phase === 'simulate' && simulationResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full flex-col gap-4"
        >
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
              <TrendingUp className="h-4 w-4" />
              4-Week Simulation Results
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {/* Weakness improvement */}
              <div>
                <p className="text-xs font-bold text-white/50">Weakness Improvement</p>
                {Object.entries(simulationResult.weaknessImprovement).map(([sub, pct]) => (
                  <div key={sub} className="mt-1 flex items-center gap-2">
                    <span className="w-20 text-xs text-white/60">{(() => { const Icon = SUBJECT_INFO[sub as Subject].icon; return <Icon className="h-3 w-3 inline mr-1" />; })()} {sub}</span>
                    <div className="h-3 flex-1 rounded-full bg-white/10">
                      <div
                        className={cn('h-3 rounded-full transition-all', pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500')}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs text-white/50">{pct}%</span>
                  </div>
                ))}
              </div>

              {/* Strength maintenance */}
              <div>
                <p className="text-xs font-bold text-white/50">Strength Maintenance</p>
                {Object.entries(simulationResult.strengthMaintenance).map(([sub, pct]) => (
                  <div key={sub} className="mt-1 flex items-center gap-2">
                    <span className="w-20 text-xs text-white/60">{(() => { const Icon = SUBJECT_INFO[sub as Subject].icon; return <Icon className="h-3 w-3 inline mr-1" />; })()} {sub}</span>
                    <div className="h-3 flex-1 rounded-full bg-white/10">
                      <div
                        className={cn('h-3 rounded-full bg-cyan-500 transition-all')}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs text-white/50">{pct}%</span>
                  </div>
                ))}
              </div>

              {/* Bonuses / Penalties */}
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs">
                <span className="text-white/60">Balance Bonus:</span>
                <span className={cn(simulationResult.balanceBonus > 0 ? 'text-emerald-400' : 'text-white/30')}>
                  +{simulationResult.balanceBonus}
                </span>
              </div>
              {simulationResult.overloadPenalty > 0 && (
                <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs">
                  <span className="text-red-300">Overload Penalty:</span>
                  <span className="text-red-400">-{simulationResult.overloadPenalty}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <Star className="h-6 w-6 text-amber-400" />
            <span className="text-lg font-bold text-amber-300">{simulationResult.totalScore} / {config.pointsMax} pts</span>
          </div>

          <button
            onClick={handleFinish}
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-500"
          >
            <CheckCircle2 className="h-4 w-4" />
            Finish
          </button>
        </motion.div>
      )}

      {phase === 'result' && simulationResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8"
        >
          <Star className="h-12 w-12 text-amber-400" />
          <p className="text-xl font-bold text-white">Study Plan Complete!</p>
          <p className="text-sm text-white/60">
            {profile.name}&apos;s performance improved by {simulationResult.totalScore} points over 4 weeks
          </p>
        </motion.div>
      )}
    </div>
  )
}
