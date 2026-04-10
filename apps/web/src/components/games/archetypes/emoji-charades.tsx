'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Smile,
  ArrowRight,
  CheckCircle2,
  Star,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface ConceptRound {
  id: string
  concept: string
  category: 'concrete' | 'abstract' | 'idiom'
  relevantEmojis: string[]
}

interface EmojiCharadesProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Emoji Grid ───────────────────────────────────────────────

const EMOJI_GRID = [
  '😊', '😢', '😠', '😨', '🤩', '😴', '🤔', '😎',
  '❤️', '💔', '🔥', '💧', '⭐', '🌙', '☀️', '🌧️',
  '🏠', '🏫', '🏖️', '🏔️', '🌳', '🌊', '🌺', '🍕',
  '🎂', '🎁', '🎭', '🎬', '🎵', '🎮', '📚', '✈️',
  '🚗', '🐶', '🐱', '🦁', '👻', '🤖', '👑', '💎',
  '⚡', '🌈', '🎯', '💰', '🏆', '🔑', '💡', '🎪',
  '🍎', '🌻', '🦋', '🐾', '🎨', '🧪', '🔮', '🗺️',
]

// ─── Concept Data ─────────────────────────────────────────────

const ALL_CONCEPTS: ConceptRound[] = [
  // Concrete
  { id: 'c1', concept: 'Going to the beach', category: 'concrete', relevantEmojis: ['🏖️', '☀️', '🌊', '😎', '🌺', '💧'] },
  { id: 'c2', concept: 'Birthday party', category: 'concrete', relevantEmojis: ['🎂', '🎁', '🤩', '🎵', '🎪', '❤️'] },
  { id: 'c3', concept: 'Scary movie night', category: 'concrete', relevantEmojis: ['👻', '😨', '🎬', '🌙', '🍕', '🏠'] },
  { id: 'c4', concept: 'Walking the dog in the park', category: 'concrete', relevantEmojis: ['🐶', '🐾', '🌳', '☀️', '😊', '🌺'] },
  { id: 'c5', concept: 'School exam day', category: 'concrete', relevantEmojis: ['🏫', '📚', '🤔', '😨', '✏️', '💡'] },
  { id: 'c6', concept: 'Cooking dinner at home', category: 'concrete', relevantEmojis: ['🏠', '🍕', '🔥', '🍎', '😊', '❤️'] },
  { id: 'c7', concept: 'Winning a trophy', category: 'concrete', relevantEmojis: ['🏆', '🤩', '⭐', '👑', '😊', '🎯'] },
  { id: 'c8', concept: 'Road trip adventure', category: 'concrete', relevantEmojis: ['🚗', '🗺️', '☀️', '🏔️', '😎', '✈️'] },

  // Abstract
  { id: 'a1', concept: 'Falling in love', category: 'abstract', relevantEmojis: ['❤️', '🤩', '😊', '🌺', '⭐', '💎', '🌈'] },
  { id: 'a2', concept: 'Feeling lonely', category: 'abstract', relevantEmojis: ['😢', '💔', '🌧️', '🌙', '😴', '🏠'] },
  { id: 'a3', concept: 'A brilliant idea', category: 'abstract', relevantEmojis: ['💡', '⚡', '🤩', '🤔', '⭐', '🧪', '🔮'] },
  { id: 'a4', concept: 'Overcoming fear', category: 'abstract', relevantEmojis: ['😨', '🦁', '💪', '⭐', '🔥', '👑', '🎯'] },
  { id: 'a5', concept: 'Creative inspiration', category: 'abstract', relevantEmojis: ['🎨', '💡', '🌈', '✨', '🤩', '🌻', '🔮'] },
  { id: 'a6', concept: 'Growing up', category: 'abstract', relevantEmojis: ['🌳', '⭐', '📚', '🏫', '🌻', '🔑', '💡'] },
  { id: 'a7', concept: 'A broken promise', category: 'abstract', relevantEmojis: ['💔', '😢', '😠', '🌧️', '🔑', '💧', '👻'] },

  // Idioms
  { id: 'i1', concept: 'Raining cats and dogs', category: 'idiom', relevantEmojis: ['🌧️', '🐶', '🐱', '💧', '🌊', '😨'] },
  { id: 'i2', concept: 'Heart of gold', category: 'idiom', relevantEmojis: ['❤️', '💰', '💎', '👑', '😊', '⭐', '💡'] },
  { id: 'i3', concept: 'Wild goose chase', category: 'idiom', relevantEmojis: ['🐾', '🚗', '🗺️', '🤔', '😠', '🌳'] },
  { id: 'i4', concept: 'Break a leg', category: 'idiom', relevantEmojis: ['🎭', '⭐', '🤩', '🎬', '👑', '🔥'] },
  { id: 'i5', concept: 'Spill the beans', category: 'idiom', relevantEmojis: ['🤔', '😨', '💡', '📚', '🔑', '😊'] },
  { id: 'i6', concept: 'Under the weather', category: 'idiom', relevantEmojis: ['🌧️', '😢', '😴', '🏠', '💧', '🌙'] },
  { id: 'i7', concept: 'Hit the jackpot', category: 'idiom', relevantEmojis: ['💰', '🤩', '⭐', '💎', '🏆', '🎯', '🔥'] },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { rounds: 5, maxEmojis: 5, category: 'concrete' as const, multiplier: 1 }
    case 'medium':
      return { rounds: 5, maxEmojis: 4, category: 'abstract' as const, multiplier: 1.5 }
    case 'hard':
      return { rounds: 5, maxEmojis: 3, category: 'idiom' as const, multiplier: 2 }
    case 'extreme':
      return { rounds: 5, maxEmojis: 3, category: 'idiom' as const, multiplier: 3 }
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

export default function EmojiCharades({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: EmojiCharadesProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const concepts = useMemo(() => {
    // Mix in some from all categories, prioritizing config.category
    const primary = ALL_CONCEPTS.filter((c) => c.category === config.category)
    const other = ALL_CONCEPTS.filter((c) => c.category !== config.category)
    const pool = [...shuffle(primary), ...shuffle(other)]
    return pool.slice(0, config.rounds)
  }, [config])

  const [round, setRound] = useState(0)
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([])
  const [roundScores, setRoundScores] = useState<{ relevant: number; total: number; score: number }[]>([])
  const [phase, setPhase] = useState<'select' | 'result'>('select')
  const [gameFinished, setGameFinished] = useState(false)

  const currentConcept = concepts[round]
  const maxScorePerRound = Math.round(100 * config.multiplier)
  const maxScore = config.rounds * maxScorePerRound

  const toggleEmoji = useCallback((emoji: string) => {
    if (isPaused || phase !== 'select') return
    setSelectedEmojis((prev) => {
      if (prev.includes(emoji)) return prev.filter((e) => e !== emoji)
      if (prev.length >= config.maxEmojis) return prev
      return [...prev, emoji]
    })
  }, [isPaused, phase, config.maxEmojis])

  const handleClear = useCallback(() => {
    if (isPaused || phase !== 'select') return
    setSelectedEmojis([])
  }, [isPaused, phase])

  const handleSubmit = useCallback(() => {
    if (selectedEmojis.length === 0 || !currentConcept) return

    const relevant = selectedEmojis.filter((e) => currentConcept.relevantEmojis.includes(e)).length
    const total = selectedEmojis.length
    // Score: relevant/total × 100 (precision-based)
    const precision = total > 0 ? relevant / total : 0
    const recall = relevant / Math.min(currentConcept.relevantEmojis.length, config.maxEmojis)
    const score = Math.round((precision * 0.6 + recall * 0.4) * 100 * config.multiplier)

    const newScores = [...roundScores, { relevant, total, score }]
    setRoundScores(newScores)
    setPhase('result')

    const totalScore = newScores.reduce((a, b) => a + b.score, 0)
    onScoreUpdate(totalScore, maxScore)
  }, [selectedEmojis, currentConcept, config, roundScores, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (round + 1 >= config.rounds) {
      setGameFinished(true)
      const finalScore = roundScores.reduce((a, b) => a + b.score, 0)
      onGameOver(finalScore, maxScore)
    } else {
      setRound((r) => r + 1)
      setSelectedEmojis([])
      setPhase('select')
    }
  }, [round, config.rounds, roundScores, maxScore, onGameOver])

  if (!currentConcept && !gameFinished) return null

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
      {/* Round indicators */}
      <div className="flex items-center gap-2">
        {concepts.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < round && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === round && !gameFinished && 'border-yellow-500/50 bg-yellow-500/15 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.3)]',
              i > round && 'border-white/10 bg-white/5 text-white/20',
              i === round && gameFinished && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
            )}
          >
            {i < roundScores.length ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </div>
        ))}
      </div>

      {gameFinished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8"
        >
          <Star className="h-12 w-12 text-amber-400" />
          <p className="text-xl font-bold text-white">Charades Complete!</p>
          <p className="text-sm text-white/60">
            Total Score: {roundScores.reduce((a, b) => a + b.score, 0)} / {maxScore}
          </p>
          {roundScores.map((s, i) => (
            <div key={i} className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-xs text-white/60">&ldquo;{concepts[i]?.concept}&rdquo;</span>
              <span className="text-sm font-bold text-amber-400">{s.score} pts</span>
            </div>
          ))}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentConcept.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full flex-col gap-4"
          >
            {/* Concept card */}
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5 text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-yellow-300">
                <Smile className="h-4 w-4" />
                Express this with emojis!
              </div>
              <p className="mt-3 text-xl font-bold text-white">&ldquo;{currentConcept.concept}&rdquo;</p>
              <p className="mt-1 text-xs text-white/40">
                Select {config.maxEmojis} emojis that best represent this concept
              </p>
            </div>

            {phase === 'select' && (
              <>
                {/* Selected emojis display */}
                <div className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  {selectedEmojis.length > 0 ? (
                    <>
                      {selectedEmojis.map((emoji, i) => (
                        <motion.button
                          key={`${emoji}-${i}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.2 }}
                          onClick={() => toggleEmoji(emoji)}
                          className="text-3xl transition-transform hover:scale-125"
                          title="Click to remove"
                        >
                          {emoji}
                        </motion.button>
                      ))}
                      {Array.from({ length: config.maxEmojis - selectedEmojis.length }).map((_, i) => (
                        <div
                          key={`empty-${i}`}
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-white/10 text-xs text-white/20"
                        >
                          ?
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-xs text-white/30">Select emojis from below...</p>
                  )}
                  {selectedEmojis.length > 0 && (
                    <button
                      onClick={handleClear}
                      className="ml-2 rounded-lg border border-white/10 p-1.5 text-white/40 transition-colors hover:text-white/60"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Emoji grid */}
                <div className="grid grid-cols-8 gap-1.5">
                  {EMOJI_GRID.map((emoji) => {
                    const isSelected = selectedEmojis.includes(emoji)
                    return (
                      <motion.button
                        key={emoji}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleEmoji(emoji)}
                        className={cn(
                          'flex h-11 w-11 items-center justify-center rounded-xl border text-xl transition-all',
                          isSelected
                            ? 'border-yellow-500/40 bg-yellow-500/15 shadow-[0_0_10px_rgba(234,179,8,0.2)] scale-110'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10',
                          !isSelected && selectedEmojis.length >= config.maxEmojis && 'opacity-30 cursor-not-allowed',
                        )}
                        disabled={!isSelected && selectedEmojis.length >= config.maxEmojis}
                      >
                        {emoji}
                      </motion.button>
                    )
                  })}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={selectedEmojis.length === 0}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all',
                    selectedEmojis.length > 0
                      ? 'bg-yellow-600 text-white shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:bg-yellow-500'
                      : 'bg-white/5 text-white/30 cursor-not-allowed',
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  Submit Emojis ({selectedEmojis.length}/{config.maxEmojis})
                </button>
              </>
            )}

            {phase === 'result' && roundScores.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-300">Round Scored!</span>
                  <span className="text-lg font-bold text-amber-400">{roundScores[roundScores.length - 1].score} pts</span>
                </div>

                <div className="text-center">
                  <p className="text-xs text-white/40">Your emojis:</p>
                  <p className="mt-1 text-3xl">{selectedEmojis.join(' ')}</p>
                </div>

                <div className="mt-2 flex flex-col gap-1">
                  <p className="text-xs text-white/40">Relevant emojis for &quot;{currentConcept.concept}&quot;:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentConcept.relevantEmojis.map((e) => (
                      <span
                        key={e}
                        className={cn(
                          'rounded-lg border px-2 py-1 text-base',
                          selectedEmojis.includes(e)
                            ? 'border-emerald-500/30 bg-emerald-500/10'
                            : 'border-white/10 bg-white/5 opacity-50',
                        )}
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-white/50">
                    {roundScores[roundScores.length - 1].relevant} of {roundScores[roundScores.length - 1].total} selected emojis were relevant
                  </p>
                </div>

                <button
                  onClick={handleNext}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-yellow-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all hover:bg-yellow-500"
                >
                  {round + 1 >= config.rounds ? 'Finish' : 'Next Round'}
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
