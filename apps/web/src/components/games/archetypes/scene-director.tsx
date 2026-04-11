'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Clapperboard,
  ArrowRight,
  Check,
  X,
  CheckCircle2,
  Star,
  Users,
  Sparkles,
  User,
  Smile,
  Frown,
  Angry,
  Meh,
  Laugh,
  Gavel,
  Briefcase,
  Trophy,
  GraduationCap,
  Shield,
  Heart,
  BookOpen,
  Tent,
  ClipboardList,
  Laptop,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'excited'
type Position = 'left' | 'center-left' | 'center' | 'center-right' | 'right'

interface Character {
  id: string
  name: string
  role: string
  icon: LucideIcon
}

interface SceneSetup {
  id: string
  title: string
  description: string
  directions: string
  characters: Character[]
  correctPlacements: { characterId: string; position: Position; emotion: Emotion }[]
}

interface SceneDirectorProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const EMOTIONS: { value: Emotion; label: string; icon: LucideIcon }[] = [
  { value: 'happy', label: 'Happy', icon: Smile },
  { value: 'sad', label: 'Sad', icon: Frown },
  { value: 'angry', label: 'Angry', icon: Angry },
  { value: 'neutral', label: 'Neutral', icon: Meh },
  { value: 'excited', label: 'Excited', icon: Laugh },
]

const POSITIONS: Position[] = ['left', 'center-left', 'center', 'center-right', 'right']
const POSITION_LABELS: Record<Position, string> = {
  left: 'Stage Left',
  'center-left': 'Center-Left',
  center: 'Center Stage',
  'center-right': 'Center-Right',
  right: 'Stage Right',
}

const ALL_SCENES: SceneSetup[] = [
  {
    id: 's1',
    title: 'The Surprise Party',
    description: 'Friends have gathered to surprise Maya on her birthday.',
    directions: 'Maya enters from stage right, looking surprised. Her best friend Lena stands center stage holding the cake, beaming with joy. Tom is on the far left, excitedly waving balloons.',
    characters: [
      { id: 'maya', name: 'Maya', role: 'Birthday girl', icon: User },
      { id: 'lena', name: 'Lena', role: 'Best friend', icon: User },
      { id: 'tom', name: 'Tom', role: 'Friend with balloons', icon: User },
    ],
    correctPlacements: [
      { characterId: 'maya', position: 'right', emotion: 'excited' },
      { characterId: 'lena', position: 'center', emotion: 'happy' },
      { characterId: 'tom', position: 'left', emotion: 'excited' },
    ],
  },
  {
    id: 's2',
    title: 'The Farewell',
    description: 'A soldier departs while family watches from the platform.',
    directions: 'Captain Ravi stands center stage, looking neutral and composed. His mother stands to his immediate left, crying. His young sister Priya is on the far right, waving sadly.',
    characters: [
      { id: 'ravi', name: 'Captain Ravi', role: 'Soldier', icon: User },
      { id: 'mother', name: 'Mother', role: 'Ravi\'s mother', icon: User },
      { id: 'priya', name: 'Priya', role: 'Young sister', icon: User },
    ],
    correctPlacements: [
      { characterId: 'ravi', position: 'center', emotion: 'neutral' },
      { characterId: 'mother', position: 'center-left', emotion: 'sad' },
      { characterId: 'priya', position: 'right', emotion: 'sad' },
    ],
  },
  {
    id: 's3',
    title: 'The Courtroom Verdict',
    description: 'The judge announces the verdict in a tense trial.',
    directions: 'Judge Park stands center, maintaining a neutral expression. The defendant Alex is positioned to the right of center, looking worried and sad. The prosecutor Ms. Chen is on the left, looking neutral and professional.',
    characters: [
      { id: 'park', name: 'Judge Park', role: 'Judge', icon: Gavel },
      { id: 'alex', name: 'Alex', role: 'The defendant', icon: User },
      { id: 'chen', name: 'Ms. Chen', role: 'Prosecutor', icon: Briefcase },
    ],
    correctPlacements: [
      { characterId: 'park', position: 'center', emotion: 'neutral' },
      { characterId: 'alex', position: 'center-right', emotion: 'sad' },
      { characterId: 'chen', position: 'left', emotion: 'neutral' },
    ],
  },
  {
    id: 's4',
    title: 'The Championship Victory',
    description: 'The team celebrates after winning the final match.',
    directions: 'Star player Kai stands center holding the trophy, absolutely thrilled. Coach Silva is to the far left, happy and clapping. Goalkeeper Mia is to Kai\'s right, excited and cheering. Team captain Dante stands far right, pumping his fist with joy.',
    characters: [
      { id: 'kai', name: 'Kai', role: 'Star player', icon: Trophy },
      { id: 'silva', name: 'Coach Silva', role: 'Coach', icon: GraduationCap },
      { id: 'mia', name: 'Mia', role: 'Goalkeeper', icon: Shield },
      { id: 'dante', name: 'Dante', role: 'Team captain', icon: Star },
    ],
    correctPlacements: [
      { characterId: 'kai', position: 'center', emotion: 'excited' },
      { characterId: 'silva', position: 'left', emotion: 'happy' },
      { characterId: 'mia', position: 'center-right', emotion: 'excited' },
      { characterId: 'dante', position: 'right', emotion: 'happy' },
    ],
  },
  {
    id: 's5',
    title: 'The Family Argument',
    description: 'A heated discussion at the dinner table.',
    directions: 'Father stands center-left, angry and pointing. Mother is center, trying to be calm and neutral. Teenage daughter Lily is center-right, looking angry back at her father. Younger brother Sam sits far right, looking sad and uncomfortable.',
    characters: [
      { id: 'father', name: 'Father', role: 'Dad', icon: User },
      { id: 'mother', name: 'Mother', role: 'Mom', icon: User },
      { id: 'lily', name: 'Lily', role: 'Teenage daughter', icon: User },
      { id: 'sam', name: 'Sam', role: 'Younger brother', icon: User },
    ],
    correctPlacements: [
      { characterId: 'father', position: 'center-left', emotion: 'angry' },
      { characterId: 'mother', position: 'center', emotion: 'neutral' },
      { characterId: 'lily', position: 'center-right', emotion: 'angry' },
      { characterId: 'sam', position: 'right', emotion: 'sad' },
    ],
  },
  {
    id: 's6',
    title: 'The Wedding Ceremony',
    description: 'A beautiful outdoor wedding is about to begin.',
    directions: 'The officiant Dr. Reed stands center stage, calm and neutral. Bride Elena is to the left of center, absolutely beaming with happiness. Groom Marcus is to the right of center, also radiantly happy. Best man Jake stands far right, happily holding the rings. Maid of honor Sofia is far left, excited and emotional.',
    characters: [
      { id: 'reed', name: 'Dr. Reed', role: 'Officiant', icon: Gavel },
      { id: 'elena', name: 'Elena', role: 'Bride', icon: Heart },
      { id: 'marcus', name: 'Marcus', role: 'Groom', icon: User },
      { id: 'jake', name: 'Jake', role: 'Best man', icon: User },
      { id: 'sofia', name: 'Sofia', role: 'Maid of honor', icon: Sparkles },
    ],
    correctPlacements: [
      { characterId: 'reed', position: 'center', emotion: 'neutral' },
      { characterId: 'elena', position: 'center-left', emotion: 'happy' },
      { characterId: 'marcus', position: 'center-right', emotion: 'happy' },
      { characterId: 'jake', position: 'right', emotion: 'happy' },
      { characterId: 'sofia', position: 'left', emotion: 'excited' },
    ],
  },
  {
    id: 's7',
    title: 'The Ghost Story',
    description: 'Students tell ghost stories around a campfire.',
    directions: 'Narrator Emma sits center, looking excited as she tells the story. Scared student Leo is to the far left, looking sad and frightened. Brave student Zara sits to the right of center, neutral and unimpressed. Camp counselor Mr. Blake stands far right, looking happy and amused.',
    characters: [
      { id: 'emma', name: 'Emma', role: 'Narrator', icon: BookOpen },
      { id: 'leo', name: 'Leo', role: 'Scared listener', icon: User },
      { id: 'zara', name: 'Zara', role: 'Brave student', icon: Shield },
      { id: 'blake', name: 'Mr. Blake', role: 'Counselor', icon: Tent },
    ],
    correctPlacements: [
      { characterId: 'emma', position: 'center', emotion: 'excited' },
      { characterId: 'leo', position: 'left', emotion: 'sad' },
      { characterId: 'zara', position: 'center-right', emotion: 'neutral' },
      { characterId: 'blake', position: 'right', emotion: 'happy' },
    ],
  },
  {
    id: 's8',
    title: 'The Job Interview',
    description: 'A panel interview at a big corporation.',
    directions: 'Candidate Nia sits center, looking neutral but composed. The CEO Ms. Tanaka is center-left, with a neutral expression. HR manager Dave is on the far left, smiling and happy. The technical lead Omar is center-right, with a neutral, analytical expression.',
    characters: [
      { id: 'nia', name: 'Nia', role: 'Candidate', icon: Briefcase },
      { id: 'tanaka', name: 'Ms. Tanaka', role: 'CEO', icon: User },
      { id: 'dave', name: 'Dave', role: 'HR Manager', icon: ClipboardList },
      { id: 'omar', name: 'Omar', role: 'Tech Lead', icon: Laptop },
    ],
    correctPlacements: [
      { characterId: 'nia', position: 'center', emotion: 'neutral' },
      { characterId: 'tanaka', position: 'center-left', emotion: 'neutral' },
      { characterId: 'dave', position: 'left', emotion: 'happy' },
      { characterId: 'omar', position: 'center-right', emotion: 'neutral' },
    ],
  },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { sceneCount: 3, maxChars: 3, multiplier: 1 }
    case 'medium':
      return { sceneCount: 4, maxChars: 4, multiplier: 1.5 }
    case 'hard':
      return { sceneCount: 5, maxChars: 5, multiplier: 2 }
    case 'extreme':
      return { sceneCount: 5, maxChars: 5, multiplier: 3 }
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

export default function SceneDirector({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: SceneDirectorProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const scenes = useMemo(() => {
    const filtered = ALL_SCENES.filter((s) => s.characters.length <= config.maxChars)
    return shuffle(filtered).slice(0, config.sceneCount)
  }, [config])

  const [sceneIndex, setSceneIndex] = useState(0)
  const [placements, setPlacements] = useState<Record<string, Position>>({})
  const [emotions, setEmotions] = useState<Record<string, Emotion>>({})
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [sceneScores, setSceneScores] = useState<{ positionScore: number; emotionScore: number; total: number }[]>([])
  const [phase, setPhase] = useState<'place' | 'result'>('place')
  const [gameFinished, setGameFinished] = useState(false)

  const currentScene = scenes[sceneIndex]
  const maxScorePerScene = Math.round(100 * config.multiplier)
  const maxScore = scenes.length * maxScorePerScene

  const allPlaced = currentScene
    ? currentScene.characters.every((c) => placements[c.id] && emotions[c.id])
    : false

  const handleSelectCharacter = useCallback((id: string) => {
    if (isPaused || phase !== 'place') return
    setSelectedCharacter(id)
  }, [isPaused, phase])

  const handlePlacePosition = useCallback((pos: Position) => {
    if (!selectedCharacter || isPaused || phase !== 'place') return
    setPlacements((p) => ({ ...p, [selectedCharacter]: pos }))
  }, [selectedCharacter, isPaused, phase])

  const handleSetEmotion = useCallback((charId: string, emotion: Emotion) => {
    if (isPaused || phase !== 'place') return
    setEmotions((e) => ({ ...e, [charId]: emotion }))
  }, [isPaused, phase])

  const handleSubmit = useCallback(() => {
    if (!allPlaced || !currentScene) return

    let posCorrect = 0
    let emoCorrect = 0
    const total = currentScene.characters.length

    for (const correct of currentScene.correctPlacements) {
      if (placements[correct.characterId] === correct.position) posCorrect++
      if (emotions[correct.characterId] === correct.emotion) emoCorrect++
    }

    const positionScore = Math.round((posCorrect / total) * 50)
    const emotionScore = Math.round((emoCorrect / total) * 50)
    const roundTotal = Math.round((positionScore + emotionScore) * config.multiplier)

    const newScores = [...sceneScores, { positionScore, emotionScore, total: roundTotal }]
    setSceneScores(newScores)
    setPhase('result')

    const totalScore = newScores.reduce((a, b) => a + b.total, 0)
    onScoreUpdate(totalScore, maxScore)
  }, [allPlaced, currentScene, placements, emotions, config.multiplier, sceneScores, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (sceneIndex + 1 >= scenes.length) {
      setGameFinished(true)
      const finalScore = sceneScores.reduce((a, b) => a + b.total, 0)
      onGameOver(finalScore, maxScore)
    } else {
      setSceneIndex((i) => i + 1)
      setPlacements({})
      setEmotions({})
      setSelectedCharacter(null)
      setPhase('place')
    }
  }, [sceneIndex, scenes.length, sceneScores, maxScore, onGameOver])

  if (!currentScene && !gameFinished) return null

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-5">
      {/* Scene indicators */}
      <div className="flex items-center gap-2">
        {scenes.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < sceneIndex && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === sceneIndex && !gameFinished && 'border-amber-500/50 bg-amber-500/15 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]',
              i > sceneIndex && 'border-white/10 bg-white/5 text-white/20',
              i === sceneIndex && gameFinished && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
            )}
          >
            {i < sceneScores.length ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
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
          <p className="text-xl font-bold text-white">Direction Complete!</p>
          <p className="text-sm text-white/60">
            Total Score: {sceneScores.reduce((a, b) => a + b.total, 0)} / {maxScore}
          </p>
          {sceneScores.map((s, i) => (
            <div key={i} className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-xs text-white/60">Scene {i + 1}: {scenes[i]?.title}</span>
              <div className="flex gap-3 text-xs">
                <span className="text-cyan-300">Pos: {s.positionScore}/50</span>
                <span className="text-pink-300">Emo: {s.emotionScore}/50</span>
                <span className="font-bold text-amber-400">{s.total} pts</span>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full flex-col gap-4"
          >
            {/* Scene description */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                <Clapperboard className="h-4 w-4" />
                Scene {sceneIndex + 1}: {currentScene.title}
              </div>
              <p className="mt-1 text-xs text-white/50">{currentScene.description}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/80">{currentScene.directions}</p>
            </div>

            {phase === 'place' && (
              <>
                {/* Stage view */}
                <div className="relative rounded-xl border border-white/10 bg-gradient-to-b from-[#151B3B] to-[#0A0E27] p-4">
                  <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-white/20">Stage</p>
                  <div className="grid grid-cols-5 gap-2" style={{ minHeight: 120 }}>
                    {POSITIONS.map((pos) => {
                      const charHere = currentScene.characters.find((c) => placements[c.id] === pos)
                      const emotion = charHere ? emotions[charHere.id] : undefined
                      const EmotionIcon = EMOTIONS.find((e) => e.value === emotion)?.icon
                      return (
                        <button
                          key={pos}
                          onClick={() => handlePlacePosition(pos)}
                          className={cn(
                            'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-3 transition-all',
                            charHere
                              ? 'border-amber-500/30 bg-amber-500/10'
                              : selectedCharacter
                                ? 'border-white/20 bg-white/5 hover:border-amber-500/30 hover:bg-amber-500/5'
                                : 'border-white/10 bg-white/3',
                          )}
                        >
                          {charHere ? (
                            <div className="flex flex-col items-center gap-1">
                              {(() => { const Icon = charHere.icon; return <Icon className="h-6 w-6 text-amber-300" />; })()}
                              <span className="text-[10px] font-bold text-white/80">{charHere.name}</span>
                              {EmotionIcon && <EmotionIcon className="h-5 w-5 text-white/70" />}
                            </div>
                          ) : (
                            <span className="text-[9px] text-white/30">{POSITION_LABELS[pos]}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Character selection */}
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    <Users className="mr-1 inline h-3 w-3" />
                    Select a character, then click a stage position
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {currentScene.characters.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectCharacter(c.id)}
                        className={cn(
                          'flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all',
                          selectedCharacter === c.id
                            ? 'border-amber-500/40 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                            : 'border-white/10 bg-white/5 hover:border-white/20',
                        )}
                      >
                        {(() => { const Icon = c.icon; return <Icon className="h-5 w-5 text-white/80" />; })()}
                        <div>
                          <p className="text-xs font-bold text-white/80">{c.name}</p>
                          <p className="text-[10px] text-white/40">{c.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emotion pickers */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    <Sparkles className="mr-1 inline h-3 w-3" />
                    Set each character&apos;s emotion
                  </p>
                  {currentScene.characters.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/3 px-3 py-2">
                      {(() => { const Icon = c.icon; return <Icon className="h-4 w-4 text-white/60" />; })()}
                      <span className="w-16 text-xs font-bold text-white/60">{c.name}</span>
                      <div className="flex gap-1.5">
                        {EMOTIONS.map((em) => (
                          <button
                            key={em.value}
                            onClick={() => handleSetEmotion(c.id, em.value)}
                            className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-lg border text-base transition-all',
                              emotions[c.id] === em.value
                                ? 'border-amber-500/40 bg-amber-500/15 scale-110'
                                : 'border-white/10 bg-white/5 hover:border-white/20',
                            )}
                            title={em.label}
                          >
                            {(() => { const Icon = em.icon; return <Icon className="h-4 w-4" />; })()}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!allPlaced}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all',
                    allPlaced
                      ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:bg-amber-500'
                      : 'bg-white/5 text-white/30 cursor-not-allowed',
                  )}
                >
                  <Clapperboard className="h-4 w-4" />
                  Action! Submit Scene
                </button>
              </>
            )}

            {phase === 'result' && sceneScores.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-300">Scene Scored!</span>
                  <span className="text-lg font-bold text-amber-400">{sceneScores[sceneScores.length - 1].total} pts</span>
                </div>

                {/* Show corrections */}
                <div className="flex flex-col gap-2">
                  {currentScene.correctPlacements.map((cp) => {
                    const char = currentScene.characters.find((c) => c.id === cp.characterId)
                    const playerPos = placements[cp.characterId]
                    const playerEmo = emotions[cp.characterId]
                    const posCorrect = playerPos === cp.position
                    const emoCorrect = playerEmo === cp.emotion
                    return (
                      <div key={cp.characterId} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">
                        {(() => { const Icon = char?.icon || User; return <Icon className="h-4 w-4 text-white/60" />; })()}
                        <span className="w-20 font-bold text-white/60">{char?.name}</span>
                        <div className="flex gap-3">
                          <span className={cn(posCorrect ? 'text-emerald-400' : 'text-red-400')}>
                            {posCorrect ? <Check className="mr-0.5 inline h-3 w-3" /> : <X className="mr-0.5 inline h-3 w-3" />} {POSITION_LABELS[playerPos!]} {!posCorrect && `→ ${POSITION_LABELS[cp.position]}`}
                          </span>
                          <span className={cn(emoCorrect ? 'text-emerald-400' : 'text-red-400')}>
                            {emoCorrect ? <Check className="mr-0.5 inline h-3 w-3" /> : <X className="mr-0.5 inline h-3 w-3" />} {(() => { const Icon = EMOTIONS.find((e) => e.value === playerEmo)?.icon; return Icon ? <Icon className="h-3 w-3 inline" /> : null; })()} {!emoCorrect && <>{' → '}{(() => { const Icon = EMOTIONS.find((e) => e.value === cp.emotion)?.icon; return Icon ? <Icon className="h-3 w-3 inline" /> : null; })()}</>}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={handleNext}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-500"
                >
                  {sceneIndex + 1 >= scenes.length ? 'Finish' : 'Next Scene'}
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
