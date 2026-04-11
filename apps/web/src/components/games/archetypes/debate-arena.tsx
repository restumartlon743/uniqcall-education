'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  MessageSquareWarning,
  ArrowRight,
  Check,
  CheckCircle2,
  Star,
  Shield,
  Swords,
  GripVertical,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface EvidenceCard {
  id: string
  text: string
  supportsPro: boolean
  strength: number // 1-5
}

interface CounterArgument {
  text: string
  rebuttals: { id: string; text: string; quality: number }[]
}

interface DebateTopic {
  id: string
  topic: string
  position: 'PRO' | 'CON'
  evidence: EvidenceCard[]
  counterArguments: CounterArgument[]
}

interface DebateArenaProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Debate Data ──────────────────────────────────────────────

const ALL_TOPICS: DebateTopic[] = [
  {
    id: 't1',
    topic: 'School uniforms should be mandatory for all students.',
    position: 'PRO',
    evidence: [
      { id: 'e1', text: 'Studies show uniforms reduce bullying by 35%', supportsPro: true, strength: 5 },
      { id: 'e2', text: 'Uniforms cost $200/year vs $800 on trendy clothes', supportsPro: true, strength: 4 },
      { id: 'e3', text: '68% of teachers report better focus in uniform schools', supportsPro: true, strength: 4 },
      { id: 'e4', text: 'Self-expression through clothing boosts confidence', supportsPro: false, strength: 3 },
      { id: 'e5', text: 'Low-income families may struggle with uniform costs', supportsPro: false, strength: 3 },
      { id: 'e6', text: 'Students in uniforms feel equal regardless of wealth', supportsPro: true, strength: 3 },
      { id: 'e7', text: 'Creative clothing choices develop personal identity', supportsPro: false, strength: 2 },
      { id: 'e8', text: 'Uniforms simplify morning routines, improving punctuality', supportsPro: true, strength: 2 },
    ],
    counterArguments: [
      {
        text: 'Students should have freedom to express their individuality through clothing.',
        rebuttals: [
          { id: 'r1', text: 'Students can express individuality through accessories, hobbies, and achievements instead', quality: 3 },
          { id: 'r2', text: 'True individuality comes from character, not fashion choices', quality: 2 },
          { id: 'r3', text: 'Uniforms are just clothes and do not matter', quality: 1 },
        ],
      },
      {
        text: 'There is no conclusive evidence that uniforms improve academic performance.',
        rebuttals: [
          { id: 'r4', text: 'While grades may not change, behavioral improvements and reduced distraction are well-documented', quality: 3 },
          { id: 'r5', text: 'Academic performance depends on teaching quality, not clothing', quality: 2 },
          { id: 'r6', text: 'Some studies actually do show improvement', quality: 1 },
        ],
      },
    ],
  },
  {
    id: 't2',
    topic: 'Social media should be banned for children under 16.',
    position: 'PRO',
    evidence: [
      { id: 'e1', text: 'Teen depression rates rose 60% alongside social media growth', supportsPro: true, strength: 5 },
      { id: 'e2', text: 'Average teen spends 7+ hours daily on screens', supportsPro: true, strength: 4 },
      { id: 'e3', text: 'Cyberbullying affects 37% of students aged 12-17', supportsPro: true, strength: 5 },
      { id: 'e4', text: 'Social media helps teens connect with distant family and support communities', supportsPro: false, strength: 3 },
      { id: 'e5', text: 'Digital literacy is essential for future careers', supportsPro: false, strength: 4 },
      { id: 'e6', text: 'Brain development is incomplete until age 25, making teens vulnerable', supportsPro: true, strength: 4 },
      { id: 'e7', text: 'Supervised social media use can teach responsible digital citizenship', supportsPro: false, strength: 3 },
      { id: 'e8', text: 'Social media companies design addictive features targeting young users', supportsPro: true, strength: 5 },
    ],
    counterArguments: [
      {
        text: 'Banning social media would isolate teenagers from their peer groups.',
        rebuttals: [
          { id: 'r1', text: 'In-person socialization is proven to be more beneficial for mental health than online interactions', quality: 3 },
          { id: 'r2', text: 'Teens socialized fine before social media existed', quality: 2 },
          { id: 'r3', text: 'They will still have phones and texting', quality: 1 },
        ],
      },
      {
        text: 'Parents, not the government, should decide what their children access online.',
        rebuttals: [
          { id: 'r4', text: 'We regulate many things for child safety — seatbelts, alcohol, driving age — this is consistent policy', quality: 3 },
          { id: 'r5', text: 'Many parents lack the technical skills to monitor effectively', quality: 2 },
          { id: 'r6', text: 'The government knows better than parents', quality: 1 },
        ],
      },
    ],
  },
  {
    id: 't3',
    topic: 'Homework should be abolished in primary school.',
    position: 'CON',
    evidence: [
      { id: 'e1', text: 'Homework reinforces classroom learning and builds study habits', supportsPro: false, strength: 4 },
      { id: 'e2', text: 'Countries with less homework (Finland) outperform homework-heavy nations', supportsPro: true, strength: 5 },
      { id: 'e3', text: 'Excessive homework causes stress and sleep deprivation in children', supportsPro: true, strength: 4 },
      { id: 'e4', text: 'Parent-child homework time strengthens family bonds', supportsPro: false, strength: 2 },
      { id: 'e5', text: 'Many children lack quiet study environments at home', supportsPro: true, strength: 4 },
      { id: 'e6', text: 'Moderate homework (30 min) in primary school shows positive effects', supportsPro: false, strength: 4 },
      { id: 'e7', text: 'Free play after school is critical for child development', supportsPro: true, strength: 3 },
      { id: 'e8', text: 'Homework teaches time management and responsibility', supportsPro: false, strength: 3 },
    ],
    counterArguments: [
      {
        text: 'Without homework, students forget up to 80% of what they learned in class.',
        rebuttals: [
          { id: 'r1', text: 'That statistic is misleading — active classroom methods like retrieval practice can replace homework for retention', quality: 3 },
          { id: 'r2', text: 'Students can review in school the next morning instead', quality: 2 },
          { id: 'r3', text: 'Forgetting is natural and unavoidable anyway', quality: 1 },
        ],
      },
      {
        text: 'Parents rely on homework to stay informed about their child\'s education.',
        rebuttals: [
          { id: 'r1', text: 'Schools can use progress reports, parent apps, and conferences instead of homework-based monitoring', quality: 3 },
          { id: 'r2', text: 'Parents can simply ask their children what they learned today', quality: 2 },
          { id: 'r3', text: 'Parents should not need to monitor education', quality: 1 },
        ],
      },
    ],
  },
  {
    id: 't4',
    topic: 'Space exploration funding should be doubled.',
    position: 'PRO',
    evidence: [
      { id: 'e1', text: 'NASA technologies have generated $7 in economic benefit for every $1 invested', supportsPro: true, strength: 5 },
      { id: 'e2', text: 'Space programs inspire STEM careers — 40% of engineers cite space as motivation', supportsPro: true, strength: 4 },
      { id: 'e3', text: 'Space funding is less than 0.5% of most national budgets', supportsPro: true, strength: 3 },
      { id: 'e4', text: 'Millions of people on Earth still lack clean water and food', supportsPro: false, strength: 5 },
      { id: 'e5', text: 'Climate change monitoring satellites are crucial for Earth science', supportsPro: true, strength: 4 },
      { id: 'e6', text: 'Private companies like SpaceX can handle space exploration more efficiently', supportsPro: false, strength: 3 },
      { id: 'e7', text: 'Asteroid mining could solve resource scarcity on Earth', supportsPro: true, strength: 3 },
      { id: 'e8', text: 'International space cooperation promotes global peace', supportsPro: true, strength: 2 },
    ],
    counterArguments: [
      {
        text: 'We should solve problems on Earth before spending billions in space.',
        rebuttals: [
          { id: 'r1', text: 'Space technology directly solves Earth problems — GPS, weather prediction, communication, and crop monitoring all came from space programs', quality: 3 },
          { id: 'r2', text: 'We can do both simultaneously — it is not an either/or choice', quality: 2 },
          { id: 'r3', text: 'Earth problems will always exist, so we would never explore space with that logic', quality: 1 },
        ],
      },
      {
        text: 'Private companies are already advancing space technology without government help.',
        rebuttals: [
          { id: 'r4', text: 'Private companies were built on decades of government-funded research — SpaceX literally uses NASA technology', quality: 3 },
          { id: 'r5', text: 'Government funding ensures space benefits all of humanity, not just shareholders', quality: 2 },
          { id: 'r6', text: 'Private companies focus on profit, not science', quality: 1 },
        ],
      },
    ],
  },
  {
    id: 't5',
    topic: 'Artificial intelligence should replace teachers for standardized subjects.',
    position: 'CON',
    evidence: [
      { id: 'e1', text: 'AI can personalize learning speed for each student', supportsPro: true, strength: 4 },
      { id: 'e2', text: 'Students with human teachers score 23% higher on critical thinking tests', supportsPro: false, strength: 5 },
      { id: 'e3', text: 'Teachers provide emotional support that AI cannot replicate', supportsPro: false, strength: 5 },
      { id: 'e4', text: 'AI tutoring is available 24/7, unlike human teachers', supportsPro: true, strength: 3 },
      { id: 'e5', text: '78% of students say teacher relationships motivate them to attend school', supportsPro: false, strength: 4 },
      { id: 'e6', text: 'AI reduces teacher burnout by handling repetitive grading', supportsPro: true, strength: 3 },
      { id: 'e7', text: 'Human teachers adapt to unexpected questions and teachable moments', supportsPro: false, strength: 4 },
      { id: 'e8', text: 'AI can introduce biases from training data into education', supportsPro: false, strength: 3 },
    ],
    counterArguments: [
      {
        text: 'AI tutoring platforms already show equal or better results in math and science.',
        rebuttals: [
          { id: 'r1', text: 'Standardized test scores alone do not measure the full value of education — creativity, collaboration, and character development require human interaction', quality: 3 },
          { id: 'r2', text: 'Those results are only for rote learning, not deep understanding', quality: 2 },
          { id: 'r3', text: 'AI results are probably manipulated by the companies selling them', quality: 1 },
        ],
      },
      {
        text: 'There is a global teacher shortage — AI is the only scalable solution.',
        rebuttals: [
          { id: 'r4', text: 'The solution to teacher shortages is better pay and working conditions, not replacing teachers with machines', quality: 3 },
          { id: 'r5', text: 'AI could assist teachers rather than replace them, increasing their capacity', quality: 2 },
          { id: 'r6', text: 'Teacher shortage is not real, just an excuse', quality: 1 },
        ],
      },
    ],
  },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { rounds: 2, evidenceCount: 6, multiplier: 1 }
    case 'medium':
      return { rounds: 3, evidenceCount: 8, multiplier: 1.5 }
    case 'hard':
      return { rounds: 3, evidenceCount: 8, multiplier: 2 }
    case 'extreme':
      return { rounds: 3, evidenceCount: 8, multiplier: 3 }
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

export default function DebateArena({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: DebateArenaProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const topics = useMemo(() => shuffle(ALL_TOPICS).slice(0, config.rounds), [config.rounds])

  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<'select' | 'order' | 'rebut' | 'result'>('select')
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([])
  const [orderedEvidence, setOrderedEvidence] = useState<string[]>([])
  const [counterIndex, setCounterIndex] = useState(0)
  const [selectedRebuttal, setSelectedRebuttal] = useState<string | null>(null)
  const [roundScores, setRoundScores] = useState<{ selection: number; ordering: number; rebuttal: number; total: number }[]>([])
  const [gameFinished, setGameFinished] = useState(false)

  const currentTopic = topics[round]
  const isPro = currentTopic?.position === 'PRO'
  const maxScorePerRound = Math.round(100 * config.multiplier)
  const maxScore = config.rounds * maxScorePerRound

  const toggleEvidence = useCallback((id: string) => {
    if (isPaused || phase !== 'select') return
    setSelectedEvidence((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : prev.length < 5 ? [...prev, id] : prev,
    )
  }, [isPaused, phase])

  const handleConfirmSelection = useCallback(() => {
    if (selectedEvidence.length < 2) return
    setOrderedEvidence([...selectedEvidence])
    setPhase('order')
  }, [selectedEvidence])

  const handleConfirmOrder = useCallback(() => {
    setCounterIndex(0)
    setSelectedRebuttal(null)
    setPhase('rebut')
  }, [])

  const handleSelectRebuttal = useCallback((id: string) => {
    if (isPaused) return
    setSelectedRebuttal(id)
  }, [isPaused])

  const handleSubmitRebuttal = useCallback(() => {
    if (!selectedRebuttal || !currentTopic) return
    const counter = currentTopic.counterArguments[counterIndex]
    if (!counter) return

    const rebuttalQuality = counter.rebuttals.find((r) => r.id === selectedRebuttal)?.quality ?? 0

    if (counterIndex + 1 < currentTopic.counterArguments.length) {
      setCounterIndex((i) => i + 1)
      setSelectedRebuttal(null)
      return
    }

    // Score the round
    const relevantEvidence = currentTopic.evidence.filter((e) =>
      isPro ? e.supportsPro : !e.supportsPro,
    )
    const relevantIds = new Set(relevantEvidence.map((e) => e.id))
    const correctSelections = selectedEvidence.filter((id) => relevantIds.has(id)).length
    const selectionScore = Math.round((correctSelections / Math.max(selectedEvidence.length, 1)) * 40)

    // Ordering score: check if ordered by strength descending
    const orderedStrengths = orderedEvidence.map(
      (id) => currentTopic.evidence.find((e) => e.id === id)?.strength ?? 0,
    )
    let orderCorrect = 0
    for (let i = 0; i < orderedStrengths.length - 1; i++) {
      if (orderedStrengths[i] >= orderedStrengths[i + 1]) orderCorrect++
    }
    const orderingScore = orderedStrengths.length > 1
      ? Math.round((orderCorrect / (orderedStrengths.length - 1)) * 30)
      : 30

    // Rebuttal score (average across all counter-arguments)
    const rebuttalScore = Math.round((rebuttalQuality / 3) * 30)

    const total = Math.round((selectionScore + orderingScore + rebuttalScore) * config.multiplier)
    const newScores = [...roundScores, { selection: selectionScore, ordering: orderingScore, rebuttal: rebuttalScore, total }]
    setRoundScores(newScores)
    setPhase('result')

    const totalScore = newScores.reduce((a, b) => a + b.total, 0)
    onScoreUpdate(totalScore, maxScore)
  }, [selectedRebuttal, currentTopic, counterIndex, isPro, selectedEvidence, orderedEvidence, config.multiplier, roundScores, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (round + 1 >= config.rounds) {
      setGameFinished(true)
      const finalScore = roundScores.reduce((a, b) => a + b.total, 0)
      onGameOver(finalScore, maxScore)
    } else {
      setRound((r) => r + 1)
      setPhase('select')
      setSelectedEvidence([])
      setOrderedEvidence([])
      setCounterIndex(0)
      setSelectedRebuttal(null)
    }
  }, [round, config.rounds, roundScores, maxScore, onGameOver])

  if (!currentTopic && !gameFinished) return null

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
      {/* Round indicators */}
      <div className="flex items-center gap-2">
        {topics.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < round && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === round && !gameFinished && 'border-orange-500/50 bg-orange-500/15 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.3)]',
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
          <p className="text-xl font-bold text-white">Debate Complete!</p>
          <p className="text-sm text-white/60">
            Total Score: {roundScores.reduce((a, b) => a + b.total, 0)} / {maxScore}
          </p>
          {roundScores.map((s, i) => (
            <div key={i} className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-xs text-white/60">Round {i + 1}</span>
              <div className="flex gap-3 text-xs">
                <span className="text-cyan-300">Evidence: {s.selection}</span>
                <span className="text-violet-300">Order: {s.ordering}</span>
                <span className="text-pink-300">Rebuttal: {s.rebuttal}</span>
                <span className="font-bold text-amber-400">{s.total} pts</span>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentTopic.id}-${phase}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full flex-col gap-4"
          >
            {/* Topic card */}
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-orange-300">
                <MessageSquareWarning className="h-4 w-4" />
                Debate Topic
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{currentTopic.topic}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-white/40">Your position:</span>
                <span className={cn(
                  'rounded-full px-3 py-0.5 text-xs font-bold',
                  isPro ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400',
                )}>
                  {isPro ? <><ThumbsUp className="mr-1 inline h-3 w-3" /> PRO</> : <><ThumbsDown className="mr-1 inline h-3 w-3" /> CON</>}
                </span>
              </div>
            </div>

            {/* Phase: Select evidence */}
            {phase === 'select' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Select evidence that supports YOUR position ({selectedEvidence.length}/5)
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {shuffle(currentTopic.evidence).slice(0, config.evidenceCount).map((e) => {
                    const isSelected = selectedEvidence.includes(e.id)
                    return (
                      <motion.button
                        key={e.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleEvidence(e.id)}
                        className={cn(
                          'flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all',
                          isSelected
                            ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                            : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20',
                        )}
                      >
                        <div className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs transition-all',
                          isSelected ? 'border-cyan-500 bg-cyan-500 text-white' : 'border-white/20',
                        )}>
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        {e.text}
                      </motion.button>
                    )
                  })}
                </div>
                <button
                  onClick={handleConfirmSelection}
                  disabled={selectedEvidence.length < 2}
                  className={cn(
                    'mt-2 flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all',
                    selectedEvidence.length >= 2
                      ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:bg-orange-500'
                      : 'bg-white/5 text-white/30 cursor-not-allowed',
                  )}
                >
                  <Shield className="h-4 w-4" />
                  Lock In Evidence
                </button>
              </div>
            )}

            {/* Phase: Order evidence by strength */}
            {phase === 'order' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Drag to arrange evidence from STRONGEST to WEAKEST
                </p>
                <Reorder.Group
                  axis="y"
                  values={orderedEvidence}
                  onReorder={setOrderedEvidence}
                  className="flex flex-col gap-2"
                >
                  {orderedEvidence.map((id, idx) => {
                    const ev = currentTopic.evidence.find((e) => e.id === id)
                    if (!ev) return null
                    return (
                      <Reorder.Item
                        key={id}
                        value={id}
                        className="flex cursor-grab items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-sm text-white/80 active:cursor-grabbing"
                      >
                        <GripVertical className="h-4 w-4 shrink-0 text-white/30" />
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-300">
                          {idx + 1}
                        </span>
                        {ev.text}
                      </Reorder.Item>
                    )
                  })}
                </Reorder.Group>
                <button
                  onClick={handleConfirmOrder}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all hover:bg-orange-500"
                >
                  <ArrowRight className="h-4 w-4" />
                  Submit Order
                </button>
              </div>
            )}

            {/* Phase: Rebuttal */}
            {phase === 'rebut' && currentTopic.counterArguments[counterIndex] && (
              <div className="flex flex-col gap-3">
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                    <Swords className="h-3.5 w-3.5" />
                    Opponent&apos;s Counter-Argument
                  </div>
                  <p className="mt-2 text-sm text-white/80">
                    &ldquo;{currentTopic.counterArguments[counterIndex].text}&rdquo;
                  </p>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Choose your rebuttal:
                </p>
                <div className="flex flex-col gap-2">
                  {currentTopic.counterArguments[counterIndex].rebuttals.map((r) => (
                    <motion.button
                      key={r.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectRebuttal(r.id)}
                      className={cn(
                        'rounded-xl border px-4 py-3 text-left text-sm transition-all',
                        selectedRebuttal === r.id
                          ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20',
                      )}
                    >
                      {r.text}
                    </motion.button>
                  ))}
                </div>
                <button
                  onClick={handleSubmitRebuttal}
                  disabled={!selectedRebuttal}
                  className={cn(
                    'mt-2 flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all',
                    selectedRebuttal
                      ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:bg-orange-500'
                      : 'bg-white/5 text-white/30 cursor-not-allowed',
                  )}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Submit Rebuttal
                </button>
              </div>
            )}

            {/* Phase: Result */}
            {phase === 'result' && roundScores.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-300">Round Complete!</span>
                  <span className="text-lg font-bold text-amber-400">{roundScores[roundScores.length - 1].total} pts</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-2">
                    <p className="text-white/40">Evidence</p>
                    <p className="text-lg font-bold text-cyan-300">{roundScores[roundScores.length - 1].selection}/40</p>
                  </div>
                  <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-2">
                    <p className="text-white/40">Ordering</p>
                    <p className="text-lg font-bold text-violet-300">{roundScores[roundScores.length - 1].ordering}/30</p>
                  </div>
                  <div className="rounded-lg border border-pink-500/20 bg-pink-500/5 p-2">
                    <p className="text-white/40">Rebuttal</p>
                    <p className="text-lg font-bold text-pink-300">{roundScores[roundScores.length - 1].rebuttal}/30</p>
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all hover:bg-orange-500"
                >
                  {round + 1 >= config.rounds ? 'Finish' : 'Next Debate'}
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
