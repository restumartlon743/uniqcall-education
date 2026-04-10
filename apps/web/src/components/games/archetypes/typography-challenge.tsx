'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Type,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type FontSize = 'small' | 'medium' | 'large'
type FontWeight = 'normal' | 'bold'
type LetterSpacing = 'tight' | 'normal' | 'wide'
type TextAlign = 'left' | 'center' | 'right'
type TextTransform = 'none' | 'uppercase' | 'capitalize'
type LineHeight = 'compact' | 'normal' | 'relaxed'
type FontStyle = 'normal' | 'italic'

interface TypoSettings {
  fontSize: FontSize
  fontWeight: FontWeight
  letterSpacing: LetterSpacing
  textAlign: TextAlign
  color: string
  textTransform: TextTransform
  lineHeight: LineHeight
  fontStyle: FontStyle
}

interface Challenge {
  heading: string
  body: string
  target: TypoSettings
  properties: (keyof TypoSettings)[]
}

interface RoundResult {
  score: number
  matched: number
  total: number
}

interface TypographyChallengeProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const COLOR_OPTIONS = ['#FFFFFF', '#8B5CF6', '#06B6D4', '#EAB308', '#EF4444', '#22C55E', '#EC4899']

const FONT_SIZE_MAP: Record<FontSize, string> = { small: 'text-sm', medium: 'text-base', large: 'text-xl' }
const FONT_WEIGHT_MAP: Record<FontWeight, string> = { normal: 'font-normal', bold: 'font-bold' }
const LETTER_SPACING_MAP: Record<LetterSpacing, string> = { tight: 'tracking-tight', normal: 'tracking-normal', wide: 'tracking-widest' }
const TEXT_ALIGN_MAP: Record<TextAlign, string> = { left: 'text-left', center: 'text-center', right: 'text-right' }
const TEXT_TRANSFORM_MAP: Record<TextTransform, string> = { none: 'normal-case', uppercase: 'uppercase', capitalize: 'capitalize' }
const LINE_HEIGHT_MAP: Record<LineHeight, string> = { compact: 'leading-tight', normal: 'leading-normal', relaxed: 'leading-relaxed' }
const FONT_STYLE_MAP: Record<FontStyle, string> = { normal: 'not-italic', italic: 'italic' }

const HEADINGS = [
  'Breaking News Today',
  'Design Excellence',
  'Future of Learning',
  'Creative Workshop',
  'The Big Idea',
  'Innovation Summit',
  'Digital Dreams',
]

const BODIES = [
  'Discover the latest trends in modern design and creative thinking for a better tomorrow.',
  'Explore innovative solutions that shape the future of education and technology worldwide.',
  'Join us on a journey through cutting-edge ideas and transformative experiences.',
  'Unleash your potential with tools and techniques designed for the next generation.',
  'A comprehensive guide to mastering the art of visual communication and beyond.',
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

const ALL_PROPS: (keyof TypoSettings)[] = [
  'fontSize', 'fontWeight', 'letterSpacing', 'textAlign', 'color', 'textTransform', 'lineHeight', 'fontStyle',
]

function getPropertyCount(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 3
    case 'medium': return 5
    case 'hard': return 7
    case 'extreme': return 8
  }
}

function randomSettings(): TypoSettings {
  return {
    fontSize: pick<FontSize>(['small', 'medium', 'large']),
    fontWeight: pick<FontWeight>(['normal', 'bold']),
    letterSpacing: pick<LetterSpacing>(['tight', 'normal', 'wide']),
    textAlign: pick<TextAlign>(['left', 'center', 'right']),
    color: pick(COLOR_OPTIONS),
    textTransform: pick<TextTransform>(['none', 'uppercase', 'capitalize']),
    lineHeight: pick<LineHeight>(['compact', 'normal', 'relaxed']),
    fontStyle: pick<FontStyle>(['normal', 'italic']),
  }
}

function defaultSettings(): TypoSettings {
  return {
    fontSize: 'medium',
    fontWeight: 'normal',
    letterSpacing: 'normal',
    textAlign: 'left',
    color: '#FFFFFF',
    textTransform: 'none',
    lineHeight: 'normal',
    fontStyle: 'normal',
  }
}

function generateChallenges(difficulty: GameDifficulty): Challenge[] {
  const count = 5
  const propCount = getPropertyCount(difficulty)
  const headings = shuffle(HEADINGS)
  const bodies = shuffle(BODIES)

  return Array.from({ length: count }, (_, i) => {
    const props = shuffle(ALL_PROPS).slice(0, propCount) as (keyof TypoSettings)[]
    return {
      heading: headings[i % headings.length],
      body: bodies[i % bodies.length],
      target: randomSettings(),
      properties: props,
    }
  })
}

function getStyleClasses(settings: TypoSettings): string {
  return cn(
    FONT_SIZE_MAP[settings.fontSize],
    FONT_WEIGHT_MAP[settings.fontWeight],
    LETTER_SPACING_MAP[settings.letterSpacing],
    TEXT_ALIGN_MAP[settings.textAlign],
    TEXT_TRANSFORM_MAP[settings.textTransform],
    LINE_HEIGHT_MAP[settings.lineHeight],
    FONT_STYLE_MAP[settings.fontStyle],
  )
}

const TOTAL_ROUNDS = 5

// ─── Component ────────────────────────────────────────────────

export default function TypographyChallenge({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: TypographyChallengeProps) {
  const challenges = useMemo(() => generateChallenges(difficulty), [difficulty])
  const maxScore = TOTAL_ROUNDS * 100

  const [currentRound, setCurrentRound] = useState(0)
  const [playerSettings, setPlayerSettings] = useState<TypoSettings>(defaultSettings)
  const [results, setResults] = useState<RoundResult[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)

  const challenge = challenges[currentRound]

  const updateSetting = useCallback(
    <K extends keyof TypoSettings>(key: K, value: TypoSettings[K]) => {
      if (submitted || isPaused) return
      setPlayerSettings((prev) => ({ ...prev, [key]: value }))
    },
    [submitted, isPaused],
  )

  const handleSubmit = useCallback(() => {
    if (submitted) return
    setSubmitted(true)

    let matched = 0
    challenge.properties.forEach((prop) => {
      if (playerSettings[prop] === challenge.target[prop]) matched++
    })
    const score = Math.round((matched / challenge.properties.length) * 100)

    const result: RoundResult = { score, matched, total: challenge.properties.length }
    const newResults = [...results, result]
    setResults(newResults)

    const totalScore = newResults.reduce((s, r) => s + r.score, 0)
    onScoreUpdate(totalScore, maxScore)
  }, [submitted, challenge, playerSettings, results, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (currentRound + 1 >= TOTAL_ROUNDS) {
      setGameFinished(true)
      const totalScore = results.reduce((s, r) => s + r.score, 0)
      onGameOver(totalScore, maxScore)
    } else {
      setCurrentRound((r) => r + 1)
      setPlayerSettings(defaultSettings())
      setSubmitted(false)
    }
  }, [currentRound, results, maxScore, onGameOver])

  const totalScore = results.reduce((s, r) => s + r.score, 0)
  const lastResult = submitted && results.length > 0 ? results[results.length - 1] : null

  // Render control for a property
  const renderControl = (prop: keyof TypoSettings) => {
    switch (prop) {
      case 'fontSize':
        return (
          <OptionRow key={prop} label="Font Size" options={['small', 'medium', 'large']}
            value={playerSettings.fontSize}
            correctValue={submitted ? challenge.target.fontSize : undefined}
            onChange={(v) => updateSetting('fontSize', v as FontSize)}
            disabled={submitted}
          />
        )
      case 'fontWeight':
        return (
          <OptionRow key={prop} label="Font Weight" options={['normal', 'bold']}
            value={playerSettings.fontWeight}
            correctValue={submitted ? challenge.target.fontWeight : undefined}
            onChange={(v) => updateSetting('fontWeight', v as FontWeight)}
            disabled={submitted}
          />
        )
      case 'letterSpacing':
        return (
          <OptionRow key={prop} label="Letter Spacing" options={['tight', 'normal', 'wide']}
            value={playerSettings.letterSpacing}
            correctValue={submitted ? challenge.target.letterSpacing : undefined}
            onChange={(v) => updateSetting('letterSpacing', v as LetterSpacing)}
            disabled={submitted}
          />
        )
      case 'textAlign':
        return (
          <OptionRow key={prop} label="Alignment" options={['left', 'center', 'right']}
            value={playerSettings.textAlign}
            correctValue={submitted ? challenge.target.textAlign : undefined}
            onChange={(v) => updateSetting('textAlign', v as TextAlign)}
            disabled={submitted}
          />
        )
      case 'color':
        return (
          <div key={prop} className="flex items-center gap-3">
            <span className="w-28 text-xs text-white/50">Color</span>
            <div className="flex gap-1.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => updateSetting('color', c)}
                  disabled={submitted}
                  className={cn(
                    'h-7 w-7 rounded-md border-2 transition-all',
                    playerSettings.color === c
                      ? 'scale-110 border-white shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                      : 'border-white/10 hover:border-white/30',
                    submitted && challenge.target.color === c && playerSettings.color !== c
                      && 'ring-2 ring-emerald-500',
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )
      case 'textTransform':
        return (
          <OptionRow key={prop} label="Transform" options={['none', 'uppercase', 'capitalize']}
            value={playerSettings.textTransform}
            correctValue={submitted ? challenge.target.textTransform : undefined}
            onChange={(v) => updateSetting('textTransform', v as TextTransform)}
            disabled={submitted}
          />
        )
      case 'lineHeight':
        return (
          <OptionRow key={prop} label="Line Height" options={['compact', 'normal', 'relaxed']}
            value={playerSettings.lineHeight}
            correctValue={submitted ? challenge.target.lineHeight : undefined}
            onChange={(v) => updateSetting('lineHeight', v as LineHeight)}
            disabled={submitted}
          />
        )
      case 'fontStyle':
        return (
          <OptionRow key={prop} label="Font Style" options={['normal', 'italic']}
            value={playerSettings.fontStyle}
            correctValue={submitted ? challenge.target.fontStyle : undefined}
            onChange={(v) => updateSetting('fontStyle', v as FontStyle)}
            disabled={submitted}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
      {/* Round indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < currentRound && results[i]?.score >= 70 && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i < currentRound && results[i]?.score < 70 && 'border-amber-500/40 bg-amber-500/15 text-amber-400',
              i === currentRound && !gameFinished && 'border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
              i > currentRound && 'border-white/10 bg-white/5 text-white/20',
              i === currentRound && gameFinished && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
            )}
          >
            {i < results.length ? (
              results[i].score >= 70 ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
            ) : (
              i + 1
            )}
          </div>
        ))}
      </div>

      {!gameFinished && (
        <>
          {/* Two columns: Target and Player */}
          <motion.div
            key={currentRound}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid w-full grid-cols-2 gap-4"
          >
            {/* Target */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                <Eye className="h-3 w-3" />
                Target
              </div>
              <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-4">
                <h4
                  className={cn(getStyleClasses(challenge.target), 'mb-2')}
                  style={{ color: challenge.target.color }}
                >
                  {challenge.heading}
                </h4>
                <p
                  className={cn(getStyleClasses(challenge.target), 'text-xs opacity-70')}
                  style={{ color: challenge.target.color }}
                >
                  {challenge.body}
                </p>
              </div>
            </div>

            {/* Player Preview */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                <Type className="h-3 w-3" />
                Your Attempt
              </div>
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                <h4
                  className={cn(getStyleClasses(playerSettings), 'mb-2')}
                  style={{ color: playerSettings.color }}
                >
                  {challenge.heading}
                </h4>
                <p
                  className={cn(getStyleClasses(playerSettings), 'text-xs opacity-70')}
                  style={{ color: playerSettings.color }}
                >
                  {challenge.body}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="w-full space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/30">
              Adjust {challenge.properties.length} properties to match
            </p>
            {challenge.properties.map((prop) => renderControl(prop))}
          </div>

          {/* Submit */}
          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-6 py-2.5 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20"
            >
              <CheckCircle2 className="h-4 w-4" />
              Submit
            </button>
          ) : lastResult ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-sm text-white/60">
                Matched: <span className={cn(
                  'font-bold',
                  lastResult.score >= 80 ? 'text-emerald-400' : lastResult.score >= 50 ? 'text-amber-400' : 'text-red-400',
                )}>
                  {lastResult.matched}/{lastResult.total}
                </span>
                — Score: <span className="font-bold text-violet-400">{lastResult.score}</span>/100
              </p>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-6 py-2.5 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-500/20"
              >
                {currentRound + 1 >= TOTAL_ROUNDS ? 'Finish' : 'Next Challenge'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : null}
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
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/40">Total Score</p>
              <p className="text-2xl font-bold text-violet-400">{totalScore}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/40">Max Possible</p>
              <p className="text-2xl font-bold text-cyan-400">{maxScore}</p>
            </div>
          </div>
          <div className="w-full space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm">
                <span className="text-white/60">R{i + 1}: {r.matched}/{r.total} matched</span>
                <span className={cn(
                  'font-bold',
                  r.score >= 80 ? 'text-emerald-400' : r.score >= 50 ? 'text-amber-400' : 'text-red-400',
                )}>{r.score}/100</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ─── Sub-Component: Option Row ────────────────────────────────

function OptionRow({
  label,
  options,
  value,
  correctValue,
  onChange,
  disabled,
}: {
  label: string
  options: string[]
  value: string
  correctValue?: string
  onChange: (v: string) => void
  disabled: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-xs text-white/50">{label}</span>
      <div className="flex gap-1.5">
        {options.map((opt) => {
          const isSelected = value === opt
          const isCorrect = correctValue === opt
          const isWrong = disabled && isSelected && correctValue !== undefined && !isCorrect
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              disabled={disabled}
              className={cn(
                'rounded-lg border px-3 py-1 text-xs font-medium transition-all',
                isSelected && !disabled && 'border-violet-500/40 bg-violet-500/15 text-violet-300',
                !isSelected && !disabled && 'border-white/10 bg-white/5 text-white/50 hover:border-white/20',
                isSelected && disabled && !isWrong && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
                isWrong && 'border-red-500/40 bg-red-500/15 text-red-300',
                isCorrect && disabled && !isSelected && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30',
                !isSelected && disabled && !isCorrect && 'border-white/5 bg-white/3 text-white/20',
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
