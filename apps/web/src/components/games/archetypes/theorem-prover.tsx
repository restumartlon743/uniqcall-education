'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ArrowDown,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  GripVertical,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface ProofStep {
  id: string
  text: string
  isDistractor: boolean
}

interface ProofPuzzle {
  premises: string[]
  conclusion: string
  steps: ProofStep[]     // correct order (non-distractors)
  allSteps: ProofStep[]  // shuffled, includes distractors
  stepCount: number
}

interface TheoremProverProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Puzzle Templates ─────────────────────────────────────────

interface PuzzleTemplate {
  premises: string[]
  conclusion: string
  steps: string[]
  distractors: string[]
}

const EASY_PUZZLES: PuzzleTemplate[] = [
  {
    premises: ['All mammals are warm-blooded.', 'A dog is a mammal.'],
    conclusion: 'A dog is warm-blooded.',
    steps: [
      'A dog is a mammal. (Given)',
      'All mammals are warm-blooded. (Given)',
      'Therefore, a dog is warm-blooded. (Modus Ponens)',
    ],
    distractors: ['A dog is a reptile.', 'Some mammals are cold-blooded.'],
  },
  {
    premises: ['If it rains, the ground is wet.', 'It is raining.'],
    conclusion: 'The ground is wet.',
    steps: [
      'It is raining. (Given)',
      'If it rains, the ground is wet. (Given)',
      'Therefore, the ground is wet. (Modus Ponens)',
    ],
    distractors: ['The ground is dry.', 'It might not rain.'],
  },
  {
    premises: ['All birds have feathers.', 'A sparrow is a bird.'],
    conclusion: 'A sparrow has feathers.',
    steps: [
      'A sparrow is a bird. (Given)',
      'All birds have feathers. (Given)',
      'Therefore, a sparrow has feathers. (Universal Instantiation)',
    ],
    distractors: ['Some birds are mammals.', 'Feathers imply flight.'],
  },
]

const MEDIUM_PUZZLES: PuzzleTemplate[] = [
  {
    premises: [
      'If P then Q.',
      'If Q then R.',
      'P is true.',
    ],
    conclusion: 'R is true.',
    steps: [
      'P is true. (Given)',
      'If P then Q. (Given)',
      'Therefore Q is true. (Modus Ponens)',
      'If Q then R. (Given) → R is true. (Hypothetical Syllogism)',
    ],
    distractors: ['If R then P.', 'Q is false.', 'Not P implies Not R.'],
  },
  {
    premises: [
      'All scientists are curious.',
      'All curious people ask questions.',
      'Marie is a scientist.',
    ],
    conclusion: 'Marie asks questions.',
    steps: [
      'Marie is a scientist. (Given)',
      'All scientists are curious. (Given) → Marie is curious.',
      'All curious people ask questions. (Given)',
      'Therefore, Marie asks questions. (Syllogism chain)',
    ],
    distractors: ['Marie is not curious.', 'Some scientists don\'t ask questions.', 'Curious people are scientists.'],
  },
]

const HARD_PUZZLES: PuzzleTemplate[] = [
  {
    premises: [
      'If A then B.',
      'If B then C.',
      'If C then D.',
      'A is true.',
    ],
    conclusion: 'D is true.',
    steps: [
      'A is true. (Given)',
      'If A then B. (Given) → B is true. (MP)',
      'If B then C. (Given) → C is true. (MP)',
      'If C then D. (Given) → D is true. (MP)',
      'Therefore D is true. (Chain of Modus Ponens)',
    ],
    distractors: [
      'If D then A. (Converse — invalid)',
      'Not B implies not D.',
      'C is false by assumption.',
      'A and D are independent.',
    ],
  },
  {
    premises: [
      'All integers are rational numbers.',
      'All rational numbers are real numbers.',
      'π is not rational.',
      '7 is an integer.',
    ],
    conclusion: '7 is a real number.',
    steps: [
      '7 is an integer. (Given)',
      'All integers are rational numbers. (Given) → 7 is rational.',
      'All rational numbers are real numbers. (Given)',
      '7 is rational → 7 is a real number. (Syllogism)',
      'Therefore, 7 is a real number. ✓',
    ],
    distractors: [
      'π is a real number. (True but irrelevant)',
      '7 is irrational.',
      'Not all reals are rational. (True but unused)',
      'Integers are not real numbers.',
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

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generatePuzzle(difficulty: GameDifficulty): ProofPuzzle {
  let template: PuzzleTemplate
  let distractorCount: number

  switch (difficulty) {
    case 'easy':
      template = pickRandom(EASY_PUZZLES)
      distractorCount = 0
      break
    case 'medium':
      template = pickRandom(MEDIUM_PUZZLES)
      distractorCount = 2
      break
    case 'hard':
    case 'extreme':
      template = pickRandom(HARD_PUZZLES)
      distractorCount = difficulty === 'extreme' ? 4 : 3
      break
  }

  const steps: ProofStep[] = template.steps.map((text, i) => ({
    id: `step-${i}`,
    text,
    isDistractor: false,
  }))

  const distractors: ProofStep[] = shuffle(template.distractors)
    .slice(0, distractorCount)
    .map((text, i) => ({
      id: `dist-${i}`,
      text,
      isDistractor: true,
    }))

  const allSteps = shuffle([...steps, ...distractors])

  return {
    premises: template.premises,
    conclusion: template.conclusion,
    steps,
    allSteps,
    stepCount: steps.length,
  }
}

// ─── Component ────────────────────────────────────────────────

export default function TheoremProver({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: TheoremProverProps) {
  const puzzle = useMemo(() => generatePuzzle(difficulty), [difficulty])
  const { premises, conclusion, allSteps, steps, stepCount } = puzzle

  const [available, setAvailable] = useState<ProofStep[]>(allSteps)
  const [placed, setPlaced] = useState<(ProofStep | null)[]>(
    () => Array.from({ length: stepCount }, () => null),
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [correctSlots, setCorrectSlots] = useState<boolean[]>([])
  const [startTime] = useState(Date.now())
  const maxScore = stepCount * 10 + 20 // step points + time bonus

  const handleSelectAvailable = useCallback(
    (step: ProofStep) => {
      if (checked || isPaused) return
      if (selectedId === step.id) {
        setSelectedId(null)
      } else {
        setSelectedId(step.id)
      }
    },
    [checked, isPaused, selectedId],
  )

  const handlePlaceInSlot = useCallback(
    (slotIdx: number) => {
      if (checked || isPaused || !selectedId) return

      const step = available.find((s) => s.id === selectedId)
      if (!step) return

      // If slot already has something, put it back
      setPlaced((prev) => {
        const next = [...prev]
        const existing = next[slotIdx]
        if (existing) {
          setAvailable((a) => [...a, existing])
        }
        next[slotIdx] = step
        return next
      })
      setAvailable((prev) => prev.filter((s) => s.id !== selectedId))
      setSelectedId(null)
    },
    [checked, isPaused, selectedId, available],
  )

  const handleRemoveFromSlot = useCallback(
    (slotIdx: number) => {
      if (checked || isPaused) return
      setPlaced((prev) => {
        const next = [...prev]
        const step = next[slotIdx]
        if (step) {
          setAvailable((a) => [...a, step])
          next[slotIdx] = null
        }
        return next
      })
    },
    [checked, isPaused],
  )

  const handleCheck = useCallback(() => {
    const correct = placed.map((step, i) => {
      if (!step) return false
      return step.id === steps[i].id
    })
    setCorrectSlots(correct)
    setChecked(true)

    const correctCount = correct.filter(Boolean).length
    const elapsedSec = Math.floor((Date.now() - startTime) / 1000)
    const timeBonus = Math.max(0, 20 - Math.floor(elapsedSec / 10))
    const score = correctCount * 10 + (correctCount === stepCount ? timeBonus : 0)

    onScoreUpdate(score, maxScore)
    onGameOver(score, maxScore)
  }, [placed, steps, stepCount, startTime, maxScore, onScoreUpdate, onGameOver])

  const handleReset = useCallback(() => {
    setAvailable(shuffle([...allSteps]))
    setPlaced(Array.from({ length: stepCount }, () => null))
    setSelectedId(null)
    setChecked(false)
    setCorrectSlots([])
  }, [allSteps, stepCount])

  const allPlaced = placed.every((p) => p !== null)

  return (
    <div className="flex flex-col gap-6">
      {/* Premises */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4"
      >
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-violet-400">
          Given Premises
        </h3>
        <ul className="space-y-1">
          {premises.map((p, i) => (
            <li key={i} className="text-sm text-white/80">
              <span className="mr-2 text-violet-400">{i + 1}.</span>
              {p}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Conclusion */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center"
      >
        <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
          Prove That
        </h3>
        <p className="text-sm font-semibold text-white">{conclusion}</p>
      </motion.div>

      {/* Proof Chain (drop slots) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
          Build Your Proof ({placed.filter(Boolean).length}/{stepCount} steps)
        </h3>
        {placed.map((step, i) => (
          <div key={i} className="flex items-stretch gap-2">
            {/* Step number */}
            <div className="flex w-8 flex-col items-center justify-center">
              <span className="text-xs font-bold text-white/30">
                {i + 1}
              </span>
              {i < stepCount - 1 && (
                <ArrowDown className="mt-1 h-3 w-3 text-white/15" />
              )}
            </div>

            {/* Slot */}
            <motion.button
              onClick={() =>
                step ? handleRemoveFromSlot(i) : handlePlaceInSlot(i)
              }
              whileHover={!checked ? { scale: 1.01 } : {}}
              className={cn(
                'flex flex-1 items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all',
                !step && !selectedId && 'border-dashed border-white/10 bg-white/3 text-white/30',
                !step && selectedId && 'border-dashed border-violet-500/40 bg-violet-500/5 text-violet-300/50',
                step && !checked && 'border-white/15 bg-white/5 text-white/80',
                checked && step && correctSlots[i] && 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
                checked && step && !correctSlots[i] && 'border-red-500/40 bg-red-500/10 text-red-300',
              )}
            >
              {step ? (
                <>
                  <GripVertical className="h-4 w-4 shrink-0 text-white/20" />
                  <span className="flex-1">{step.text}</span>
                  {checked && (
                    correctSlots[i] ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                    )
                  )}
                </>
              ) : (
                <span className="italic">
                  {selectedId ? 'Click to place step here' : 'Select a step below'}
                </span>
              )}
            </motion.button>
          </div>
        ))}
      </div>

      {/* Available steps */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
          Available Steps
        </h3>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {available.map((step) => (
              <motion.button
                key={step.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => handleSelectAvailable(step)}
                className={cn(
                  'rounded-lg border px-4 py-2.5 text-left text-sm transition-all',
                  selectedId === step.id
                    ? 'border-violet-500/50 bg-violet-500/15 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                    : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/8',
                  checked && 'pointer-events-none opacity-40',
                )}
              >
                {step.text}
                {step.isDistractor && checked && (
                  <span className="ml-2 text-xs text-red-400">(distractor)</span>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
          {available.length === 0 && !checked && (
            <p className="py-2 text-xs text-white/25 italic">All steps placed.</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        {!checked ? (
          <>
            <button
              onClick={handleCheck}
              disabled={!allPlaced}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all',
                allPlaced
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'border-white/10 bg-white/5 text-white/25 cursor-not-allowed',
              )}
            >
              <Sparkles className="h-4 w-4" />
              Verify Proof
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-center"
          >
            <p className="text-sm font-bold text-white">
              {correctSlots.filter(Boolean).length}/{stepCount} steps correct
            </p>
            <p className="mt-1 text-xs text-white/40">
              {correctSlots.every(Boolean)
                ? 'QED — Perfect proof! 🎓'
                : 'Review the highlighted steps and try again!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
