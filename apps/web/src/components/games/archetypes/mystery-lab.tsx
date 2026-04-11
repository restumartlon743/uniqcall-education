'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Search,
  ArrowRight,
  Check,
  X,
  CheckCircle2,
  Star,
  FlaskConical,
  BarChart3,
  Lightbulb,
  FileQuestion,
  Eye,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type EvidenceType = 'fingerprint' | 'substance' | 'data'
type Phase = 'observe' | 'hypothesize' | 'test' | 'conclude' | 'result'

interface Evidence {
  id: string
  name: string
  type: EvidenceType
  description: string
  testResult: string
  isRelevant: boolean
}

interface Mystery {
  id: string
  title: string
  category: 'theft' | 'contamination' | 'missing'
  scenario: string
  evidenceList: Evidence[]
  hypotheses: string[]
  correctHypothesis: number
  conclusions: string[]
  correctConclusion: number
}

interface MysteryLabProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const EVIDENCE_ICONS: Record<EvidenceType, { icon: LucideIcon; color: string }> = {
  fingerprint: { icon: Search, color: 'text-purple-400' },
  substance: { icon: FlaskConical, color: 'text-emerald-400' },
  data: { icon: BarChart3, color: 'text-cyan-400' },
}

const ALL_MYSTERIES: Mystery[] = [
  {
    id: 'm1',
    title: 'The Missing Prototype',
    category: 'theft',
    scenario: 'A valuable tech prototype has vanished from the R&D lab overnight. Security cameras show 3 employees entered the building after hours. The prototype was in a locked safe.',
    evidenceList: [
      { id: 'e1', name: 'Safe Fingerprints', type: 'fingerprint', description: 'Fingerprints found on the safe door', testResult: 'Match: Employee B (Dr. Chen) — fresh prints overlaying older ones', isRelevant: true },
      { id: 'e2', name: 'Coffee Cup Residue', type: 'substance', description: 'A coffee cup left near the safe', testResult: 'DNA from saliva matches Employee A (Mr. Torres) — but cup is from the morning shift', isRelevant: false },
      { id: 'e3', name: 'Keycard Log Data', type: 'data', description: 'Entry/exit timestamps from the keycard system', testResult: 'Employee B entered at 11:47 PM, exited at 12:32 AM. Employee C entered at 10 PM, exited at 10:15 PM. Employee A entered at 6 AM (morning shift)', isRelevant: true },
      { id: 'e4', name: 'Chemical Trace on Safe', type: 'substance', description: 'A powdery residue on the safe lock', testResult: 'Graphite lubricant — used to ease lock mechanisms, matches Employee B\'s desk supplies', isRelevant: true },
      { id: 'e5', name: 'Desk Fingerprints', type: 'fingerprint', description: 'Fingerprints on nearby desks', testResult: 'Multiple employees — inconclusive, normal office activity', isRelevant: false },
    ],
    hypotheses: [
      'Employee A (Mr. Torres) stole it during morning shift',
      'Employee B (Dr. Chen) opened the safe using lubricant and took the prototype',
      'Employee C broke in but found nothing',
      'An outside intruder bypassed security',
    ],
    correctHypothesis: 1,
    conclusions: [
      'The prototype was moved to a different lab by management',
      'Dr. Chen used graphite lubricant to pick the safe lock at 11:47 PM and left with the prototype at 12:32 AM',
      'Mr. Torres accidentally misplaced the prototype during his shift',
      'The security system malfunctioned and no one actually entered',
    ],
    correctConclusion: 1,
  },
  {
    id: 'm2',
    title: 'The Contaminated Water Supply',
    category: 'contamination',
    scenario: 'Students in the science building reported blue-tinted water from drinking fountains. Three chemicals were recently delivered to labs on the same floor. No one has claimed responsibility.',
    evidenceList: [
      { id: 'e1', name: 'Water Sample', type: 'substance', description: 'Blue-tinted water from the fountain', testResult: 'Contains copper sulfate — a blue crystalline compound used in chemistry labs', isRelevant: true },
      { id: 'e2', name: 'Delivery Records', type: 'data', description: 'Chemical delivery log for the week', testResult: 'Copper sulfate delivered to Lab 204 on Monday. Methylene blue delivered to Lab 208. Cobalt chloride to Lab 212.', isRelevant: true },
      { id: 'e3', name: 'Pipe Junction Residue', type: 'substance', description: 'Residue found where lab drain meets water main', testResult: 'Copper sulfate crystals found at the Lab 204 drain junction — improper disposal caused backflow', isRelevant: true },
      { id: 'e4', name: 'Fountain Fingerprints', type: 'fingerprint', description: 'Fingerprints on the fountain', testResult: 'Dozens of student prints — normal usage, inconclusive', isRelevant: false },
      { id: 'e5', name: 'Maintenance Log', type: 'data', description: 'Plumbing maintenance records', testResult: 'Backflow preventer in Lab 204\'s section was flagged for repair 2 weeks ago but not yet fixed', isRelevant: true },
    ],
    hypotheses: [
      'A student poured methylene blue into the fountain as a prank',
      'Copper sulfate from Lab 204 backflowed through a broken preventer into the water main',
      'The cobalt chloride delivery was contaminated',
      'The water treatment facility sent tainted water',
    ],
    correctHypothesis: 1,
    conclusions: [
      'The plumbing company is at fault for not fixing the backflow preventer',
      'Lab 204 improperly disposed of copper sulfate down the drain, which backflowed into the water supply through the broken preventer',
      'Students in Lab 208 mixed chemicals incorrectly',
      'The contamination came from an external source unrelated to the building',
    ],
    correctConclusion: 1,
  },
  {
    id: 'm3',
    title: 'The Vanishing Artifacts',
    category: 'missing',
    scenario: 'Three ancient coins disappeared from a museum display case. The case was intact but empty at morning inspection. The alarm system shows no breach. Two night guards and one curator had access.',
    evidenceList: [
      { id: 'e1', name: 'Display Case Glass', type: 'fingerprint', description: 'Fingerprints on the inside of the glass', testResult: 'Match Curator Martinez — she arranged the display yesterday. Fresh prints on the case\'s hidden back panel.', isRelevant: true },
      { id: 'e2', name: 'Alarm System Data', type: 'data', description: 'Alarm sensor readings overnight', testResult: 'No breach detected — but the back panel sensor was deactivated at 2:14 AM using curator-level access code', isRelevant: true },
      { id: 'e3', name: 'Guard Route Data', type: 'data', description: 'GPS tracking of guard routes', testResult: 'Guard A followed normal route all night. Guard B skipped the wing at 2:10-2:30 AM.', isRelevant: true },
      { id: 'e4', name: 'Cleaning Solution', type: 'substance', description: 'Residue on the display shelf', testResult: 'Standard museum cleaning solution — applied during last week\'s maintenance, not recent', isRelevant: false },
      { id: 'e5', name: 'Back Panel Dust', type: 'fingerprint', description: 'Dust disturbance on the back panel', testResult: 'Recent wiping pattern — someone accessed the panel and tried to clean up evidence', isRelevant: true },
    ],
    hypotheses: [
      'Guard A stole the coins during his route',
      'Curator Martinez used her access code to disable the sensor and removed coins through the back panel',
      'Guard B broke the display during his skip',
      'The coins were never real — they were replaced with forgeries that dissolved',
    ],
    correctHypothesis: 1,
    conclusions: [
      'The alarm system had a software glitch that hid the breach',
      'Curator Martinez deactivated the back panel sensor at 2:14 AM, accessed the case from behind, and removed the coins — Guard B may have been complicit by skipping his route',
      'Guard A sold the coins and framed the curator',
      'The coins were removed during regular maintenance and misplaced',
    ],
    correctConclusion: 1,
  },
  {
    id: 'm4',
    title: 'The Poisoned Garden',
    category: 'contamination',
    scenario: 'Prize-winning roses in the botanical garden are dying in a specific pattern — only the east section. The gardener, a rival competitor, and a construction crew all had recent access.',
    evidenceList: [
      { id: 'e1', name: 'Soil Sample East', type: 'substance', description: 'Soil from the dying rose section', testResult: 'Extremely high salt concentration — 10× normal levels. Salt kills plants by dehydrating roots.', isRelevant: true },
      { id: 'e2', name: 'Soil Sample West', type: 'substance', description: 'Soil from the healthy rose section', testResult: 'Normal salt levels — healthy soil composition', isRelevant: true },
      { id: 'e3', name: 'Construction Runoff Data', type: 'data', description: 'Drainage patterns from nearby construction', testResult: 'Construction site uses de-icing salt on pathways. Drainage flows East toward the affected garden section.', isRelevant: true },
      { id: 'e4', name: 'Footprints Near Roses', type: 'fingerprint', description: 'Boot prints near the dying section', testResult: 'Construction worker boots — standard site-issued. Present throughout the area.', isRelevant: true },
      { id: 'e5', name: 'Gardener Glove Residue', type: 'substance', description: 'Residue on the gardener\'s gloves', testResult: 'Standard fertilizer — potassium-based, normal gardening supplies', isRelevant: false },
    ],
    hypotheses: [
      'The gardener over-fertilized the east section',
      'Salt runoff from the construction site drained into the east garden section',
      'The rival competitor poisoned the roses with herbicide',
      'A natural soil disease is spreading from east to west',
    ],
    correctHypothesis: 1,
    conclusions: [
      'The rival competitor snuck in at night and salted the soil',
      'De-icing salt from the construction site\'s pathways drained into the east garden section due to the natural slope, causing fatal salt concentration in the soil',
      'The gardener used the wrong fertilizer formula',
      'Climate change altered the east section\'s microclimate',
    ],
    correctConclusion: 1,
  },
  {
    id: 'm5',
    title: 'The Forged Painting',
    category: 'theft',
    scenario: 'An art gallery suspects one of three recently acquired paintings is a forgery. The original was reportedly valued at $2 million. All three passed initial visual inspection.',
    evidenceList: [
      { id: 'e1', name: 'Paint Layer Analysis', type: 'substance', description: 'Chemical analysis of paint layers on all three', testResult: 'Painting A: period-correct linseed oil pigments. Painting B: contains titanium white (invented 1921, painting dated 1870). Painting C: period-correct egg tempera.', isRelevant: true },
      { id: 'e2', name: 'Canvas Dating', type: 'data', description: 'Carbon-14 dating of canvas material', testResult: 'A: 1860-1880. B: 1920-1950. C: 1855-1875. All supposedly from the 1870s.', isRelevant: true },
      { id: 'e3', name: 'Frame Fingerprints', type: 'fingerprint', description: 'Fingerprints on the back of each frame', testResult: 'A: gallery staff only. B: unknown prints + gallery staff. C: gallery staff only.', isRelevant: true },
      { id: 'e4', name: 'UV Light Scan', type: 'data', description: 'Ultraviolet fluorescence imaging', testResult: 'A: uniform aging. B: patchy fluorescence suggesting artificial aging techniques. C: uniform aging.', isRelevant: true },
      { id: 'e5', name: 'Gallery Dust', type: 'substance', description: 'Dust composition from display area', testResult: 'Standard gallery dust — no anomalies', isRelevant: false },
    ],
    hypotheses: [
      'Painting A is the forgery — it was cleaned too well',
      'Painting B is the forgery — titanium white, modern canvas, and artificial aging',
      'Painting C is the forgery — the egg tempera is synthetic',
      'All three are authentic but from different periods',
    ],
    correctHypothesis: 1,
    conclusions: [
      'Painting B was created between 1920-1950 using titanium white paint (unavailable in 1870), on modern canvas, with artificial aging applied to simulate patina — the unknown fingerprints suggest an outside forger',
      'The gallery was scammed on all three purchases',
      'Carbon dating is unreliable and all paintings need more testing',
      'Painting A\'s cleaning removed evidence of its true age',
    ],
    correctConclusion: 0,
  },
  {
    id: 'm6',
    title: 'The Data Breach',
    category: 'theft',
    scenario: 'A company discovered customer records were leaked online. Server logs show unusual activity. Three employees had database access: the DBA, a junior dev, and the security analyst.',
    evidenceList: [
      { id: 'e1', name: 'Server Access Logs', type: 'data', description: 'Database query logs from the past week', testResult: 'Junior dev ran a SELECT * query on the customer table at 3:47 AM — far outside work hours. Downloaded 50,000 records.', isRelevant: true },
      { id: 'e2', name: 'USB Port Activity', type: 'data', description: 'USB device connection logs', testResult: 'An unregistered USB device was connected to the junior dev\'s workstation at 3:52 AM', isRelevant: true },
      { id: 'e3', name: 'Keyboard Residue', type: 'fingerprint', description: 'Fingerprints on the junior dev\'s keyboard', testResult: 'Only the junior dev\'s prints — no sign of someone else using their workstation', isRelevant: true },
      { id: 'e4', name: 'Network Traffic', type: 'data', description: 'Network packet analysis', testResult: 'Large data transfer detected at 3:55 AM from the junior dev\'s machine to an external IP — not a company-approved service', isRelevant: true },
      { id: 'e5', name: 'Coffee Machine Residue', type: 'substance', description: 'Traces near the break room', testResult: 'Standard coffee — no relevance', isRelevant: false },
    ],
    hypotheses: [
      'The DBA accidentally exposed the database through misconfiguration',
      'The junior dev accessed and exfiltrated customer data at 3:47 AM',
      'The security analyst sold the data through a backdoor',
      'An external hacker compromised the junior dev\'s credentials',
    ],
    correctHypothesis: 1,
    conclusions: [
      'The junior dev queried all customer records at 3:47 AM, copied them to an unregistered USB at 3:52 AM, and transferred the data to an external server at 3:55 AM — only their prints were on the keyboard',
      'The DBA left access controls too loose, enabling anyone to access the data',
      'An external hacker used the junior dev\'s stolen credentials remotely',
      'The security analyst orchestrated the breach through the junior dev',
    ],
    correctConclusion: 0,
  },
  {
    id: 'm7',
    title: 'The Lab Explosion',
    category: 'contamination',
    scenario: 'A small explosion occurred in Chemistry Lab 3 during off-hours. No injuries, but equipment was damaged. An experiment was left running overnight by one of three research assistants.',
    evidenceList: [
      { id: 'e1', name: 'Residue Analysis', type: 'substance', description: 'Chemical residue at the blast site', testResult: 'Hydrogen peroxide decomposition products — catalyzed reaction that produced oxygen rapidly, building pressure in a sealed vessel', isRelevant: true },
      { id: 'e2', name: 'Lab Notebook Entries', type: 'data', description: 'Experiment logs from all three assistants', testResult: 'Assistant A: organic synthesis (no peroxide). Assistant B: catalysis experiment using manganese dioxide with hydrogen peroxide — noted "left to run overnight in sealed flask". Assistant C: spectroscopy (no chemicals left out).', isRelevant: true },
      { id: 'e3', name: 'Glove Residue', type: 'fingerprint', description: 'Residue on discarded gloves near the blast', testResult: 'Manganese dioxide particles — matches Assistant B\'s experiment', isRelevant: true },
      { id: 'e4', name: 'Temperature Log', type: 'data', description: 'Lab thermostat and sensor data', testResult: 'Temperature rose 15°C over 6 hours before the explosion — the exothermic reaction heated the sealed system', isRelevant: true },
      { id: 'e5', name: 'Floor Scuff Marks', type: 'fingerprint', description: 'Shoe marks near the exit', testResult: 'Multiple overlapping marks from regular lab traffic — inconclusive', isRelevant: false },
    ],
    hypotheses: [
      'Assistant A\'s organic synthesis created flammable vapors',
      'Assistant B left a catalyzed peroxide decomposition in a sealed flask, causing pressure buildup',
      'Assistant C\'s spectroscopy laser overheated equipment',
      'A gas line leak caused the explosion',
    ],
    correctHypothesis: 1,
    conclusions: [
      'Assistant B\'s experiment — adding manganese dioxide catalyst to hydrogen peroxide in a sealed flask — generated oxygen gas continuously overnight, building pressure until the flask exploded',
      'Old equipment failure caused a random explosion',
      'Improper ventilation led to gas accumulation from multiple experiments',
      'Assistant A\'s organic solvents evaporated and ignited',
    ],
    correctConclusion: 0,
  },
  {
    id: 'm8',
    title: 'The Missing Drone',
    category: 'missing',
    scenario: 'A research drone worth $50,000 disappeared from the field station. It was last seen on the charging pad at 6 PM. Three researchers were present: a wildlife biologist, a meteorologist, and a cartographer.',
    evidenceList: [
      { id: 'e1', name: 'Charging Pad Data', type: 'data', description: 'Drone charging and disconnection logs', testResult: 'Drone disconnected at 8:47 PM — manual disconnection, not scheduled. Battery was at 100%.', isRelevant: true },
      { id: 'e2', name: 'GPS Telemetry', type: 'data', description: 'Last GPS data transmitted by the drone', testResult: 'Drone flew 12 km north to the wildlife monitoring zone at 8:50 PM. Last signal at 9:15 PM near a cliff face. Altitude dropped rapidly.', isRelevant: true },
      { id: 'e3', name: 'Station Camera', type: 'fingerprint', description: 'Security camera footage at the charging station', testResult: 'Wildlife biologist seen accessing the charging station at 8:45 PM with a laptop', isRelevant: true },
      { id: 'e4', name: 'Laptop Browser History', type: 'data', description: 'Browsing history on the biologist\'s laptop', testResult: 'Drone control software launched at 8:46 PM. Flight plan set to wildlife zone. No recovery plan programmed.', isRelevant: true },
      { id: 'e5', name: 'Weather Station Residue', type: 'substance', description: 'Unusual readings from weather instruments', testResult: 'High winds recorded — 45 km/h gusts from the north starting at 9 PM. Standard conditions before that.', isRelevant: false },
    ],
    hypotheses: [
      'The meteorologist accidentally launched it while testing instruments',
      'The wildlife biologist launched an unauthorized night flight to the monitoring zone and the drone crashed',
      'The cartographer took the drone for mapping and lost it',
      'Strong winds blew the drone off the charging pad',
    ],
    correctHypothesis: 1,
    conclusions: [
      'The wildlife biologist launched the drone at 8:47 PM for an unauthorized night survey of the wildlife zone. Without a recovery plan programmed, the drone flew to the cliff area and crashed — the rapid altitude drop confirms impact.',
      'High winds caused the drone to malfunction during a scheduled flight',
      'The cartographer and biologist collaborated on an unauthorized mission',
      'The drone\'s autopilot malfunctioned due to a software bug',
    ],
    correctConclusion: 0,
  },
  {
    id: 'm9',
    title: 'The Cafeteria Illness',
    category: 'contamination',
    scenario: 'Twelve students fell ill after lunch on Tuesday. All ate the pasta special. The cafeteria chef, sous chef, and a delivery driver are under investigation.',
    evidenceList: [
      { id: 'e1', name: 'Pasta Sauce Sample', type: 'substance', description: 'Leftover pasta sauce from the batch', testResult: 'Contains Bacillus cereus bacteria — toxin produced when cooked rice or pasta is left at room temperature too long', isRelevant: true },
      { id: 'e2', name: 'Temperature Log', type: 'data', description: 'Walk-in cooler temperature readings', testResult: 'Cooler maintained at 4°C all week — within safe range. However, the pasta was prepared Monday evening and left on the counter until Tuesday morning.', isRelevant: true },
      { id: 'e3', name: 'Chef Kitchen Surfaces', type: 'fingerprint', description: 'Surface culture swabs from prep areas', testResult: 'Sous chef\'s prep station: trace B. cereus on the counter where pasta was left overnight', isRelevant: true },
      { id: 'e4', name: 'Delivery Invoice', type: 'data', description: 'Ingredient delivery records', testResult: 'All ingredients delivered fresh on Monday, properly refrigerated upon arrival. No anomalies in supply chain.', isRelevant: false },
      { id: 'e5', name: 'Hand Swab Results', type: 'fingerprint', description: 'Hand culture tests for all staff', testResult: 'All staff: normal hand flora. The contamination was environmental, not from personal hygiene.', isRelevant: false },
    ],
    hypotheses: [
      'The delivery driver brought contaminated ingredients',
      'The sous chef left the cooked pasta at room temperature overnight, enabling bacterial toxin production',
      'The chef used expired sauce from the back of the fridge',
      'A student contaminated the serving line',
    ],
    correctHypothesis: 1,
    conclusions: [
      'The sous chef prepared pasta Monday evening and left it on the counter overnight instead of refrigerating it. B. cereus multiplied and produced heat-stable toxins that weren\'t destroyed when the pasta was reheated Tuesday.',
      'The delivery company\'s cold chain was broken during transport',
      'The chef knowingly served old food to save costs',
      'Cross-contamination from raw meat in the kitchen caused the illness',
    ],
    correctConclusion: 0,
  },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'medium':
      return { mysteryCount: 3, pointsPerTest: 8, pointsHypothesis: 30, pointsConclusion: 30, showRelevance: true }
    case 'hard':
      return { mysteryCount: 3, pointsPerTest: 10, pointsHypothesis: 35, pointsConclusion: 35, showRelevance: false }
    case 'extreme':
      return { mysteryCount: 3, pointsPerTest: 12, pointsHypothesis: 40, pointsConclusion: 40, showRelevance: false }
    default:
      return { mysteryCount: 3, pointsPerTest: 8, pointsHypothesis: 30, pointsConclusion: 30, showRelevance: true }
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

export default function MysteryLab({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: MysteryLabProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const mysteries = useMemo(() => shuffle(ALL_MYSTERIES).slice(0, config.mysteryCount), [config.mysteryCount])

  const [mysteryIndex, setMysteryIndex] = useState(0)
  const [testedEvidence, setTestedEvidence] = useState<Set<string>>(new Set())
  const [selectedHypothesis, setSelectedHypothesis] = useState<number | null>(null)
  const [selectedConclusion, setSelectedConclusion] = useState<number | null>(null)
  const [mysteryScores, setMysteryScores] = useState<{ tests: number; hypothesis: number; conclusion: number; total: number }[]>([])
  const [phase, setPhase] = useState<Phase>('observe')
  const [gameFinished, setGameFinished] = useState(false)

  const currentMystery = mysteries[mysteryIndex]

  const maxScore = useMemo(() => {
    let total = 0
    for (const m of mysteries) {
      const relevantTests = m.evidenceList.filter((e) => e.isRelevant).length
      total += relevantTests * config.pointsPerTest + config.pointsHypothesis + config.pointsConclusion
    }
    return total
  }, [mysteries, config])

  const handleTestEvidence = useCallback((evidenceId: string) => {
    if (isPaused || phase !== 'test') return
    setTestedEvidence((prev) => new Set(prev).add(evidenceId))
  }, [isPaused, phase])

  const handleProceedToHypothesis = useCallback(() => setPhase('hypothesize'), [])
  const handleProceedToTest = useCallback(() => setPhase('test'), [])
  const handleProceedToConclude = useCallback(() => setPhase('conclude'), [])

  const handleSubmit = useCallback(() => {
    if (selectedHypothesis === null || selectedConclusion === null) return

    const relevantTested = currentMystery.evidenceList.filter((e) => e.isRelevant && testedEvidence.has(e.id)).length
    const testScore = relevantTested * config.pointsPerTest
    const hypScore = selectedHypothesis === currentMystery.correctHypothesis ? config.pointsHypothesis : 0
    const conScore = selectedConclusion === currentMystery.correctConclusion ? config.pointsConclusion : 0
    const total = testScore + hypScore + conScore

    const newScores = [...mysteryScores, { tests: testScore, hypothesis: hypScore, conclusion: conScore, total }]
    setMysteryScores(newScores)
    setPhase('result')

    const totalSoFar = newScores.reduce((a, b) => a + b.total, 0)
    onScoreUpdate(totalSoFar, maxScore)
  }, [selectedHypothesis, selectedConclusion, currentMystery, testedEvidence, config, mysteryScores, maxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (mysteryIndex + 1 >= mysteries.length) {
      setGameFinished(true)
      const finalScore = mysteryScores.reduce((a, b) => a + b.total, 0)
      onGameOver(finalScore, maxScore)
    } else {
      setMysteryIndex((i) => i + 1)
      setTestedEvidence(new Set())
      setSelectedHypothesis(null)
      setSelectedConclusion(null)
      setPhase('observe')
    }
  }, [mysteryIndex, mysteries.length, mysteryScores, maxScore, onGameOver])

  if (!currentMystery && !gameFinished) return null

  const phaseSteps: { key: Phase; label: string }[] = [
    { key: 'observe', label: 'Observe' },
    { key: 'hypothesize', label: 'Hypothesize' },
    { key: 'test', label: 'Test' },
    { key: 'conclude', label: 'Conclude' },
  ]

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-5">
      {/* Mystery progress */}
      <div className="flex items-center gap-2">
        {mysteries.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < mysteryIndex && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === mysteryIndex && !gameFinished && 'border-purple-500/50 bg-purple-500/15 text-purple-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
              i > mysteryIndex && 'border-white/10 bg-white/5 text-white/20',
            )}
          >
            {i < mysteryScores.length ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
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
          <p className="text-xl font-bold text-white">Investigation Complete!</p>
          <p className="text-sm text-white/60">
            Total Score: {mysteryScores.reduce((a, b) => a + b.total, 0)} / {maxScore}
          </p>
          {mysteryScores.map((s, i) => (
            <div key={i} className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-xs text-white/60">Case {i + 1}: {mysteries[i]?.title}</span>
              <div className="flex gap-3 text-xs">
                <span className="text-cyan-300">Tests: {s.tests}</span>
                <span className="text-purple-300">Hyp: {s.hypothesis > 0 ? <Check className="inline h-3 w-3" /> : <X className="inline h-3 w-3" />}</span>
                <span className="text-pink-300">Con: {s.conclusion > 0 ? <Check className="inline h-3 w-3" /> : <X className="inline h-3 w-3" />}</span>
                <span className="font-bold text-amber-400">{s.total} pts</span>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMystery.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full flex-col gap-4"
          >
            {/* Scientific method steps */}
            <div className="flex items-center gap-1">
              {phaseSteps.map((s, i) => {
                const current = phaseSteps.findIndex((ps) => ps.key === phase)
                const isActive = i === current
                const isDone = i < current || phase === 'result'
                return (
                  <div key={s.key} className="flex items-center gap-1">
                    {i > 0 && <ArrowRight className="h-3 w-3 text-white/20" />}
                    <div className={cn(
                      'rounded-full px-3 py-1 text-[10px] font-bold transition-all',
                      isActive && 'bg-purple-500/20 text-purple-300',
                      isDone && 'bg-emerald-500/15 text-emerald-400',
                      !isActive && !isDone && 'bg-white/5 text-white/30',
                    )}>
                      {s.label}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Scenario */}
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-purple-300">
                <Search className="h-4 w-4" />
                Case {mysteryIndex + 1}: {currentMystery.title}
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/50">{currentMystery.category}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{currentMystery.scenario}</p>
            </div>

            {/* Phase: Observe */}
            {phase === 'observe' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  <Eye className="mr-1 inline h-3 w-3" /> Review the evidence available
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {currentMystery.evidenceList.map((ev) => (
                    <div key={ev.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-2">
                        {(() => { const Icon = EVIDENCE_ICONS[ev.type].icon; return <Icon className={cn('h-4 w-4', EVIDENCE_ICONS[ev.type].color)} /> })()}
                        <span className="text-xs font-bold text-white/80">{ev.name}</span>
                      </div>
                      <p className="mt-1 text-[10px] text-white/40">{ev.description}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleProceedToHypothesis}
                  className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:bg-purple-500"
                >
                  <Lightbulb className="h-4 w-4" />
                  Form Hypothesis
                </button>
              </div>
            )}

            {/* Phase: Hypothesize */}
            {phase === 'hypothesize' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  <Lightbulb className="mr-1 inline h-3 w-3" /> Select your initial hypothesis
                </p>
                <div className="flex flex-col gap-2">
                  {currentMystery.hypotheses.map((hyp, i) => (
                    <button
                      key={i}
                      onClick={() => !isPaused && setSelectedHypothesis(i)}
                      className={cn(
                        'rounded-xl border px-4 py-3 text-left text-xs transition-all',
                        selectedHypothesis === i
                          ? 'border-purple-500/40 bg-purple-500/15 text-purple-200'
                          : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20',
                      )}
                    >
                      {hyp}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleProceedToTest}
                  disabled={selectedHypothesis === null}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all',
                    selectedHypothesis !== null
                      ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:bg-purple-500'
                      : 'bg-white/5 text-white/30 cursor-not-allowed',
                  )}
                >
                  <FlaskConical className="h-4 w-4" />
                  Run Tests
                </button>
              </div>
            )}

            {/* Phase: Test */}
            {phase === 'test' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  <FlaskConical className="mr-1 inline h-3 w-3" /> Click evidence to run tests ({testedEvidence.size}/{currentMystery.evidenceList.length})
                </p>
                <div className="flex flex-col gap-2">
                  {currentMystery.evidenceList.map((ev) => {
                    const tested = testedEvidence.has(ev.id)
                    return (
                      <div key={ev.id} className="flex flex-col gap-1">
                        <button
                          onClick={() => handleTestEvidence(ev.id)}
                          className={cn(
                            'rounded-xl border px-4 py-3 text-left transition-all',
                            tested
                              ? 'border-emerald-500/30 bg-emerald-500/10'
                              : 'border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-purple-500/5',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {(() => { const Icon = EVIDENCE_ICONS[ev.type].icon; return <Icon className={cn('h-4 w-4', EVIDENCE_ICONS[ev.type].color)} /> })()}
                            <span className="text-xs font-bold text-white/80">{ev.name}</span>
                            {tested && <CheckCircle2 className="ml-auto h-3 w-3 text-emerald-400" />}
                            {config.showRelevance && ev.isRelevant && <span className="ml-auto text-[9px] text-amber-400">Key evidence</span>}
                          </div>
                        </button>
                        {tested && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="ml-4 rounded-lg border border-white/5 bg-white/3 px-3 py-2"
                          >
                            <p className="text-[10px] text-cyan-300">{ev.testResult}</p>
                          </motion.div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <button
                  onClick={handleProceedToConclude}
                  className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:bg-purple-500"
                >
                  <BarChart3 className="h-4 w-4" />
                  Draw Conclusion
                </button>
              </div>
            )}

            {/* Phase: Conclude */}
            {phase === 'conclude' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  <FileQuestion className="mr-1 inline h-3 w-3" /> Select your conclusion
                </p>
                <div className="flex flex-col gap-2">
                  {currentMystery.conclusions.map((con, i) => (
                    <button
                      key={i}
                      onClick={() => !isPaused && setSelectedConclusion(i)}
                      className={cn(
                        'rounded-xl border px-4 py-3 text-left text-xs transition-all',
                        selectedConclusion === i
                          ? 'border-purple-500/40 bg-purple-500/15 text-purple-200'
                          : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20',
                      )}
                    >
                      {con}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={selectedConclusion === null}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all',
                    selectedConclusion !== null
                      ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:bg-purple-500'
                      : 'bg-white/5 text-white/30 cursor-not-allowed',
                  )}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Submit Investigation
                </button>
              </div>
            )}

            {/* Phase: Result */}
            {phase === 'result' && mysteryScores.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-300">Case Closed!</span>
                  <span className="text-lg font-bold text-amber-400">{mysteryScores[mysteryScores.length - 1].total} pts</span>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Relevant evidence tested</span>
                    <span className="text-cyan-300">{mysteryScores[mysteryScores.length - 1].tests} pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Hypothesis</span>
                    <span className={cn(mysteryScores[mysteryScores.length - 1].hypothesis > 0 ? 'text-emerald-400' : 'text-red-400')}>
                      {mysteryScores[mysteryScores.length - 1].hypothesis > 0 ? <><Check className="mr-0.5 inline h-3 w-3" />Correct</> : <><X className="mr-0.5 inline h-3 w-3" />Wrong</>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Conclusion</span>
                    <span className={cn(mysteryScores[mysteryScores.length - 1].conclusion > 0 ? 'text-emerald-400' : 'text-red-400')}>
                      {mysteryScores[mysteryScores.length - 1].conclusion > 0 ? <><Check className="mr-0.5 inline h-3 w-3" />Correct</> : <><X className="mr-0.5 inline h-3 w-3" />Wrong</>}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:bg-purple-500"
                >
                  {mysteryIndex + 1 >= mysteries.length ? 'Finish' : 'Next Case'}
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


