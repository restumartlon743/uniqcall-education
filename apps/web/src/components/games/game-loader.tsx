'use client'

import type { ComponentType } from 'react'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Gamepad2, Loader2 } from 'lucide-react'
import type { GameDefinition, GameDifficulty } from '@/lib/game-data'
import { calculateXP, getAccuracyPercent } from '@/lib/game-utils'
import { GameShell } from './game-shell'

// ─── Lazy-loaded game components ──────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GAME_COMPONENTS: Record<string, ComponentType<any>> = {
  'logic-grid-puzzle': dynamic(
    () => import('./archetypes/logic-grid-puzzle'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'theorem-prover': dynamic(
    () => import('./archetypes/theorem-prover'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'pattern-decoder': dynamic(
    () => import('./archetypes/pattern-decoder'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'circuit-builder': dynamic(
    () => import('./archetypes/circuit-builder'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'bridge-constructor': dynamic(
    () => import('./archetypes/bridge-constructor'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'code-machine': dynamic(
    () => import('./archetypes/code-machine'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'justice-scales': dynamic(
    () => import('./archetypes/justice-scales'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'rule-architect': dynamic(
    () => import('./archetypes/rule-architect'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'war-room': dynamic(
    () => import('./archetypes/war-room'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'startup-simulator': dynamic(
    () => import('./archetypes/startup-simulator'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'chess-tactics': dynamic(
    () => import('./archetypes/chess-tactics'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'idea-factory': dynamic(
    () => import('./archetypes/idea-factory'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'color-harmonizer': dynamic(
    () => import('./archetypes/color-harmonizer'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'invention-lab': dynamic(
    () => import('./archetypes/invention-lab'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'pixel-precision': dynamic(
    () => import('./archetypes/pixel-precision'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'symmetry-studio': dynamic(
    () => import('./archetypes/symmetry-studio'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'typography-challenge': dynamic(
    () => import('./archetypes/typography-challenge'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'story-weaver': dynamic(
    () => import('./archetypes/story-weaver'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'debate-arena': dynamic(
    () => import('./archetypes/debate-arena'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'word-architect': dynamic(
    () => import('./archetypes/word-architect'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'rhythm-catcher': dynamic(
    () => import('./archetypes/rhythm-catcher'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'scene-director': dynamic(
    () => import('./archetypes/scene-director'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'emoji-charades': dynamic(
    () => import('./archetypes/emoji-charades'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'empathy-simulator': dynamic(
    () => import('./archetypes/empathy-simulator'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'triage-trainer': dynamic(
    () => import('./archetypes/triage-trainer'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'wellness-garden': dynamic(
    () => import('./archetypes/wellness-garden'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'peace-table': dynamic(
    () => import('./archetypes/peace-table'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'culture-bridge': dynamic(
    () => import('./archetypes/culture-bridge'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'translation-challenge': dynamic(
    () => import('./archetypes/translation-challenge'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'field-journal': dynamic(
    () => import('./archetypes/field-journal'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'geo-tracker': dynamic(
    () => import('./archetypes/geo-tracker'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'mystery-lab': dynamic(
    () => import('./archetypes/mystery-lab'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'teach-back-challenge': dynamic(
    () => import('./archetypes/teach-back-challenge'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'study-plan-designer': dynamic(
    () => import('./archetypes/study-plan-designer'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'future-builder': dynamic(
    () => import('./archetypes/future-builder'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'trend-spotter': dynamic(
    () => import('./archetypes/trend-spotter'),
    { loading: () => <GameLoadingSpinner /> },
  ),
  'innovation-pitch': dynamic(
    () => import('./archetypes/innovation-pitch'),
    { loading: () => <GameLoadingSpinner /> },
  ),
}

function GameLoadingSpinner() {
  return (
    <div className="flex h-96 flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      <p className="text-xs text-white/40">Loading game…</p>
    </div>
  )
}

// ─── Game Loader ──────────────────────────────────────────────

interface GameLoaderProps {
  game: GameDefinition
}

export function GameLoader({ game }: GameLoaderProps) {
  const router = useRouter()
  const [difficulty, setDifficulty] = useState<GameDifficulty>(game.difficulty[0])
  const [score, setScore] = useState(0)
  const [maxScore, setMaxScore] = useState(100)
  const [isGameOver, setIsGameOver] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [key, setKey] = useState(0)

  const handleScoreUpdate = useCallback(
    (newScore: number, newMaxScore: number) => {
      setScore(newScore)
      setMaxScore(newMaxScore)
    },
    [],
  )

  const handleGameOver = useCallback(
    (finalScore: number, finalMaxScore: number) => {
      setScore(finalScore)
      setMaxScore(finalMaxScore)
      setIsGameOver(true)

      const accuracy = getAccuracyPercent(finalScore, finalMaxScore)
      const xp = calculateXP({
        baseXP: game.xpRange[0] + Math.round(
          ((game.xpRange[1] - game.xpRange[0]) * accuracy) / 100,
        ),
        accuracy,
        difficulty,
        streakDays: 0,
      })
      setXpEarned(xp)
    },
    [difficulty, game.xpRange],
  )

  const handleRestart = useCallback(() => {
    setScore(0)
    setMaxScore(100)
    setIsGameOver(false)
    setXpEarned(0)
    setIsPaused(false)
    setKey((k) => k + 1)
  }, [])

  const handleExit = useCallback(() => {
    router.push('/student/games')
  }, [router])

  const GameComponent = GAME_COMPONENTS[game.slug]

  return (
    <GameShell
      key={key}
      gameSlug={game.slug}
      gameName={game.name}
      archetype={game.archetype}
      difficulty={difficulty}
      onDifficultyChange={(d) => {
        setDifficulty(d)
        handleRestart()
      }}
      score={score}
      maxScore={maxScore}
      timeLimit={undefined}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      onExit={handleExit}
      xpEarned={xpEarned}
    >
      {GameComponent ? (
        <GameComponent
          difficulty={difficulty}
          onScoreUpdate={handleScoreUpdate}
          onGameOver={handleGameOver}
          isPaused={isPaused}
        />
      ) : (
        <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 bg-white/2">
          <Gamepad2 className="h-12 w-12 text-purple-400/40" />
          <div className="text-center">
            <p className="text-sm font-semibold text-white/60">
              {game.name}
            </p>
            <p className="mt-1 text-xs text-white/30">
              Game component not yet implemented — coming soon!
            </p>
          </div>
        </div>
      )}
    </GameShell>
  )
}
