'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Globe,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Star,
  Timer,
  Zap,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface CulturalFact {
  id: string
  question: string
  correctAnswer: string
  options: string[]
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface CultureBridgeProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const ALL_FACTS: CulturalFact[] = [
  // Easy: famous customs
  { id: 'f1', question: 'Bowing is the traditional greeting in which country?', correctAnswer: 'Japan', options: ['Japan', 'Brazil', 'Germany', 'Egypt'], explanation: 'In Japan, bowing (ojigi) is a fundamental part of social interaction showing respect.', difficulty: 'easy' },
  { id: 'f2', question: 'In which country is it customary to remove shoes before entering a home?', correctAnswer: 'Japan', options: ['United States', 'Japan', 'Brazil', 'France'], explanation: 'In Japan, removing shoes at the entrance (genkan) is a deeply rooted custom for cleanliness.', difficulty: 'easy' },
  { id: 'f3', question: 'The "Namaste" greeting with palms pressed together originates from…', correctAnswer: 'India', options: ['India', 'Thailand', 'China', 'Morocco'], explanation: 'Namaste is a Sanskrit word meaning "I bow to you" and is the traditional Indian greeting.', difficulty: 'easy' },
  { id: 'f4', question: 'Carnival with elaborate costumes and samba dancing is most associated with…', correctAnswer: 'Brazil', options: ['Spain', 'Brazil', 'Italy', 'Mexico'], explanation: 'Rio de Janeiro\'s Carnival is the world\'s largest carnival celebration with samba parades.', difficulty: 'easy' },
  { id: 'f5', question: 'Which culture celebrates Day of the Dead (Día de los Muertos)?', correctAnswer: 'Mexico', options: ['Spain', 'Philippines', 'Mexico', 'Peru'], explanation: 'Día de los Muertos is a Mexican tradition honoring deceased loved ones with altars and marigolds.', difficulty: 'easy' },
  { id: 'f6', question: 'In which country is punctuality considered extremely important in business?', correctAnswer: 'Germany', options: ['Brazil', 'Germany', 'India', 'Nigeria'], explanation: 'German business culture values precise punctuality; being even 5 minutes late is considered rude.', difficulty: 'easy' },
  { id: 'f7', question: 'Which country\'s tea ceremony (Chadō) is a meditative cultural practice?', correctAnswer: 'Japan', options: ['China', 'Japan', 'England', 'Morocco'], explanation: 'The Japanese tea ceremony (Chadō) is a choreographed ritual centered on Zen Buddhist principles.', difficulty: 'easy' },
  { id: 'f8', question: 'Kimchi, a fermented vegetable dish, is a staple food of…', correctAnswer: 'South Korea', options: ['China', 'South Korea', 'Vietnam', 'Japan'], explanation: 'Kimchi is a cornerstone of Korean cuisine, with families making it together during "Kimjang."', difficulty: 'easy' },
  { id: 'f9', question: 'The traditional greeting of cheek-kissing is common in…', correctAnswer: 'France', options: ['France', 'Japan', 'China', 'Finland'], explanation: 'In France, "la bise" (cheek-kissing) is a standard greeting between friends and acquaintances.', difficulty: 'easy' },
  { id: 'f10', question: 'In which culture is the "Haka" war dance performed?', correctAnswer: 'Māori (New Zealand)', options: ['Māori (New Zealand)', 'Aboriginal (Australia)', 'Hawaiian', 'Samoan'], explanation: 'The Haka is a traditional Māori war dance now used to welcome guests and in sports events.', difficulty: 'easy' },
  // Medium: nuanced etiquette
  { id: 'f11', question: 'In Egypt, which hand should you use to eat or pass food?', correctAnswer: 'Right hand', options: ['Right hand', 'Left hand', 'Either hand', 'Both hands'], explanation: 'In many Middle Eastern and African cultures, the left hand is considered unclean; the right is used for eating.', difficulty: 'medium' },
  { id: 'f12', question: 'In South Korea, when receiving a business card, you should…', correctAnswer: 'Accept with both hands and read it carefully', options: ['Accept with both hands and read it carefully', 'Quickly pocket it', 'Write notes on it', 'Accept with your left hand'], explanation: 'In Korean business culture, business cards are treated with great respect and examined before putting away.', difficulty: 'medium' },
  { id: 'f13', question: 'In Thailand, which body part should you never point at someone with?', correctAnswer: 'Feet', options: ['Feet', 'Fingers', 'Elbows', 'Head'], explanation: 'In Thai culture, feet are considered the lowest and dirtiest part of the body; pointing with them is very disrespectful.', difficulty: 'medium' },
  { id: 'f14', question: 'In India, what does a head wobble (side-to-side) usually mean?', correctAnswer: 'Yes / understanding / agreement', options: ['Yes / understanding / agreement', 'No / disagreement', 'Confusion', 'Boredom'], explanation: 'The Indian head wobble can mean "yes," "I understand," or general acknowledgment depending on context.', difficulty: 'medium' },
  { id: 'f15', question: 'In Japan, tipping at a restaurant is considered…', correctAnswer: 'Rude or insulting', options: ['Rude or insulting', 'Expected (15-20%)', 'Optional but appreciated', 'Mandatory by law'], explanation: 'In Japan, tipping can be seen as suggesting the person needs extra money, which is considered insulting.', difficulty: 'medium' },
  { id: 'f16', question: 'In Brazil, the "OK" hand gesture (thumb and index forming a circle) means…', correctAnswer: 'An offensive gesture', options: ['An offensive gesture', 'Everything is fine', 'Money', 'Zero'], explanation: 'In Brazil, this gesture is considered very rude and offensive, unlike its meaning in the US.', difficulty: 'medium' },
  { id: 'f17', question: 'In China, you should never give someone a clock as a gift because…', correctAnswer: 'It symbolizes death/counting time until death', options: ['It symbolizes death/counting time until death', 'It\'s considered too cheap', 'Clocks are bad luck in general', 'Only children receive clocks'], explanation: 'In Chinese, "giving a clock" (送钟, sòng zhōng) sounds like "attending a funeral" (送终, sòng zhōng).', difficulty: 'medium' },
  { id: 'f18', question: 'When visiting a German home, what is customary to bring?', correctAnswer: 'Flowers (but not roses or lilies)', options: ['Flowers (but not roses or lilies)', 'Money in an envelope', 'Food for the dinner', 'Nothing — gifts are uncommon'], explanation: 'Bringing flowers is customary in Germany, but roses imply romance and white lilies are for funerals.', difficulty: 'medium' },
  { id: 'f19', question: 'In which country is slurping noodles considered a compliment to the chef?', correctAnswer: 'Japan', options: ['Japan', 'Italy', 'China', 'France'], explanation: 'In Japan, slurping noodles shows enjoyment and helps cool the noodles — it\'s polite, not rude.', difficulty: 'medium' },
  { id: 'f20', question: 'In Middle Eastern cultures, admiring someone\'s possession might lead them to…', correctAnswer: 'Offer it to you as a gift', options: ['Offer it to you as a gift', 'Feel uncomfortable', 'Show you more possessions', 'Ignore the compliment'], explanation: 'In many Middle Eastern cultures, complimenting an item may obligate the host to give it to you out of generosity.', difficulty: 'medium' },
  // Hard: rare/surprising facts
  { id: 'f21', question: 'In Finland, "silence in conversation" is generally interpreted as…', correctAnswer: 'Comfortable and respectful', options: ['Comfortable and respectful', 'Rude and awkward', 'A sign of anger', 'Disinterest'], explanation: 'Finns value silence; it shows thoughtfulness and doesn\'t need to be filled with small talk.', difficulty: 'hard' },
  { id: 'f22', question: 'In Tibetan culture, sticking out your tongue is a sign of…', correctAnswer: 'Respect and greeting', options: ['Respect and greeting', 'Insult', 'Hunger', 'Playfulness'], explanation: 'This tradition dates back to showing you don\'t have a black tongue, which was associated with an evil king.', difficulty: 'hard' },
  { id: 'f23', question: 'In Nigeria, among the Yoruba, a younger person greets an elder by…', correctAnswer: 'Prostrating or kneeling on the ground', options: ['Prostrating or kneeling on the ground', 'A firm handshake', 'Bowing from the waist', 'Touching their forehead'], explanation: 'Yoruba culture requires young men to prostrate (dobale) and young women to kneel (kunle) before elders.', difficulty: 'hard' },
  { id: 'f24', question: 'In which country is it extremely rude to blow your nose in public?', correctAnswer: 'Japan', options: ['Japan', 'United States', 'Brazil', 'Australia'], explanation: 'In Japan, blowing your nose in public is very rude; people will leave the room or use the restroom instead.', difficulty: 'hard' },
  { id: 'f25', question: 'The Chilean "hand under elbow" gesture means…', correctAnswer: 'Someone is cheap/stingy', options: ['Someone is cheap/stingy', 'Agreement', 'Strength', 'Friendship'], explanation: 'In Chile, tapping the underside of your elbow implies someone is unwilling to spend money.', difficulty: 'hard' },
  { id: 'f26', question: 'In Russia, giving an even number of flowers is associated with…', correctAnswer: 'Funerals and mourning', options: ['Funerals and mourning', 'Celebration', 'Romance', 'Friendship'], explanation: 'In Russian tradition, even-numbered bouquets are reserved for funerals; always give odd numbers for happy occasions.', difficulty: 'hard' },
  { id: 'f27', question: 'In China, the number 4 is considered unlucky because…', correctAnswer: 'It sounds like the word for "death"', options: ['It sounds like the word for "death"', 'It represents bad weather', 'A myth about 4 demons', 'It\'s an incomplete number'], explanation: '四 (sì, four) sounds like 死 (sǐ, death), so many buildings in China skip the 4th floor.', difficulty: 'hard' },
  { id: 'f28', question: 'In Polynesian cultures, the "hongi" greeting involves…', correctAnswer: 'Pressing noses and foreheads together', options: ['Pressing noses and foreheads together', 'Clapping twice', 'A long hug', 'Bowing deeply'], explanation: 'The hongi represents the sharing of breath (ha) and symbolizes the unity of two people.', difficulty: 'hard' },
  { id: 'f29', question: 'In Ethiopia, "gursha" is the practice of…', correctAnswer: 'Hand-feeding another person as a sign of love', options: ['Hand-feeding another person as a sign of love', 'A dance before meals', 'Praying over food', 'Serving the eldest first'], explanation: 'Gursha is when someone hand-feeds you a mouthful of food, showing deep affection and friendship.', difficulty: 'hard' },
  { id: 'f30', question: 'In Bhutan, the national sport is…', correctAnswer: 'Archery', options: ['Archery', 'Soccer', 'Cricket', 'Wrestling'], explanation: 'Archery (dha) is Bhutan\'s national sport, played with traditional bows during festivals with singing and dancing.', difficulty: 'hard' },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { count: 10, pool: ['easy'] as const, timePerQuestion: 20, speedBonusMax: 3 }
    case 'medium':
      return { count: 10, pool: ['easy', 'medium'] as const, timePerQuestion: 15, speedBonusMax: 5 }
    case 'hard':
      return { count: 10, pool: ['easy', 'medium', 'hard'] as const, timePerQuestion: 12, speedBonusMax: 7 }
    case 'extreme':
      return { count: 10, pool: ['medium', 'hard'] as const, timePerQuestion: 10, speedBonusMax: 10 }
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

export default function CultureBridge({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: CultureBridgeProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const questions = useMemo(() => {
    const pool = ALL_FACTS.filter((f) => (config.pool as readonly string[]).includes(f.difficulty))
    return shuffle(pool).slice(0, config.count).map((q) => ({
      ...q,
      options: shuffle(q.options),
    }))
  }, [config])

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [results, setResults] = useState<{ correct: boolean; speedBonus: number }[]>([])
  const [timeLeft, setTimeLeft] = useState(config.timePerQuestion)
  const [finished, setFinished] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const current = questions[index]
  const basePointsPerQuestion = 10
  const maxScore = questions.length * (basePointsPerQuestion + config.speedBonusMax)

  // Timer
  useEffect(() => {
    if (selected !== null || isPaused || finished) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [index, selected, isPaused, finished])

  // Auto-select timeout
  useEffect(() => {
    if (timeLeft === 0 && selected === null) {
      handleSelect('__timeout__')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  const handleSelect = useCallback(
    (answer: string) => {
      if (isPaused || selected !== null) return
      if (timerRef.current) clearInterval(timerRef.current)
      setSelected(answer)

      const isCorrect = answer === current.correctAnswer
      const elapsed = config.timePerQuestion - timeLeft
      const speedBonus = isCorrect ? Math.max(0, Math.round(config.speedBonusMax * (1 - elapsed / config.timePerQuestion))) : 0
      const newResults = [...results, { correct: isCorrect, speedBonus }]
      setResults(newResults)

      const totalScore = newResults.reduce((a, r) => a + (r.correct ? basePointsPerQuestion + r.speedBonus : 0), 0)
      onScoreUpdate(totalScore, maxScore)
    },
    [isPaused, selected, current, config, timeLeft, results, maxScore, onScoreUpdate],
  )

  const handleNext = useCallback(() => {
    if (index + 1 >= questions.length) {
      setFinished(true)
      const totalScore = results.reduce((a, r) => a + (r.correct ? basePointsPerQuestion + r.speedBonus : 0), 0)
      onGameOver(totalScore, maxScore)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
      setTimeLeft(config.timePerQuestion)
    }
  }, [index, questions.length, results, maxScore, config.timePerQuestion, onGameOver])

  const totalCorrect = results.filter((r) => r.correct).length
  const totalBonusEarned = results.reduce((a, r) => a + r.speedBonus, 0)
  const timerPercent = (timeLeft / config.timePerQuestion) * 100

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
      {/* Progress */}
      <div className="flex items-center gap-1.5">
        {questions.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold transition-all',
              i < index && results[i]?.correct && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i < index && !results[i]?.correct && 'border-red-500/40 bg-red-500/15 text-red-400',
              i === index && !finished && 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300',
              i > index && 'border-white/10 bg-white/5 text-white/20',
            )}
          >
            {i < results.length ? (results[i].correct ? '✓' : '✗') : i + 1}
          </div>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex w-full items-center justify-between rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-cyan-400" />
          <span className="text-xs text-white/60">Correct: <span className="font-bold text-emerald-400">{totalCorrect}</span>/{results.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-3 w-3 text-amber-400" />
          <span className="text-xs text-white/60">Speed Bonus: <span className="font-bold text-amber-400">+{totalBonusEarned}</span></span>
        </div>
      </div>

      {finished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8"
        >
          <Star className="h-12 w-12 text-amber-400" />
          <p className="text-xl font-bold text-white">Culture Bridge Complete!</p>
          <p className="text-sm text-white/60">
            Correct: {totalCorrect}/{questions.length} | Bonus: +{totalBonusEarned}
          </p>
          <p className="text-sm text-white/60">
            Total Score: {results.reduce((a, r) => a + (r.correct ? basePointsPerQuestion + r.speedBonus : 0), 0)} / {maxScore}
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
            {/* Timer */}
            {selected === null && (
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-white/40" />
                <div className="relative flex-1 h-2 rounded-full bg-white/10">
                  <motion.div
                    className={cn(
                      'absolute left-0 top-0 h-2 rounded-full',
                      timerPercent > 50 ? 'bg-cyan-500' : timerPercent > 25 ? 'bg-yellow-500' : 'bg-red-500',
                    )}
                    animate={{ width: `${timerPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className={cn('text-xs font-bold', timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-white/60')}>
                  {timeLeft}s
                </span>
              </div>
            )}

            {/* Question */}
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
              <p className="text-xs text-cyan-300/60">Question {index + 1} of {questions.length}</p>
              <p className="mt-2 text-sm font-semibold text-white/90">{current.question}</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {current.options.map((opt) => {
                const isChosen = selected === opt
                const revealed = selected !== null
                const isCorrectAnswer = opt === current.correctAnswer
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    disabled={revealed}
                    className={cn(
                      'rounded-xl border p-4 text-left text-sm transition-all',
                      !revealed && 'border-white/10 bg-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5',
                      revealed && isChosen && isCorrectAnswer && 'border-emerald-500/40 bg-emerald-500/10',
                      revealed && isChosen && !isCorrectAnswer && 'border-red-500/40 bg-red-500/10',
                      revealed && !isChosen && isCorrectAnswer && 'border-emerald-500/20 bg-emerald-500/5',
                      revealed && !isChosen && !isCorrectAnswer && 'border-white/5 bg-white/3 opacity-40',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {revealed && isCorrectAnswer && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      {revealed && isChosen && !isCorrectAnswer && <XCircle className="h-4 w-4 text-red-400" />}
                      <span className="text-white/80">{opt}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs text-white/60">{current.explanation}</p>
                {results[results.length - 1]?.speedBonus > 0 && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-amber-400">
                    <Zap className="h-3 w-3" /> Speed bonus: +{results[results.length - 1].speedBonus}
                  </p>
                )}
              </motion.div>
            )}

            {selected !== null && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleNext}
                className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-500"
              >
                {index + 1 >= questions.length ? 'Finish' : 'Next Question'}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
