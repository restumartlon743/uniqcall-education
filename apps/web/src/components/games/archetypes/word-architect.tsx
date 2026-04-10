'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  SpellCheck,
  CheckCircle2,
  Star,
  Lightbulb,
  Timer,
  HelpCircle,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface CrosswordWord {
  word: string
  clue: string
  row: number
  col: number
  direction: 'across' | 'down'
}

interface CrosswordPuzzle {
  id: string
  gridSize: number
  words: CrosswordWord[]
}

interface WordArchitectProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Puzzle Data ──────────────────────────────────────────────

const EASY_PUZZLES: CrosswordPuzzle[] = [
  {
    id: 'e1',
    gridSize: 8,
    words: [
      { word: 'STORY', clue: 'A tale or narrative', row: 0, col: 1, direction: 'across' },
      { word: 'WRITE', clue: 'To put words on paper', row: 0, col: 3, direction: 'down' },
      { word: 'POEM', clue: 'Verses with rhythm', row: 2, col: 0, direction: 'across' },
      { word: 'PLOT', clue: 'The main events of a story', row: 4, col: 2, direction: 'across' },
      { word: 'SONG', clue: 'Musical composition with words', row: 0, col: 1, direction: 'down' },
    ],
  },
  {
    id: 'e2',
    gridSize: 8,
    words: [
      { word: 'BRAVE', clue: 'Showing courage', row: 0, col: 0, direction: 'across' },
      { word: 'RIVER', clue: 'A flowing body of water', row: 2, col: 1, direction: 'across' },
      { word: 'BLOOM', clue: 'When flowers open up', row: 0, col: 2, direction: 'down' },
      { word: 'EAGLE', clue: 'A large bird of prey', row: 4, col: 0, direction: 'across' },
      { word: 'BLEND', clue: 'To mix together smoothly', row: 0, col: 0, direction: 'down' },
    ],
  },
  {
    id: 'e3',
    gridSize: 8,
    words: [
      { word: 'OCEAN', clue: 'Vast body of salt water', row: 0, col: 0, direction: 'across' },
      { word: 'ORBIT', clue: 'Path around a planet', row: 0, col: 0, direction: 'down' },
      { word: 'CREAM', clue: 'Top of fresh milk', row: 2, col: 2, direction: 'across' },
      { word: 'NIGHT', clue: 'When the sun sets', row: 4, col: 1, direction: 'across' },
      { word: 'CAMEL', clue: 'Desert animal with humps', row: 0, col: 2, direction: 'down' },
    ],
  },
  {
    id: 'e4',
    gridSize: 8,
    words: [
      { word: 'DREAM', clue: 'Images during sleep', row: 0, col: 0, direction: 'across' },
      { word: 'DANCE', clue: 'Move to music', row: 0, col: 0, direction: 'down' },
      { word: 'APPLE', clue: 'Red or green fruit', row: 2, col: 2, direction: 'across' },
      { word: 'SMILE', clue: 'Happy facial expression', row: 4, col: 0, direction: 'across' },
      { word: 'EASEL', clue: 'Stand for painting', row: 0, col: 4, direction: 'down' },
    ],
  },
  {
    id: 'e5',
    gridSize: 8,
    words: [
      { word: 'LIGHT', clue: 'Opposite of dark', row: 0, col: 0, direction: 'across' },
      { word: 'LUNAR', clue: 'Relating to the moon', row: 0, col: 0, direction: 'down' },
      { word: 'GLOBE', clue: 'A round model of Earth', row: 2, col: 1, direction: 'across' },
      { word: 'PEACE', clue: 'Freedom from disturbance', row: 4, col: 0, direction: 'across' },
      { word: 'IMAGE', clue: 'A visual representation', row: 0, col: 2, direction: 'down' },
    ],
  },
]

const MEDIUM_PUZZLES: CrosswordPuzzle[] = [
  {
    id: 'm1',
    gridSize: 10,
    words: [
      { word: 'MYSTERY', clue: 'Something unexplained', row: 0, col: 0, direction: 'across' },
      { word: 'MONARCH', clue: 'A king or queen', row: 0, col: 0, direction: 'down' },
      { word: 'SILENCE', clue: 'Complete absence of sound', row: 2, col: 2, direction: 'across' },
      { word: 'VOYAGE', clue: 'A long journey by sea', row: 4, col: 1, direction: 'across' },
      { word: 'SHADOW', clue: 'Dark area cast by an object', row: 0, col: 4, direction: 'down' },
      { word: 'LEGEND', clue: 'An old traditional story', row: 6, col: 0, direction: 'across' },
      { word: 'RIDDLE', clue: 'A puzzling question', row: 1, col: 3, direction: 'down' },
      { word: 'CASTLE', clue: 'A medieval fortress', row: 0, col: 6, direction: 'down' },
    ],
  },
  {
    id: 'm2',
    gridSize: 10,
    words: [
      { word: 'CHAPTER', clue: 'A section of a book', row: 0, col: 0, direction: 'across' },
      { word: 'CLIMAX', clue: 'The most intense point', row: 0, col: 0, direction: 'down' },
      { word: 'HEROES', clue: 'Brave main characters', row: 2, col: 1, direction: 'across' },
      { word: 'FABLE', clue: 'Story with a moral lesson', row: 4, col: 2, direction: 'across' },
      { word: 'AUTHOR', clue: 'Person who writes books', row: 0, col: 2, direction: 'down' },
      { word: 'ENDING', clue: 'How a story concludes', row: 6, col: 0, direction: 'across' },
      { word: 'POETRY', clue: 'Literary work in verse', row: 0, col: 4, direction: 'down' },
      { word: 'RHYME', clue: 'Words that sound alike', row: 2, col: 5, direction: 'down' },
    ],
  },
  {
    id: 'm3',
    gridSize: 10,
    words: [
      { word: 'THEATER', clue: 'Place for live performances', row: 0, col: 0, direction: 'across' },
      { word: 'TRAGIC', clue: 'Causing great sadness', row: 0, col: 0, direction: 'down' },
      { word: 'SCRIPT', clue: 'Written text for a play', row: 2, col: 1, direction: 'across' },
      { word: 'WISDOM', clue: 'Quality of being wise', row: 4, col: 2, direction: 'across' },
      { word: 'HAIKU', clue: 'Japanese short poem', row: 0, col: 1, direction: 'down' },
      { word: 'PHRASE', clue: 'A group of words', row: 6, col: 0, direction: 'across' },
      { word: 'SATIRE', clue: 'Humor used to criticize', row: 0, col: 5, direction: 'down' },
      { word: 'ESSAY', clue: 'Short written composition', row: 1, col: 3, direction: 'down' },
    ],
  },
  {
    id: 'm4',
    gridSize: 10,
    words: [
      { word: 'FANTASY', clue: 'Genre with magic and dragons', row: 0, col: 0, direction: 'across' },
      { word: 'FICTION', clue: 'Invented stories', row: 0, col: 0, direction: 'down' },
      { word: 'MEMOIR', clue: 'Personal life account', row: 2, col: 2, direction: 'across' },
      { word: 'SYMBOL', clue: 'Something representing another', row: 4, col: 1, direction: 'across' },
      { word: 'NOVICE', clue: 'A beginner', row: 0, col: 4, direction: 'down' },
      { word: 'SONNET', clue: '14-line poem form', row: 6, col: 0, direction: 'across' },
      { word: 'ACCENT', clue: 'Way of pronouncing words', row: 0, col: 6, direction: 'down' },
      { word: 'THEME', clue: 'Central idea of a story', row: 1, col: 3, direction: 'down' },
    ],
  },
  {
    id: 'm5',
    gridSize: 10,
    words: [
      { word: 'GRAMMAR', clue: 'Rules of language structure', row: 0, col: 0, direction: 'across' },
      { word: 'GENIUS', clue: 'Exceptional intellectual ability', row: 0, col: 0, direction: 'down' },
      { word: 'PHRASE', clue: 'Small group of words', row: 2, col: 2, direction: 'across' },
      { word: 'SKETCH', clue: 'A rough drawing or outline', row: 4, col: 1, direction: 'across' },
      { word: 'ADVERB', clue: 'Word modifying a verb', row: 0, col: 4, direction: 'down' },
      { word: 'SUFFIX', clue: 'Ending added to a word', row: 6, col: 0, direction: 'across' },
      { word: 'RHYTHM', clue: 'Pattern of beats in language', row: 0, col: 6, direction: 'down' },
      { word: 'METAPHOR', clue: 'Figurative comparison', row: 1, col: 2, direction: 'down' },
    ],
  },
]

const HARD_PUZZLES: CrosswordPuzzle[] = [
  {
    id: 'h1',
    gridSize: 12,
    words: [
      { word: 'PROTAGONIST', clue: 'The main character of a story', row: 0, col: 0, direction: 'across' },
      { word: 'PERSPECTIVE', clue: 'Point of view in a narrative', row: 0, col: 0, direction: 'down' },
      { word: 'ALLUSION', clue: 'Indirect reference to something', row: 2, col: 2, direction: 'across' },
      { word: 'RHETORIC', clue: 'Art of persuasive speaking', row: 4, col: 1, direction: 'across' },
      { word: 'NARRATIVE', clue: 'A spoken or written account', row: 0, col: 4, direction: 'down' },
      { word: 'ELOQUENT', clue: 'Fluent and persuasive speech', row: 6, col: 0, direction: 'across' },
      { word: 'PROLOGUE', clue: 'Introduction to a story', row: 0, col: 8, direction: 'down' },
      { word: 'ALLEGORY', clue: 'Story with hidden meaning', row: 8, col: 1, direction: 'across' },
      { word: 'EPITOME', clue: 'Perfect example of something', row: 1, col: 6, direction: 'down' },
      { word: 'ODYSSEY', clue: 'A long and eventful journey', row: 3, col: 3, direction: 'down' },
      { word: 'SYNTAX', clue: 'Arrangement of words', row: 10, col: 0, direction: 'across' },
      { word: 'EPIPHANY', clue: 'Sudden realization moment', row: 0, col: 10, direction: 'down' },
    ],
  },
  {
    id: 'h2',
    gridSize: 12,
    words: [
      { word: 'METAPHORICAL', clue: 'Not literal, figurative', row: 0, col: 0, direction: 'across' },
      { word: 'MONOLOGUE', clue: 'Long speech by one person', row: 0, col: 0, direction: 'down' },
      { word: 'SOLILOQUY', clue: 'Speaking thoughts aloud alone', row: 2, col: 2, direction: 'across' },
      { word: 'DRAMATIC', clue: 'Relating to theater or drama', row: 4, col: 1, direction: 'across' },
      { word: 'OXYMORON', clue: 'Contradictory words together', row: 0, col: 4, direction: 'down' },
      { word: 'FOLKLORE', clue: 'Traditional beliefs and stories', row: 6, col: 0, direction: 'across' },
      { word: 'HYPERBOLE', clue: 'Exaggerated statement', row: 0, col: 8, direction: 'down' },
      { word: 'PARABLE', clue: 'Simple moral story', row: 8, col: 2, direction: 'across' },
      { word: 'ANTHOLOGY', clue: 'Collection of writings', row: 1, col: 6, direction: 'down' },
      { word: 'IRONIC', clue: 'Opposite of expected meaning', row: 3, col: 3, direction: 'down' },
      { word: 'DIALECT', clue: 'Regional form of a language', row: 10, col: 0, direction: 'across' },
      { word: 'PREMISE', clue: 'The basis of a story', row: 0, col: 10, direction: 'down' },
    ],
  },
  {
    id: 'h3',
    gridSize: 12,
    words: [
      { word: 'COMPOSITION', clue: 'A written work or essay', row: 0, col: 0, direction: 'across' },
      { word: 'CHRONICLE', clue: 'Historical account of events', row: 0, col: 0, direction: 'down' },
      { word: 'PARADOX', clue: 'A self-contradicting statement', row: 2, col: 2, direction: 'across' },
      { word: 'ELOQUENT', clue: 'Beautifully expressive', row: 4, col: 1, direction: 'across' },
      { word: 'PERSONA', clue: 'Role or character adopted', row: 0, col: 4, direction: 'down' },
      { word: 'ANALOGY', clue: 'A comparison for explanation', row: 6, col: 0, direction: 'across' },
      { word: 'NUANCED', clue: 'Subtle differences in meaning', row: 0, col: 8, direction: 'down' },
      { word: 'SUBPLOT', clue: 'Secondary storyline', row: 8, col: 2, direction: 'across' },
      { word: 'IMAGERY', clue: 'Visually descriptive language', row: 1, col: 6, direction: 'down' },
      { word: 'MEMOIR', clue: 'Account of personal memories', row: 3, col: 3, direction: 'down' },
      { word: 'BALLAD', clue: 'Narrative poem or song', row: 10, col: 0, direction: 'across' },
      { word: 'STANZA', clue: 'Group of lines in a poem', row: 0, col: 10, direction: 'down' },
    ],
  },
  {
    id: 'h4',
    gridSize: 12,
    words: [
      { word: 'STORYTELLER', clue: 'Person narrating tales', row: 0, col: 0, direction: 'across' },
      { word: 'SYMBOLISM', clue: 'Use of symbols for ideas', row: 0, col: 0, direction: 'down' },
      { word: 'DICTION', clue: 'Choice of words in speech', row: 2, col: 2, direction: 'across' },
      { word: 'NOVELLA', clue: 'Short novel', row: 4, col: 1, direction: 'across' },
      { word: 'ONOMATOPOEIA', clue: 'Word imitating a sound', row: 0, col: 4, direction: 'down' },
      { word: 'PROSODY', clue: 'Patterns of rhythm and sound', row: 6, col: 0, direction: 'across' },
      { word: 'CATHARSIS', clue: 'Emotional purification', row: 0, col: 8, direction: 'down' },
      { word: 'EPITAPH', clue: 'Inscription on a tombstone', row: 8, col: 2, direction: 'across' },
      { word: 'GENRE', clue: 'Category of artistic work', row: 1, col: 6, direction: 'down' },
      { word: 'ARCHAIC', clue: 'Very old-fashioned language', row: 3, col: 3, direction: 'down' },
      { word: 'COUPLET', clue: 'Two successive rhyming lines', row: 10, col: 0, direction: 'across' },
      { word: 'LYRICAL', clue: 'Expressing emotion beautifully', row: 0, col: 10, direction: 'down' },
    ],
  },
  {
    id: 'h5',
    gridSize: 12,
    words: [
      { word: 'VOCABULARY', clue: 'Words known and used', row: 0, col: 0, direction: 'across' },
      { word: 'VERSIFIED', clue: 'Written in verse form', row: 0, col: 0, direction: 'down' },
      { word: 'PHRASING', clue: 'Way of expressing something', row: 2, col: 2, direction: 'across' },
      { word: 'SUSPENSE', clue: 'Feeling of excited uncertainty', row: 4, col: 1, direction: 'across' },
      { word: 'ABSTRACT', clue: 'Existing in thought only', row: 0, col: 4, direction: 'down' },
      { word: 'FORESHADOW', clue: 'Hint of what is to come', row: 6, col: 0, direction: 'across' },
      { word: 'BREVITY', clue: 'Concise and exact use of words', row: 0, col: 8, direction: 'down' },
      { word: 'TENSION', clue: 'Mental or emotional strain', row: 8, col: 2, direction: 'across' },
      { word: 'CLASSIC', clue: 'Outstanding example of a type', row: 1, col: 6, direction: 'down' },
      { word: 'CONTEXT', clue: 'Circumstances of a situation', row: 3, col: 3, direction: 'down' },
      { word: 'PREFACE', clue: 'Introduction to a book', row: 10, col: 0, direction: 'across' },
      { word: 'SIMILE', clue: 'Comparison using like or as', row: 0, col: 10, direction: 'down' },
    ],
  },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { puzzles: EASY_PUZZLES, timeLimit: 180, hintPenalty: 0.1, multiplier: 1 }
    case 'medium':
      return { puzzles: MEDIUM_PUZZLES, timeLimit: 150, hintPenalty: 0.1, multiplier: 1.5 }
    case 'hard':
      return { puzzles: HARD_PUZZLES, timeLimit: 120, hintPenalty: 0.1, multiplier: 2 }
    case 'extreme':
      return { puzzles: HARD_PUZZLES, timeLimit: 90, hintPenalty: 0.15, multiplier: 3 }
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

export default function WordArchitect({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: WordArchitectProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const puzzle = useMemo(() => shuffle(config.puzzles)[0], [config.puzzles])

  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [activeClue, setActiveClue] = useState<number>(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [revealed, setRevealed] = useState<Record<number, Set<number>>>({})
  const [timeLeft, setTimeLeft] = useState(config.timeLimit)
  const [gameFinished, setGameFinished] = useState(false)
  const [results, setResults] = useState<{ correct: number; total: number; timeBonus: number; hintPenalty: number; finalScore: number } | null>(null)
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const maxScore = Math.round(puzzle.words.length * 10 * config.multiplier)

  // Timer
  useEffect(() => {
    if (gameFinished || isPaused) return
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, gameFinished, isPaused])

  const handleAnswerChange = useCallback((wordIndex: number, value: string) => {
    if (isPaused || gameFinished) return
    setAnswers((a) => ({ ...a, [wordIndex]: value.toUpperCase() }))
  }, [isPaused, gameFinished])

  const handleHint = useCallback(() => {
    if (isPaused || gameFinished) return
    const word = puzzle.words[activeClue]
    if (!word) return
    const currentAnswer = answers[activeClue] ?? ''
    const revealedSet = revealed[activeClue] ?? new Set<number>()

    // Find first unrevealed, incorrectly filled position
    for (let i = 0; i < word.word.length; i++) {
      if (!revealedSet.has(i) && (currentAnswer[i] ?? '') !== word.word[i]) {
        const newRevealed = new Set(revealedSet)
        newRevealed.add(i)
        setRevealed((r) => ({ ...r, [activeClue]: newRevealed }))

        // Insert letter into answer
        const chars = (currentAnswer.padEnd(word.word.length, ' ')).split('')
        chars[i] = word.word[i]
        setAnswers((a) => ({ ...a, [activeClue]: chars.join('').trimEnd() }))
        setHintsUsed((h) => h + 1)
        return
      }
    }
  }, [isPaused, gameFinished, puzzle.words, activeClue, answers, revealed])

  const handleSubmit = useCallback(() => {
    if (gameFinished) return
    let correct = 0
    for (let i = 0; i < puzzle.words.length; i++) {
      const answer = (answers[i] ?? '').toUpperCase().trim()
      if (answer === puzzle.words[i].word.toUpperCase()) correct++
    }

    const timeBonus = Math.round((timeLeft / config.timeLimit) * 20)
    const hintPenalty = Math.round(hintsUsed * config.hintPenalty * 10)
    const baseScore = correct * 10
    const finalScore = Math.max(0, Math.round((baseScore + timeBonus - hintPenalty) * config.multiplier))

    setResults({ correct, total: puzzle.words.length, timeBonus, hintPenalty, finalScore })
    setGameFinished(true)
    onScoreUpdate(finalScore, maxScore)
    onGameOver(finalScore, maxScore)
  }, [gameFinished, puzzle.words, answers, timeLeft, config.timeLimit, config.hintPenalty, config.multiplier, hintsUsed, maxScore, onScoreUpdate, onGameOver])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const acrossClues = puzzle.words
    .map((w, i) => ({ ...w, index: i }))
    .filter((w) => w.direction === 'across')
  const downClues = puzzle.words
    .map((w, i) => ({ ...w, index: i }))
    .filter((w) => w.direction === 'down')

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-5">
      {/* Header bar */}
      <div className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <SpellCheck className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-bold text-white/80">
            {puzzle.words.length} Words
          </span>
        </div>
        <div className={cn(
          'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold',
          timeLeft > 60 ? 'bg-emerald-500/10 text-emerald-400' :
          timeLeft > 30 ? 'bg-amber-500/10 text-amber-400' :
          'bg-red-500/10 text-red-400',
        )}>
          <Timer className="h-3 w-3" />
          {formatTime(timeLeft)}
        </div>
        <button
          onClick={handleHint}
          disabled={isPaused || gameFinished}
          className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs font-bold text-amber-400 transition-all hover:bg-amber-500/10 disabled:opacity-30"
        >
          <Lightbulb className="h-3 w-3" />
          Hint ({hintsUsed} used)
        </button>
      </div>

      {gameFinished && results ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8"
        >
          <Star className="h-12 w-12 text-amber-400" />
          <p className="text-xl font-bold text-white">Crossword Complete!</p>
          <div className="grid w-full max-w-xs grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
              <p className="text-white/40">Words Correct</p>
              <p className="text-lg font-bold text-cyan-300">{results.correct}/{results.total}</p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-white/40">Time Bonus</p>
              <p className="text-lg font-bold text-emerald-300">+{results.timeBonus}</p>
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <p className="text-white/40">Hint Penalty</p>
              <p className="text-lg font-bold text-red-300">-{results.hintPenalty}</p>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-white/40">Final Score</p>
              <p className="text-lg font-bold text-amber-400">{results.finalScore}</p>
            </div>
          </div>
          {/* Show answers */}
          <div className="mt-2 flex w-full flex-col gap-1.5">
            {puzzle.words.map((w, i) => {
              const playerAnswer = (answers[i] ?? '').toUpperCase().trim()
              const isCorrect = playerAnswer === w.word.toUpperCase()
              return (
                <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs">
                  <span className="text-white/60">{w.clue}</span>
                  <div className="flex items-center gap-2">
                    {!isCorrect && (
                      <span className="text-red-400 line-through">{playerAnswer || '—'}</span>
                    )}
                    <span className={cn(isCorrect ? 'text-emerald-400' : 'text-amber-400')}>
                      {w.word}
                    </span>
                    {isCorrect ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <HelpCircle className="h-3.5 w-3.5 text-red-400" />}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      ) : (
        <div className="flex w-full flex-col gap-5 lg:flex-row">
          {/* Clues panel */}
          <div className="flex flex-1 flex-col gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-cyan-400">Across</p>
              {acrossClues.map((w) => (
                <button
                  key={w.index}
                  onClick={() => {
                    setActiveClue(w.index)
                    inputRefs.current[w.index]?.focus()
                  }}
                  className={cn(
                    'mb-1 flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-all',
                    activeClue === w.index
                      ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200'
                      : 'border-white/5 bg-white/2 text-white/60 hover:border-white/10',
                  )}
                >
                  <span className="shrink-0 font-bold text-white/40">{w.index + 1}.</span>
                  {w.clue}
                </button>
              ))}
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-violet-400">Down</p>
              {downClues.map((w) => (
                <button
                  key={w.index}
                  onClick={() => {
                    setActiveClue(w.index)
                    inputRefs.current[w.index]?.focus()
                  }}
                  className={cn(
                    'mb-1 flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-all',
                    activeClue === w.index
                      ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
                      : 'border-white/5 bg-white/2 text-white/60 hover:border-white/10',
                  )}
                >
                  <span className="shrink-0 font-bold text-white/40">{w.index + 1}.</span>
                  {w.clue}
                </button>
              ))}
            </div>
          </div>

          {/* Answer inputs */}
          <div className="flex flex-1 flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">Your Answers</p>
            <AnimatePresence>
              {puzzle.words.map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-all',
                    activeClue === i
                      ? 'border-cyan-500/30 bg-cyan-500/5'
                      : 'border-white/10 bg-white/5',
                  )}
                >
                  <span className="shrink-0 text-[10px] font-bold text-white/30">
                    {i + 1}. ({w.direction === 'across' ? '→' : '↓'})
                  </span>
                  <div className="flex gap-1">
                    {w.word.split('').map((letter, li) => {
                      const isRevealed = revealed[i]?.has(li)
                      const currentChar = (answers[i] ?? '')[li] ?? ''
                      return (
                        <div
                          key={li}
                          className={cn(
                            'flex h-7 w-7 items-center justify-center rounded border text-xs font-bold uppercase',
                            isRevealed
                              ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                              : currentChar
                                ? 'border-white/20 bg-white/10 text-white'
                                : 'border-white/10 bg-white/5 text-white/20',
                          )}
                        >
                          {isRevealed ? letter : currentChar || '·'}
                        </div>
                      )
                    })}
                  </div>
                  <input
                    ref={(el) => { inputRefs.current[i] = el }}
                    type="text"
                    value={answers[i] ?? ''}
                    onChange={(e) => handleAnswerChange(i, e.target.value.slice(0, w.word.length))}
                    onFocus={() => setActiveClue(i)}
                    maxLength={w.word.length}
                    placeholder={`${w.word.length} letters`}
                    className="w-20 shrink-0 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs uppercase text-white/80 placeholder-white/20 outline-none focus:border-cyan-500/30"
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              onClick={handleSubmit}
              disabled={isPaused}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-500"
            >
              <CheckCircle2 className="h-4 w-4" />
              Submit Answers
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
