'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Notebook,
  ArrowRight,
  CheckCircle2,
  Star,
  Search,
  Leaf,
  Eye,
  PawPrint,
  Landmark,
  Zap,
  TreePalm,
  Waves,
  Snowflake,
  Mountain,
  TreeDeciduous,
  Sun as SunIcon,
  Fish,
  Pin,
  Flame,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

type Category = 'fauna' | 'flora' | 'artifact' | 'phenomenon'

interface Discovery {
  id: string
  name: string
  description: string
  clue: string
  category: Category
  hidden: boolean // requires clue reading on medium+
  multiStep: boolean // requires deduction on hard
  deductionHint?: string
}

interface Environment {
  id: string
  name: string
  icon: LucideIcon
  sceneDescription: string
  detailedObservation: string
  discoveries: Discovery[]
}

interface FieldJournalProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const CATEGORY_INFO: Record<Category, { label: string; icon: LucideIcon; color: string }> = {
  fauna: { label: 'Fauna', icon: PawPrint, color: 'text-amber-400' },
  flora: { label: 'Flora', icon: Leaf, color: 'text-emerald-400' },
  artifact: { label: 'Artifact', icon: Landmark, color: 'text-purple-400' },
  phenomenon: { label: 'Phenomenon', icon: Zap, color: 'text-cyan-400' },
}

const ALL_ENVIRONMENTS: Environment[] = [
  {
    id: 'e1',
    name: 'Tropical Rainforest',
    icon: TreePalm,
    sceneDescription: 'A dense canopy blocks most sunlight. The air is thick and humid. Vines cascade from towering trees, and the chorus of insects fills the air.',
    detailedObservation: 'Looking closer, iridescent beetles crawl along a fallen log. Strange bracket fungi glow faintly in the shade. A carved stone is half-buried in the soil near the roots. Lightning occasionally illuminates bioluminescent spores drifting through the canopy.',
    discoveries: [
      { id: 'd1', name: 'Iridescent Beetle', description: 'A large beetle with a metallic blue-green shell', clue: 'Found crawling along a fallen log', category: 'fauna', hidden: false, multiStep: false },
      { id: 'd2', name: 'Bracket Fungi', description: 'Shelf-like fungi emitting a faint green glow', clue: 'Grows in the shade of fallen trees', category: 'flora', hidden: false, multiStep: false },
      { id: 'd3', name: 'Carved Stone Tablet', description: 'Ancient markings suggest a lost civilization', clue: 'Half-buried near tree roots', category: 'artifact', hidden: true, multiStep: false },
      { id: 'd4', name: 'Bioluminescent Spores', description: 'Tiny glowing particles floating through the canopy', clue: 'Only visible during lightning flashes', category: 'phenomenon', hidden: true, multiStep: false },
      { id: 'd5', name: 'Poison Dart Frog', description: 'A tiny bright-red frog on a leaf', clue: 'Its bright color is a warning signal — search the low leaves', category: 'fauna', hidden: false, multiStep: false },
      { id: 'd6', name: 'Orchid Mantis', description: 'An insect perfectly camouflaged as a white orchid', clue: 'The "flower" moves when wind doesn\'t blow — combine the beetle observation with the fungi area', category: 'fauna', hidden: true, multiStep: true, deductionHint: 'Revisit the log area — something that looks like a flower is actually alive' },
    ],
  },
  {
    id: 'e2',
    name: 'Deep Ocean Trench',
    icon: Waves,
    sceneDescription: 'Darkness surrounds the submersible. Pressure readings climb. Occasional flashes of light pierce the abyss from unknown sources.',
    detailedObservation: 'The spotlight reveals tube worms clustered around a hydrothermal vent. An anglerfish drifts past with its bio-lantern. Strange mineral formations jut from the seafloor. Periodic pressure waves suggest tectonic movement below.',
    discoveries: [
      { id: 'd1', name: 'Giant Tube Worms', description: 'Red-tipped worms thriving near volcanic vents', clue: 'Clustered around hydrothermal vents', category: 'fauna', hidden: false, multiStep: false },
      { id: 'd2', name: 'Anglerfish', description: 'A deep-sea predator with a bioluminescent lure', clue: 'A light that moves independently in the dark', category: 'fauna', hidden: false, multiStep: false },
      { id: 'd3', name: 'Black Smoker Chimney', description: 'Mineral-rich superheated water plume', clue: 'Dark cloud rising from the seafloor', category: 'phenomenon', hidden: false, multiStep: false },
      { id: 'd4', name: 'Manganese Nodule', description: 'Rare mineral formation on the ocean floor', clue: 'Look at the strange mineral formations carefully', category: 'artifact', hidden: true, multiStep: false },
      { id: 'd5', name: 'Chemosynthetic Bacteria Mat', description: 'White bacterial colonies converting chemicals to energy', clue: 'A white carpet near the vents — life without sunlight', category: 'flora', hidden: true, multiStep: false },
      { id: 'd6', name: 'Tectonic Micro-Quake', description: 'Subtle seismic activity detected by instruments', clue: 'Cross-reference the pressure waves with the vent activity — combined readings reveal the pattern', category: 'phenomenon', hidden: true, multiStep: true, deductionHint: 'The tube worms retract periodically — correlate this with the pressure readings' },
      { id: 'd7', name: 'Ghost Octopus', description: 'A translucent octopus barely visible against the vent glow', clue: 'Something moved between the tube worms and the bacterial mat', category: 'fauna', hidden: true, multiStep: true, deductionHint: 'Observe the area between the worms and bacteria — a shadow that shouldn\'t be there' },
    ],
  },
  {
    id: 'e3',
    name: 'Ancient Ruins City',
    icon: Landmark,
    sceneDescription: 'Crumbling stone columns line a wide avenue. Moss covers intricate carvings. The wind carries dust through empty doorways.',
    detailedObservation: 'A sundial still casts accurate shadows. Tiny lizards bask on warm stones. Hardy fig trees have split ancient walls. Faded murals depict astronomical events. An echo from the central chamber suggests hidden passages.',
    discoveries: [
      { id: 'd1', name: 'Sun Lizard', description: 'A small reptile with golden scales', clue: 'Basking on the warm stones of the avenue', category: 'fauna', hidden: false, multiStep: false },
      { id: 'd2', name: 'Strangler Fig', description: 'A tree whose roots have grown through ancient walls', clue: 'The living force breaking apart the structure', category: 'flora', hidden: false, multiStep: false },
      { id: 'd3', name: 'Working Sundial', description: 'An ancient time-keeping device still functioning', clue: 'The shadow falls on markings that match modern hours', category: 'artifact', hidden: false, multiStep: false },
      { id: 'd4', name: 'Astronomical Mural', description: 'Faded paintings showing eclipse patterns', clue: 'The murals depict events that happen in cycles', category: 'artifact', hidden: true, multiStep: false },
      { id: 'd5', name: 'Resonance Chamber', description: 'A room that amplifies sound into the tunnels', clue: 'The echo suggests the architecture was designed to amplify', category: 'phenomenon', hidden: true, multiStep: false },
      { id: 'd6', name: 'Hidden Water Channel', description: 'An underground aqueduct still carrying water', clue: 'Connect the fig tree roots, the echo, and the damp stones — water flows hidden beneath', category: 'phenomenon', hidden: true, multiStep: true, deductionHint: 'The fig tree\'s roots follow the water — trace them to find the channel' },
    ],
  },
  {
    id: 'e4',
    name: 'Arctic Tundra',
    icon: Snowflake,
    sceneDescription: 'A vast expanse of white stretches to the horizon. Wind-sculpted snowdrifts form strange patterns. The air is biting cold and crystal clear.',
    detailedObservation: 'Arctic fox tracks lead to a burrow. Lichen patches color the exposed rocks. A rusted weather station pokes from the snow. The northern lights shimmer on the horizon. Frost crystals form perfect hexagonal patterns on equipment.',
    discoveries: [
      { id: 'd1', name: 'Arctic Fox', description: 'White-furred predator blending into the snow', clue: 'Follow the tracks to the burrow', category: 'fauna', hidden: false, multiStep: false },
      { id: 'd2', name: 'Crustose Lichen', description: 'Colorful patches surviving on bare rock', clue: 'The only color on the exposed stones', category: 'flora', hidden: false, multiStep: false },
      { id: 'd3', name: 'Abandoned Weather Station', description: 'Soviet-era meteorological equipment', clue: 'Metal poking through snowdrift', category: 'artifact', hidden: false, multiStep: false },
      { id: 'd4', name: 'Aurora Borealis', description: 'Dancing lights caused by solar wind', clue: 'Green and purple curtains of light on the northern horizon', category: 'phenomenon', hidden: false, multiStep: false },
      { id: 'd5', name: 'Frost Hexagons', description: 'Perfect geometric ice crystals', clue: 'Examine the metal surfaces — the crystals have mathematical precision', category: 'phenomenon', hidden: true, multiStep: false },
      { id: 'd6', name: 'Permafrost Mammoth Tusk', description: 'Ancient ivory exposed by thawing permafrost', clue: 'The fox burrow leads deeper — combine the erosion pattern with the station data', category: 'artifact', hidden: true, multiStep: true, deductionHint: 'The weather station recorded warming — the burrow exposed something ancient' },
    ],
  },
  {
    id: 'e5',
    name: 'Volcanic Island',
    icon: Flame,
    sceneDescription: 'Black volcanic rock meets turquoise water. Steam rises from cracks in the ground. The island is young and raw.',
    detailedObservation: 'Red crabs navigate the tide pools. Pioneer plants push through cracks in the lava. Obsidian shards glint in the sun. Geysers erupt on a regular cycle. The sulfur smell is intense near the fumaroles.',
    discoveries: [
      { id: 'd1', name: 'Sally Lightfoot Crab', description: 'Bright red crabs on black volcanic rock', clue: 'Vivid red against the dark tide pools', category: 'fauna', hidden: false, multiStep: false },
      { id: 'd2', name: 'Pioneer Fern', description: 'First plants colonizing new lava flows', clue: 'Green shoots in the cracks of cooling lava', category: 'flora', hidden: false, multiStep: false },
      { id: 'd3', name: 'Obsidian Formation', description: 'Volcanic glass with razor-sharp edges', clue: 'Glinting black shards among the rock', category: 'artifact', hidden: false, multiStep: false },
      { id: 'd4', name: 'Geyser Cycle', description: 'Predictable eruption of superheated water', clue: 'The eruptions follow a timed pattern', category: 'phenomenon', hidden: false, multiStep: false },
      { id: 'd5', name: 'Sulfur Crystal Cluster', description: 'Yellow mineral deposits near fumaroles', clue: 'Near the intense smell — crystalline yellow formations', category: 'flora', hidden: true, multiStep: false },
      { id: 'd6', name: 'Lava Tube System', description: 'Underground tunnels formed by flowing lava', clue: 'The geyser timing plus the crab migration pattern reveals an underground network', category: 'phenomenon', hidden: true, multiStep: true, deductionHint: 'Crabs disappear during geyser eruptions — they use tunnels to escape' },
    ],
  },
  {
    id: 'e6',
    name: 'Bamboo Forest',
    icon: TreeDeciduous,
    sceneDescription: 'Towering bamboo stalks creak in the wind. Dappled light creates shifting patterns on the forest floor. A stream murmurs nearby.',
    detailedObservation: 'Panda scratching marks score the bamboo at regular heights. Delicate mushrooms cluster at stalk bases. An old stone lantern hides in the undergrowth. The wind creates a harmonic humming through the hollow stalks.',
    discoveries: [
      { id: 'd1', name: 'Panda Claw Marks', description: 'Scratching evidence of giant panda territory', clue: 'Regular vertical marks on bamboo stalks', category: 'fauna', hidden: false, multiStep: false },
      { id: 'd2', name: 'Enoki Mushroom Cluster', description: 'Thin white mushrooms at bamboo bases', clue: 'Delicate clusters in the damp shade', category: 'flora', hidden: false, multiStep: false },
      { id: 'd3', name: 'Stone Lantern', description: 'An ancient Japanese tōrō hidden by growth', clue: 'Carved stone barely visible in the undergrowth', category: 'artifact', hidden: true, multiStep: false },
      { id: 'd4', name: 'Bamboo Wind Harmonics', description: 'Natural music from wind through hollow stalks', clue: 'The humming changes pitch with wind direction', category: 'phenomenon', hidden: false, multiStep: false },
      { id: 'd5', name: 'Golden Bamboo Viper', description: 'A yellow-green snake camouflaged in the canopy', clue: 'A stalk that seems too thick — look closer at the joints', category: 'fauna', hidden: true, multiStep: true, deductionHint: 'Compare the panda marks — one stalk has none because something else lives there' },
    ],
  },
  {
    id: 'e7',
    name: 'Desert Oasis',
    icon: SunIcon,
    sceneDescription: 'Sand dunes surround a patch of green. Palm trees shade a natural spring. The heat shimmers on the horizon.',
    detailedObservation: 'A fennec fox peers from behind a rock. Date palms hang heavy with fruit. Pottery shards litter the spring edge. Mirages dance in the distance, but one reflection seems too consistent.',
    discoveries: [
      { id: 'd1', name: 'Fennec Fox', description: 'Large-eared desert fox adapted to heat', clue: 'Enormous ears peek from behind a rock', category: 'fauna', hidden: false, multiStep: false },
      { id: 'd2', name: 'Date Palm', description: 'Fruit-bearing palm providing shade and food', clue: 'Heavy clusters of golden fruit', category: 'flora', hidden: false, multiStep: false },
      { id: 'd3', name: 'Ancient Pottery Shards', description: 'Fragments of trade-route vessels', clue: 'Broken pieces with painted patterns near the spring', category: 'artifact', hidden: false, multiStep: false },
      { id: 'd4', name: 'Persistent Mirage', description: 'An optical illusion that appears in the same spot', clue: 'One shimmer on the horizon never moves — possible second water source', category: 'phenomenon', hidden: true, multiStep: false },
      { id: 'd5', name: 'Underground Spring Map', description: 'The pottery shards form a map when assembled', clue: 'Arrange the pottery designs — the mirage location matches a symbol', category: 'artifact', hidden: true, multiStep: true, deductionHint: 'The consistent mirage and the pottery patterns both point to the same place' },
    ],
  },
  {
    id: 'e8',
    name: 'Coral Reef Shallows',
    icon: Fish,
    sceneDescription: 'Crystal clear water reveals a kaleidoscope of coral formations. Fish dart between branching structures. Sunlight ripples across the sandy seabed.',
    detailedObservation: 'A clownfish guards its anemone home. Brain coral forms massive dome structures. Half-buried anchor chain creates an artificial reef. The tide patterns reveal exposed sections that glow under UV light.',
    discoveries: [
      { id: 'd1', name: 'Clownfish Colony', description: 'Orange fish living symbiotically with anemones', clue: 'Small orange fish darting in and out of waving tentacles', category: 'fauna', hidden: false, multiStep: false },
      { id: 'd2', name: 'Brain Coral Dome', description: 'Massive coral formation resembling a brain', clue: 'The largest structure with maze-like grooves', category: 'flora', hidden: false, multiStep: false },
      { id: 'd3', name: 'Shipwreck Anchor', description: 'Historical anchor now hosting marine life', clue: 'Metal chain disappearing into the sand', category: 'artifact', hidden: false, multiStep: false },
      { id: 'd4', name: 'Fluorescent Coral', description: 'Coral that glows under ultraviolet light', clue: 'At low tide, exposed sections seem to change color', category: 'phenomenon', hidden: true, multiStep: false },
      { id: 'd5', name: 'Mantis Shrimp Tunnel', description: 'A powerful crustacean\'s burrow network', clue: 'Clicking sounds from the sand near the anchor — connect the shrimp activity to the sand patterns', category: 'fauna', hidden: true, multiStep: true, deductionHint: 'The sand near the anchor has circular patterns — something powerful lives below' },
    ],
  },
  {
    id: 'e9',
    name: 'Mountain Cloud Forest',
    icon: Mountain,
    sceneDescription: 'Mist clings to everything. Moss-draped trees emerge like ghosts from the fog. The altitude makes breathing deliberate.',
    detailedObservation: 'A quetzal perches on a branch with its long tail trailing. Epiphytic orchids cling to every surface. A Mayan jade figure lies in a stream bed. Cloud condensation on leaves creates a constant drip — a micro water cycle in action.',
    discoveries: [
      { id: 'd1', name: 'Resplendent Quetzal', description: 'Emerald bird with spectacular tail feathers', clue: 'A flash of green with impossibly long tail feathers', category: 'fauna', hidden: false, multiStep: false },
      { id: 'd2', name: 'Ghost Orchid', description: 'Rare white orchid growing on tree bark', clue: 'Ethereal white flower clinging to a moss-covered trunk', category: 'flora', hidden: false, multiStep: false },
      { id: 'd3', name: 'Jade Figurine', description: 'Pre-Columbian carved jade artifact', clue: 'Something green and geometric in the stream bed', category: 'artifact', hidden: true, multiStep: false },
      { id: 'd4', name: 'Cloud Drip Cycle', description: 'Microclimate water harvesting by leaves', clue: 'The constant dripping isn\'t rain — it\'s the forest making its own water', category: 'phenomenon', hidden: false, multiStep: false },
      { id: 'd5', name: 'Mycorrhizal Network', description: 'Underground fungal internet connecting trees', clue: 'The orchids, the moss, and the trees share nutrients — follow the fungal threads between roots', category: 'phenomenon', hidden: true, multiStep: true, deductionHint: 'When you disturb one plant, nearby ones react — they\'re connected underground' },
    ],
  },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { envCount: 3, showHidden: false, showMultiStep: false, pointsPerFind: 10, pointsPerCategory: 5 }
    case 'medium':
      return { envCount: 3, showHidden: true, showMultiStep: false, pointsPerFind: 12, pointsPerCategory: 8 }
    case 'hard':
    case 'extreme':
      return { envCount: 3, showHidden: true, showMultiStep: true, pointsPerFind: 15, pointsPerCategory: 10 }
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

export default function FieldJournal({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: FieldJournalProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const environments = useMemo(() => shuffle(ALL_ENVIRONMENTS).slice(0, config.envCount), [config.envCount])

  const [envIndex, setEnvIndex] = useState(0)
  const [foundDiscoveries, setFoundDiscoveries] = useState<Set<string>>(new Set())
  const [categorizations, setCategorizations] = useState<Record<string, Category>>({})
  const [, setSelectedDiscovery] = useState<string | null>(null)
  const [showDeductionHint, setShowDeductionHint] = useState<string | null>(null)
  const [envScores, setEnvScores] = useState<{ found: number; categorized: number; total: number }[]>([])
  const [phase, setPhase] = useState<'explore' | 'catalog' | 'result'>('explore')
  const [gameFinished, setGameFinished] = useState(false)

  const currentEnv = environments[envIndex]

  const visibleDiscoveries = useMemo(() => {
    if (!currentEnv) return []
    return currentEnv.discoveries.filter((d) => {
      if (!config.showHidden && d.hidden) return false
      if (!config.showMultiStep && d.multiStep) return false
      return true
    })
  }, [currentEnv, config])

  const totalMaxScore = useMemo(() => {
    let total = 0
    for (const env of environments) {
      const visible = env.discoveries.filter((d) => {
        if (!config.showHidden && d.hidden) return false
        if (!config.showMultiStep && d.multiStep) return false
        return true
      })
      total += visible.length * (config.pointsPerFind + config.pointsPerCategory)
    }
    return total
  }, [environments, config])

  const handleDiscover = useCallback((discoveryId: string) => {
    if (isPaused || phase !== 'explore') return
    const key = `${currentEnv.id}-${discoveryId}`
    setFoundDiscoveries((prev) => new Set(prev).add(key))
    setSelectedDiscovery(discoveryId)
  }, [isPaused, phase, currentEnv])

  const handleCategorize = useCallback((discoveryId: string, category: Category) => {
    if (isPaused || phase !== 'catalog') return
    const key = `${currentEnv.id}-${discoveryId}`
    setCategorizations((prev) => ({ ...prev, [key]: category }))
  }, [isPaused, phase, currentEnv])

  const handleFinishExploring = useCallback(() => {
    setPhase('catalog')
    setSelectedDiscovery(null)
  }, [])

  const handleSubmitCatalog = useCallback(() => {
    let foundCount = 0
    let correctCats = 0

    for (const d of visibleDiscoveries) {
      const key = `${currentEnv.id}-${d.id}`
      if (foundDiscoveries.has(key)) {
        foundCount++
        if (categorizations[key] === d.category) correctCats++
      }
    }

    const score = foundCount * config.pointsPerFind + correctCats * config.pointsPerCategory
    const newScores = [...envScores, { found: foundCount, categorized: correctCats, total: score }]
    setEnvScores(newScores)
    setPhase('result')

    const totalSoFar = newScores.reduce((a, b) => a + b.total, 0)
    onScoreUpdate(totalSoFar, totalMaxScore)
  }, [visibleDiscoveries, currentEnv, foundDiscoveries, categorizations, config, envScores, totalMaxScore, onScoreUpdate])

  const handleNext = useCallback(() => {
    if (envIndex + 1 >= environments.length) {
      setGameFinished(true)
      const finalScore = envScores.reduce((a, b) => a + b.total, 0)
      onGameOver(finalScore, totalMaxScore)
    } else {
      setEnvIndex((i) => i + 1)
      setFoundDiscoveries(new Set())
      setCategorizations({})
      setSelectedDiscovery(null)
      setShowDeductionHint(null)
      setPhase('explore')
    }
  }, [envIndex, environments.length, envScores, totalMaxScore, onGameOver])

  if (!currentEnv && !gameFinished) return null

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-5">
      {/* Progress indicators */}
      <div className="flex items-center gap-2">
        {environments.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < envIndex && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === envIndex && !gameFinished && 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]',
              i > envIndex && 'border-white/10 bg-white/5 text-white/20',
              i === envIndex && gameFinished && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
            )}
          >
            {i < envScores.length ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
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
          <p className="text-xl font-bold text-white">Journal Complete!</p>
          <p className="text-sm text-white/60">
            Total Score: {envScores.reduce((a, b) => a + b.total, 0)} / {totalMaxScore}
          </p>
          {envScores.map((s, i) => (
            <div key={i} className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-xs text-white/60">{environments[i]?.icon && (() => { const Icon = environments[i].icon; return <Icon className="h-3 w-3 inline mr-1" />; })()}{environments[i]?.name}</span>
              <div className="flex gap-3 text-xs">
                <span className="text-cyan-300">Found: {s.found}</span>
                <span className="text-emerald-300">Cataloged: {s.categorized}</span>
                <span className="font-bold text-amber-400">{s.total} pts</span>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEnv.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full flex-col gap-4"
          >
            {/* Environment header */}
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                <Notebook className="h-4 w-4" />
                {(() => { const Icon = currentEnv.icon; return <Icon className="h-5 w-5 text-cyan-300" />; })()}
                Environment {envIndex + 1}: {currentEnv.name}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{currentEnv.sceneDescription}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/50">{currentEnv.detailedObservation}</p>
            </div>

            {phase === 'explore' && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  <Search className="mr-1 inline h-3 w-3" />
                  Click on discoveries to add them to your journal ({foundDiscoveries.size} found)
                </p>

                <div className="grid gap-2 sm:grid-cols-2">
                  {visibleDiscoveries.map((d) => {
                    const key = `${currentEnv.id}-${d.id}`
                    const isFound = foundDiscoveries.has(key)
                    return (
                      <button
                        key={d.id}
                        onClick={() => handleDiscover(d.id)}
                        className={cn(
                          'flex flex-col gap-1 rounded-xl border p-3 text-left transition-all',
                          isFound
                            ? 'border-emerald-500/30 bg-emerald-500/10'
                            : 'border-white/10 bg-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5',
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {isFound && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                          <span className="text-xs font-bold text-white/80 flex items-center gap-1">
                            {d.multiStep ? <Search className="h-3 w-3 inline" /> : d.hidden ? <Eye className="h-3 w-3 inline" /> : <Pin className="h-3 w-3 inline" />} {d.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/40">{d.clue}</p>
                        {d.multiStep && !isFound && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowDeductionHint(d.id) }}
                            className="mt-1 text-[10px] text-cyan-400 hover:text-cyan-300"
                          >
                            Need a deduction hint?
                          </button>
                        )}
                        {showDeductionHint === d.id && d.deductionHint && (
                          <p className="mt-1 rounded bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-300">{d.deductionHint}</p>
                        )}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={handleFinishExploring}
                  className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-500"
                >
                  <Eye className="h-4 w-4" />
                  Finish Exploring — Catalog Findings
                </button>
              </>
            )}

            {phase === 'catalog' && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  <Leaf className="mr-1 inline h-3 w-3" />
                  Categorize each discovery
                </p>

                <div className="flex flex-col gap-2">
                  {visibleDiscoveries
                    .filter((d) => foundDiscoveries.has(`${currentEnv.id}-${d.id}`))
                    .map((d) => {
                      const key = `${currentEnv.id}-${d.id}`
                      return (
                        <div key={d.id} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/3 px-3 py-2">
                          <div className="min-w-[120px]">
                            <p className="text-xs font-bold text-white/80">{d.name}</p>
                            <p className="text-[10px] text-white/40">{d.description}</p>
                          </div>
                          <div className="flex gap-1.5">
                            {(Object.keys(CATEGORY_INFO) as Category[]).map((cat) => (
                              <button
                                key={cat}
                                onClick={() => handleCategorize(d.id, cat)}
                                className={cn(
                                  'flex items-center gap-1 rounded-lg border px-2 py-1.5 text-[10px] font-bold transition-all',
                                  categorizations[key] === cat
                                    ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                                    : 'border-white/10 bg-white/5 text-white/40 hover:border-white/20',
                                )}
                              >
                                {(() => { const Icon = CATEGORY_INFO[cat].icon; return <Icon className="h-3 w-3 inline" />; })()} {CATEGORY_INFO[cat].label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                </div>

                <button
                  onClick={handleSubmitCatalog}
                  className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-500"
                >
                  <Notebook className="h-4 w-4" />
                  Submit Catalog
                </button>
              </>
            )}

            {phase === 'result' && envScores.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-300">Environment Cataloged!</span>
                  <span className="text-lg font-bold text-amber-400">{envScores[envScores.length - 1].total} pts</span>
                </div>

                <div className="flex flex-col gap-2">
                  {visibleDiscoveries.map((d) => {
                    const key = `${currentEnv.id}-${d.id}`
                    const wasFound = foundDiscoveries.has(key)
                    const catCorrect = categorizations[key] === d.category
                    return (
                      <div key={d.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">
                        <span className={cn(wasFound ? 'text-emerald-400' : 'text-red-400')}>{wasFound ? '✓' : '✗'}</span>
                        <span className="w-32 font-bold text-white/60">{d.name}</span>
                        {wasFound && (
                          <span className={cn(catCorrect ? 'text-emerald-400' : 'text-red-400')}>
                            {(() => { const Icon = CATEGORY_INFO[categorizations[key] || d.category].icon; return <Icon className="h-3 w-3 inline" />; })()}
                            {!catCorrect && <>{' → '}{(() => { const Icon = CATEGORY_INFO[d.category].icon; return <Icon className="h-3 w-3 inline" />; })()} {CATEGORY_INFO[d.category].label}</>}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={handleNext}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-500"
                >
                  {envIndex + 1 >= environments.length ? 'Finish' : 'Next Environment'}
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
