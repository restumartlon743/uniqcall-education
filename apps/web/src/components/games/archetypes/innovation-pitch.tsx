'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Presentation,
  Timer,
  ArrowRight,
  CheckCircle2,
  Star,
  Lightbulb,
  Target,
  Users,
  DollarSign,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface PitchOption {
  id: string
  label: string
  investorAppeal: { innovation: number; feasibility: number; marketFit: number; team: number }
}

interface PitchCategory {
  key: 'problem' | 'solution' | 'market' | 'revenue' | 'team'
  label: string
  icon: typeof Lightbulb
  options: PitchOption[]
}

interface ProblemScenario {
  id: string
  title: string
  description: string
  sector: string
  categories: PitchCategory[]
  maxPossibleScore: number
}

interface InvestorFeedback {
  innovation: number
  feasibility: number
  marketFit: number
  team: number
  total: number
  maxTotal: number
}

interface PitchResult {
  problem: string
  selections: Record<string, string>
  feedback: InvestorFeedback
  timeSpent: number
}

interface InnovationPitchProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

function buildScenario(
  id: string,
  title: string,
  description: string,
  sector: string,
  problemOptions: PitchOption[],
  solutionOptions: PitchOption[],
  marketOptions: PitchOption[],
  revenueOptions: PitchOption[],
  teamOptions: PitchOption[],
): ProblemScenario {
  const categories: PitchCategory[] = [
    { key: 'problem', label: 'Problem Statement', icon: Target, options: problemOptions },
    { key: 'solution', label: 'Solution Approach', icon: Lightbulb, options: solutionOptions },
    { key: 'market', label: 'Target Market', icon: Users, options: marketOptions },
    { key: 'revenue', label: 'Revenue Model', icon: DollarSign, options: revenueOptions },
    { key: 'team', label: 'Team Composition', icon: Users, options: teamOptions },
  ]
  const maxPossibleScore = categories.reduce((sum, cat) => {
    const best = Math.max(...cat.options.map((o) => o.investorAppeal.innovation + o.investorAppeal.feasibility + o.investorAppeal.marketFit + o.investorAppeal.team))
    return sum + best
  }, 0)
  return { id, title, description, sector, categories, maxPossibleScore }
}

const ALL_SCENARIOS: ProblemScenario[] = [
  buildScenario(
    's1',
    'Ocean Plastic Crisis',
    'Over 8 million tons of plastic enter our oceans annually, threatening marine ecosystems and entering our food chain.',
    'Environment',
    [
      { id: 's1p1', label: 'Microplastics contaminate 90% of bottled water globally', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 5, team: 2 } },
      { id: 's1p2', label: 'Marine species face extinction from plastic ingestion', investorAppeal: { innovation: 2, feasibility: 3, marketFit: 3, team: 2 } },
      { id: 's1p3', label: 'Coastal communities lose $2.5T annually from ocean pollution', investorAppeal: { innovation: 4, feasibility: 4, marketFit: 5, team: 3 } },
    ],
    [
      { id: 's1s1', label: 'AI-powered autonomous ocean cleanup drones', investorAppeal: { innovation: 5, feasibility: 3, marketFit: 4, team: 3 } },
      { id: 's1s2', label: 'Bioengineered bacteria that digest plastic into biofuel', investorAppeal: { innovation: 5, feasibility: 2, marketFit: 4, team: 4 } },
      { id: 's1s3', label: 'Smart recycling bins with consumer rewards app', investorAppeal: { innovation: 3, feasibility: 5, marketFit: 5, team: 2 } },
    ],
    [
      { id: 's1m1', label: 'Coastal cities & port authorities in 50+ countries', investorAppeal: { innovation: 3, feasibility: 3, marketFit: 5, team: 2 } },
      { id: 's1m2', label: 'Environmental NGOs and government agencies', investorAppeal: { innovation: 2, feasibility: 4, marketFit: 3, team: 2 } },
      { id: 's1m3', label: 'Eco-conscious consumers & sustainable brands', investorAppeal: { innovation: 3, feasibility: 5, marketFit: 4, team: 3 } },
    ],
    [
      { id: 's1r1', label: 'SaaS licensing to municipalities + carbon credits', investorAppeal: { innovation: 4, feasibility: 4, marketFit: 4, team: 3 } },
      { id: 's1r2', label: 'Selling recycled plastic as premium material', investorAppeal: { innovation: 3, feasibility: 5, marketFit: 5, team: 2 } },
      { id: 's1r3', label: 'Government grants and donations only', investorAppeal: { innovation: 1, feasibility: 3, marketFit: 2, team: 1 } },
    ],
    [
      { id: 's1t1', label: 'Marine biologists + robotics engineers + ex-Google PM', investorAppeal: { innovation: 4, feasibility: 4, marketFit: 3, team: 5 } },
      { id: 's1t2', label: 'Solo founder with environmental science PhD', investorAppeal: { innovation: 3, feasibility: 2, marketFit: 2, team: 2 } },
      { id: 's1t3', label: 'Business school grads with no domain expertise', investorAppeal: { innovation: 1, feasibility: 2, marketFit: 3, team: 1 } },
    ],
  ),
  buildScenario(
    's2',
    'Global Mental Health Epidemic',
    'Depression and anxiety rates have tripled since 2020. 75% of people in developing countries have zero access to mental healthcare.',
    'Healthcare',
    [
      { id: 's2p1', label: 'Therapist shortage: 1 provider per 10,000 people in rural areas', investorAppeal: { innovation: 4, feasibility: 4, marketFit: 5, team: 3 } },
      { id: 's2p2', label: 'Mental health stigma prevents 60% from seeking help', investorAppeal: { innovation: 3, feasibility: 3, marketFit: 4, team: 2 } },
      { id: 's2p3', label: 'Traditional therapy costs $150/session, unaffordable for most', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 4, team: 2 } },
    ],
    [
      { id: 's2s1', label: 'AI companion app with CBT-trained conversational therapy', investorAppeal: { innovation: 5, feasibility: 4, marketFit: 5, team: 3 } },
      { id: 's2s2', label: 'VR immersive environments for guided meditation', investorAppeal: { innovation: 4, feasibility: 3, marketFit: 3, team: 3 } },
      { id: 's2s3', label: 'Peer support matching platform connecting recovered patients', investorAppeal: { innovation: 3, feasibility: 5, marketFit: 4, team: 2 } },
    ],
    [
      { id: 's2m1', label: 'Young adults 18-35 in urban areas globally', investorAppeal: { innovation: 3, feasibility: 5, marketFit: 5, team: 2 } },
      { id: 's2m2', label: 'Corporate wellness programs at Fortune 500 companies', investorAppeal: { innovation: 2, feasibility: 4, marketFit: 4, team: 3 } },
      { id: 's2m3', label: 'Schools & universities for student mental health', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 4, team: 3 } },
    ],
    [
      { id: 's2r1', label: 'Freemium app with premium AI therapy subscription ($9.99/mo)', investorAppeal: { innovation: 4, feasibility: 5, marketFit: 5, team: 3 } },
      { id: 's2r2', label: 'B2B licensing to healthcare systems per patient', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 4, team: 3 } },
      { id: 's2r3', label: 'Non-profit model with philanthropic funding', investorAppeal: { innovation: 1, feasibility: 3, marketFit: 2, team: 1 } },
    ],
    [
      { id: 's2t1', label: 'Psychiatrist + NLP engineer + health-tech serial entrepreneur', investorAppeal: { innovation: 4, feasibility: 4, marketFit: 4, team: 5 } },
      { id: 's2t2', label: 'Full-stack devs with personal mental health experience', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 3, team: 3 } },
      { id: 's2t3', label: 'Marketing team with no clinical advisors', investorAppeal: { innovation: 1, feasibility: 2, marketFit: 3, team: 1 } },
    ],
  ),
  buildScenario(
    's3',
    'Food Waste in Supply Chains',
    '1/3 of all food produced globally is wasted. Supply chain inefficiencies are the #1 cause, costing the economy $1 trillion annually.',
    'AgTech',
    [
      { id: 's3p1', label: '40% of produce spoils before reaching consumers due to poor logistics', investorAppeal: { innovation: 4, feasibility: 5, marketFit: 5, team: 2 } },
      { id: 's3p2', label: 'Restaurants throw away 85 billion pounds of food per year', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 4, team: 2 } },
      { id: 's3p3', label: 'Consumers lack visibility into food freshness and expiry', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 3, team: 2 } },
    ],
    [
      { id: 's3s1', label: 'IoT sensors + AI for real-time supply chain freshness tracking', investorAppeal: { innovation: 5, feasibility: 4, marketFit: 5, team: 3 } },
      { id: 's3s2', label: 'Blockchain-verified farm-to-table traceability platform', investorAppeal: { innovation: 4, feasibility: 3, marketFit: 4, team: 3 } },
      { id: 's3s3', label: 'Surplus food marketplace connecting stores to consumers', investorAppeal: { innovation: 3, feasibility: 5, marketFit: 4, team: 2 } },
    ],
    [
      { id: 's3m1', label: 'Large grocery chains & food distributors', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 5, team: 3 } },
      { id: 's3m2', label: 'Small-medium restaurants and cafeterias', investorAppeal: { innovation: 2, feasibility: 5, marketFit: 3, team: 2 } },
      { id: 's3m3', label: 'Direct-to-consumer through mobile app', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 4, team: 2 } },
    ],
    [
      { id: 's3r1', label: 'Per-sensor SaaS fee + data analytics dashboard subscription', investorAppeal: { innovation: 4, feasibility: 4, marketFit: 5, team: 3 } },
      { id: 's3r2', label: 'Transaction fee on each surplus food sale', investorAppeal: { innovation: 2, feasibility: 5, marketFit: 4, team: 2 } },
      { id: 's3r3', label: 'One-time hardware sales with no recurring revenue', investorAppeal: { innovation: 1, feasibility: 3, marketFit: 2, team: 1 } },
    ],
    [
      { id: 's3t1', label: 'Supply chain PhD + IoT hardware lead + ex-Amazon logistics VP', investorAppeal: { innovation: 4, feasibility: 5, marketFit: 4, team: 5 } },
      { id: 's3t2', label: 'Food science grads with fresh startup energy', investorAppeal: { innovation: 3, feasibility: 3, marketFit: 3, team: 3 } },
      { id: 's3t3', label: 'Fintech engineers pivoting to food industry', investorAppeal: { innovation: 2, feasibility: 2, marketFit: 2, team: 2 } },
    ],
  ),
  buildScenario(
    's4',
    'Rural Education Access Gap',
    '250 million children worldwide lack access to quality education. Rural schools have 4x fewer qualified teachers than urban ones.',
    'EdTech',
    [
      { id: 's4p1', label: '70% of rural students drop out before high school due to irrelevant curriculum', investorAppeal: { innovation: 4, feasibility: 4, marketFit: 5, team: 3 } },
      { id: 's4p2', label: 'Teacher absenteeism in rural schools exceeds 25%', investorAppeal: { innovation: 3, feasibility: 3, marketFit: 4, team: 2 } },
      { id: 's4p3', label: 'Only 15% of rural schools have reliable internet connectivity', investorAppeal: { innovation: 3, feasibility: 3, marketFit: 3, team: 2 } },
    ],
    [
      { id: 's4s1', label: 'Offline-first AI tutor on low-cost tablets with adaptive curriculum', investorAppeal: { innovation: 5, feasibility: 4, marketFit: 5, team: 4 } },
      { id: 's4s2', label: 'Satellite-connected micro-schools with remote expert teachers', investorAppeal: { innovation: 4, feasibility: 3, marketFit: 4, team: 3 } },
      { id: 's4s3', label: 'Gamified SMS-based learning platform for feature phones', investorAppeal: { innovation: 3, feasibility: 5, marketFit: 3, team: 2 } },
    ],
    [
      { id: 's4m1', label: 'Government education ministries in developing nations', investorAppeal: { innovation: 2, feasibility: 4, marketFit: 5, team: 3 } },
      { id: 's4m2', label: 'International development orgs (UNICEF, World Bank)', investorAppeal: { innovation: 2, feasibility: 3, marketFit: 4, team: 3 } },
      { id: 's4m3', label: 'Parents willing to pay for children\'s education supplements', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 4, team: 2 } },
    ],
    [
      { id: 's4r1', label: 'Government contracts + per-student licensing to schools', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 5, team: 3 } },
      { id: 's4r2', label: 'Freemium consumer app with premium content tiers', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 3, team: 2 } },
      { id: 's4r3', label: 'Hardware sales subsidized by advertising', investorAppeal: { innovation: 1, feasibility: 2, marketFit: 2, team: 1 } },
    ],
    [
      { id: 's4t1', label: 'Former teacher + ML researcher + ed-tech founder (prev exit)', investorAppeal: { innovation: 4, feasibility: 5, marketFit: 4, team: 5 } },
      { id: 's4t2', label: 'CS students passionate about education equality', investorAppeal: { innovation: 3, feasibility: 3, marketFit: 3, team: 2 } },
      { id: 's4t3', label: 'Consultants with education sector reports but no tech skills', investorAppeal: { innovation: 1, feasibility: 1, marketFit: 3, team: 1 } },
    ],
  ),
  buildScenario(
    's5',
    'Urban Traffic Congestion',
    'Cities lose $87B annually to traffic congestion. Average commuters spend 54 extra hours per year stuck in traffic.',
    'Mobility',
    [
      { id: 's5p1', label: 'Single-occupancy vehicles make up 76% of commuter traffic', investorAppeal: { innovation: 4, feasibility: 5, marketFit: 5, team: 2 } },
      { id: 's5p2', label: 'Public transit systems are underfunded and unreliable', investorAppeal: { innovation: 2, feasibility: 3, marketFit: 4, team: 2 } },
      { id: 's5p3', label: 'Traffic congestion increases air pollution by 40% in city centers', investorAppeal: { innovation: 3, feasibility: 3, marketFit: 3, team: 2 } },
    ],
    [
      { id: 's5s1', label: 'AI traffic flow optimization with dynamic signal control', investorAppeal: { innovation: 5, feasibility: 4, marketFit: 5, team: 4 } },
      { id: 's5s2', label: 'Incentivized carpooling app with employer partnerships', investorAppeal: { innovation: 3, feasibility: 5, marketFit: 4, team: 2 } },
      { id: 's5s3', label: 'Underground autonomous pod transit network', investorAppeal: { innovation: 5, feasibility: 1, marketFit: 3, team: 3 } },
    ],
    [
      { id: 's5m1', label: 'City transportation departments in metro areas 1M+ pop', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 5, team: 3 } },
      { id: 's5m2', label: 'Corporate campuses and business districts', investorAppeal: { innovation: 2, feasibility: 5, marketFit: 4, team: 2 } },
      { id: 's5m3', label: 'Individual commuters through consumer app', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 3, team: 2 } },
    ],
    [
      { id: 's5r1', label: 'City licensing fees + congestion reduction performance bonuses', investorAppeal: { innovation: 4, feasibility: 4, marketFit: 5, team: 3 } },
      { id: 's5r2', label: 'Per-ride transaction fee on carpools', investorAppeal: { innovation: 2, feasibility: 5, marketFit: 4, team: 2 } },
      { id: 's5r3', label: 'Advertising and data monetization', investorAppeal: { innovation: 1, feasibility: 3, marketFit: 2, team: 1 } },
    ],
    [
      { id: 's5t1', label: 'Urban planner + computer vision PhD + ex-Uber city launcher', investorAppeal: { innovation: 4, feasibility: 5, marketFit: 5, team: 5 } },
      { id: 's5t2', label: 'Data scientists with transportation modeling experience', investorAppeal: { innovation: 3, feasibility: 4, marketFit: 3, team: 3 } },
      { id: 's5t3', label: 'Recent grads who experienced bad traffic firsthand', investorAppeal: { innovation: 2, feasibility: 2, marketFit: 2, team: 1 } },
    ],
  ),
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { problems: 2, timeLimit: 90, scoreMultiplier: 1.0, maxScore: 200 }
    case 'medium':
      return { problems: 3, timeLimit: 60, scoreMultiplier: 1.0, maxScore: 300 }
    case 'hard':
      return { problems: 4, timeLimit: 45, scoreMultiplier: 0.8, maxScore: 400 }
    case 'extreme':
      return { problems: 5, timeLimit: 30, scoreMultiplier: 0.6, maxScore: 500 }
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

// ─── Helpers ──────────────────────────────────────────────────

function computeFeedback(
  scenario: ProblemScenario,
  selections: Record<string, string>,
  multiplier: number,
): InvestorFeedback {
  let innovation = 0
  let feasibility = 0
  let marketFit = 0
  let team = 0

  for (const cat of scenario.categories) {
    const selectedId = selections[cat.key]
    const option = cat.options.find((o) => o.id === selectedId)
    if (option) {
      innovation += option.investorAppeal.innovation
      feasibility += option.investorAppeal.feasibility
      marketFit += option.investorAppeal.marketFit
      team += option.investorAppeal.team
    }
  }

  const rawTotal = innovation + feasibility + marketFit + team
  const total = Math.round(rawTotal * multiplier)

  return { innovation, feasibility, marketFit, team, total, maxTotal: scenario.maxPossibleScore }
}

const FEEDBACK_LABELS: { key: keyof InvestorFeedback; label: string; icon: typeof Lightbulb; color: string }[] = [
  { key: 'innovation', label: 'Innovation', icon: Sparkles, color: 'text-purple-400' },
  { key: 'feasibility', label: 'Feasibility', icon: CheckCircle2, color: 'text-emerald-400' },
  { key: 'marketFit', label: 'Market Fit', icon: Target, color: 'text-cyan-400' },
  { key: 'team', label: 'Team', icon: Users, color: 'text-amber-400' },
]

// ─── Component ────────────────────────────────────────────────

export default function InnovationPitch({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: InnovationPitchProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])

  const scenarios = useMemo(() => {
    return shuffle(ALL_SCENARIOS).slice(0, config.problems)
  }, [config.problems])

  const [problemIndex, setProblemIndex] = useState(0)
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<'building' | 'feedback' | 'finished'>('building')
  const [timeLeft, setTimeLeft] = useState(config.timeLimit)
  const [totalScore, setTotalScore] = useState(0)
  const [results, setResults] = useState<PitchResult[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const roundStartRef = useRef(Date.now())

  const currentScenario = scenarios[problemIndex]
  const currentCategory = currentScenario?.categories[categoryIndex]

  // Timer
  useEffect(() => {
    if (phase !== 'building' || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    roundStartRef.current = Date.now()
    setTimeLeft(config.timeLimit)

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemIndex, phase, isPaused])

  const handleTimeUp = useCallback(() => {
    if (phase !== 'building') return
    finalizePitch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, selections, problemIndex])

  const handleSelectOption = useCallback((optionId: string) => {
    if (phase !== 'building' || isPaused) return

    const key = currentCategory.key
    setSelections((prev) => ({ ...prev, [key]: optionId }))

    // Move to next category or show feedback
    if (categoryIndex + 1 < currentScenario.categories.length) {
      setCategoryIndex((i) => i + 1)
    } else {
      // All categories done — auto-submit
      const finalSelections = { ...selections, [key]: optionId }
      if (timerRef.current) clearInterval(timerRef.current)
      submitPitch(finalSelections)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isPaused, categoryIndex, currentCategory, currentScenario, selections])

  const submitPitch = useCallback((finalSelections: Record<string, string>) => {
    const timeSpent = Math.round((Date.now() - roundStartRef.current) / 1000)
    const feedback = computeFeedback(currentScenario, finalSelections, config.scoreMultiplier)
    const newTotal = totalScore + feedback.total
    setTotalScore(newTotal)
    onScoreUpdate(newTotal, config.maxScore)

    setResults((prev) => [...prev, {
      problem: currentScenario.title,
      selections: finalSelections,
      feedback,
      timeSpent,
    }])
    setPhase('feedback')
  }, [currentScenario, config, totalScore, onScoreUpdate])

  const finalizePitch = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    submitPitch(selections)
  }, [selections, submitPitch])

  const handleNextProblem = useCallback(() => {
    if (problemIndex + 1 >= config.problems) {
      setPhase('finished')
      onGameOver(totalScore, config.maxScore)
      return
    }
    setProblemIndex((i) => i + 1)
    setCategoryIndex(0)
    setSelections({})
    setPhase('building')
  }, [problemIndex, config, totalScore, onGameOver])

  // ─── Finished Screen ─────────────────────────────────────────

  if (phase === 'finished') {
    const avgScore = results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.feedback.total, 0) / results.length)
      : 0

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500"
        >
          <Presentation className="h-10 w-10 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white">Pitch Day Complete!</h2>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-bold text-purple-400">{totalScore}</p>
            <p className="text-xs text-gray-400">Total Score</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-bold text-cyan-400">{results.length}</p>
            <p className="text-xs text-gray-400">Pitches Made</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-2xl font-bold text-amber-400">{avgScore}</p>
            <p className="text-xs text-gray-400">Avg Score</p>
          </div>
        </div>

        <div className="w-full max-w-md space-y-3">
          <h3 className="text-sm font-semibold text-gray-300">Pitch Results</h3>
          {results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">{r.problem}</span>
                <span className="text-sm font-mono text-purple-400">{r.feedback.total} pts</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {FEEDBACK_LABELS.map(({ key, label, color }) => (
                  <div key={key} className="text-center">
                    <p className={cn('text-lg font-bold', color)}>
                      {r.feedback[key as keyof InvestorFeedback]}
                    </p>
                    <p className="text-[10px] text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  // ─── Main Game Screen ─────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Presentation className="h-5 w-5 text-purple-400" />
          <span className="text-sm font-semibold text-gray-300">
            Pitch {problemIndex + 1}/{config.problems}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Star className="h-4 w-4 text-amber-400" />
            <span className="font-mono text-white">{totalScore}</span>
          </div>

          <div className={cn(
            'flex items-center gap-1 rounded-lg px-3 py-1 text-sm font-mono',
            timeLeft <= 10 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/10 text-white'
          )}>
            <Timer className="h-4 w-4" />
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
          animate={{ width: `${((problemIndex + (phase === 'feedback' ? 1 : 0)) / config.problems) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {phase === 'building' && (
          <motion.div
            key={`build-${problemIndex}-${categoryIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-4"
          >
            {/* Problem Card */}
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-purple-400 font-medium">{currentScenario.sector}</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{currentScenario.title}</h3>
              <p className="text-sm text-gray-400">{currentScenario.description}</p>
            </div>

            {/* Category Progress */}
            <div className="flex items-center gap-1">
              {currentScenario.categories.map((cat, i) => {
                const Icon = cat.icon
                return (
                  <div
                    key={cat.key}
                    className={cn(
                      'flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-all',
                      i === categoryIndex
                        ? 'bg-purple-500/20 text-purple-300 font-semibold'
                        : i < categoryIndex || selections[cat.key]
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/5 text-gray-500'
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{cat.label}</span>
                    {i < currentScenario.categories.length - 1 && (
                      <ChevronRight className="h-3 w-3 text-gray-600 ml-1" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Current Category Selection */}
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                {(() => { const Icon = currentCategory.icon; return <Icon className="h-4 w-4" /> })()}
                Choose: {currentCategory.label}
              </h4>
              <p className="text-xs text-gray-500">
                Step {categoryIndex + 1} of {currentScenario.categories.length}
              </p>
            </div>

            <div className="space-y-2">
              {currentCategory.options.map((option, i) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => handleSelectOption(option.id)}
                  className={cn(
                    'group w-full rounded-xl border p-4 text-left transition-all',
                    'border-white/10 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                  )}
                >
                  <p className="text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {option.label}
                  </p>

                  {/* Mini appeal hints — only on easy */}
                  {difficulty === 'easy' && (
                    <div className="mt-2 flex gap-3 text-[10px] text-gray-500">
                      <span>🧪 Innovation: {'●'.repeat(option.investorAppeal.innovation)}{'○'.repeat(5 - option.investorAppeal.innovation)}</span>
                      <span>✅ Feasibility: {'●'.repeat(option.investorAppeal.feasibility)}{'○'.repeat(5 - option.investorAppeal.feasibility)}</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'feedback' && results.length > 0 && (
          <motion.div
            key={`feedback-${problemIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-4"
          >
            {/* Investor Panel Title */}
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
              <h3 className="text-lg font-bold text-white mb-1">Investor Panel Feedback</h3>
              <p className="text-sm text-gray-400">
                Your pitch for &ldquo;{results[results.length - 1].problem}&rdquo;
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              {FEEDBACK_LABELS.map(({ key, label, icon: Icon, color }, i) => {
                const value = results[results.length - 1].feedback[key as keyof InvestorFeedback] as number
                const maxValue = 25 // 5 categories * 5 max each
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={cn('h-4 w-4', color)} />
                      <span className="text-xs text-gray-400">{label}</span>
                    </div>
                    <p className={cn('text-2xl font-bold', color)}>{value}</p>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-white/10">
                      <motion.div
                        className={cn(
                          'h-full rounded-full',
                          key === 'innovation' ? 'bg-purple-500'
                            : key === 'feasibility' ? 'bg-emerald-500'
                            : key === 'marketFit' ? 'bg-cyan-500'
                            : 'bg-amber-500'
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${(value / maxValue) * 100}%` }}
                        transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Total Score */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 p-4 text-center"
            >
              <p className="text-sm text-gray-400">Pitch Score</p>
              <p className="text-3xl font-bold text-white">
                {results[results.length - 1].feedback.total}
                <span className="text-lg text-gray-500"> / {results[results.length - 1].feedback.maxTotal}</span>
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNextProblem}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/25"
            >
              {problemIndex + 1 >= config.problems ? 'See Final Results' : 'Next Problem'}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
