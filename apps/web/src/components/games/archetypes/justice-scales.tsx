'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Scale,
  ArrowRight,
  CheckCircle2,
  XCircle,
  GripVertical,
  Gavel,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface EvidenceCard {
  id: string
  text: string
  expectedSide: 'pro' | 'con'
  weight: number
}

interface Scenario {
  id: string
  title: string
  description: string
  evidence: EvidenceCard[]
  verdicts: { label: string; correct: boolean }[]
  difficulty: GameDifficulty[]
}

interface JusticeScalesProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Scenario Data ────────────────────────────────────────────

const ALL_SCENARIOS: Scenario[] = [
  {
    id: 's1',
    title: 'The Broken Fence',
    description: 'Farmer A claims Farmer B\'s cattle broke through the fence and destroyed crops worth $2,000. Farmer B says the fence was already in disrepair.',
    evidence: [
      { id: 'e1', text: 'Photos show fence was rotting before the incident', expectedSide: 'con', weight: 3 },
      { id: 'e2', text: 'Witnesses saw cattle in Farmer A\'s field', expectedSide: 'pro', weight: 2 },
      { id: 'e3', text: 'Farmer B admitted he hadn\'t checked on his cattle in days', expectedSide: 'pro', weight: 2 },
      { id: 'e4', text: 'The shared fence maintenance agreement was expired', expectedSide: 'con', weight: 2 },
    ],
    verdicts: [
      { label: 'Farmer B pays full $2,000', correct: false },
      { label: 'Both share costs equally', correct: true },
      { label: 'Farmer A bears all losses', correct: false },
    ],
    difficulty: ['easy', 'medium', 'hard'],
  },
  {
    id: 's2',
    title: 'The Noisy Neighbor',
    description: 'Resident Maria files a complaint that her neighbor\'s home business (a music studio) operates past 10 PM and disturbs her sleep.',
    evidence: [
      { id: 'e1', text: 'Sound meter readings show 65dB at Maria\'s bedroom wall after 10 PM', expectedSide: 'pro', weight: 3 },
      { id: 'e2', text: 'The studio has proper soundproofing installed', expectedSide: 'con', weight: 2 },
      { id: 'e3', text: 'City noise ordinance sets 55dB limit after 10 PM', expectedSide: 'pro', weight: 3 },
      { id: 'e4', text: 'The studio predates Maria\'s move-in by 2 years', expectedSide: 'con', weight: 1 },
    ],
    verdicts: [
      { label: 'Studio must close by 10 PM', correct: true },
      { label: 'No action needed', correct: false },
      { label: 'Maria should move out', correct: false },
    ],
    difficulty: ['easy', 'medium', 'hard'],
  },
  {
    id: 's3',
    title: 'The Missing Package',
    description: 'Online shopper Alex claims a $500 electronics package was never delivered. The delivery service says it was left at the door and signed for.',
    evidence: [
      { id: 'e1', text: 'Delivery photo shows package at a different door number', expectedSide: 'pro', weight: 3 },
      { id: 'e2', text: 'GPS data confirms driver was at the correct street', expectedSide: 'con', weight: 1 },
      { id: 'e3', text: 'The signature doesn\'t match Alex\'s handwriting', expectedSide: 'pro', weight: 3 },
      { id: 'e4', text: 'Alex has no prior history of false claims', expectedSide: 'pro', weight: 1 },
      { id: 'e5', text: 'A neighbor reports seeing a package at the wrong door', expectedSide: 'pro', weight: 2 },
    ],
    verdicts: [
      { label: 'Delivery company refunds Alex', correct: true },
      { label: 'Alex loses the claim', correct: false },
      { label: 'Split the cost 50/50', correct: false },
    ],
    difficulty: ['easy', 'medium', 'hard'],
  },
  {
    id: 's4',
    title: 'The School Exclusion',
    description: 'Student Jamie was suspended for 3 days for wearing a political T-shirt. Jamie\'s parents claim it violates free speech rights.',
    evidence: [
      { id: 'e1', text: 'School dress code prohibits "disruptive messaging"', expectedSide: 'con', weight: 2 },
      { id: 'e2', text: 'The T-shirt contained no threatening language', expectedSide: 'pro', weight: 2 },
      { id: 'e3', text: 'Other students wore band T-shirts without punishment', expectedSide: 'pro', weight: 3 },
      { id: 'e4', text: 'A teacher reported that it caused a classroom argument', expectedSide: 'con', weight: 2 },
      { id: 'e5', text: 'Student handbook was not updated for 5 years', expectedSide: 'pro', weight: 1 },
    ],
    verdicts: [
      { label: 'Suspension is valid', correct: false },
      { label: 'Reduce to 1-day and update policy', correct: true },
      { label: 'Full reversal, no punishment', correct: false },
    ],
    difficulty: ['medium', 'hard'],
  },
  {
    id: 's5',
    title: 'The Contaminated Well',
    description: 'A village discovers their well water is contaminated. A nearby factory denies responsibility, pointing to natural mineral deposits.',
    evidence: [
      { id: 'e1', text: 'Water tests show industrial chemicals not found naturally', expectedSide: 'pro', weight: 3 },
      { id: 'e2', text: 'Factory passed environmental inspection 6 months ago', expectedSide: 'con', weight: 2 },
      { id: 'e3', text: 'Satellite images show runoff channels toward the well', expectedSide: 'pro', weight: 3 },
      { id: 'e4', text: 'Geological survey confirms mineral deposits in the area', expectedSide: 'con', weight: 2 },
      { id: 'e5', text: 'Three factory workers report improper waste disposal', expectedSide: 'pro', weight: 3 },
      { id: 'e6', text: 'Contamination started after the factory expanded operations', expectedSide: 'pro', weight: 2 },
    ],
    verdicts: [
      { label: 'Factory pays full remediation costs', correct: true },
      { label: 'Natural causes, no liability', correct: false },
      { label: 'Joint government-factory investigation only', correct: false },
    ],
    difficulty: ['medium', 'hard'],
  },
  {
    id: 's6',
    title: 'The Inheritance Dispute',
    description: 'Three siblings dispute their late parent\'s estate. The eldest claims a handwritten note gives them the family home; the others say it\'s not a valid will.',
    evidence: [
      { id: 'e1', text: 'Handwriting experts confirm the note\'s authenticity', expectedSide: 'pro', weight: 2 },
      { id: 'e2', text: 'The note was not witnessed or notarized', expectedSide: 'con', weight: 3 },
      { id: 'e3', text: 'The eldest cared for the parent in their final years', expectedSide: 'pro', weight: 1 },
      { id: 'e4', text: 'A previous official will divided assets equally', expectedSide: 'con', weight: 3 },
      { id: 'e5', text: 'Parent told neighbors the eldest should get the house', expectedSide: 'pro', weight: 1 },
      { id: 'e6', text: 'The note was found only after the eldest searched the house alone', expectedSide: 'con', weight: 2 },
    ],
    verdicts: [
      { label: 'Eldest gets the home per the note', correct: false },
      { label: 'Follow the official will — equal split', correct: true },
      { label: 'Eldest gets 50%, others split the rest', correct: false },
    ],
    difficulty: ['hard'],
  },
  {
    id: 's7',
    title: 'The Data Breach',
    description: 'A social media company exposed 10,000 users\' data. They claim it was a sophisticated external hack; users claim negligence.',
    evidence: [
      { id: 'e1', text: 'Security audit from last year flagged outdated encryption', expectedSide: 'pro', weight: 3 },
      { id: 'e2', text: 'The hack exploited a zero-day vulnerability', expectedSide: 'con', weight: 2 },
      { id: 'e3', text: 'Company delayed notifying users for 3 weeks', expectedSide: 'pro', weight: 2 },
      { id: 'e4', text: 'Employee reused a password from a breached database', expectedSide: 'pro', weight: 3 },
      { id: 'e5', text: 'Industry peers also suffered similar attacks', expectedSide: 'con', weight: 1 },
      { id: 'e6', text: 'Company had no incident response plan', expectedSide: 'pro', weight: 2 },
    ],
    verdicts: [
      { label: 'Company is negligent — compensate users', correct: true },
      { label: 'Hack was unpreventable — no liability', correct: false },
      { label: 'Fine the company but no user compensation', correct: false },
    ],
    difficulty: ['medium', 'hard'],
  },
  {
    id: 's8',
    title: 'The Street Vendor License',
    description: 'A city revokes a street vendor\'s license for "blocking pedestrian traffic." The vendor says they followed all regulations and the real reason is pressure from nearby shops.',
    evidence: [
      { id: 'e1', text: 'Photos show the vendor kept within their designated area', expectedSide: 'pro', weight: 3 },
      { id: 'e2', text: 'Two shop owners filed formal complaints', expectedSide: 'con', weight: 1 },
      { id: 'e3', text: 'City inspector\'s report shows no violations', expectedSide: 'pro', weight: 3 },
      { id: 'e4', text: 'Other vendors in the area were not revoked', expectedSide: 'pro', weight: 2 },
      { id: 'e5', text: 'City council member owns one of the complaining shops', expectedSide: 'pro', weight: 3 },
    ],
    verdicts: [
      { label: 'Revocation is justified', correct: false },
      { label: 'Reinstate the license immediately', correct: true },
      { label: 'Temporary suspension pending review', correct: false },
    ],
    difficulty: ['easy', 'medium', 'hard'],
  },
]

// ─── Helpers ──────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getCaseCount(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 3
    case 'medium': return 4
    case 'hard': return 5
    case 'extreme': return 5
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

function selectScenarios(difficulty: GameDifficulty): Scenario[] {
  const available = ALL_SCENARIOS.filter((s) => s.difficulty.includes(difficulty))
  return shuffle(available).slice(0, getCaseCount(difficulty))
}

// ─── Component ────────────────────────────────────────────────

export default function JusticeScales({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: JusticeScalesProps) {
  const scenarios = useMemo(() => selectScenarios(difficulty), [difficulty])
  const multiplier = getMultiplier(difficulty)

  const [caseIndex, setCaseIndex] = useState(0)
  const [placements, setPlacements] = useState<Record<string, 'pro' | 'con'>>({})
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [phase, setPhase] = useState<'evidence' | 'verdict' | 'result'>('evidence')
  const [selectedVerdict, setSelectedVerdict] = useState<number | null>(null)
  const [caseScores, setCaseScores] = useState<number[]>([])
  const [gameFinished, setGameFinished] = useState(false)

  const scenario = scenarios[caseIndex]
  const maxScorePerCase = 10
  const maxScore = scenarios.length * maxScorePerCase * multiplier

  const allEvidencePlaced = scenario
    ? scenario.evidence.every((e) => placements[e.id] !== undefined)
    : false

  const proWeight = scenario
    ? scenario.evidence
        .filter((e) => placements[e.id] === 'pro')
        .reduce((sum, e) => sum + e.weight, 0)
    : 0
  const conWeight = scenario
    ? scenario.evidence
        .filter((e) => placements[e.id] === 'con')
        .reduce((sum, e) => sum + e.weight, 0)
    : 0
  const totalWeight = proWeight + conWeight || 1
  const tiltAngle = ((proWeight - conWeight) / Math.max(totalWeight, 1)) * 25

  const handleDragStart = useCallback(
    (id: string) => {
      if (isPaused || phase !== 'evidence') return
      setDraggedId(id)
    },
    [isPaused, phase],
  )

  const handleDrop = useCallback(
    (side: 'pro' | 'con') => {
      if (!draggedId || isPaused) return
      setPlacements((prev) => ({ ...prev, [draggedId]: side }))
      setDraggedId(null)
    },
    [draggedId, isPaused],
  )

  const handleSubmitEvidence = useCallback(() => {
    if (!allEvidencePlaced || isPaused) return
    setPhase('verdict')
  }, [allEvidencePlaced, isPaused])

  const handleSelectVerdict = useCallback(
    (idx: number) => {
      if (isPaused || phase !== 'verdict') return
      setSelectedVerdict(idx)
    },
    [isPaused, phase],
  )

  const handleSubmitVerdict = useCallback(() => {
    if (selectedVerdict === null || isPaused || !scenario) return

    // Score evidence placement
    let evidenceCorrect = 0
    for (const e of scenario.evidence) {
      if (placements[e.id] === e.expectedSide) evidenceCorrect++
    }
    const evidenceRatio = evidenceCorrect / scenario.evidence.length

    // Score verdict
    const verdictCorrect = scenario.verdicts[selectedVerdict]?.correct ? 1 : 0

    // Combined score: 60% evidence + 40% verdict
    const caseScore = Math.round((evidenceRatio * 6 + verdictCorrect * 4) * multiplier)

    const newScores = [...caseScores, caseScore]
    setCaseScores(newScores)
    setPhase('result')

    const totalScore = newScores.reduce((a, b) => a + b, 0)
    onScoreUpdate(totalScore, maxScore)
  }, [selectedVerdict, isPaused, scenario, placements, caseScores, multiplier, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (caseIndex + 1 >= scenarios.length) {
      setGameFinished(true)
      const finalScore = [...caseScores].reduce((a, b) => a + b, 0)
      onGameOver(finalScore, maxScore)
    } else {
      setCaseIndex((i) => i + 1)
      setPlacements({})
      setDraggedId(null)
      setPhase('evidence')
      setSelectedVerdict(null)
    }
  }, [caseIndex, scenarios.length, caseScores, maxScore, onGameOver])

  if (!scenario) return null

  const unplacedEvidence = scenario.evidence.filter((e) => !placements[e.id])
  const proEvidence = scenario.evidence.filter((e) => placements[e.id] === 'pro')
  const conEvidence = scenario.evidence.filter((e) => placements[e.id] === 'con')

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
      {/* Case indicator */}
      <div className="flex items-center gap-2">
        {scenarios.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < caseIndex && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === caseIndex && !gameFinished && 'border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
              i > caseIndex && 'border-white/10 bg-white/5 text-white/20',
              i === caseIndex && gameFinished && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
            )}
          >
            {i < caseScores.length ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </div>
        ))}
      </div>

      {!gameFinished && (
        <>
          {/* Scenario card */}
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-xl border border-violet-500/20 bg-violet-500/5 p-5"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-violet-300">
              <Gavel className="h-4 w-4" />
              Case #{caseIndex + 1}: {scenario.title}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{scenario.description}</p>
          </motion.div>

          {/* Animated Scale */}
          <div className="relative flex h-32 w-64 items-end justify-center">
            {/* Base */}
            <div className="absolute bottom-0 h-2 w-32 rounded-full bg-white/20" />
            {/* Pillar */}
            <div className="absolute bottom-2 h-20 w-1 bg-white/30" />
            {/* Beam */}
            <motion.div
              animate={{ rotate: tiltAngle }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
              className="absolute bottom-[5.5rem] flex h-1 w-56 origin-center items-center justify-between rounded-full bg-amber-400/60"
            >
              {/* Left pan (Pro) */}
              <div className="flex h-10 w-16 -translate-y-3 items-center justify-center rounded-b-lg border border-t-0 border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold text-emerald-400">
                PRO {proWeight}
              </div>
              {/* Right pan (Con) */}
              <div className="flex h-10 w-16 -translate-y-3 items-center justify-center rounded-b-lg border border-t-0 border-red-500/30 bg-red-500/10 text-[10px] font-bold text-red-400">
                CON {conWeight}
              </div>
            </motion.div>
            <Scale className="absolute bottom-8 h-6 w-6 text-amber-400/40" />
          </div>

          {phase === 'evidence' && (
            <>
              {/* Drop zones */}
              <div className="grid w-full grid-cols-2 gap-4">
                {/* Pro zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop('pro')}
                  className="min-h-[80px] rounded-xl border-2 border-dashed border-emerald-500/20 bg-emerald-500/5 p-3"
                >
                  <p className="mb-2 text-center text-xs font-bold text-emerald-400">⬆ PRO (Supports Claim)</p>
                  <div className="flex flex-col gap-1">
                    {proEvidence.map((e) => (
                      <div key={e.id} className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200">
                        {e.text}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Con zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop('con')}
                  className="min-h-[80px] rounded-xl border-2 border-dashed border-red-500/20 bg-red-500/5 p-3"
                >
                  <p className="mb-2 text-center text-xs font-bold text-red-400">⬇ CON (Against Claim)</p>
                  <div className="flex flex-col gap-1">
                    {conEvidence.map((e) => (
                      <div key={e.id} className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-200">
                        {e.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Unplaced evidence cards */}
              {unplacedEvidence.length > 0 && (
                <div className="flex w-full flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    Drag evidence to a side
                  </p>
                  {unplacedEvidence.map((e) => (
                    <motion.div
                      key={e.id}
                      draggable
                      onDragStart={() => handleDragStart(e.id)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex cursor-grab items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition-all hover:border-violet-500/30 hover:bg-violet-500/5 active:cursor-grabbing"
                    >
                      <GripVertical className="h-4 w-4 shrink-0 text-white/30" />
                      {e.text}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Submit evidence */}
              <button
                onClick={handleSubmitEvidence}
                disabled={!allEvidencePlaced}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold transition-all',
                  allEvidencePlaced
                    ? 'border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'cursor-not-allowed border-white/10 bg-white/5 text-white/25',
                )}
              >
                Proceed to Verdict
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}

          {phase === 'verdict' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full flex-col items-center gap-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Choose your verdict
              </p>
              <div className="flex w-full flex-col gap-3">
                {scenario.verdicts.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectVerdict(i)}
                    className={cn(
                      'rounded-xl border px-5 py-3 text-left text-sm font-medium transition-all',
                      selectedVerdict === i
                        ? 'border-violet-500/50 bg-violet-500/15 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-violet-500/20 hover:bg-violet-500/5',
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmitVerdict}
                disabled={selectedVerdict === null}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold transition-all',
                  selectedVerdict !== null
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                    : 'cursor-not-allowed border-white/10 bg-white/5 text-white/25',
                )}
              >
                <Gavel className="h-4 w-4" />
                Deliver Verdict
              </button>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full flex-col items-center gap-4"
            >
              {/* Evidence breakdown */}
              <div className="w-full rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="mb-3 text-sm font-bold text-white/80">Evidence Placement Review</p>
                {scenario.evidence.map((e) => {
                  const placed = placements[e.id]
                  const correct = placed === e.expectedSide
                  return (
                    <div key={e.id} className="mb-1 flex items-center gap-2 text-xs">
                      {correct ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
                      )}
                      <span className={cn(correct ? 'text-white/70' : 'text-white/40')}>
                        {e.text}
                      </span>
                      {!correct && (
                        <span className="ml-auto text-[10px] text-amber-400">
                          → {e.expectedSide.toUpperCase()}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Verdict result */}
              <div
                className={cn(
                  'w-full rounded-xl border p-4 text-center text-sm font-semibold',
                  scenario.verdicts[selectedVerdict!]?.correct
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-red-500/30 bg-red-500/10 text-red-300',
                )}
              >
                {scenario.verdicts[selectedVerdict!]?.correct
                  ? '✓ Correct verdict!'
                  : `✗ The fair verdict was: "${scenario.verdicts.find((v) => v.correct)?.label}"`}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-6 py-2.5 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-500/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                {caseIndex + 1 >= scenarios.length ? 'Finish' : 'Next Case'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
