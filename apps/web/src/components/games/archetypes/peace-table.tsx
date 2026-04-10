'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Handshake,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  ThumbsUp,
  ThumbsDown,
  Drama,
  Music,
  Palette,
  UserRound,
  Mountain,
  Wheat,
  Home,
  BookOpen,
  Briefcase,
  Landmark,
  Castle,
  Tent,
  School,
  Megaphone,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface Party {
  name: string
  icon: LucideIcon
  demand: string
  hiddenInterest: string
  proposals: string[]
}

interface NegotiationScenario {
  id: string
  title: string
  context: string
  parties: [Party, Party, Party]
  // For each party, which proposal indices satisfy them (>50%)
  satisfactionMap: Record<string, number[]>
  difficulty: 'easy' | 'medium' | 'hard'
}

interface PeaceTableProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const ALL_SCENARIOS: NegotiationScenario[] = [
  // Easy: aligned interests
  {
    id: 'n1',
    title: 'The School Festival Budget',
    context: 'Three clubs need to share the school festival budget. Each wants more funding.',
    parties: [
      {
        name: 'Drama Club',
        icon: Drama,
        demand: 'We need $500 for costumes and stage design.',
        hiddenInterest: 'We mainly need the stage area reserved and basic costumes.',
        proposals: ['Full $500 budget for drama', 'Shared stage with music club', 'Use recycled costumes + $200 budget', 'Cancel drama performance'],
      },
      {
        name: 'Music Club',
        icon: Music,
        demand: 'We need $400 for equipment rental and sound system.',
        hiddenInterest: 'We already have instruments; we mainly need the sound system.',
        proposals: ['Full $400 budget for music', 'Share sound system with drama', 'Use school speakers + $150 budget', 'Cancel music performance'],
      },
      {
        name: 'Art Club',
        icon: Palette,
        demand: 'We need $300 for supplies for a gallery exhibition.',
        hiddenInterest: 'We have some supplies; we mainly need display space.',
        proposals: ['Full $300 budget for art', 'Gallery in school hallway (free)', 'Use donated supplies + $100', 'Cancel art exhibition'],
      },
    ],
    satisfactionMap: {
      'Drama Club': [1, 2],
      'Music Club': [1, 2],
      'Art Club': [1, 2],
    },
    difficulty: 'easy',
  },
  {
    id: 'n2',
    title: 'The Playground Redesign',
    context: 'The community must decide how to redesign the neighborhood playground.',
    parties: [
      {
        name: 'Parents Group',
        icon: Users,
        demand: 'We want safe equipment for young children under 8.',
        hiddenInterest: 'Safety and shade are the top priorities, not specific equipment.',
        proposals: ['Toddler-only playground', 'Mixed-age zones with safety barriers', 'Add shade structures + soft ground', 'No changes needed'],
      },
      {
        name: 'Teens Council',
        icon: Users,
        demand: 'We want a basketball court and skate ramp.',
        hiddenInterest: 'We just need a dedicated hangout space with some activity.',
        proposals: ['Full basketball court', 'Multi-sport area in separate zone', 'Climbing wall + seating area', 'No teen space'],
      },
      {
        name: 'Seniors Assoc.',
        icon: UserRound,
        demand: 'We want a quiet garden area with benches.',
        hiddenInterest: 'We need a calm space away from noise.',
        proposals: ['Full garden replacing playground', 'Garden corner with sound buffer', 'Benches along walking path', 'No senior space'],
      },
    ],
    satisfactionMap: {
      'Parents Group': [1, 2],
      'Teens Council': [1, 2],
      'Seniors Assoc.': [1, 2],
    },
    difficulty: 'easy',
  },
  // Medium: some conflict
  {
    id: 'n3',
    title: 'The Water Rights Dispute',
    context: 'A river flows through three villages. Drought has reduced water supply.',
    parties: [
      {
        name: 'Upstream Village',
        icon: Mountain,
        demand: 'We have first access and should take what we need.',
        hiddenInterest: 'We mainly need water for drinking and domestic use.',
        proposals: ['Unlimited upstream access', 'Priority drinking water + share irrigation', 'Metered equal shares', 'Downstream gets priority'],
      },
      {
        name: 'Farming Village',
        icon: Wheat,
        demand: 'Our crops will die without 70% of the water.',
        hiddenInterest: 'We can switch to drought-resistant crops if we get 40%.',
        proposals: ['70% for farming', '40% for farming + crop switch program', 'Equal split + shared well', 'No water for farming'],
      },
      {
        name: 'Downstream Town',
        icon: Home,
        demand: 'We receive polluted runoff and need clean water rights.',
        hiddenInterest: 'We need a filtration system and guaranteed minimum flow.',
        proposals: ['All water treated before release', 'Shared filtration + minimum flow guarantee', 'Build separate well system', 'Accept runoff as-is'],
      },
    ],
    satisfactionMap: {
      'Upstream Village': [1, 2],
      'Farming Village': [1, 2],
      'Downstream Town': [0, 1],
    },
    difficulty: 'medium',
  },
  {
    id: 'n4',
    title: 'The Library Hours',
    context: 'Budget cuts mean the library must reduce hours. Three groups have conflicting schedules.',
    parties: [
      {
        name: 'Students',
        icon: BookOpen,
        demand: 'Keep evening hours (6-10pm) for studying.',
        hiddenInterest: 'We need reliable study space; a quiet room elsewhere could work.',
        proposals: ['Keep all evening hours', 'Evening hours 3 days/week + study room access', 'Move to weekend-only evenings', 'No evening hours'],
      },
      {
        name: 'Working Parents',
        icon: Briefcase,
        demand: 'Keep Saturday hours for children\'s programs.',
        hiddenInterest: 'We need childcare-compatible activities on weekends.',
        proposals: ['Full Saturday hours', 'Saturday morning + partner program', 'Move to Sunday', 'Cancel weekend hours'],
      },
      {
        name: 'Senior Book Club',
        icon: BookOpen,
        demand: 'Keep weekday morning hours for our group.',
        hiddenInterest: 'We need a regular meeting space; any calm daytime slot works.',
        proposals: ['Keep all morning hours', 'Tues/Thurs mornings + community room', 'Move to afternoon slot', 'Cancel morning hours'],
      },
    ],
    satisfactionMap: {
      'Students': [1],
      'Working Parents': [0, 1],
      'Senior Book Club': [1, 2],
    },
    difficulty: 'medium',
  },
  // Hard: zero-sum situations
  {
    id: 'n5',
    title: 'The Border Market',
    context: 'Two countries and a nomadic tribe share a border market. New taxes threaten the arrangement.',
    parties: [
      {
        name: 'Country Alpha',
        icon: Landmark,
        demand: 'Tax all goods entering our territory at 25%.',
        hiddenInterest: 'We need revenue but don\'t want to lose traders.',
        proposals: ['25% tax on all goods', '10% tax + shared market revenue', 'Tax-free zone with licensing fee', 'No taxes (lose revenue)'],
      },
      {
        name: 'Country Beta',
        icon: Castle,
        demand: 'Mirror any taxes Alpha impostes. No unfair advantage.',
        hiddenInterest: 'We want equal treatment and infrastructure investment.',
        proposals: ['Mirror all taxes', 'Joint tax-free zone + shared infrastructure', 'Separate markets', 'Accept disadvantage'],
      },
      {
        name: 'Nomadic Tribe',
        icon: Tent,
        demand: 'No taxes — we\'ve traded here for generations.',
        hiddenInterest: 'We need guaranteed market access and respect for our trade routes.',
        proposals: ['Zero taxes for tribe', 'Small licensing fee + guaranteed stalls', 'Seasonal free-trade windows', 'Abandon market'],
      },
    ],
    satisfactionMap: {
      'Country Alpha': [1, 2],
      'Country Beta': [1],
      'Nomadic Tribe': [1, 2],
    },
    difficulty: 'hard',
  },
  {
    id: 'n6',
    title: 'The School Uniform Policy',
    context: 'The school board, students, and parents disagree about a mandatory uniform policy.',
    parties: [
      {
        name: 'School Board',
        icon: School,
        demand: 'Full mandatory uniforms to promote equality.',
        hiddenInterest: 'We want to reduce visible economic disparity and bullying.',
        proposals: ['Full mandatory uniform', 'Dress code with affordable options', 'Uniform tops + free bottoms', 'No dress code'],
      },
      {
        name: 'Students',
        icon: Megaphone,
        demand: 'No uniforms! We want freedom of expression.',
        hiddenInterest: 'We want some personal expression and comfort.',
        proposals: ['No dress code at all', 'Free dress Fridays + casual options', 'School colors + personal accessories', 'Full uniform (unhappy)'],
      },
      {
        name: 'Parents',
        icon: Users,
        demand: 'Uniforms are expensive. We can\'t afford new ones each year.',
        hiddenInterest: 'We need affordability and hand-me-down compatibility.',
        proposals: ['School provides free uniforms', 'Subsidized basic pieces + swap program', 'Simple dress code (cheap)', 'Full-price uniforms (burden)'],
      },
    ],
    satisfactionMap: {
      'School Board': [1, 2],
      'Students': [1, 2],
      'Parents': [1, 2],
    },
    difficulty: 'hard',
  },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { rounds: 2, pool: ['easy'] as const, showHidden: true }
    case 'medium':
      return { rounds: 3, pool: ['easy', 'medium'] as const, showHidden: false }
    case 'hard':
      return { rounds: 3, pool: ['easy', 'medium', 'hard'] as const, showHidden: false }
    case 'extreme':
      return { rounds: 3, pool: ['medium', 'hard'] as const, showHidden: false }
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

export default function PeaceTable({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: PeaceTableProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const scenarios = useMemo(() => {
    const pool = ALL_SCENARIOS.filter((s) => (config.pool as readonly string[]).includes(s.difficulty))
    return shuffle(pool).slice(0, config.rounds)
  }, [config])

  const [roundIndex, setRoundIndex] = useState(0)
  const [selections, setSelections] = useState<Record<string, number>>({})
  const [phase, setPhase] = useState<'negotiate' | 'result'>('negotiate')
  const [roundScores, setRoundScores] = useState<{ satisfied: number; total: number; score: number }[]>([])
  const [finished, setFinished] = useState(false)

  const current = scenarios[roundIndex]
  const maxScorePerRound = 100
  const maxScore = scenarios.length * maxScorePerRound

  const handleSelectProposal = useCallback(
    (partyName: string, proposalIdx: number) => {
      if (isPaused || phase !== 'negotiate') return
      setSelections((prev) => ({ ...prev, [partyName]: proposalIdx }))
    },
    [isPaused, phase],
  )

  const allSelected = current ? current.parties.every((p) => selections[p.name] !== undefined) : false

  const handleSubmit = useCallback(() => {
    if (!allSelected || !current) return

    let satisfiedCount = 0
    const totalParties = current.parties.length

    for (const party of current.parties) {
      const selectedIdx = selections[party.name]
      const satisfiedBy = current.satisfactionMap[party.name] ?? []
      if (satisfiedBy.includes(selectedIdx)) {
        satisfiedCount++
      }
    }

    // Score: all must be >50% (at least satisfied). Full marks if all satisfied.
    const allSatisfied = satisfiedCount === totalParties
    const score = allSatisfied
      ? maxScorePerRound
      : Math.round((satisfiedCount / totalParties) * maxScorePerRound * 0.6) // Penalty for not satisfying all

    const newScores = [...roundScores, { satisfied: satisfiedCount, total: totalParties, score }]
    setRoundScores(newScores)
    setPhase('result')

    const totalScore = newScores.reduce((a, b) => a + b.score, 0)
    onScoreUpdate(totalScore, maxScore)
  }, [allSelected, current, selections, roundScores, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (roundIndex + 1 >= scenarios.length) {
      setFinished(true)
      const final = roundScores.reduce((a, b) => a + b.score, 0)
      onGameOver(final, maxScore)
    } else {
      setRoundIndex((i) => i + 1)
      setSelections({})
      setPhase('negotiate')
    }
  }, [roundIndex, scenarios.length, roundScores, maxScore, onGameOver])

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-5">
      {/* Round indicators */}
      <div className="flex items-center gap-2">
        {scenarios.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < roundIndex && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === roundIndex && !finished && 'border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
              i > roundIndex && 'border-white/10 bg-white/5 text-white/20',
            )}
          >
            {i < roundScores.length ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </div>
        ))}
      </div>

      {finished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8"
        >
          <Star className="h-12 w-12 text-amber-400" />
          <p className="text-xl font-bold text-white">Negotiations Complete!</p>
          <p className="text-sm text-white/60">
            Total: {roundScores.reduce((a, b) => a + b.score, 0)} / {maxScore}
          </p>
          {roundScores.map((s, i) => (
            <div key={i} className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-xs text-white/60">Round {i + 1}: {scenarios[i]?.title}</span>
              <div className="flex gap-3 text-xs">
                <span className={cn(s.satisfied === s.total ? 'text-emerald-400' : 'text-yellow-400')}>
                  {s.satisfied}/{s.total} satisfied
                </span>
                <span className="font-bold text-amber-400">{s.score} pts</span>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full flex-col gap-4"
          >
            {/* Context */}
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-violet-300">
                <Handshake className="h-4 w-4" />
                {current.title}
              </div>
              <p className="mt-2 text-sm text-white/80">{current.context}</p>
            </div>

            {/* Parties */}
            <div className="flex flex-col gap-4">
              {current.parties.map((party) => {
                const selectedIdx = selections[party.name]
                return (
                  <div key={party.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2">
                      {(() => { const Icon = party.icon; return <Icon className="h-5 w-5" />; })()}
                      <span className="text-sm font-bold text-white/80">{party.name}</span>
                    </div>
                    <p className="mt-1 text-xs text-white/60">
                      <Users className="mr-1 inline h-3 w-3" />
                      Demand: {party.demand}
                    </p>
                    {config.showHidden && (
                      <p className="mt-1 text-xs italic text-violet-300/50">
                        Hidden interest: {party.hiddenInterest}
                      </p>
                    )}

                    {phase === 'negotiate' && (
                      <div className="mt-3 flex flex-col gap-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                          Select a proposal for {party.name}:
                        </p>
                        {party.proposals.map((prop, pi) => (
                          <button
                            key={pi}
                            onClick={() => handleSelectProposal(party.name, pi)}
                            className={cn(
                              'rounded-lg border px-3 py-2 text-left text-xs transition-all',
                              selectedIdx === pi
                                ? 'border-violet-500/40 bg-violet-500/10 text-white/90 shadow-[0_0_8px_rgba(139,92,246,0.15)]'
                                : 'border-white/10 bg-white/3 text-white/60 hover:border-white/20',
                            )}
                          >
                            {prop}
                          </button>
                        ))}
                      </div>
                    )}

                    {phase === 'result' && roundScores.length > 0 && (
                      <div className="mt-2">
                        {(() => {
                          const satisfiedBy = current.satisfactionMap[party.name] ?? []
                          const isSatisfied = satisfiedBy.includes(selectedIdx)
                          return (
                            <div className={cn('flex items-center gap-2 rounded-lg border px-3 py-2 text-xs', isSatisfied ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-red-500/30 bg-red-500/10')}>
                              {isSatisfied ? (
                                <><ThumbsUp className="h-4 w-4 text-emerald-400" /><span className="text-emerald-300">Satisfied!</span></>
                              ) : (
                                <><ThumbsDown className="h-4 w-4 text-red-400" /><span className="text-red-300">Not satisfied — hidden interest: {party.hiddenInterest}</span></>
                              )}
                            </div>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {phase === 'negotiate' && (
              <button
                onClick={handleSubmit}
                disabled={!allSelected}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all',
                  allSelected
                    ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:bg-violet-500'
                    : 'bg-white/5 text-white/30 cursor-not-allowed',
                )}
              >
                <Handshake className="h-4 w-4" />
                Present Compromise
              </button>
            )}

            {phase === 'result' && roundScores.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                  <span className="text-sm text-white/60">Round Score:</span>
                  <span className="text-lg font-bold text-amber-400">{roundScores[roundScores.length - 1].score} / {maxScorePerRound}</span>
                </div>
                <button
                  onClick={handleNext}
                  className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:bg-violet-500"
                >
                  {roundIndex + 1 >= scenarios.length ? 'Finish' : 'Next Negotiation'}
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
