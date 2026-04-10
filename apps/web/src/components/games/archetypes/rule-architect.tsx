'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ShieldCheck,
  ArrowRight,
  Plus,
  Trash2,
  Play,
  Users,
  Frown,
  Meh,
  Smile,
  Store,
  Home,
  Baby,
  UserRound,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface Condition {
  id: string
  label: string
  key: string
}

interface Action {
  id: string
  label: string
  key: string
}

interface NPC {
  name: string
  age: number
  isShopkeeper: boolean
  ownsProperty: boolean
  income: 'low' | 'medium' | 'high'
  hasChildren: boolean
  isElderly: boolean
}

interface Rule {
  conditionKey: string
  actionKey: string
}

interface VillageScenario {
  id: string
  name: string
  description: string
  npcs: NPC[]
  conditions: Condition[]
  actions: Action[]
  idealRules: Rule[]
}

interface RuleArchitectProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const CONDITIONS: Condition[] = [
  { id: 'c1', label: 'Age > 18', key: 'adult' },
  { id: 'c2', label: 'Is a shopkeeper', key: 'shopkeeper' },
  { id: 'c3', label: 'Owns property', key: 'property' },
  { id: 'c4', label: 'Income is low', key: 'lowIncome' },
  { id: 'c5', label: 'Has children', key: 'hasChildren' },
  { id: 'c6', label: 'Is elderly (65+)', key: 'elderly' },
  { id: 'c7', label: 'Income is high', key: 'highIncome' },
]

const ACTIONS: Action[] = [
  { id: 'a1', label: 'Can vote in council', key: 'vote' },
  { id: 'a2', label: 'Pays standard tax', key: 'tax' },
  { id: 'a3', label: 'Gets financial subsidy', key: 'subsidy' },
  { id: 'a4', label: 'Must volunteer 2hrs/week', key: 'volunteer' },
  { id: 'a5', label: 'Gets free healthcare', key: 'healthcare' },
  { id: 'a6', label: 'Pays property tax', key: 'propertyTax' },
  { id: 'a7', label: 'Gets education grant', key: 'eduGrant' },
]

const SCENARIOS: VillageScenario[] = [
  {
    id: 'v1',
    name: 'Riverside Village',
    description: 'A small farming village needs rules for fair governance. Ensure adults can participate and vulnerable residents are supported.',
    npcs: [
      { name: 'Anna', age: 34, isShopkeeper: true, ownsProperty: true, income: 'medium', hasChildren: true, isElderly: false },
      { name: 'Budi', age: 72, isShopkeeper: false, ownsProperty: true, income: 'low', hasChildren: false, isElderly: true },
      { name: 'Citra', age: 16, isShopkeeper: false, ownsProperty: false, income: 'low', hasChildren: false, isElderly: false },
      { name: 'Dewa', age: 45, isShopkeeper: true, ownsProperty: true, income: 'high', hasChildren: true, isElderly: false },
      { name: 'Eka', age: 28, isShopkeeper: false, ownsProperty: false, income: 'low', hasChildren: true, isElderly: false },
      { name: 'Farah', age: 55, isShopkeeper: false, ownsProperty: true, income: 'medium', hasChildren: false, isElderly: false },
    ],
    conditions: CONDITIONS,
    actions: ACTIONS,
    idealRules: [
      { conditionKey: 'adult', actionKey: 'vote' },
      { conditionKey: 'lowIncome', actionKey: 'subsidy' },
      { conditionKey: 'property', actionKey: 'propertyTax' },
      { conditionKey: 'elderly', actionKey: 'healthcare' },
      { conditionKey: 'hasChildren', actionKey: 'eduGrant' },
      { conditionKey: 'highIncome', actionKey: 'tax' },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────

function getRuleCount(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 2
    case 'medium': return 4
    case 'hard': return 6
    case 'extreme': return 6
  }
}

function getMultiplier(difficulty: GameDifficulty): number {
  switch (difficulty) {
    case 'easy': return 1
    case 'medium': return 1.5
    case 'hard': return 2
    case 'extreme': return 3
  }
}

function matchesCondition(npc: NPC, conditionKey: string): boolean {
  switch (conditionKey) {
    case 'adult': return npc.age > 18
    case 'shopkeeper': return npc.isShopkeeper
    case 'property': return npc.ownsProperty
    case 'lowIncome': return npc.income === 'low'
    case 'hasChildren': return npc.hasChildren
    case 'elderly': return npc.isElderly
    case 'highIncome': return npc.income === 'high'
    default: return false
  }
}

function computeSatisfaction(npc: NPC, rules: Rule[]): number {
  let score = 50 // Base satisfaction

  const appliedActions = new Set<string>()
  for (const rule of rules) {
    if (matchesCondition(npc, rule.conditionKey)) {
      appliedActions.add(rule.actionKey)
    }
  }

  // Positive effects
  if (appliedActions.has('vote') && npc.age > 18) score += 10
  if (appliedActions.has('subsidy') && npc.income === 'low') score += 15
  if (appliedActions.has('healthcare') && npc.isElderly) score += 15
  if (appliedActions.has('eduGrant') && npc.hasChildren) score += 10

  // Negative effects
  if (appliedActions.has('tax')) score -= 5
  if (appliedActions.has('propertyTax') && npc.ownsProperty) score -= 5
  if (appliedActions.has('volunteer')) score -= 5

  // Unfairness penalties
  if (appliedActions.has('tax') && npc.income === 'low') score -= 15
  if (appliedActions.has('propertyTax') && !npc.ownsProperty) score -= 10
  if (appliedActions.has('volunteer') && npc.isElderly) score -= 10

  // Bonus: children get education
  if (npc.hasChildren && !appliedActions.has('eduGrant')) score -= 5
  // Bonus: elderly get healthcare
  if (npc.isElderly && !appliedActions.has('healthcare')) score -= 10
  // Penalty: minors taxed
  if (npc.age <= 18 && (appliedActions.has('tax') || appliedActions.has('propertyTax'))) score -= 20
  // Bonus: vote if adult
  if (npc.age > 18 && !appliedActions.has('vote')) score -= 5

  return Math.max(0, Math.min(100, score))
}

function getSatisfactionIcon(score: number) {
  if (score >= 70) return Smile
  if (score >= 40) return Meh
  return Frown
}

function getSatisfactionColor(score: number): string {
  if (score >= 70) return 'text-emerald-400'
  if (score >= 40) return 'text-amber-400'
  return 'text-red-400'
}

// ─── Component ────────────────────────────────────────────────

export default function RuleArchitect({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: RuleArchitectProps) {
  const scenario = SCENARIOS[0]
  const multiplier = getMultiplier(difficulty)
  const requiredRules = getRuleCount(difficulty)
  const maxScore = 100 * multiplier

  const [rules, setRules] = useState<Rule[]>([])
  const [currentCondition, setCurrentCondition] = useState<string>('')
  const [currentAction, setCurrentAction] = useState<string>('')
  const [phase, setPhase] = useState<'build' | 'simulate' | 'done'>('build')
  const [satisfactions, setSatisfactions] = useState<{ name: string; score: number }[]>([])
  const [finalScore, setFinalScore] = useState(0)

  const addRule = useCallback(() => {
    if (!currentCondition || !currentAction || isPaused) return
    if (rules.length >= requiredRules) return
    // Prevent duplicate rules
    const isDuplicate = rules.some(
      (r) => r.conditionKey === currentCondition && r.actionKey === currentAction,
    )
    if (isDuplicate) return

    setRules((prev) => [...prev, { conditionKey: currentCondition, actionKey: currentAction }])
    setCurrentCondition('')
    setCurrentAction('')
  }, [currentCondition, currentAction, isPaused, rules, requiredRules])

  const removeRule = useCallback(
    (index: number) => {
      if (isPaused || phase !== 'build') return
      setRules((prev) => prev.filter((_, i) => i !== index))
    },
    [isPaused, phase],
  )

  const handleSimulate = useCallback(() => {
    if (isPaused || rules.length === 0) return

    const results = scenario.npcs.map((npc) => ({
      name: npc.name,
      score: computeSatisfaction(npc, rules),
    }))

    setSatisfactions(results)
    const avg = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    const scoreValue = Math.round(avg * multiplier)
    setFinalScore(scoreValue)
    setPhase('simulate')
    onScoreUpdate(scoreValue, maxScore)
  }, [isPaused, rules, scenario.npcs, multiplier, maxScore, onScoreUpdate])

  const handleFinish = useCallback(() => {
    setPhase('done')
    onGameOver(finalScore, maxScore)
  }, [finalScore, maxScore, onGameOver])

  const conditionLabel = (key: string) =>
    CONDITIONS.find((c) => c.key === key)?.label ?? key
  const actionLabel = (key: string) =>
    ACTIONS.find((a) => a.key === key)?.label ?? key

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
      {/* Scenario info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-xl border border-violet-500/20 bg-violet-500/5 p-5"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-violet-300">
          <ShieldCheck className="h-4 w-4" />
          {scenario.name}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{scenario.description}</p>
        <p className="mt-2 text-xs text-cyan-400">
          Create {requiredRules} rules for this community (IF condition THEN action)
        </p>
      </motion.div>

      {/* Villagers */}
      <div className="flex w-full flex-wrap gap-2">
        {scenario.npcs.map((npc) => {
          const satResult = satisfactions.find((s) => s.name === npc.name)
          const SatIcon = satResult ? getSatisfactionIcon(satResult.score) : Users
          const satColor = satResult ? getSatisfactionColor(satResult.score) : 'text-white/40'

          return (
            <div
              key={npc.name}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs"
            >
              <SatIcon className={cn('h-4 w-4', satColor)} />
              <div>
                <span className="font-semibold text-white/80">{npc.name}</span>
                <span className="ml-1 text-white/40">
                  {npc.age}y {npc.isShopkeeper ? <Store className="ml-1 inline h-3 w-3" /> : ''} {npc.ownsProperty ? <Home className="ml-1 inline h-3 w-3" /> : ''} {npc.hasChildren ? <Baby className="ml-1 inline h-3 w-3" /> : ''} {npc.isElderly ? <UserRound className="ml-1 inline h-3 w-3" /> : ''}
                </span>
                {satResult && (
                  <span className={cn('ml-2 font-bold', satColor)}>
                    {satResult.score}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {phase === 'build' && (
        <>
          {/* Rule builder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex w-full flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold text-white/40">IF…</label>
              <select
                value={currentCondition}
                onChange={(e) => setCurrentCondition(e.target.value)}
                disabled={isPaused}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/80 outline-none focus:border-violet-500/40"
              >
                <option value="">Select condition</option>
                {CONDITIONS.map((c) => (
                  <option key={c.id} value={c.key} className="bg-[#151B3B] text-white">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold text-white/40">THEN…</label>
              <select
                value={currentAction}
                onChange={(e) => setCurrentAction(e.target.value)}
                disabled={isPaused}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/80 outline-none focus:border-violet-500/40"
              >
                <option value="">Select action</option>
                {ACTIONS.map((a) => (
                  <option key={a.id} value={a.key} className="bg-[#151B3B] text-white">
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={addRule}
              disabled={!currentCondition || !currentAction || rules.length >= requiredRules || isPaused}
              className={cn(
                'flex items-center gap-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all',
                currentCondition && currentAction && rules.length < requiredRules
                  ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
                  : 'cursor-not-allowed border-white/10 bg-white/5 text-white/25',
              )}
            >
              <Plus className="h-4 w-4" />
              Add Rule
            </button>
          </motion.div>

          {/* Current rules */}
          <div className="flex w-full flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Rules ({rules.length}/{requiredRules})
            </p>
            <AnimatePresence>
              {rules.map((rule, i) => (
                <motion.div
                  key={`${rule.conditionKey}-${rule.actionKey}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <span className="rounded bg-violet-500/15 px-2 py-0.5 text-xs font-bold text-violet-300">
                    IF
                  </span>
                  <span className="text-white/70">{conditionLabel(rule.conditionKey)}</span>
                  <span className="rounded bg-cyan-500/15 px-2 py-0.5 text-xs font-bold text-cyan-300">
                    THEN
                  </span>
                  <span className="text-white/70">{actionLabel(rule.actionKey)}</span>
                  <button
                    onClick={() => removeRule(i)}
                    className="ml-auto text-red-400/50 transition-colors hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Simulate button */}
          <button
            onClick={handleSimulate}
            disabled={rules.length === 0 || isPaused}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold transition-all',
              rules.length > 0
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'cursor-not-allowed border-white/10 bg-white/5 text-white/25',
            )}
          >
            <Play className="h-4 w-4" />
            Simulate Rules
          </button>
        </>
      )}

      {phase === 'simulate' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full flex-col items-center gap-4"
        >
          {/* Satisfaction bars */}
          <div className="w-full rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-3 text-sm font-bold text-white/80">Community Satisfaction</p>
            {satisfactions.map((s) => {
              const SatIcon = getSatisfactionIcon(s.score)
              const color = getSatisfactionColor(s.score)
              return (
                <div key={s.name} className="mb-2 flex items-center gap-3">
                  <SatIcon className={cn('h-4 w-4 shrink-0', color)} />
                  <span className="w-16 text-xs font-semibold text-white/70">{s.name}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.score}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={cn(
                        'h-full rounded-full',
                        s.score >= 70 ? 'bg-emerald-500' : s.score >= 40 ? 'bg-amber-500' : 'bg-red-500',
                      )}
                    />
                  </div>
                  <span className={cn('w-10 text-right text-xs font-bold', color)}>
                    {s.score}%
                  </span>
                </div>
              )
            })}
          </div>

          {/* Average score */}
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 text-center">
            <p className="text-xs text-cyan-400/60">Average Satisfaction</p>
            <p className="text-2xl font-bold text-cyan-300">
              {Math.round(satisfactions.reduce((s, r) => s + r.score, 0) / satisfactions.length)}%
            </p>
          </div>

          <button
            onClick={handleFinish}
            className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-6 py-2.5 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-500/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            Finish
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </div>
  )
}
