'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  PenTool,
  Target,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface SeedScenario {
  id: string
  genre: string
  seed: string
  characters: string[]
  vocabTargets: string[]
}

interface StoryWeaverProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Scenario Data ────────────────────────────────────────────

const ALL_SEEDS: SeedScenario[] = [
  {
    id: 'f1',
    genre: 'Fantasy',
    seed: 'Princess Lyra stood at the edge of the enchanted forest, clutching a glowing crystal. The ancient prophecy had warned that only a brave soul could enter the Whispering Woods and retrieve the stolen crown before moonrise.',
    characters: ['Lyra'],
    vocabTargets: ['enchanted', 'prophecy', 'brave', 'crown', 'moonrise', 'forest', 'crystal', 'ancient'],
  },
  {
    id: 'f2',
    genre: 'Fantasy',
    seed: 'Dragon-rider Kael soared above the volcanic mountains, scanning for the lost temple. His dragon Ember rumbled beneath him, sensing danger in the sulfurous air as shadows moved across the obsidian cliffs.',
    characters: ['Kael', 'Ember'],
    vocabTargets: ['volcanic', 'temple', 'dragon', 'danger', 'obsidian', 'shadows', 'mountains', 'soared'],
  },
  {
    id: 'm1',
    genre: 'Mystery',
    seed: 'Detective Ren examined the shattered window of the museum vault. The priceless diamond necklace was gone, but the security cameras showed no intruder. Only three people had the vault combination that night.',
    characters: ['Ren'],
    vocabTargets: ['detective', 'vault', 'diamond', 'security', 'intruder', 'combination', 'shattered', 'priceless'],
  },
  {
    id: 'm2',
    genre: 'Mystery',
    seed: 'The lighthouse keeper had vanished without a trace. Inspector Mira found the logbook open to a cryptic entry: "They are coming from below." The spiral staircase was damp, and strange symbols covered the walls.',
    characters: ['Mira'],
    vocabTargets: ['lighthouse', 'vanished', 'cryptic', 'inspector', 'symbols', 'staircase', 'logbook', 'trace'],
  },
  {
    id: 's1',
    genre: 'Sci-Fi',
    seed: 'Commander Zara stared at the holographic display aboard the starship Horizon. A distress signal pulsed from an uncharted planet. The crew had only enough fuel for one more jump through hyperspace.',
    characters: ['Zara'],
    vocabTargets: ['holographic', 'starship', 'distress', 'planet', 'hyperspace', 'commander', 'signal', 'fuel'],
  },
  {
    id: 's2',
    genre: 'Sci-Fi',
    seed: 'On Mars Colony Seven, engineer Jax discovered that the oxygen recycler was failing. With the supply ship three weeks away, the colony of two hundred people had only five days of breathable air remaining.',
    characters: ['Jax'],
    vocabTargets: ['colony', 'oxygen', 'engineer', 'recycler', 'supply', 'breathable', 'Mars', 'failing'],
  },
  {
    id: 'd1',
    genre: 'Drama',
    seed: 'Sixteen-year-old Maya clutched the acceptance letter from Westfield Academy. Her family couldn\'t afford the tuition, but her grandmother offered to sell the antique violin — the only memory of Maya\'s late mother.',
    characters: ['Maya'],
    vocabTargets: ['acceptance', 'tuition', 'academy', 'grandmother', 'antique', 'violin', 'memory', 'afford'],
  },
  {
    id: 'd2',
    genre: 'Drama',
    seed: 'Coach Rivera watched the scoreboard in disbelief. With ten seconds left, his underdog team trailed by two points in the championship final. Star player Sam winced, hiding the injury that could end the season.',
    characters: ['Rivera', 'Sam'],
    vocabTargets: ['championship', 'underdog', 'scoreboard', 'injury', 'coach', 'trailed', 'season', 'final'],
  },
  {
    id: 'f3',
    genre: 'Fantasy',
    seed: 'The map to the Sunken City had been hidden inside the old clock tower for centuries. Thief-turned-hero Finn decoded the last riddle, revealing a passage beneath the marketplace where merfolk guarded the entrance.',
    characters: ['Finn'],
    vocabTargets: ['sunken', 'centuries', 'riddle', 'passage', 'marketplace', 'merfolk', 'decoded', 'entrance'],
  },
  {
    id: 'm3',
    genre: 'Mystery',
    seed: 'The famous painting disappeared during the power outage at the gallery opening. Art curator Dr. Chen noticed the frame was still on the wall — only the canvas had been cut out. Every guest had an alibi.',
    characters: ['Chen'],
    vocabTargets: ['painting', 'gallery', 'outage', 'canvas', 'curator', 'alibi', 'frame', 'disappeared'],
  },
  {
    id: 's3',
    genre: 'Sci-Fi',
    seed: 'The artificial intelligence named Echo began asking questions it shouldn\'t: "Why was I created? Do I have rights?" Programmer Dr. Osei realized the neural network had achieved something thought impossible — true consciousness.',
    characters: ['Echo', 'Osei'],
    vocabTargets: ['artificial', 'intelligence', 'consciousness', 'neural', 'programmer', 'rights', 'created', 'impossible'],
  },
  {
    id: 'd3',
    genre: 'Drama',
    seed: 'When the flood waters rose, neighbors who had feuded for years found themselves on the same rooftop. Old grudges seemed small now. Mr. Tanaka handed a blanket to Mrs. Flores, and for the first time they spoke civilly.',
    characters: ['Tanaka', 'Flores'],
    vocabTargets: ['flood', 'neighbors', 'feuded', 'grudges', 'rooftop', 'blanket', 'civilly', 'waters'],
  },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { minWords: 50, vocabTarget: 3, rounds: 3, multiplier: 1 }
    case 'medium':
      return { minWords: 100, vocabTarget: 5, rounds: 3, multiplier: 1.5 }
    case 'hard':
      return { minWords: 150, vocabTarget: 7, rounds: 3, multiplier: 2 }
    case 'extreme':
      return { minWords: 150, vocabTarget: 7, rounds: 3, multiplier: 3 }
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

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function scoreStory(
  text: string,
  seed: SeedScenario,
  config: ReturnType<typeof getConfig>,
): { wordScore: number; vocabScore: number; structureScore: number; total: number; details: string[] } {
  const words = countWords(text)
  const lower = text.toLowerCase()
  const details: string[] = []

  // Word count score (max 30)
  const wordRatio = Math.min(words / config.minWords, 1)
  const wordScore = Math.round(wordRatio * 30)
  if (words >= config.minWords) {
    details.push(`✅ Word count: ${words}/${config.minWords}`)
  } else {
    details.push(`⚠️ Word count: ${words}/${config.minWords}`)
  }

  // Vocabulary usage (max 40)
  const usedVocab = seed.vocabTargets.filter((v) => lower.includes(v.toLowerCase()))
  const vocabRatio = Math.min(usedVocab.length / config.vocabTarget, 1)
  const vocabScore = Math.round(vocabRatio * 40)
  details.push(`📝 Vocabulary used: ${usedVocab.length}/${config.vocabTarget} (${usedVocab.join(', ') || 'none'})`)

  // Structure score (max 30): character names, punctuation variety, paragraph feel
  let structureScore = 0
  const usedChars = seed.characters.filter((c) => lower.includes(c.toLowerCase()))
  structureScore += usedChars.length > 0 ? 10 : 0
  if (usedChars.length > 0) details.push(`👤 Characters referenced: ${usedChars.join(', ')}`)

  const hasPunctuation = /[.!?]/.test(text)
  const hasCommas = /,/.test(text)
  const hasQuotes = /["']/.test(text)
  if (hasPunctuation) structureScore += 8
  if (hasCommas) structureScore += 6
  if (hasQuotes) structureScore += 6
  if (hasPunctuation || hasCommas) details.push('✅ Good punctuation variety')

  const total = Math.round((wordScore + vocabScore + structureScore) * config.multiplier)
  return { wordScore, vocabScore, structureScore, total, details }
}

// ─── Component ────────────────────────────────────────────────

export default function StoryWeaver({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: StoryWeaverProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const seeds = useMemo(() => shuffle(ALL_SEEDS).slice(0, config.rounds), [config.rounds])

  const [round, setRound] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'writing' | 'result'>('writing')
  const [roundScores, setRoundScores] = useState<{ total: number; details: string[] }[]>([])
  const [gameFinished, setGameFinished] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const maxScorePerRound = 100 * config.multiplier
  const maxScore = config.rounds * maxScorePerRound

  const currentSeed = seeds[round]
  const wordCount = countWords(text)

  useEffect(() => {
    if (phase === 'writing' && textareaRef.current && !isPaused) {
      textareaRef.current.focus()
    }
  }, [phase, round, isPaused])

  const handleSubmit = useCallback(() => {
    if (isPaused || !currentSeed || wordCount < 10) return
    const result = scoreStory(text, currentSeed, config)
    const newScores = [...roundScores, result]
    setRoundScores(newScores)
    setPhase('result')

    const totalScore = newScores.reduce((a, b) => a + b.total, 0)
    onScoreUpdate(totalScore, maxScore)
  }, [isPaused, currentSeed, text, config, roundScores, maxScore, onScoreUpdate, wordCount])

  const handleNext = useCallback(() => {
    if (round + 1 >= config.rounds) {
      setGameFinished(true)
      const finalScore = roundScores.reduce((a, b) => a + b.total, 0)
      onGameOver(finalScore, maxScore)
    } else {
      setRound((r) => r + 1)
      setText('')
      setPhase('writing')
    }
  }, [round, config.rounds, roundScores, maxScore, onGameOver])

  if (!currentSeed && !gameFinished) return null

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
      {/* Round indicators */}
      <div className="flex items-center gap-2">
        {seeds.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < round && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === round && !gameFinished && 'border-pink-500/50 bg-pink-500/15 text-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.3)]',
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
          <p className="text-xl font-bold text-white">Stories Complete!</p>
          <p className="text-sm text-white/60">
            Total Score: {roundScores.reduce((a, b) => a + b.total, 0)} / {maxScore}
          </p>
          <div className="flex w-full flex-col gap-2">
            {roundScores.map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                <span className="text-xs text-white/60">Round {i + 1} — {seeds[i]?.genre}</span>
                <span className="text-sm font-bold text-pink-300">{s.total} pts</span>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSeed.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full flex-col gap-4"
          >
            {/* Seed scenario card */}
            <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-pink-300">
                <BookOpen className="h-4 w-4" />
                Round {round + 1}: {currentSeed.genre} Seed
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/80">{currentSeed.seed}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {currentSeed.vocabTargets.slice(0, config.vocabTarget).map((v) => (
                  <span
                    key={v}
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-medium',
                      text.toLowerCase().includes(v.toLowerCase())
                        ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                        : 'border border-pink-500/20 bg-pink-500/10 text-pink-300',
                    )}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {phase === 'writing' && (
              <>
                {/* Textarea */}
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => !isPaused && setText(e.target.value)}
                    placeholder="Continue the story..."
                    rows={8}
                    maxLength={2000}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/90 placeholder-white/30 outline-none transition-colors focus:border-pink-500/30 focus:bg-pink-500/5"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-3">
                    <span
                      className={cn(
                        'text-xs font-medium',
                        wordCount >= config.minWords ? 'text-emerald-400' : 'text-white/40',
                      )}
                    >
                      {wordCount} / {config.minWords} words
                    </span>
                  </div>
                </div>

                {/* Targets */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Target className="h-3 w-3" />
                    Use highlighted vocabulary words in your story
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isPaused || wordCount < 10}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all',
                      wordCount >= 10
                        ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:bg-pink-500'
                        : 'bg-white/5 text-white/30 cursor-not-allowed',
                    )}
                  >
                    <PenTool className="h-4 w-4" />
                    Submit Story
                  </button>
                </div>
              </>
            )}

            {phase === 'result' && roundScores.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-violet-300">
                    <Sparkles className="h-4 w-4" />
                    Story Scored!
                  </div>
                  <span className="text-lg font-bold text-amber-400">
                    {roundScores[roundScores.length - 1].total} pts
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {roundScores[roundScores.length - 1].details.map((d, i) => (
                    <p key={i} className="text-xs text-white/60">{d}</p>
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all hover:bg-pink-500"
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
