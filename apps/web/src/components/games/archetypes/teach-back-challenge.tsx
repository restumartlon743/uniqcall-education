'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Star,
  MessageCircle,
  BookOpen,
  Lightbulb,
  Wrench,
  Zap,
  UserRound,
} from 'lucide-react'
import type { GameDifficulty } from '@/lib/game-data'

// ─── Types ────────────────────────────────────────────────────

interface Question {
  question: string
  level: 'basic' | 'application' | 'edge-case'
  options: string[]
  correctOption: number
  explanation: string
}

interface Concept {
  id: string
  subject: string
  title: string
  explanation: string
  questions: Question[]
}

interface TeachBackChallengeProps {
  difficulty: GameDifficulty
  onScoreUpdate: (score: number, maxScore: number) => void
  onGameOver: (finalScore: number, maxScore: number) => void
  isPaused: boolean
}

// ─── Data ─────────────────────────────────────────────────────

const ALL_CONCEPTS: Concept[] = [
  {
    id: 'c1', subject: 'Biology', title: 'Photosynthesis',
    explanation: 'Photosynthesis is the process by which plants convert carbon dioxide and water into glucose and oxygen using sunlight energy. It occurs in chloroplasts, specifically using chlorophyll pigments that absorb light. The process has two stages: light-dependent reactions (in thylakoids) and the Calvin cycle (in stroma).',
    questions: [
      { question: 'The student asks: "So plants eat sunlight?"', level: 'basic', options: [
        'Yes, plants eat sunlight like we eat food.',
        'Not exactly — plants use sunlight as energy to convert CO₂ and water into glucose, which is their actual food.',
        'No, plants eat from the soil through their roots.',
        'Plants absorb sunlight and store it directly as energy.',
      ], correctOption: 1, explanation: 'The best explanation clarifies the misconception — sunlight is the energy source, not the food itself.' },
      { question: '"Can photosynthesis work with a desk lamp?"', level: 'application', options: [
        'No, only natural sunlight works for photosynthesis.',
        'Yes, any light source can drive photosynthesis as long as it has the right wavelengths — chlorophyll mainly absorbs red and blue light.',
        'Only UV light works for photosynthesis.',
        'Desk lamps are too weak for any photosynthesis.',
      ], correctOption: 1, explanation: 'This tests application: artificial light with correct wavelengths can indeed drive photosynthesis.' },
      { question: '"What happens if a plant gets light but no CO₂?"', level: 'edge-case', options: [
        'The plant will still make glucose from water alone.',
        'Nothing happens — the plant needs both. Without CO₂, the Calvin cycle cannot produce glucose even with light energy available.',
        'The plant switches to a different food source.',
        'The plant dies immediately.',
      ], correctOption: 1, explanation: 'Edge case: both inputs are required. The light reactions still produce ATP/NADPH, but glucose cannot be synthesized without CO₂.' },
    ],
  },
  {
    id: 'c2', subject: 'Physics', title: 'Newton\'s Third Law',
    explanation: 'Newton\'s Third Law states that for every action, there is an equal and opposite reaction. When object A exerts a force on object B, object B simultaneously exerts a force equal in magnitude but opposite in direction on object A. These forces act on different objects — they never cancel each other out.',
    questions: [
      { question: '"If I push a wall and it pushes back equally, why doesn\'t it move?"', level: 'basic', options: [
        'The wall is too heavy to push.',
        'The wall pushes back harder than you push.',
        'The wall\'s reaction force acts on YOU, not on the wall. The wall doesn\'t move because other forces (friction with the ground, its structure) keep it stationary.',
        'Newton\'s Third Law only works with moving objects.',
      ], correctOption: 2, explanation: 'Key insight: action-reaction forces act on different objects, and other forces determine motion.' },
      { question: '"If a truck hits a small car, the truck exerts more force, right?"', level: 'application', options: [
        'Yes, the bigger object always exerts more force.',
        'No — both experience exactly the same force. The car accelerates more because it has less mass (F=ma with same F, smaller m means larger a).',
        'The forces are equal but the truck is stronger.',
        'It depends on how fast they\'re going.',
      ], correctOption: 1, explanation: 'Application of Third Law: forces are equal, but different masses lead to different accelerations.' },
      { question: '"In space with no friction, if I push a box, do I also move?"', level: 'edge-case', options: [
        'No, you stay still and only the box moves.',
        'Yes! You push the box (action) and the box pushes you back (reaction). In space with no friction to hold you, you\'d float backward while the box moves forward.',
        'Only if the box is lighter than you.',
        'In space, Newton\'s laws don\'t apply.',
      ], correctOption: 1, explanation: 'In zero-friction space, the reaction force on you has no opposing friction, so both objects move.' },
    ],
  },
  {
    id: 'c3', subject: 'Math', title: 'Probability & Independent Events',
    explanation: 'Independent events are events where the outcome of one does not affect the outcome of another. For independent events, the probability of both occurring is the product of their individual probabilities: P(A and B) = P(A) × P(B). Example: two coin flips — getting heads on the first doesn\'t change the probability of heads on the second.',
    questions: [
      { question: '"I got heads 5 times in a row. Tails must be due next, right?"', level: 'basic', options: [
        'Yes, probability has to balance out eventually.',
        'You should bet on tails because it\'s overdue.',
        'No — each flip is independent. The coin has no memory. The probability of tails on flip 6 is still exactly 50%, regardless of previous results. This misconception is called the gambler\'s fallacy.',
        'After 5 heads, it\'s actually more likely to get heads again.',
      ], correctOption: 2, explanation: 'Addresses the gambler\'s fallacy: independent events don\'t "remember" previous outcomes.' },
      { question: '"What\'s the chance of rolling a 6 on two dice simultaneously?"', level: 'application', options: [
        '1/6 because each die has a 1/6 chance.',
        'P(6 on die A) × P(6 on die B) = 1/6 × 1/6 = 1/36. Since the dice are independent, we multiply their individual probabilities.',
        '2/6 because there are two dice.',
        '1/12 because you add the probabilities.',
      ], correctOption: 1, explanation: 'Correct application of the multiplication rule for independent events.' },
      { question: '"If I draw a card and don\'t put it back, is the next draw independent?"', level: 'edge-case', options: [
        'Yes, cards are always independent like coins.',
        'No — drawing without replacement changes the remaining deck. The second draw\'s probability depends on what was drawn first. This is a dependent event, not independent. For example, if you drew an ace, the probability of drawing another ace decreases.',
        'It doesn\'t matter whether you replace the card or not.',
        'Only if you shuffle between draws.',
      ], correctOption: 1, explanation: 'Critical distinction: sampling without replacement creates dependent events.' },
    ],
  },
  {
    id: 'c4', subject: 'Chemistry', title: 'States of Matter',
    explanation: 'Matter exists in three common states: solid, liquid, and gas. In solids, particles are tightly packed and vibrate in fixed positions. In liquids, particles are close but flow past each other. In gases, particles are far apart and move freely. Temperature and pressure determine which state matter is in — adding energy (heat) causes transitions from solid → liquid → gas.',
    questions: [
      { question: '"Why does ice float in water? Isn\'t solid heavier?"', level: 'basic', options: [
        'Ice is lighter because it\'s frozen.',
        'Ice floats because water is unusual — when it freezes, its molecules form a crystal structure with more space between them, making ice LESS dense than liquid water. Most solids are denser than their liquid form, but water is an exception.',
        'Ice doesn\'t actually float, it just looks like it does.',
        'Because ice has air bubbles inside.',
      ], correctOption: 1, explanation: 'Water\'s unique property: ice is less dense due to hydrogen bonding creating an open crystal lattice.' },
      { question: '"Can something be a solid and a gas at the same time?"', level: 'application', options: [
        'No, matter can only be in one state at a time.',
        'Yes, through sublimation: some substances can go directly from solid to gas without becoming liquid. Dry ice (solid CO₂) is a great example — it "smokes" because it sublimes directly to gas at room temperature.',
        'Only in outer space.',
        'Yes, everything is all three states at once.',
      ], correctOption: 1, explanation: 'Sublimation demonstrates direct solid-to-gas transition; this is an application of phase transitions.' },
      { question: '"What about plasma? Is that a state of matter too?"', level: 'edge-case', options: [
        'Plasma isn\'t real matter.',
        'Plasma is just very hot gas, not a separate state.',
        'Yes! Plasma is often called the fourth state of matter. It forms when gas is superheated and electrons are stripped from atoms, creating an ionized gas. It behaves differently from regular gas — it conducts electricity and responds to magnetic fields. Stars, lightning, and neon signs contain plasma.',
        'Plasma only exists in science fiction.',
      ], correctOption: 2, explanation: 'Plasma is the fourth state: ionized gas with unique electromagnetic properties.' },
    ],
  },
  {
    id: 'c5', subject: 'Geography', title: 'Tectonic Plates',
    explanation: 'Earth\'s outer shell (lithosphere) is divided into large pieces called tectonic plates that float on the semi-fluid asthenosphere below. These plates move due to convection currents in the mantle. Where plates meet, they can collide (convergent), pull apart (divergent), or slide past each other (transform). These boundaries cause earthquakes, volcanoes, and mountain formation.',
    questions: [
      { question: '"If plates are always moving, why can\'t I feel it?"', level: 'basic', options: [
        'The plates don\'t actually move — it\'s just a theory.',
        'They move too slowly for us to feel — typically 1-10 centimeters per year, about the speed your fingernails grow. Over millions of years, though, this movement reshapes continents.',
        'You can feel it, but only during earthquakes.',
        'The plates only move deep underground, not at the surface.',
      ], correctOption: 1, explanation: 'The key is scale: extremely slow movement (cm/year) is imperceptible but transformative over geological time.' },
      { question: '"Why is the Ring of Fire so earthquake-prone?"', level: 'application', options: [
        'Because that region has weaker rock.',
        'The Ring of Fire encircles the Pacific Plate, which is surrounded by convergent and subduction boundaries. The Pacific Plate is diving beneath neighboring plates at these boundaries, creating intense geological activity — both earthquakes and volcanic eruptions.',
        'Because the ocean water makes the ground weaker.',
        'It\'s just a coincidence that many volcanoes are arranged in a ring.',
      ], correctOption: 1, explanation: 'Application: the Ring of Fire demonstrates how plate boundaries create geological hotspots.' },
      { question: '"Could a new ocean form between two continents?"', level: 'edge-case', options: [
        'No, oceans have always been where they are.',
        'Only if a meteor hits and creates a new basin.',
        'Yes! It\'s actually happening right now. The East African Rift is a divergent boundary splitting the African plate. In millions of years, eastern Africa will separate, and ocean water will fill the widening gap — creating a new ocean, similar to how the Atlantic formed when the Americas split from Europe and Africa.',
        'New oceans can only form at the poles.',
      ], correctOption: 2, explanation: 'Edge case: active rifting in East Africa is literally creating a future ocean.' },
    ],
  },
  {
    id: 'c6', subject: 'Computer Science', title: 'Binary Number System',
    explanation: 'Computers use binary (base-2), which has only two digits: 0 and 1. Each binary digit (bit) represents a power of 2. For example, 1011 in binary = 1×8 + 0×4 + 1×2 + 1×1 = 11 in decimal. Binary exists because digital circuits have two states: on (1) and off (0). Everything in a computer — text, images, music — is encoded in binary.',
    questions: [
      { question: '"Why can\'t computers just use normal numbers?"', level: 'basic', options: [
        'Computers are too simple to understand normal numbers.',
        'Computer circuits are built from transistors that have two states: ON and OFF. Binary perfectly maps to this: 1=ON, 0=OFF. Using more states would make circuits unreliable — it\'s easier to tell if a switch is on or off than to measure exact voltage levels.',
        'They could, but binary was invented first.',
        'Normal numbers take too much memory.',
      ], correctOption: 1, explanation: 'Root cause: digital electronics are binary by nature (on/off states).' },
      { question: '"How does a computer show the letter A using just 0s and 1s?"', level: 'application', options: [
        'It draws the letter pixel by pixel randomly.',
        'Each letter is assigned a number using a code like ASCII. \'A\' = 65 in decimal = 01000001 in binary. The computer stores this number, and when displaying text, it looks up which shape to draw for that number.',
        'Computers don\'t actually use binary for text.',
        'The letter A is stored as a picture file.',
      ], correctOption: 1, explanation: 'Application: character encoding (ASCII/Unicode) maps binary numbers to letters.' },
      { question: '"Could a computer work with base-3 instead of base-2?"', level: 'edge-case', options: [
        'No, computers can only work in binary.',
        'Theoretically yes! Ternary (base-3) computers have been researched — they would use three states instead of two. Russia built a ternary computer (Setun) in 1958. However, binary won because two-state circuits are simpler, cheaper, and more reliable to manufacture at scale.',
        'Base-3 would be exactly the same as binary.',
        'Only quantum computers can use other bases.',
      ], correctOption: 1, explanation: 'Historical edge case: ternary computing exists but binary won due to practical engineering advantages.' },
    ],
  },
  {
    id: 'c7', subject: 'Economics', title: 'Supply and Demand',
    explanation: 'Supply and demand is the fundamental model of how prices are set in a market. When demand for a product increases (more people want it) and supply stays the same, prices go up. When supply increases (more is available) and demand stays the same, prices go down. The equilibrium price is where supply equals demand — the quantity sellers want to sell matches what buyers want to buy.',
    questions: [
      { question: '"If everyone wants a toy, why not just make more?"', level: 'basic', options: [
        'Companies don\'t want to make more because they like high prices.',
        'Increasing production takes time and costs money. Factories need raw materials, workers, and equipment. In the short term, supply is limited, so high demand drives prices up. Over time, companies DO increase production, which brings prices back down — this is the market adjusting.',
        'They always make enough for everyone.',
        'Making more doesn\'t affect the price.',
      ], correctOption: 1, explanation: 'Key insight: short-term supply constraints vs. long-term adjustment to equilibrium.' },
      { question: '"Why are concert tickets so expensive on resale sites?"', level: 'application', options: [
        'Because resellers are greedy.',
        'The venue set a price below market equilibrium (more people want tickets than available). Resellers exploit this gap — they buy at the low original price and sell at the higher market price where supply meets actual demand.',
        'Concert tickets are always expensive.',
        'Because the concert is too good.',
      ], correctOption: 1, explanation: 'Application: price arbitrage when initial price is below equilibrium creates resale markets.' },
      { question: '"Could a product be really useful but have a low price?"', level: 'edge-case', options: [
        'No, useful things are always expensive.',
        'Price depends on popularity, not usefulness.',
        'Yes! This is called the diamond-water paradox. Water is essential for life but cheap because supply is abundant. Diamonds are less useful but expensive because supply is scarce. Price depends on supply AND demand, not just how useful something is. Marginal utility also plays a role.',
        'Only if the government controls the price.',
      ], correctOption: 2, explanation: 'The diamond-water paradox: price reflects scarcity and marginal utility, not total usefulness.' },
    ],
  },
  {
    id: 'c8', subject: 'History', title: 'The Industrial Revolution',
    explanation: 'The Industrial Revolution (1760-1840) was a period of major technological, social, and economic change. It began in Britain with mechanization of textile production, powered by steam engines. Factories replaced cottage industries, urbanization accelerated as people moved to cities for work, and new transportation (railways, steamships) connected the world. It also brought challenges: child labor, pollution, and harsh working conditions.',
    questions: [
      { question: '"Why did the Industrial Revolution start in Britain?"', level: 'basic', options: [
        'Britain was the smartest country.',
        'Britain had a unique combination of factors: abundant coal and iron deposits, a strong navy protecting trade routes, political stability, available capital from colonial trade, and a culture of innovation. No single factor — it was the convergence of resources, economy, and culture.',
        'It was random — could have started anywhere.',
        'Because Britain had the biggest army.',
      ], correctOption: 1, explanation: 'Multiple converging factors, not a single cause — a key historical analysis skill.' },
      { question: '"Were factories good or bad for people?"', level: 'application', options: [
        'Completely good — they created jobs and wealth.',
        'Completely bad — they exploited workers and polluted.',
        'Both. Factories increased productivity and wages over time, lifting millions from poverty. But initially, conditions were terrible: 16-hour days, child labor, dangerous machines, no safety laws. It took decades of reforms (labor laws, unions, regulations) to improve conditions. The answer depends on the time period and who you ask.',
        'Factories only helped the rich.',
      ], correctOption: 2, explanation: 'Nuanced analysis: acknowledging both benefits and harms with historical context.' },
      { question: '"Could a second Industrial Revolution happen today?"', level: 'edge-case', options: [
        'No, the Industrial Revolution was a one-time event.',
        'Many historians argue we\'re in one right now! The Digital Revolution (computers, internet, AI) is transforming society similarly: changing how we work, communicate, and live. Some call it the Fourth Industrial Revolution. Like the original, it brings both opportunities (global connectivity) and challenges (job displacement, privacy concerns).',
        'Only in developing countries.',
        'Technology has peaked and can\'t advance further.',
      ], correctOption: 1, explanation: 'Drawing parallels between historical and modern transformations.' },
    ],
  },
  {
    id: 'c9', subject: 'Biology', title: 'Natural Selection',
    explanation: 'Natural selection is the mechanism of evolution. In every population, individuals have random variations in traits. Some traits help an organism survive and reproduce better in its environment (fitness). Those organisms pass on their advantageous traits to offspring. Over many generations, the population shifts toward those beneficial traits. This isn\'t a conscious choice — it\'s a statistical process.',
    questions: [
      { question: '"So animals choose to evolve?"', level: 'basic', options: [
        'Yes, they decide what features they need.',
        'No! Evolution isn\'t a choice. Random mutations create variation. The environment then "selects" which variations survive — organisms with beneficial traits are more likely to reproduce. It\'s like a filter, not a decision. No individual evolves; populations change over many generations.',
        'Only smart animals can evolve.',
        'Scientists make animals evolve in labs.',
      ], correctOption: 1, explanation: 'Critical misconception: evolution is not directed or intentional — it\'s a passive filtering process.' },
      { question: '"Why do some bacteria resist antibiotics?"', level: 'application', options: [
        'Bacteria learn to fight antibiotics over time.',
        'Among millions of bacteria, a few already have random mutations that make them resistant. When an antibiotic kills the non-resistant majority, only resistant bacteria survive and multiply. This is natural selection in action — the antibiotic is the selection pressure, and resistance is the advantageous trait.',
        'Antibiotics become weaker over time.',
        'Bacteria steal resistance from other organisms.',
      ], correctOption: 1, explanation: 'Real-world application of natural selection: antibiotic resistance as selection pressure + pre-existing variation.' },
      { question: '"If survival of the fittest works, why do peacock tails exist? They\'re huge and impractical!"', level: 'edge-case', options: [
        'Peacock tails aren\'t actually disadvantageous.',
        'Evolution made a mistake with peacocks.',
        'Great question! This is sexual selection — a form of natural selection where traits that attract mates are selected for, even if they reduce survival. A peacock with a magnificent tail shows it\'s strong enough to survive DESPITE the handicap, making it attractive. The mating advantage outweighs the predation risk.',
        'Peacocks will eventually evolve smaller tails.',
      ], correctOption: 2, explanation: 'Edge case: sexual selection can favor traits that seem counter to survival fitness.' },
    ],
  },
  {
    id: 'c10', subject: 'Philosophy', title: 'The Trolley Problem',
    explanation: 'The trolley problem is a thought experiment in ethics. A runaway trolley is heading toward five people tied to the tracks. You can pull a lever to divert it to another track, where only one person is tied. Do you pull the lever? Utilitarians say yes (save five, lose one = less harm). Deontologists may say no (actively causing someone\'s death is wrong regardless of outcome). It explores the conflict between consequences and duties.',
    questions: [
      { question: '"Just save five people, obviously. Why is this hard?"', level: 'basic', options: [
        'You\'re right, it\'s not hard at all. Always save more people.',
        'It seems obvious, but consider: by pulling the lever, YOU actively cause the one person\'s death. Without your action, they\'d live. The question isn\'t about math — it\'s about whether it\'s morally acceptable to actively kill one person to save five. There\'s a difference between letting something happen and making it happen.',
        'Some people just don\'t want to make decisions.',
        'The answer depends on who the five people are.',
      ], correctOption: 1, explanation: 'The distinction between action and inaction is the core ethical tension.' },
      { question: '"What if the one person on the other track is a doctor who saves lives?"', level: 'application', options: [
        'Then definitely don\'t switch — the doctor is more valuable.',
        'This version asks: should we value lives differently? A pure utilitarian might calculate that the doctor saves more lives over time, so don\'t switch. But this leads to uncomfortable conclusions — it means some lives are worth more than others. Most ethical frameworks reject ranking human lives by their utility.',
        'The profession doesn\'t matter.',
        'Always save the most people regardless.',
      ], correctOption: 1, explanation: 'Application: introducing a variable that tests whether we should assign different values to lives.' },
      { question: '"What if instead of a lever, you had to push a person off a bridge to stop the trolley?"', level: 'edge-case', options: [
        'Same thing — it saves five people.',
        'This is the "fat man" variant, and it changes most people\'s intuition dramatically! Even people who\'d pull the lever often refuse to push someone. Logically the math is the same (sacrifice one to save five), but physically pushing someone feels like murder while pulling a lever feels more detached. This reveals that our moral intuitions aren\'t purely logical.',
        'Pushing someone is illegal, so the question is invalid.',
        'You should never interfere in any version.',
      ], correctOption: 1, explanation: 'Edge case: same utilitarian math but different moral intuitions — reveals our ethical inconsistencies.' },
    ],
  },
  {
    id: 'c11', subject: 'Music', title: 'Musical Scales and Keys',
    explanation: 'A musical scale is a set of notes arranged in ascending or descending order. The most common is the major scale (do-re-mi-fa-sol-la-ti-do), which uses a specific pattern of whole and half steps: W-W-H-W-W-W-H. A key is based on a specific scale — C Major uses all white keys on a piano. Minor scales sound "sadder" and use a different step pattern. Keys help musicians stay in harmony.',
    questions: [
      { question: '"Why do some songs sound happy and others sound sad?"', level: 'basic', options: [
        'Happy songs are faster and sad songs are slower.',
        'It\'s mostly about major vs. minor keys. Major keys use intervals that our brains perceive as bright and resolved. Minor keys use flatter intervals that sound tense or melancholic. This isn\'t just cultural — research shows even people with no musical training associate major with happiness and minor with sadness.',
        'It depends on the lyrics, not the music.',
        'All music sounds the same if you listen carefully.',
      ], correctOption: 1, explanation: 'Major vs. minor tonality creates the fundamental emotional quality of music.' },
      { question: '"Can you play a major scale starting on any note?"', level: 'application', options: [
        'No, it only works starting on C.',
        'Yes! That\'s exactly how different keys work. If you follow the same pattern (W-W-H-W-W-W-H) starting from any note, you get a major scale in that key. Starting from G gives you G Major, which needs one sharp (F#) to maintain the pattern. This is why different keys have different sharps and flats.',
        'Only on piano, not on other instruments.',
        'You can, but it will sound wrong.',
      ], correctOption: 1, explanation: 'The interval pattern is transposable — this is how keys and key signatures work.' },
      { question: '"Why can some notes sound good together while others clash?"', level: 'edge-case', options: [
        'It\'s random — you just have to memorize which ones go together.',
        'Notes that sound good together have simple frequency ratios. An octave is 2:1, a perfect fifth is 3:2. These simple ratios create consonance. Dissonant notes have complex ratios that create "beating" — subtle clashing vibrations. Interestingly, what sounds dissonant vs. consonant has shifted throughout music history; medieval listeners found some intervals unpleasant that we now consider beautiful.',
        'All notes sound good together if played loud enough.',
        'Only notes in the same key can sound good together.',
      ], correctOption: 1, explanation: 'Physics of frequency ratios + cultural evolution of consonance perception.' },
    ],
  },
  {
    id: 'c12', subject: 'Environmental Science', title: 'The Greenhouse Effect',
    explanation: 'The greenhouse effect is a natural process that warms Earth\'s surface. The sun\'s energy passes through the atmosphere and heats the ground. The ground emits infrared (heat) radiation back up. Greenhouse gases (CO₂, methane, water vapor) absorb some of this infrared radiation and re-emit it in all directions, including back toward the surface. This "blanket effect" keeps Earth about 33°C warmer than it would be otherwise. Human activities have increased greenhouse gas concentrations, intensifying this effect.',
    questions: [
      { question: '"Isn\'t the greenhouse effect a bad thing?"', level: 'basic', options: [
        'Yes, the greenhouse effect is entirely harmful.',
        'The natural greenhouse effect is actually essential! Without it, Earth would be about -18°C — too cold for life. The PROBLEM is the enhanced greenhouse effect: humans burning fossil fuels have added extra CO₂, trapping more heat than normal and causing global warming. The greenhouse effect itself is good; too much of it is dangerous.',
        'No, it\'s completely beneficial.',
        'The greenhouse effect doesn\'t exist.',
      ], correctOption: 1, explanation: 'Distinguishing between the natural (necessary) greenhouse effect and the enhanced (problematic) one.' },
      { question: '"Why does my car get hot inside on a sunny day?"', level: 'application', options: [
        'Sun heats the metal and it conducts heat inside.',
        'Similar principle to the greenhouse effect! Sunlight (short wavelength) passes through glass. Inside, surfaces absorb it and emit infrared (longer wavelength). Glass is partially opaque to infrared, trapping heat inside. Same concept as greenhouse gases trapping infrared in the atmosphere.',
        'Hot air rises into the car from the road.',
        'Cars are designed to absorb heat for winter warmth.',
      ], correctOption: 1, explanation: 'Direct analogy: glass in cars blocks infrared just like greenhouse gases in the atmosphere.' },
      { question: '"Mars has CO₂ in its atmosphere. Why is it cold?"', level: 'edge-case', options: [
        'Mars is just too far from the sun.',
        'Mars\'s atmosphere is about 95% CO₂, but it\'s incredibly thin — about 1% of Earth\'s atmospheric pressure. The greenhouse effect depends on BOTH the type of gas AND the amount. Mars has the right gas but not enough atmospheric mass to trap significant heat. Atmosphere density matters as much as composition.',
        'CO₂ only causes warming on Earth.',
        'Mars was once warm but its greenhouse effect stopped working.',
      ], correctOption: 1, explanation: 'Edge case: greenhouse warming depends on atmospheric density, not just composition.' },
    ],
  },
]

// ─── Config ───────────────────────────────────────────────────

function getConfig(difficulty: GameDifficulty) {
  switch (difficulty) {
    case 'medium':
      return { sessionCount: 4, pointsPerQuestion: 25 }
    case 'hard':
      return { sessionCount: 4, pointsPerQuestion: 30 }
    case 'extreme':
      return { sessionCount: 4, pointsPerQuestion: 35 }
    default:
      return { sessionCount: 4, pointsPerQuestion: 25 }
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

export default function TeachBackChallenge({
  difficulty,
  onScoreUpdate,
  onGameOver,
  isPaused,
}: TeachBackChallengeProps) {
  const config = useMemo(() => getConfig(difficulty), [difficulty])
  const concepts = useMemo(() => shuffle(ALL_CONCEPTS).slice(0, config.sessionCount), [config.sessionCount])

  const [conceptIndex, setConceptIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(-1) // -1 = reading phase
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [sessionResults, setSessionResults] = useState<boolean[]>([])
  const [allScores, setAllScores] = useState<{ correct: number; total: number; score: number }[]>([])
  const [gameFinished, setGameFinished] = useState(false)

  const currentConcept = concepts[conceptIndex]
  const currentQuestion = questionIndex >= 0 ? currentConcept?.questions[questionIndex] : null
  const maxScore = concepts.reduce((a, c) => a + c.questions.length * config.pointsPerQuestion, 0)

  const handleStartTeaching = useCallback(() => {
    if (isPaused) return
    setQuestionIndex(0)
  }, [isPaused])

  const handleSelectAnswer = useCallback((optionIndex: number) => {
    if (isPaused || showFeedback) return
    setSelectedAnswer(optionIndex)
    setShowFeedback(true)

    const isCorrect = optionIndex === currentQuestion?.correctOption
    setSessionResults((prev) => [...prev, isCorrect])
  }, [isPaused, showFeedback, currentQuestion])

  const handleNextQuestion = useCallback(() => {
    setSelectedAnswer(null)
    setShowFeedback(false)

    if (questionIndex + 1 >= currentConcept.questions.length) {
      // Finish this concept
      const correct = sessionResults.filter(Boolean).length
      const total = currentConcept.questions.length
      const score = correct * config.pointsPerQuestion

      const newScores = [...allScores, { correct, total, score }]
      setAllScores(newScores)

      const totalSoFar = newScores.reduce((a, b) => a + b.score, 0)
      onScoreUpdate(totalSoFar, maxScore)

      if (conceptIndex + 1 >= concepts.length) {
        setGameFinished(true)
        onGameOver(totalSoFar, maxScore)
      } else {
        setConceptIndex((i) => i + 1)
        setQuestionIndex(-1)
        setSessionResults([])
      }
    } else {
      setQuestionIndex((i) => i + 1)
    }
  }, [questionIndex, currentConcept, sessionResults, config, allScores, maxScore, onScoreUpdate, conceptIndex, concepts.length, onGameOver])

  if (!currentConcept && !gameFinished) return null

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-5">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {concepts.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all',
              i < conceptIndex && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
              i === conceptIndex && !gameFinished && 'border-amber-500/50 bg-amber-500/15 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]',
              i > conceptIndex && 'border-white/10 bg-white/5 text-white/20',
              gameFinished && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
            )}
          >
            {i < allScores.length ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
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
          <p className="text-xl font-bold text-white">Teaching Complete!</p>
          <p className="text-sm text-white/60">
            Total Score: {allScores.reduce((a, b) => a + b.score, 0)} / {maxScore}
          </p>
          {allScores.map((s, i) => (
            <div key={i} className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-xs text-white/60"><BookOpen className="mr-1 inline h-3 w-3" /> {concepts[i]?.title}</span>
              <div className="flex gap-3 text-xs">
                <span className="text-cyan-300">{s.correct}/{s.total} correct</span>
                <span className="font-bold text-amber-400">{s.score} pts</span>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentConcept.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full flex-col gap-4"
          >
            {/* Concept header */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                <GraduationCap className="h-4 w-4" />
                Teaching Session {conceptIndex + 1}: {currentConcept.title}
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/50">{currentConcept.subject}</span>
              </div>
            </div>

            {/* Reading phase */}
            {questionIndex === -1 && (
              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white/50">
                    <BookOpen className="h-3 w-3" />
                    Read and understand this concept:
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">{currentConcept.explanation}</p>
                </div>

                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <p className="text-xs text-cyan-300">
                    <UserRound className="mr-1 inline h-4 w-4 text-cyan-300" /> A virtual student is about to ask you {currentConcept.questions.length} questions about this concept.
                    Choose the best explanation for each!
                  </p>
                </div>

                <button
                  onClick={handleStartTeaching}
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-500"
                >
                  <MessageCircle className="h-4 w-4" />
                  Start Teaching
                </button>
              </div>
            )}

            {/* Question phase */}
            {currentQuestion && (
              <div className="flex flex-col gap-4">
                {/* Question badge */}
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-bold',
                    currentQuestion.level === 'basic' && 'bg-emerald-500/20 text-emerald-300',
                    currentQuestion.level === 'application' && 'bg-amber-500/20 text-amber-300',
                    currentQuestion.level === 'edge-case' && 'bg-red-500/20 text-red-300',
                  )}>
                    {currentQuestion.level === 'basic' ? <><Lightbulb className="mr-1 inline h-3 w-3" /> Basic Understanding</> : currentQuestion.level === 'application' ? <><Wrench className="mr-1 inline h-3 w-3" /> Application</> : <><Zap className="mr-1 inline h-3 w-3" /> Edge Case</>}
                  </span>
                  <span className="text-[10px] text-white/30">Q{questionIndex + 1}/{currentConcept.questions.length}</span>
                </div>

                {/* Student question */}
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl"><UserRound className="h-6 w-6 text-cyan-300" /></span>
                    <p className="text-sm text-white/80">{currentQuestion.question}</p>
                  </div>
                </div>

                {/* Options */}
                <div className="flex flex-col gap-2">
                  {currentQuestion.options.map((opt, i) => {
                    const isSelected = selectedAnswer === i
                    const isCorrect = i === currentQuestion.correctOption
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelectAnswer(i)}
                        disabled={showFeedback}
                        className={cn(
                          'rounded-xl border px-4 py-3 text-left text-xs transition-all',
                          !showFeedback && !isSelected && 'border-white/10 bg-white/5 text-white/60 hover:border-white/20',
                          !showFeedback && isSelected && 'border-amber-500/40 bg-amber-500/15 text-amber-200',
                          showFeedback && isCorrect && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200',
                          showFeedback && isSelected && !isCorrect && 'border-red-500/40 bg-red-500/15 text-red-200',
                          showFeedback && !isSelected && !isCorrect && 'border-white/5 bg-white/3 text-white/30',
                        )}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'rounded-xl border p-4',
                      selectedAnswer === currentQuestion.correctOption
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-red-500/20 bg-red-500/5',
                    )}
                  >
                    <p className={cn(
                      'text-xs font-bold',
                      selectedAnswer === currentQuestion.correctOption ? 'text-emerald-300' : 'text-red-300',
                    )}>
                      {selectedAnswer === currentQuestion.correctOption ? '✓ Excellent explanation!' : '✗ Not the best approach'}
                    </p>
                    <p className="mt-1 text-[10px] text-white/50">{currentQuestion.explanation}</p>

                    <button
                      onClick={handleNextQuestion}
                      className="mt-3 flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs font-bold text-white/80 transition-all hover:bg-white/15"
                    >
                      {questionIndex + 1 >= currentConcept.questions.length
                        ? (conceptIndex + 1 >= concepts.length ? 'Finish' : 'Next Concept')
                        : 'Next Question'}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
