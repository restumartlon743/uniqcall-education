'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArrowRight, Zap, CheckCircle2, XCircle } from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type PatternType = 'arithmetic' | 'geometric' | 'fibonacci' | 'alternating' | 'quadratic'

interface Round {
  sequence: number[]
  answer: number
  options: number[]
  patternType: PatternType
  explanation: string
}

interface PatternDecoderProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Pattern Generation ───────────────────────────────────────

const TOTAL_ROUNDS = 5

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getPatternTypes(difficulty: GameDifficulty): PatternType[] {
  switch (difficulty) {
    case 'easy':
      return ['arithmetic', 'geometric']
    case 'medium':
      return ['arithmetic', 'geometric', 'fibonacci']
    case 'hard':
      return ['arithmetic', 'geometric', 'fibonacci', 'alternating']
    case 'extreme':
      return ['arithmetic', 'geometric', 'fibonacci', 'alternating', 'quadratic']
  }
}

function getSequenceLength(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 5
    case 'medium': return 6
    case 'hard': return 6
    case 'extreme': return 7
  }
}

function generateRound(difficulty: GameDifficulty): Round {
  const types = getPatternTypes(difficulty)
  const patternType = types[Math.floor(Math.random() * types.length)]
  const len = getSequenceLength(difficulty)
  let sequence: number[] = []
  let answer: number
  let explanation: string

  switch (patternType) {
    case 'arithmetic': {
      const start = randInt(1, 20)
      const diff = randInt(2, 12) * (Math.random() > 0.3 ? 1 : -1)
      for (let i = 0; i < len; i++) sequence.push(start + diff * i)
      answer = start + diff * len
      explanation = `Arithmetic: each term ${diff > 0 ? '+' : ''}${diff}`
      break
    }
    case 'geometric': {
      const start = randInt(1, 5)
      const ratio = randInt(2, 4)
      for (let i = 0; i < len; i++) sequence.push(start * Math.pow(ratio, i))
      answer = start * Math.pow(ratio, len)
      explanation = `Geometric: each term ×${ratio}`
      break
    }
    case 'fibonacci': {
      const a = randInt(1, 5)
      const b = randInt(1, 5)
      sequence = [a, b]
      for (let i = 2; i < len; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2])
      }
      answer = sequence[len - 1] + sequence[len - 2]
      explanation = 'Fibonacci-style: each term = sum of two previous'
      break
    }
    case 'alternating': {
      const base1 = randInt(1, 10)
      const step1 = randInt(2, 6)
      const base2 = randInt(20, 40)
      const step2 = randInt(-5, -2)
      for (let i = 0; i < len; i++) {
        sequence.push(
          i % 2 === 0 ? base1 + step1 * Math.floor(i / 2) : base2 + step2 * Math.floor(i / 2),
        )
      }
      if (len % 2 === 0) {
        answer = base1 + step1 * Math.floor(len / 2)
      } else {
        answer = base2 + step2 * Math.floor(len / 2)
      }
      explanation = 'Alternating: two interleaved sequences'
      break
    }
    case 'quadratic': {
      const a = randInt(1, 3)
      const b = randInt(0, 5)
      const c = randInt(0, 10)
      for (let i = 1; i <= len; i++) {
        sequence.push(a * i * i + b * i + c)
      }
      answer = a * (len + 1) * (len + 1) + b * (len + 1) + c
      explanation = `Quadratic: ${a}n² + ${b}n + ${c}`
      break
    }
  }

  // Generate wrong options close to the answer
  const wrongSet = new Set<number>()
  while (wrongSet.size < 3) {
    const offset = randInt(1, Math.max(5, Math.abs(Math.floor(answer * 0.2)))) * (Math.random() > 0.5 ? 1 : -1)
    const wrong = answer + offset
    if (wrong !== answer && !wrongSet.has(wrong)) {
      wrongSet.add(wrong)
    }
  }

  const options = shuffle([answer, ...wrongSet])

  return { sequence, answer, options, patternType, explanation }
}

function generateRounds(difficulty: GameDifficulty): Round[] {
  return Array.from({ length: TOTAL_ROUNDS }, () => generateRound(difficulty))
}

function getMultiplier(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 1
    case 'medium': return 1.5
    case 'hard': return 2
    case 'extreme': return 3
  }
}

// ─── Component ────────────────────────────────────────────────

export default function PatternDecoder({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: PatternDecoderProps) {
  const rounds = useMemo(() => generateRounds(difficulty), [difficulty])
  const multiplier = getMultiplier(difficulty)

  const [currentRound, setCurrentRound] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const [streak, setStreak] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)

  const round = rounds[currentRound]
  const maxScore = TOTAL_ROUNDS * 10 * multiplier
  const currentScore = results.filter(Boolean).length * 10 * multiplier

  const handleSelect = useCallback(
    (option: number) => {
      if (confirmed || isPaused) return
      setSelected(option)
    },
    [confirmed, isPaused],
  )

  const handleConfirm = useCallback(() => {
    if (selected === null || isPaused) return
    setConfirmed(true)
    setShowExplanation(true)

    const isCorrect = selected === round.answer
    const newResults = [...results, isCorrect]
    setResults(newResults)

    if (isCorrect) {
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
    }

    const score = newResults.filter(Boolean).length * 10 * multiplier
    onScoreUpdate(score, maxScore)
  }, [selected, isPaused, round, results, multiplier, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (currentRound + 1 >= TOTAL_ROUNDS) {
      setGameFinished(true)
      const finalScore = [...results].filter(Boolean).length * 10 * multiplier
      onGameOver(finalScore, maxScore)
    } else {
      setCurrentRound((r) => r + 1)
      setSelected(null)
      setConfirmed(false)
      setShowExplanation(false)
    }
  }, [currentRound, results, multiplier, maxScore, onGameOver])

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
      {/* Round indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2"
      >
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < currentRound && results[i] && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i < currentRound && !results[i] && 'border-red-500/40 bg-red-500/15 text-red-400',
              i === currentRound && !gameFinished && 'border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
              i > currentRound && 'border-white/10 bg-white/5 text-white/20',
              i === currentRound && gameFinished && results[i] && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === currentRound && gameFinished && !results[i] && 'border-red-500/40 bg-red-500/15 text-red-400',
            )}
          >
            {i < results.length ? (
              results[i] ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )
            ) : (
              i + 1
            )}
          </div>
        ))}
      </motion.div>

      {!gameFinished && (
        <>
          {/* Streak */}
          {streak >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400"
            >
              <Zap className="h-3 w-3" />
              {streak}× Streak!
            </motion.div>
          )}

          {/* Sequence display */}
          <motion.div
            key={currentRound}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Find the next number in the sequence
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {round.sequence.map((num, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex h-14 w-14 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/5 text-lg font-bold text-white shadow-[0_0_10px_rgba(139,92,246,0.1)] sm:h-16 sm:w-16"
                >
                  {num}
                </motion.div>
              ))}
              <ArrowRight className="mx-1 h-5 w-5 text-white/30" />
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed text-lg font-bold sm:h-16 sm:w-16',
                  confirmed && selected === round.answer
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : confirmed && selected !== round.answer
                      ? 'border-red-500/50 bg-red-500/10 text-red-400'
                      : 'border-cyan-500/30 bg-cyan-500/5 text-cyan-300',
                )}
              >
                {confirmed ? (confirmed && selected === round.answer ? selected : round.answer) : '?'}
              </motion.div>
            </div>
          </motion.div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {round.options.map((option, i) => {
              const isCorrectOption = option === round.answer
              const isSelected = selected === option
              return (
                <motion.button
                  key={`${currentRound}-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  onClick={() => handleSelect(option)}
                  disabled={confirmed}
                  className={cn(
                    'flex h-14 items-center justify-center rounded-xl border text-lg font-bold transition-all',
                    !confirmed && !isSelected && 'border-white/10 bg-white/5 text-white/80 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-200',
                    !confirmed && isSelected && 'border-violet-500/50 bg-violet-500/15 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.3)]',
                    confirmed && isCorrectOption && 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300',
                    confirmed && isSelected && !isCorrectOption && 'border-red-500/50 bg-red-500/15 text-red-300',
                    confirmed && !isSelected && !isCorrectOption && 'border-white/5 bg-white/3 text-white/20',
                  )}
                >
                  {option}
                </motion.button>
              )
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm text-white/60"
              >
                <span className="font-semibold text-cyan-400">Pattern: </span>
                {round.explanation}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3">
            {!confirmed ? (
              <button
                onClick={handleConfirm}
                disabled={selected === null}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold transition-all',
                  selected !== null
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'border-white/10 bg-white/5 text-white/25 cursor-not-allowed',
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-6 py-2.5 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-500/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                {currentRound + 1 >= TOTAL_ROUNDS ? 'Finish' : 'Next Round'}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </>
      )}

      {/* Final Summary */}
      {gameFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h3 className="text-lg font-bold text-white">Session Complete!</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/40">Correct</p>
              <p className="text-2xl font-bold text-emerald-400">
                {results.filter(Boolean).length}/{TOTAL_ROUNDS}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/40">Score</p>
              <p className="text-2xl font-bold text-violet-400">{Math.round(currentScore)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/40">Multiplier</p>
              <p className="text-2xl font-bold text-cyan-400">{multiplier}×</p>
            </div>
          </div>
          <div className="flex gap-2">
            {results.map((r, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-xs text-white/30">R{i + 1}</span>
                {r ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
