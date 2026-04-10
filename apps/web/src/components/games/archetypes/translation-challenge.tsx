'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Languages,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Star,
  Users,
  Baby,
  GraduationCap,
  Globe,
  Heart,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type Audience = 'child' | 'elderly' | 'expert' | 'foreigner'

interface TranslationRound {
  id: string
  originalMessage: string
  sourceContext: string
  targetAudience: Audience
  options: { text: string; isCorrect: boolean; feedback: string }[]
}

interface TranslationChallengeProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const AUDIENCE_CONFIG: Record<Audience, { label: string; icon: typeof Baby; color: string; description: string }> = {
  child: { label: 'Child (age 8)', icon: Baby, color: 'text-pink-400', description: 'Simple words, fun comparisons, short sentences' },
  elderly: { label: 'Elderly Person', icon: Heart, color: 'text-amber-400', description: 'Respectful, clear, patient, no jargon' },
  expert: { label: 'Technical Expert', icon: GraduationCap, color: 'text-blue-400', description: 'Precise terminology, concise, no over-simplification' },
  foreigner: { label: 'Foreign Visitor', icon: Globe, color: 'text-emerald-400', description: 'Simple English, avoid idioms, culturally clear' },
}

const ALL_ROUNDS: TranslationRound[] = [
  {
    id: 'tr1',
    originalMessage: 'Photosynthesis is the process by which green plants convert light energy, usually from the sun, into chemical energy that can be later released to fuel the plant\'s activities.',
    sourceContext: 'Biology textbook',
    targetAudience: 'child',
    options: [
      { text: 'Plants eat sunlight! They use light from the sun like food - it gives them energy to grow big and strong, kind of like how breakfast gives you energy to play.', isCorrect: true, feedback: 'Simple analogy to food/breakfast makes it relatable for an 8-year-old.' },
      { text: 'Photosynthesis converts photons into glucose via chloroplast-mediated reactions in the thylakoid membrane.', isCorrect: false, feedback: 'Way too technical for a child — no kid knows what thylakoids are!' },
      { text: 'The botanical process of photosynthetic activity enables autotrophic organisms to synthesize carbohydrates.', isCorrect: false, feedback: 'This is even more complex than the original — the opposite of what we need.' },
      { text: 'Plants make their food from sunlight through a complex biochemical pathway involving electron transport chains.', isCorrect: false, feedback: 'Still too sciency — "biochemical pathway" and "electron transport" aren\'t kid-friendly.' },
    ],
  },
  {
    id: 'tr2',
    originalMessage: 'The stock market experienced a significant correction today, with the S&P 500 declining 3.2% amid concerns over rising inflation and potential interest rate hikes by the Federal Reserve.',
    sourceContext: 'Financial news',
    targetAudience: 'elderly',
    options: [
      { text: 'The value of stocks went down quite a bit today — about 3% less than yesterday. This happened because people are worried that everyday prices are going up and the bank that controls money might make borrowing more expensive.', isCorrect: true, feedback: 'Clear, respectful language that explains financial jargon without being condescending.' },
      { text: 'Stonks go brr downward lol. Fed gonna hike rates, inflation vibes are bad.', isCorrect: false, feedback: 'Slang and internet speak would be confusing and disrespectful.' },
      { text: 'The equities market corrected following hawkish Fed signals and CPI overshoot.', isCorrect: false, feedback: 'Financial jargon like "equities" and "hawkish" needs translation, not compression.' },
      { text: 'Don\'t worry about your investments, everything will be fine.', isCorrect: false, feedback: 'Dismissive and patronizing — doesn\'t actually explain what happened.' },
    ],
  },
  {
    id: 'tr3',
    originalMessage: 'Machine learning algorithms iteratively learn from data, allowing computers to find hidden patterns without being explicitly programmed where to look.',
    sourceContext: 'AI research paper',
    targetAudience: 'child',
    options: [
      { text: 'Imagine teaching a computer like training a puppy! You show it lots of examples, and it figures out the patterns on its own — like how you learned the difference between cats and dogs by seeing lots of them.', isCorrect: true, feedback: 'The puppy/pet analogy and learning from examples are perfect for children.' },
      { text: 'ML models use gradient descent to optimize loss functions across neural network architectures.', isCorrect: false, feedback: 'This technical explanation would confuse most adults, let alone an 8-year-old!' },
      { text: 'Computers use sophisticated statistical methods to identify correlations in large datasets autonomously.', isCorrect: false, feedback: 'Still academic language — not child-friendly at all.' },
      { text: 'AI is when robots think like humans using math.', isCorrect: false, feedback: 'Too vague and slightly misleading — ML isn\'t exactly "thinking like humans."' },
    ],
  },
  {
    id: 'tr4',
    originalMessage: 'The patient presents with acute myocardial infarction, exhibiting ST-segment elevation in leads II, III, and aVF, consistent with inferior wall MI.',
    sourceContext: 'Medical chart',
    targetAudience: 'expert',
    options: [
      { text: 'Inferior STEMI confirmed — ST elevation in II, III, aVF. Likely RCA occlusion. Recommend emergent PCI.', isCorrect: true, feedback: 'Concise, precise, uses appropriate medical terminology for a cardiologist.' },
      { text: 'The patient had a heart attack. Their heart isn\'t working well. They need help right away.', isCorrect: false, feedback: 'Too simplified for a medical expert — loses critical diagnostic information.' },
      { text: 'Heart go ouchie. Bad lines on the monitor thingy. Need to fix ASAP.', isCorrect: false, feedback: 'This would be alarming in a medical context — completely inappropriate.' },
      { text: 'The patient\'s electrocardiogram shows some abnormal patterns that could indicate cardiac distress of some kind.', isCorrect: false, feedback: 'Too vague for an expert — "some abnormal patterns" and "some kind" lack precision.' },
    ],
  },
  {
    id: 'tr5',
    originalMessage: 'Climate change refers to long-term shifts in global temperatures and weather patterns, primarily driven by human activities such as burning fossil fuels.',
    sourceContext: 'Environmental science article',
    targetAudience: 'foreigner',
    options: [
      { text: 'The Earth is getting warmer over many years. This is mostly because people burn oil, gas, and coal for energy. This changes the weather everywhere in the world.', isCorrect: true, feedback: 'Simple English, short sentences, no idioms — clear for non-native speakers.' },
      { text: 'Global warming is caused by anthropogenic greenhouse gas emissions leading to radiative forcing imbalances.', isCorrect: false, feedback: 'Complex scientific vocabulary would confuse someone with limited English.' },
      { text: 'It\'s getting hot in here! Mother Nature is fighting back because we\'ve been playing with fire — literally!', isCorrect: false, feedback: 'Idioms like "playing with fire" and "Mother Nature" are confusing for foreign visitors.' },
      { text: 'The climate is experiencing unprecedented perturbations due to industrial-era carbon dioxide accumulation.', isCorrect: false, feedback: 'Words like "perturbations" and "unprecedented" are difficult for non-native speakers.' },
    ],
  },
  {
    id: 'tr6',
    originalMessage: 'Quantum entanglement occurs when pairs of particles interact in ways such that the quantum state of each particle cannot be described independently of the state of the others.',
    sourceContext: 'Physics journal',
    targetAudience: 'child',
    options: [
      { text: 'Imagine you have two magic dice. No matter how far apart they are, when you roll one and get a 6, the other one ALWAYS shows 1. They\'re connected in a spooky way that scientists are still trying to understand!', isCorrect: true, feedback: 'The magic dice metaphor makes quantum weirdness tangible and exciting for kids.' },
      { text: 'Entangled qubits share a Bell state where measurement of one instantaneously determines the other\'s eigenstate.', isCorrect: false, feedback: 'Even physics undergrads struggle with this language!' },
      { text: 'Particles are linked together forever by invisible quantum forces that transcend spacetime.', isCorrect: false, feedback: 'While simpler, "transcend spacetime" is too abstract for a child.' },
      { text: 'Two tiny things are connected. When you look at one, the other one changes too. Very tiny. Very fast.', isCorrect: false, feedback: 'Too minimal — loses the wonder and the key insight about distance.' },
    ],
  },
  {
    id: 'tr7',
    originalMessage: 'The Electoral College is a body of electors established by the United States Constitution, which forms every four years for the sole purpose of electing the president and vice president.',
    sourceContext: 'Civics textbook',
    targetAudience: 'foreigner',
    options: [
      { text: 'In America, people vote for president, but their votes are counted by state. Each state has a certain number of points. The person who gets enough points (270) wins. It is not the same as counting every single vote directly.', isCorrect: true, feedback: 'Clear "points" analogy avoids complex political vocabulary while staying accurate.' },
      { text: 'The EC is a constitutionally established deliberative body of 538 appointed electors who cast ballots per the results of the general election.', isCorrect: false, feedback: 'Legal jargon like "deliberative body" and "constitutionally established" is hard for non-native speakers.' },
      { text: 'It\'s like picking team captains — each state picks someone to vote for the big boss of the country!', isCorrect: false, feedback: 'A bit too casual and the "big boss" framing could be confusing cross-culturally.' },
      { text: 'An outdated system where the popular vote doesn\'t matter and swing states decide everything.', isCorrect: false, feedback: 'Opinions and idioms like "swing states decide everything" complicate understanding.' },
    ],
  },
  {
    id: 'tr8',
    originalMessage: 'To be or not to be, that is the question — whether \'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.',
    sourceContext: 'Shakespeare\'s Hamlet',
    targetAudience: 'elderly',
    options: [
      { text: 'Hamlet is wondering whether it\'s better to endure life\'s hardships patiently, or to fight back against all the difficulties he faces. It\'s a moment where he questions the meaning of living through suffering.', isCorrect: true, feedback: 'Respectful interpretation that maintains the depth while being accessible.' },
      { text: 'Shakespeare\'s using mixed metaphors — "sea of troubles" vs military imagery — to represent Hamlet\'s existential paralysis in the face of ontological uncertainty.', isCorrect: false, feedback: 'Literary criticism isn\'t what\'s needed — just a clear explanation of the meaning.' },
      { text: 'Hamlet is basically saying YOLO — should he just deal with it or fight back? Classic emo prince moment.', isCorrect: false, feedback: 'Slang and dismissive tone is inappropriate for an elderly audience.' },
      { text: 'He asks if living or dying is better when life is hard.', isCorrect: false, feedback: 'While technically correct, it\'s so stripped down it loses the beauty of what Hamlet is expressing.' },
    ],
  },
  {
    id: 'tr9',
    originalMessage: 'The blockchain is a decentralized, distributed ledger that records transactions across many computers so that any involved record cannot be altered retroactively.',
    sourceContext: 'Technology article',
    targetAudience: 'elderly',
    options: [
      { text: 'Think of a shared notebook that everyone in town has a copy of. When someone writes a transaction in it, everyone\'s copy updates. Nobody can erase or change what was written because everyone has the same record.', isCorrect: true, feedback: 'The shared notebook metaphor is familiar and concrete for elderly audiences.' },
      { text: 'Blockchain utilizes cryptographic hash functions and Merkle trees to ensure data integrity in a peer-to-peer consensus network.', isCorrect: false, feedback: 'Technical jargon that would confuse most non-technical people.' },
      { text: 'It\'s like crypto? Bitcoin? Digital money on the internet. Very complicated. Don\'t worry about it.', isCorrect: false, feedback: 'Dismissive and patronizing — elderly people deserve a real explanation.' },
      { text: 'An immutable distributed database with consensus mechanisms for trustless transaction validation.', isCorrect: false, feedback: 'Pure technobabble that doesn\'t communicate anything meaningful.' },
    ],
  },
  {
    id: 'tr10',
    originalMessage: 'The GDP (Gross Domestic Product) measures the total monetary value of all finished goods and services produced within a country\'s borders in a specific time period.',
    sourceContext: 'Economics textbook',
    targetAudience: 'child',
    options: [
      { text: 'GDP is like counting up ALL the money from everything a country makes and sells in one year — all the toys, food, cars, movies, everything! The bigger the number, the more stuff that country is making.', isCorrect: true, feedback: 'Concrete examples (toys, food, cars) and the counting metaphor work great for kids.' },
      { text: 'GDP represents the aggregate market value of all final goods and services in the domestic production boundary.', isCorrect: false, feedback: 'Textbook definition repeated — doesn\'t simplify anything.' },
      { text: 'It\'s how rich a country is, basically. More GDP = more money = better country.', isCorrect: false, feedback: 'Oversimplified and misleading — GDP doesn\'t equal "better country."' },
      { text: 'A comprehensive macroeconomic indicator tracking national output adjusted for purchasing power parity.', isCorrect: false, feedback: 'Even more complex than the original — completely wrong direction.' },
    ],
  },
  {
    id: 'tr11',
    originalMessage: 'Cognitive behavioral therapy (CBT) is a structured, goal-oriented psychotherapy that helps patients identify and change destructive or disturbing thought patterns that have a negative influence on behavior and emotions.',
    sourceContext: 'Psychology textbook',
    targetAudience: 'expert',
    options: [
      { text: 'CBT employs cognitive restructuring and behavioral activation techniques to modify maladaptive schemas, targeting the cognitive triad in treatment of depression and anxiety disorders.', isCorrect: true, feedback: 'Uses precise clinical terminology appropriate for a mental health professional.' },
      { text: 'It\'s a type of talking therapy where you learn to think more positively about things.', isCorrect: false, feedback: 'Too simplified — misses the structured, evidence-based nature of CBT.' },
      { text: 'Basically it\'s about training your brain to stop being negative. Mind over matter kind of thing.', isCorrect: false, feedback: '"Mind over matter" trivializes CBT — it\'s a scientifically validated intervention.' },
      { text: 'A therapy modality that theoretically addresses patterns but lacks robust longitudinal efficacy data.', isCorrect: false, feedback: 'CBT actually has strong evidence — this is misleading for an expert audience.' },
    ],
  },
  {
    id: 'tr12',
    originalMessage: 'The Renaissance was a cultural movement that began in Italy in the late 14th century and spread throughout Europe, marked by a renewed interest in classical art, literature, and learning.',
    sourceContext: 'History textbook',
    targetAudience: 'foreigner',
    options: [
      { text: 'About 600 years ago in Italy, people became very interested in old Greek and Roman ideas again. They began making beautiful art and studying science. This movement then spread to other countries in Europe. It is called the Renaissance.', isCorrect: true, feedback: 'Short sentences, time reference in years (not century), and concrete descriptions work for non-native speakers.' },
      { text: 'The Renaissance represented a paradigmatic shift from medieval scholasticism toward humanistic epistemological frameworks grounded in Greco-Roman antiquity.', isCorrect: false, feedback: 'Academic language that would be incomprehensible to most non-native speakers.' },
      { text: 'It was when Europe leveled up from the Dark Ages and started being cool again.', isCorrect: false, feedback: 'Gaming slang and "Dark Ages" framing is culturally specific and imprecise.' },
      { text: 'A big art thing happened in Italy a long time ago. Lots of paintings. Very famous.', isCorrect: false, feedback: 'Too minimal — misses the broader cultural and intellectual significance.' },
    ],
  },
  {
    id: 'tr13',
    originalMessage: 'Mitosis is a type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus.',
    sourceContext: 'Biology textbook',
    targetAudience: 'elderly',
    options: [
      { text: 'Mitosis is the way our cells make copies of themselves. One cell splits into two cells, and each new cell is an exact copy of the original — like making a photocopy. This is how our body grows and repairs itself.', isCorrect: true, feedback: 'The photocopy analogy is familiar and accurate, and connecting it to body repair adds relevance.' },
      { text: 'During mitotic division, prophase, metaphase, anaphase, and telophase ensure chromosomal fidelity through spindle fiber attachment at kinetochores.', isCorrect: false, feedback: 'Too technical — phases and structures aren\'t needed for basic understanding.' },
      { text: 'Cells go through a process that makes more cells. Science stuff. Important for health.', isCorrect: false, feedback: 'Vague and slightly patronizing — elderly people can understand more than this.' },
      { text: 'It\'s basically cloning at the cellular level bro.', isCorrect: false, feedback: 'Casual tone and "bro" are inappropriate for an elderly audience.' },
    ],
  },
  {
    id: 'tr14',
    originalMessage: 'Supply and demand is an economic model of price determination in a market, where the price of a good will settle at a point where the quantity demanded equals the quantity supplied.',
    sourceContext: 'Economics textbook',
    targetAudience: 'child',
    options: [
      { text: 'Imagine you\'re selling lemonade. If LOTS of kids want lemonade but you only have a little, you can charge more! But if nobody wants lemonade and you have tons, you\'d lower the price. That\'s supply and demand!', isCorrect: true, feedback: 'Lemonade stand is the perfect real-world example a kid can picture.' },
      { text: 'The equilibrium price is determined by the intersection of the supply and demand curves in a perfectly competitive market framework.', isCorrect: false, feedback: 'Economic jargon — kids don\'t know what equilibrium or supply curves are.' },
      { text: 'When something is rare, it costs more. When there is a lot, it costs less. Simple economics.', isCorrect: false, feedback: 'Better, but still abstract — needs a concrete example for children.' },
      { text: 'Market dynamics dictate pricing through bilateral negotiation of marginal utility and production costs.', isCorrect: false, feedback: 'Worse than the original — completely inaccessible for a child.' },
    ],
  },
  {
    id: 'tr15',
    originalMessage: 'CRISPR-Cas9 is a genome editing tool that allows researchers to alter DNA sequences and modify gene function with unprecedented precision and efficiency.',
    sourceContext: 'Science journal',
    targetAudience: 'expert',
    options: [
      { text: 'CRISPR-Cas9 leverages guide RNA-directed endonuclease activity for site-specific DSBs, enabling precise indels via NHEJ or HDR pathways. Current applications span therapeutic gene correction and functional genomics screens.', isCorrect: true, feedback: 'Appropriate technical depth for a molecular biologist or geneticist.' },
      { text: 'It\'s like tiny scissors that cut DNA and let scientists change genes.', isCorrect: false, feedback: 'The "scissors" analogy is for laypeople — an expert needs mechanism details.' },
      { text: 'Scientists can now edit the code of life using a revolutionary technology discovered from bacteria.', isCorrect: false, feedback: 'Journalistic framing lacks the precision an expert expects.' },
      { text: 'DNA gets cut and pasted around by some enzyme system. Pretty neat for science.', isCorrect: false, feedback: 'Casual and imprecise — not appropriate for technical communication.' },
    ],
  },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { count: 5, showAudienceHint: true }
    case 'medium':
      return { count: 5, showAudienceHint: false }
    case 'hard':
      return { count: 6, showAudienceHint: false }
    case 'extreme':
      return { count: 7, showAudienceHint: false }
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

export default function TranslationChallenge({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: TranslationChallengeProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const rounds = useMemo(() => {
    return shuffle(ALL_ROUNDS).slice(0, config.count).map((r) => ({
      ...r,
      options: shuffle(r.options),
    }))
  }, [config])

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [results, setResults] = useState<boolean[]>([])
  const [finished, setFinished] = useState(false)

  const current = rounds[index]
  const maxScore = rounds.length

  const handleSelect = useCallback(
    (optIdx: number) => {
      if (isPaused || selected !== null) return
      setSelected(optIdx)
      const isCorrect = current.options[optIdx].isCorrect
      const newResults = [...results, isCorrect]
      setResults(newResults)
      const score = newResults.filter(Boolean).length
      onScoreUpdate(score, maxScore)
    },
    [isPaused, selected, current, results, maxScore, onScoreUpdate],
  )

  const handleNext = useCallback(() => {
    if (index + 1 >= rounds.length) {
      setFinished(true)
      const final = results.filter(Boolean).length
      onGameOver(final, maxScore)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
    }
  }, [index, rounds.length, results, maxScore, onGameOver])

  const correctCount = results.filter(Boolean).length
  const audienceConf = AUDIENCE_CONFIG[current.targetAudience]
  const AudienceIcon = audienceConf.icon

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
      {/* Progress */}
      <div className="flex items-center gap-1.5">
        {rounds.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-bold transition-all',
              i < index && results[i] && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i < index && !results[i] && 'border-red-500/40 bg-red-500/15 text-red-400',
              i === index && !finished && 'border-indigo-500/50 bg-indigo-500/15 text-indigo-300 shadow-[0_0_8px_rgba(99,102,241,0.3)]',
              i > index && 'border-white/10 bg-white/5 text-white/20',
            )}
          >
            {i < results.length ? (results[i] ? '✓' : '✗') : i + 1}
          </div>
        ))}
      </div>

      {/* Score bar */}
      <div className="flex w-full items-center justify-between rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-indigo-400" />
          <span className="text-xs text-white/60">Score: <span className="font-bold text-indigo-300">{correctCount}/{results.length}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-white/40" />
          <span className="text-xs text-white/60">Rounds: {index + 1}/{rounds.length}</span>
        </div>
      </div>

      {finished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8"
        >
          <Star className="h-12 w-12 text-amber-400" />
          <p className="text-xl font-bold text-white">Translation Complete!</p>
          <p className="text-sm text-white/60">
            Correct adaptations: {correctCount} / {maxScore}
          </p>
          <p className="text-xs text-white/40">
            Accuracy: {Math.round((correctCount / maxScore) * 100)}%
          </p>
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
            {/* Original message */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Original ({current.sourceContext})</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{current.originalMessage}</p>
            </div>

            {/* Target audience */}
            <div className={cn('flex items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3')}>
              <AudienceIcon className={cn('h-5 w-5', audienceConf.color)} />
              <div>
                <p className="text-sm font-bold text-white/80">
                  Rewrite for: <span className={audienceConf.color}>{audienceConf.label}</span>
                </p>
                {config.showAudienceHint && (
                  <p className="text-xs text-white/40">{audienceConf.description}</p>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/30">
                Pick the best version for this audience:
              </p>
              {current.options.map((opt, oi) => {
                const isChosen = selected === oi
                const revealed = selected !== null
                const isCorrect = opt.isCorrect
                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(oi)}
                    disabled={revealed}
                    className={cn(
                      'rounded-xl border p-4 text-left text-sm transition-all',
                      !revealed && 'border-white/10 bg-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5',
                      revealed && isChosen && isCorrect && 'border-emerald-500/40 bg-emerald-500/10',
                      revealed && isChosen && !isCorrect && 'border-red-500/40 bg-red-500/10',
                      revealed && !isChosen && isCorrect && 'border-emerald-500/20 bg-emerald-500/5',
                      revealed && !isChosen && !isCorrect && 'border-white/5 bg-white/3 opacity-40',
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {revealed && isCorrect && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />}
                      {revealed && isChosen && !isCorrect && <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />}
                      <span className="text-white/80">{opt.text}</span>
                    </div>
                    {revealed && (isChosen || isCorrect) && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={cn('mt-2 text-xs', isCorrect ? 'text-emerald-300' : 'text-red-300')}
                      >
                        {opt.feedback}
                      </motion.p>
                    )}
                  </button>
                )
              })}
            </div>

            {selected !== null && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleNext}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all hover:bg-indigo-500"
              >
                {index + 1 >= rounds.length ? 'Finish' : 'Next Message'}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
