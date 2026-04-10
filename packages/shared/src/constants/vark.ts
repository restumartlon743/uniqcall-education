import type { VarkTag } from '../types/enums';

export interface VarkStyleDescription {
  tag: VarkTag;
  name: string;
  name_id: string;
  description: string;
  learning_preferences: string[];
  ideal_content_types: string[];
}

export const VARK_STYLES: readonly VarkStyleDescription[] = [
  {
    tag: 'V',
    name: 'Visual',
    name_id: 'Visual',
    description:
      'Learns best through seeing. Prefers diagrams, charts, maps, videos, and visual representations of information.',
    learning_preferences: [
      'Diagrams and flowcharts',
      'Color-coded notes',
      'Videos and animations',
      'Mind maps',
      'Infographics',
    ],
    ideal_content_types: ['video', 'practice'],
  },
  {
    tag: 'A',
    name: 'Aural/Auditory',
    name_id: 'Auditori',
    description:
      'Learns best through hearing. Prefers lectures, discussions, podcasts, and verbal explanations.',
    learning_preferences: [
      'Lectures and discussions',
      'Podcasts and audio books',
      'Group discussions',
      'Verbal repetition',
      'Mnemonics and rhymes',
    ],
    ideal_content_types: ['audio', 'video'],
  },
  {
    tag: 'R',
    name: 'Read/Write',
    name_id: 'Baca/Tulis',
    description:
      'Learns best through reading and writing. Prefers textbooks, articles, note-taking, and written assignments.',
    learning_preferences: [
      'Textbooks and articles',
      'Written notes and summaries',
      'Lists and definitions',
      'Written assignments',
      'Research papers',
    ],
    ideal_content_types: ['text'],
  },
  {
    tag: 'K',
    name: 'Kinesthetic',
    name_id: 'Kinestetik',
    description:
      'Learns best through hands-on experience. Prefers experiments, simulations, building, and physical activities.',
    learning_preferences: [
      'Hands-on experiments',
      'Simulations and role play',
      'Building models',
      'Field trips',
      'Physical movement while learning',
    ],
    ideal_content_types: ['practice'],
  },
] as const;

export const VARK_TAGS: readonly VarkTag[] = ['V', 'A', 'R', 'K'] as const;

export const VARK_QUESTION_COUNT = 16;

export const VARK_BY_TAG = Object.fromEntries(
  VARK_STYLES.map((s) => [s.tag, s]),
) as Record<VarkTag, VarkStyleDescription>;
