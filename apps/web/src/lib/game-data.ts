// ─── Game Framework Types & Registry ──────────────────────────

export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'extreme'

export type ArchetypeCode =
  | 'THINKER'
  | 'ENGINEER'
  | 'GUARDIAN'
  | 'STRATEGIST'
  | 'CREATOR'
  | 'SHAPER'
  | 'STORYTELLER'
  | 'PERFORMER'
  | 'HEALER'
  | 'DIPLOMAT'
  | 'EXPLORER'
  | 'MENTOR'
  | 'VISIONARY'

export type ClusterNumber = 1 | 2 | 3

export interface GameDefinition {
  slug: string
  name: string
  archetype: ArchetypeCode
  cluster: ClusterNumber
  description: string
  xpRange: [number, number]
  educationalBenefit: string
  difficulty: GameDifficulty[]
  icon: string
}

export interface ClusterInfo {
  id: ClusterNumber
  name: string
  description: string
  color: 'purple' | 'pink' | 'cyan'
  archetypes: ArchetypeCode[]
}

export const CLUSTERS: ClusterInfo[] = [
  {
    id: 1,
    name: 'Logical-Systemic',
    description: 'Analytical thinking, systems design, and strategic planning',
    color: 'purple',
    archetypes: ['THINKER', 'ENGINEER', 'GUARDIAN', 'STRATEGIST'],
  },
  {
    id: 2,
    name: 'Creative-Expressive',
    description: 'Artistic creation, storytelling, and performance',
    color: 'pink',
    archetypes: ['CREATOR', 'SHAPER', 'STORYTELLER', 'PERFORMER'],
  },
  {
    id: 3,
    name: 'Social-Humanitarian',
    description: 'Empathy, collaboration, exploration, and leadership',
    color: 'cyan',
    archetypes: ['HEALER', 'DIPLOMAT', 'EXPLORER', 'MENTOR', 'VISIONARY'],
  },
]

export const ARCHETYPE_LABELS: Record<ArchetypeCode, string> = {
  THINKER: 'The Thinker',
  ENGINEER: 'The Engineer',
  GUARDIAN: 'The Guardian',
  STRATEGIST: 'The Strategist',
  CREATOR: 'The Creator',
  SHAPER: 'The Shaper',
  STORYTELLER: 'The Storyteller',
  PERFORMER: 'The Performer',
  HEALER: 'The Healer',
  DIPLOMAT: 'The Diplomat',
  EXPLORER: 'The Explorer',
  MENTOR: 'The Mentor',
  VISIONARY: 'The Visionary',
}

// ─── Complete 37 Mini-Game Registry ───────────────────────────

export const GAME_REGISTRY: GameDefinition[] = [
  // ── Cluster 1: Logical-Systemic ─────────────────────────────

  // THINKER games
  {
    slug: 'logic-grid-puzzle',
    name: 'Logic Grid Puzzle',
    archetype: 'THINKER',
    cluster: 1,
    description: 'Solve constraint-based logic puzzles by elimination and deduction. Place elements correctly using only the given clues.',
    xpRange: [50, 200],
    educationalBenefit: 'Develops deductive reasoning and systematic elimination skills',
    difficulty: ['easy', 'medium', 'hard', 'extreme'],
    icon: 'Grid3x3',
  },
  {
    slug: 'theorem-prover',
    name: 'Theorem Prover',
    archetype: 'THINKER',
    cluster: 1,
    description: 'Construct valid mathematical proofs step by step. Drag premises and logical operators to reach the conclusion.',
    xpRange: [75, 250],
    educationalBenefit: 'Strengthens formal logic and mathematical proof construction',
    difficulty: ['medium', 'hard', 'extreme'],
    icon: 'BookCheck',
  },
  {
    slug: 'pattern-decoder',
    name: 'Pattern Decoder',
    archetype: 'THINKER',
    cluster: 1,
    description: 'Identify hidden patterns in sequences of numbers, shapes, or symbols and predict the next element.',
    xpRange: [40, 180],
    educationalBenefit: 'Enhances pattern recognition and abstract reasoning',
    difficulty: ['easy', 'medium', 'hard', 'extreme'],
    icon: 'ScanSearch',
  },

  // ENGINEER games
  {
    slug: 'circuit-builder',
    name: 'Circuit Builder',
    archetype: 'ENGINEER',
    cluster: 1,
    description: 'Design and connect electronic circuits to achieve target outputs. Wire components, resistors, and logic gates.',
    xpRange: [60, 220],
    educationalBenefit: 'Teaches electrical engineering fundamentals and circuit design',
    difficulty: ['easy', 'medium', 'hard', 'extreme'],
    icon: 'CircuitBoard',
  },
  {
    slug: 'bridge-constructor',
    name: 'Bridge Constructor',
    archetype: 'ENGINEER',
    cluster: 1,
    description: 'Build structurally sound bridges using limited materials. Test them under increasing loads.',
    xpRange: [60, 220],
    educationalBenefit: 'Develops structural engineering intuition and material optimization',
    difficulty: ['easy', 'medium', 'hard', 'extreme'],
    icon: 'Construction',
  },
  {
    slug: 'code-machine',
    name: 'Code Machine',
    archetype: 'ENGINEER',
    cluster: 1,
    description: 'Program a virtual machine with drag-and-drop code blocks to solve computational challenges.',
    xpRange: [50, 200],
    educationalBenefit: 'Introduces computational thinking and basic programming logic',
    difficulty: ['easy', 'medium', 'hard', 'extreme'],
    icon: 'Code2',
  },

  // GUARDIAN games
  {
    slug: 'justice-scales',
    name: 'Justice Scales',
    archetype: 'GUARDIAN',
    cluster: 1,
    description: 'Weigh moral dilemmas and legal scenarios, deciding fair outcomes based on rules and ethical principles.',
    xpRange: [50, 180],
    educationalBenefit: 'Develops ethical reasoning and understanding of justice systems',
    difficulty: ['easy', 'medium', 'hard'],
    icon: 'Scale',
  },
  {
    slug: 'rule-architect',
    name: 'Rule Architect',
    archetype: 'GUARDIAN',
    cluster: 1,
    description: 'Design rulesets for simulated communities. Balance fairness, enforcement, and individual rights.',
    xpRange: [60, 200],
    educationalBenefit: 'Strengthens regulatory thinking and policy design skills',
    difficulty: ['medium', 'hard', 'extreme'],
    icon: 'ShieldCheck',
  },

  // STRATEGIST games
  {
    slug: 'war-room',
    name: 'War Room',
    archetype: 'STRATEGIST',
    cluster: 1,
    description: 'Command tactical operations on a virtual battlefield. Manage resources, position units, and outmaneuver the AI.',
    xpRange: [75, 250],
    educationalBenefit: 'Develops strategic thinking, resource management, and foresight',
    difficulty: ['easy', 'medium', 'hard', 'extreme'],
    icon: 'Swords',
  },
  {
    slug: 'startup-simulator',
    name: 'Startup Simulator',
    archetype: 'STRATEGIST',
    cluster: 1,
    description: 'Build a startup from scratch. Make investment, hiring, and pivot decisions under market uncertainty.',
    xpRange: [75, 250],
    educationalBenefit: 'Teaches entrepreneurial decision-making and business strategy',
    difficulty: ['medium', 'hard', 'extreme'],
    icon: 'Rocket',
  },
  {
    slug: 'chess-tactics',
    name: 'Chess Tactics',
    archetype: 'STRATEGIST',
    cluster: 1,
    description: 'Solve chess tactical puzzles — forks, pins, skewers, and checkmate patterns within limited moves.',
    xpRange: [40, 200],
    educationalBenefit: 'Enhances forward planning, pattern recognition, and tactical calculation',
    difficulty: ['easy', 'medium', 'hard', 'extreme'],
    icon: 'Crown',
  },

  // ── Cluster 2: Creative-Expressive ──────────────────────────

  // CREATOR games
  {
    slug: 'idea-factory',
    name: 'Idea Factory',
    archetype: 'CREATOR',
    cluster: 2,
    description: 'Brainstorm and combine random concepts to produce innovative product ideas within a time limit.',
    xpRange: [50, 180],
    educationalBenefit: 'Fosters divergent thinking and creative ideation',
    difficulty: ['easy', 'medium', 'hard'],
    icon: 'Lightbulb',
  },
  {
    slug: 'color-harmonizer',
    name: 'Color Harmonizer',
    archetype: 'CREATOR',
    cluster: 2,
    description: 'Create visually harmonious color palettes that match moods, themes, and design requirements.',
    xpRange: [40, 150],
    educationalBenefit: 'Develops color theory knowledge and aesthetic sensibility',
    difficulty: ['easy', 'medium', 'hard'],
    icon: 'Palette',
  },
  {
    slug: 'invention-lab',
    name: 'Invention Lab',
    archetype: 'CREATOR',
    cluster: 2,
    description: 'Combine materials and mechanisms to invent contraptions that solve quirky engineering challenges.',
    xpRange: [60, 220],
    educationalBenefit: 'Encourages creative problem-solving and inventive thinking',
    difficulty: ['easy', 'medium', 'hard', 'extreme'],
    icon: 'FlaskConical',
  },

  // SHAPER games
  {
    slug: 'pixel-precision',
    name: 'Pixel Precision',
    archetype: 'SHAPER',
    cluster: 2,
    description: 'Replicate pixel art under tight constraints. Match the reference image as closely as possible.',
    xpRange: [40, 160],
    educationalBenefit: 'Sharpens visual attention to detail and spatial precision',
    difficulty: ['easy', 'medium', 'hard', 'extreme'],
    icon: 'Grid2x2',
  },
  {
    slug: 'symmetry-studio',
    name: 'Symmetry Studio',
    archetype: 'SHAPER',
    cluster: 2,
    description: 'Complete symmetrical patterns by mirroring shapes across axes. Unlock rotational and fractal challenges.',
    xpRange: [40, 160],
    educationalBenefit: 'Develops spatial reasoning and symmetry understanding',
    difficulty: ['easy', 'medium', 'hard'],
    icon: 'FlipHorizontal2',
  },
  {
    slug: 'typography-challenge',
    name: 'Typography Challenge',
    archetype: 'SHAPER',
    cluster: 2,
    description: 'Pair fonts, adjust spacing, and layout text to achieve professional typographic compositions.',
    xpRange: [40, 150],
    educationalBenefit: 'Trains design eye for typography, hierarchy, and visual communication',
    difficulty: ['easy', 'medium', 'hard'],
    icon: 'Type',
  },

  // STORYTELLER games
  {
    slug: 'story-weaver',
    name: 'Story Weaver',
    archetype: 'STORYTELLER',
    cluster: 2,
    description: 'Craft branching narratives by choosing plot points, character arcs, and dramatic twists.',
    xpRange: [50, 200],
    educationalBenefit: 'Develops narrative structure, character development, and creative writing',
    difficulty: ['easy', 'medium', 'hard'],
    icon: 'BookOpen',
  },
  {
    slug: 'debate-arena',
    name: 'Debate Arena',
    archetype: 'STORYTELLER',
    cluster: 2,
    description: 'Construct persuasive arguments on timed debate topics. Counter AI opponents with logic and rhetoric.',
    xpRange: [60, 220],
    educationalBenefit: 'Strengthens argumentation, critical thinking, and persuasive communication',
    difficulty: ['medium', 'hard', 'extreme'],
    icon: 'MessageSquareWarning',
  },
  {
    slug: 'word-architect',
    name: 'Word Architect',
    archetype: 'STORYTELLER',
    cluster: 2,
    description: 'Build complex words and sentences from morphemes, roots, and affixes — like linguistic Lego.',
    xpRange: [40, 160],
    educationalBenefit: 'Enhances vocabulary, morphological awareness, and language structure',
    difficulty: ['easy', 'medium', 'hard'],
    icon: 'SpellCheck',
  },

  // PERFORMER games
  {
    slug: 'rhythm-catcher',
    name: 'Rhythm Catcher',
    archetype: 'PERFORMER',
    cluster: 2,
    description: 'Tap, swipe, and hold to match rhythmic patterns of increasing complexity. Feel the beat!',
    xpRange: [40, 180],
    educationalBenefit: 'Develops timing, rhythmic awareness, and motor coordination',
    difficulty: ['easy', 'medium', 'hard', 'extreme'],
    icon: 'Music',
  },
  {
    slug: 'scene-director',
    name: 'Scene Director',
    archetype: 'PERFORMER',
    cluster: 2,
    description: 'Direct actors on a virtual stage — position them, set emotions, and time dialogue for maximum impact.',
    xpRange: [60, 200],
    educationalBenefit: 'Teaches theatrical direction, emotional expression, and staging',
    difficulty: ['easy', 'medium', 'hard'],
    icon: 'Clapperboard',
  },
  {
    slug: 'emoji-charades',
    name: 'Emoji Charades',
    archetype: 'PERFORMER',
    cluster: 2,
    description: 'Express concepts, movies, or phrases using only emoji sequences. Others guess your meaning.',
    xpRange: [30, 120],
    educationalBenefit: 'Enhances non-verbal communication and creative expression',
    difficulty: ['easy', 'medium', 'hard'],
    icon: 'Smile',
  },

  // ── Cluster 3: Social-Humanitarian ──────────────────────────

  // HEALER games
  {
    slug: 'empathy-simulator',
    name: 'Empathy Simulator',
    archetype: 'HEALER',
    cluster: 3,
    description: 'Navigate social scenarios from others\' perspectives. Choose responses that reflect emotional understanding.',
    xpRange: [50, 180],
    educationalBenefit: 'Builds emotional intelligence and perspective-taking ability',
    difficulty: ['easy', 'medium', 'hard'],
    icon: 'Heart',
  },
  {
    slug: 'triage-trainer',
    name: 'Triage Trainer',
    archetype: 'HEALER',
    cluster: 3,
    description: 'Prioritize patients in an emergency room based on symptoms and severity. Make fast, life-saving decisions.',
    xpRange: [60, 220],
    educationalBenefit: 'Develops decision-making under pressure and medical triage awareness',
    difficulty: ['easy', 'medium', 'hard', 'extreme'],
    icon: 'Stethoscope',
  },
  {
    slug: 'wellness-garden',
    name: 'Wellness Garden',
    archetype: 'HEALER',
    cluster: 3,
    description: 'Grow a virtual garden by completing mindfulness activities, journaling, and self-care routines.',
    xpRange: [30, 120],
    educationalBenefit: 'Promotes mental wellness habits, self-awareness, and stress management',
    difficulty: ['easy', 'medium'],
    icon: 'Flower2',
  },

  // DIPLOMAT games
  {
    slug: 'peace-table',
    name: 'Peace Table',
    archetype: 'DIPLOMAT',
    cluster: 3,
    description: 'Mediate conflicts between simulated parties with opposing interests. Negotiate win-win outcomes.',
    xpRange: [60, 220],
    educationalBenefit: 'Develops negotiation, mediation, and conflict resolution skills',
    difficulty: ['medium', 'hard', 'extreme'],
    icon: 'Handshake',
  },
  {
    slug: 'culture-bridge',
    name: 'Culture Bridge',
    archetype: 'DIPLOMAT',
    cluster: 3,
    description: 'Match customs, greetings, and etiquette to their cultures. Navigate cross-cultural scenarios respectfully.',
    xpRange: [40, 160],
    educationalBenefit: 'Builds cultural literacy and cross-cultural communication awareness',
    difficulty: ['easy', 'medium', 'hard'],
    icon: 'Globe',
  },
  {
    slug: 'translation-challenge',
    name: 'Translation Challenge',
    archetype: 'DIPLOMAT',
    cluster: 3,
    description: 'Translate phrases between languages, preserving meaning and cultural nuance. Speed and accuracy matter.',
    xpRange: [50, 180],
    educationalBenefit: 'Strengthens multilingual awareness and translation thinking',
    difficulty: ['easy', 'medium', 'hard', 'extreme'],
    icon: 'Languages',
  },

  // EXPLORER games
  {
    slug: 'field-journal',
    name: 'Field Journal',
    archetype: 'EXPLORER',
    cluster: 3,
    description: 'Observe virtual ecosystems, document species and phenomena, and draw scientific conclusions from fieldwork.',
    xpRange: [50, 200],
    educationalBenefit: 'Develops scientific observation, documentation, and hypothesis formation',
    difficulty: ['easy', 'medium', 'hard'],
    icon: 'Notebook',
  },
  {
    slug: 'geo-tracker',
    name: 'Geo Tracker',
    archetype: 'EXPLORER',
    cluster: 3,
    description: 'Navigate virtual terrains using maps, coordinates, and compass. Find hidden waypoints across diverse geographies.',
    xpRange: [50, 200],
    educationalBenefit: 'Enhances geography knowledge, navigation, and spatial orientation',
    difficulty: ['easy', 'medium', 'hard', 'extreme'],
    icon: 'Map',
  },
  {
    slug: 'mystery-lab',
    name: 'Mystery Lab',
    archetype: 'EXPLORER',
    cluster: 3,
    description: 'Investigate crime-scene-style puzzles using forensic techniques — collect evidence, test hypotheses, solve cases.',
    xpRange: [60, 220],
    educationalBenefit: 'Builds investigative reasoning and scientific method application',
    difficulty: ['medium', 'hard', 'extreme'],
    icon: 'Search',
  },

  // MENTOR games
  {
    slug: 'teach-back-challenge',
    name: 'Teach-Back Challenge',
    archetype: 'MENTOR',
    cluster: 3,
    description: 'Explain complex topics to a virtual student. Simplify concepts until they demonstrate understanding.',
    xpRange: [60, 220],
    educationalBenefit: 'Deepens understanding through teaching and strengthens communication clarity',
    difficulty: ['medium', 'hard', 'extreme'],
    icon: 'GraduationCap',
  },
  {
    slug: 'study-plan-designer',
    name: 'Study Plan Designer',
    archetype: 'MENTOR',
    cluster: 3,
    description: 'Create optimized study plans for virtual students based on their strengths, weaknesses, and goals.',
    xpRange: [50, 180],
    educationalBenefit: 'Develops metacognitive planning and personalized learning design',
    difficulty: ['easy', 'medium', 'hard'],
    icon: 'CalendarCheck',
  },

  // VISIONARY games
  {
    slug: 'future-builder',
    name: 'Future Builder',
    archetype: 'VISIONARY',
    cluster: 3,
    description: 'Design a city of the future by balancing sustainability, technology, and community needs.',
    xpRange: [75, 250],
    educationalBenefit: 'Encourages systems thinking, futurism, and sustainable design',
    difficulty: ['easy', 'medium', 'hard', 'extreme'],
    icon: 'Building2',
  },
  {
    slug: 'trend-spotter',
    name: 'Trend Spotter',
    archetype: 'VISIONARY',
    cluster: 3,
    description: 'Analyze data visualizations and news feeds to identify emerging trends before they go mainstream.',
    xpRange: [50, 200],
    educationalBenefit: 'Sharpens analytical reading, data literacy, and predictive thinking',
    difficulty: ['medium', 'hard', 'extreme'],
    icon: 'TrendingUp',
  },
  {
    slug: 'innovation-pitch',
    name: 'Innovation Pitch',
    archetype: 'VISIONARY',
    cluster: 3,
    description: 'Pitch innovative solutions to real-world problems. Convince an AI investor panel with data and vision.',
    xpRange: [60, 220],
    educationalBenefit: 'Develops presentation skills, persuasion, and solution-oriented thinking',
    difficulty: ['medium', 'hard', 'extreme'],
    icon: 'Presentation',
  },
]

// ─── Helper functions ─────────────────────────────────────────

export function getGameBySlug(slug: string): GameDefinition | undefined {
  return GAME_REGISTRY.find((g) => g.slug === slug)
}

export function getGamesByArchetype(archetype: ArchetypeCode): GameDefinition[] {
  return GAME_REGISTRY.filter((g) => g.archetype === archetype)
}

export function getGamesByCluster(cluster: ClusterNumber): GameDefinition[] {
  return GAME_REGISTRY.filter((g) => g.cluster === cluster)
}

export function getClusterInfo(cluster: ClusterNumber): ClusterInfo | undefined {
  return CLUSTERS.find((c) => c.id === cluster)
}
