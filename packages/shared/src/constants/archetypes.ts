import type { ArchetypeCluster, ArchetypeCode, CognitiveParam, KnowledgeField } from '../types/enums';
import type { CognitiveParams } from '../types/database';

export interface ArchetypeDefinition {
  code: ArchetypeCode;
  name_en: string;
  name_id: string;
  cluster: ArchetypeCluster;
  dominant_params: CognitiveParams;
  description: string;
  behavior_traits: string[];
  recommended_majors: string[];
  recommended_professions: string[];
  knowledge_field: KnowledgeField;
}

export const COGNITIVE_PARAMS: readonly CognitiveParam[] = [
  'analytical',
  'creative',
  'linguistic',
  'kinesthetic',
  'social',
  'observation',
  'intuition',
] as const;

export const ARCHETYPES: readonly ArchetypeDefinition[] = [
  // ─── Cluster 1: Logical-Systemic ───────────────────────────
  {
    code: 'THINKER',
    name_en: 'The Thinker',
    name_id: 'Sang Pemikir',
    cluster: 'LOGICAL_SYSTEMIC',
    dominant_params: {
      analytical: 50,
      creative: 5,
      linguistic: 5,
      kinesthetic: 5,
      social: 5,
      observation: 15,
      intuition: 15,
    },
    description:
      'Deep theoretical thinker driven by logic, scientific laws, and abstract reasoning. Excels at dissecting complex problems into fundamental principles.',
    behavior_traits: [
      'Prefers working alone on complex problems',
      'Asks deep "why" questions consistently',
      'Enjoys theoretical debates and abstract concepts',
      'Methodical and detail-oriented approach',
    ],
    recommended_majors: ['Matematika', 'Fisika', 'Filsafat'],
    recommended_professions: [
      'Research Scientist',
      'Data Analyst',
      'University Professor',
      'Philosopher',
    ],
    knowledge_field: 'ALAM',
  },
  {
    code: 'ENGINEER',
    name_en: 'The Engineer',
    name_id: 'Sang Teknokrat',
    cluster: 'LOGICAL_SYSTEMIC',
    dominant_params: {
      analytical: 30,
      creative: 10,
      linguistic: 5,
      kinesthetic: 20,
      social: 5,
      observation: 20,
      intuition: 10,
    },
    description:
      'Systems builder who combines analytical thinking with hands-on execution. Thrives on assembling technical solutions and optimizing processes.',
    behavior_traits: [
      'Enjoys building and tinkering with things',
      'Thinks in systems and flowcharts',
      'Prefers practical over theoretical',
      'Strong troubleshooting instinct',
    ],
    recommended_majors: ['Teknik Mesin', 'Teknik Elektro', 'Informatika'],
    recommended_professions: [
      'Software Engineer',
      'Mechanical Engineer',
      'Systems Architect',
      'Product Developer',
    ],
    knowledge_field: 'ALAM',
  },
  {
    code: 'GUARDIAN',
    name_en: 'The Guardian',
    name_id: 'Sang Penjaga',
    cluster: 'LOGICAL_SYSTEMIC',
    dominant_params: {
      analytical: 25,
      creative: 5,
      linguistic: 10,
      kinesthetic: 5,
      social: 25,
      observation: 15,
      intuition: 15,
    },
    description:
      'Driven by justice, rules, and consistency. Combines analytical precision with social awareness to uphold fairness and order.',
    behavior_traits: [
      'Strong sense of right and wrong',
      'Values consistency and fairness',
      'Detail-oriented with documentation',
      'Advocates for others proactively',
    ],
    recommended_majors: ['Hukum', 'Akuntansi', 'Perpajakan'],
    recommended_professions: [
      'Lawyer',
      'Auditor',
      'Compliance Officer',
      'Judge',
    ],
    knowledge_field: 'SOSIAL',
  },
  {
    code: 'STRATEGIST',
    name_en: 'The Strategist',
    name_id: 'Sang Perencana',
    cluster: 'LOGICAL_SYSTEMIC',
    dominant_params: {
      analytical: 25,
      creative: 10,
      linguistic: 10,
      kinesthetic: 5,
      social: 20,
      observation: 10,
      intuition: 20,
    },
    description:
      'Long-term visionary who blends analytical planning with social insight and intuition. Natural leader who sees the big picture.',
    behavior_traits: [
      'Thinks several steps ahead',
      'Natural leader in group settings',
      'Enjoys planning and organizing',
      'Balances logic with gut feeling',
      'Sees connections others miss',
    ],
    recommended_majors: ['Manajemen', 'Hubungan Internasional', 'Ekonomi'],
    recommended_professions: [
      'Business Strategist',
      'Management Consultant',
      'Diplomat',
      'CEO / Founder',
    ],
    knowledge_field: 'SOSIAL',
  },

  // ─── Cluster 2: Creative-Expressive ────────────────────────
  {
    code: 'CREATOR',
    name_en: 'The Creator',
    name_id: 'Sang Pencipta',
    cluster: 'CREATIVE_EXPRESSIVE',
    dominant_params: {
      analytical: 10,
      creative: 35,
      linguistic: 10,
      kinesthetic: 10,
      social: 5,
      observation: 15,
      intuition: 15,
    },
    description:
      'Innovative mind driven by ideas and visual expression. Constantly generating new concepts, designs, and creative solutions.',
    behavior_traits: [
      'Always doodling or sketching ideas',
      'Sees visual solutions to problems',
      'Prefers open-ended assignments',
      'Energized by brainstorming sessions',
    ],
    recommended_majors: ['DKV', 'Animasi', 'Desain Produk'],
    recommended_professions: [
      'Graphic Designer',
      'UI/UX Designer',
      'Art Director',
      'Animator',
    ],
    knowledge_field: 'SENI',
  },
  {
    code: 'SHAPER',
    name_en: 'The Shaper',
    name_id: 'Sang Arsitek',
    cluster: 'CREATIVE_EXPRESSIVE',
    dominant_params: {
      analytical: 20,
      creative: 30,
      linguistic: 5,
      kinesthetic: 10,
      social: 5,
      observation: 20,
      intuition: 10,
    },
    description:
      'Merges artistic vision with technical precision. Creates physical spaces and structures that balance beauty with functionality.',
    behavior_traits: [
      'Notices spatial relationships instinctively',
      'Combines aesthetics with engineering logic',
      'Enjoys model-building and prototyping',
      'Detail-oriented in visual composition',
    ],
    recommended_majors: ['Arsitektur', 'Desain Interior', 'Teknik Sipil'],
    recommended_professions: [
      'Architect',
      'Interior Designer',
      'Urban Planner',
      'Industrial Designer',
    ],
    knowledge_field: 'SENI',
  },
  {
    code: 'STORYTELLER',
    name_en: 'The Storyteller',
    name_id: 'Sang Juru Bicara',
    cluster: 'CREATIVE_EXPRESSIVE',
    dominant_params: {
      analytical: 5,
      creative: 10,
      linguistic: 35,
      kinesthetic: 5,
      social: 25,
      observation: 10,
      intuition: 10,
    },
    description:
      'Inspires through narrative and communication. Masters language to connect, persuade, and move people emotionally.',
    behavior_traits: [
      'Excellent writer and public speaker',
      'Sees stories in everyday events',
      'Connects with diverse audiences easily',
      'Uses metaphors and analogies naturally',
      'Driven to share ideas with the world',
    ],
    recommended_majors: ['Komunikasi', 'Jurnalistik', 'Public Relations'],
    recommended_professions: [
      'Journalist',
      'Content Creator',
      'Public Relations Specialist',
      'Author',
      'Copywriter',
    ],
    knowledge_field: 'HUMANIORA',
  },
  {
    code: 'PERFORMER',
    name_en: 'The Performer',
    name_id: 'Sang Penghibur',
    cluster: 'CREATIVE_EXPRESSIVE',
    dominant_params: {
      analytical: 5,
      creative: 30,
      linguistic: 10,
      kinesthetic: 15,
      social: 15,
      observation: 10,
      intuition: 15,
    },
    description:
      'Expressive personality who thrives on stage and social energy. Combines creativity with physical presence and intuitive timing.',
    behavior_traits: [
      'Naturally draws attention in groups',
      'Expressive body language and voice',
      'Thrives under spotlight and pressure',
      'Energized by audience reactions',
    ],
    recommended_majors: ['Seni Musik', 'Teater', 'Broadcasting'],
    recommended_professions: [
      'Musician',
      'Actor',
      'Broadcaster',
      'Event Host',
      'Performing Artist',
    ],
    knowledge_field: 'SENI',
  },

  // ─── Cluster 3: Social-Humanitarian ────────────────────────
  {
    code: 'HEALER',
    name_en: 'The Healer',
    name_id: 'Sang Penyembuh',
    cluster: 'SOCIAL_HUMANITARIAN',
    dominant_params: {
      analytical: 10,
      creative: 5,
      linguistic: 10,
      kinesthetic: 5,
      social: 30,
      observation: 25,
      intuition: 15,
    },
    description:
      'Deeply empathetic individual driven by the desire to heal and restore. Combines keen observation with genuine care for others\u2019 wellbeing.',
    behavior_traits: [
      'Highly attuned to others\u2019 emotions',
      'Patient and compassionate listener',
      'Drawn to helping those in distress',
      'Observant of subtle behavioral cues',
      'Calm presence under pressure',
    ],
    recommended_majors: ['Kedokteran', 'Psikologi', 'Farmasi'],
    recommended_professions: [
      'Doctor',
      'Psychologist',
      'Pharmacist',
      'Counselor',
      'Nurse',
    ],
    knowledge_field: 'ALAM',
  },
  {
    code: 'DIPLOMAT',
    name_en: 'The Diplomat',
    name_id: 'Sang Diplomat',
    cluster: 'SOCIAL_HUMANITARIAN',
    dominant_params: {
      analytical: 5,
      creative: 5,
      linguistic: 25,
      kinesthetic: 5,
      social: 30,
      observation: 10,
      intuition: 20,
    },
    description:
      'Masterful mediator who navigates complex social landscapes. Uses language and intuition to bridge cultural divides and resolve conflict.',
    behavior_traits: [
      'Natural peacemaker in conflicts',
      'Adapts communication style to audience',
      'Understands cultural nuances',
      'Builds consensus across diverse groups',
    ],
    recommended_majors: ['Hubungan Internasional', 'Sosiologi', 'Ilmu Politik'],
    recommended_professions: [
      'Diplomat',
      'International Relations Specialist',
      'Mediator',
      'NGO Director',
      'Cultural Attaché',
    ],
    knowledge_field: 'SOSIAL',
  },
  {
    code: 'EXPLORER',
    name_en: 'The Explorer',
    name_id: 'Sang Penjelajah',
    cluster: 'SOCIAL_HUMANITARIAN',
    dominant_params: {
      analytical: 10,
      creative: 5,
      linguistic: 5,
      kinesthetic: 25,
      social: 5,
      observation: 30,
      intuition: 20,
    },
    description:
      'Adventurous discoverer driven by curiosity and field research. Combines sharp observation with physical exploration and intuitive pattern recognition.',
    behavior_traits: [
      'Restless curiosity about the world',
      'Prefers fieldwork over classroom',
      'Notices environmental details others miss',
      'Physically active and outdoors-oriented',
      'Thrives in unfamiliar environments',
    ],
    recommended_majors: ['Geografi', 'Biologi', 'Arkeologi'],
    recommended_professions: [
      'Field Researcher',
      'Geologist',
      'Marine Biologist',
      'Archaeologist',
      'Environmental Scientist',
    ],
    knowledge_field: 'ALAM',
  },
  {
    code: 'MENTOR',
    name_en: 'The Mentor',
    name_id: 'Sang Pembimbing',
    cluster: 'SOCIAL_HUMANITARIAN',
    dominant_params: {
      analytical: 20,
      creative: 5,
      linguistic: 25,
      kinesthetic: 5,
      social: 30,
      observation: 10,
      intuition: 5,
    },
    description:
      'Dedicated educator who guides others toward growth. Combines social warmth with analytical clarity and strong communication skills.',
    behavior_traits: [
      'Naturally explains complex ideas simply',
      'Patient and encouraging with learners',
      'Tracks individual progress of peers',
      'Finds joy in others\u2019 achievements',
    ],
    recommended_majors: ['Pendidikan', 'Psikologi Pendidikan', 'Bimbingan Konseling'],
    recommended_professions: [
      'Teacher',
      'Academic Counselor',
      'Corporate Trainer',
      'Education Consultant',
    ],
    knowledge_field: 'HUMANIORA',
  },
  {
    code: 'VISIONARY',
    name_en: 'The Visionary',
    name_id: 'Sang Visioner',
    cluster: 'SOCIAL_HUMANITARIAN',
    dominant_params: {
      analytical: 20,
      creative: 25,
      linguistic: 5,
      kinesthetic: 5,
      social: 5,
      observation: 10,
      intuition: 30,
    },
    description:
      'Future-oriented innovator who senses trends before they emerge. Blends intuition with creativity and analytical rigor to build what\u2019s next.',
    behavior_traits: [
      'Constantly imagining future scenarios',
      'Questions the status quo',
      'Connects seemingly unrelated domains',
      'Risk-tolerant and entrepreneurial',
      'Inspires others with ambitious ideas',
    ],
    recommended_majors: ['Startup / Bisnis', 'Futurisme', 'Teknologi Informasi'],
    recommended_professions: [
      'Startup Founder',
      'Innovation Consultant',
      'Futurist',
      'Venture Capitalist',
      'Technology Strategist',
    ],
    knowledge_field: 'SOSIAL',
  },
] as const;

export const ARCHETYPE_CODES: readonly ArchetypeCode[] = ARCHETYPES.map(
  (a) => a.code,
);

export const ARCHETYPE_BY_CODE = Object.fromEntries(
  ARCHETYPES.map((a) => [a.code, a]),
) as Record<ArchetypeCode, ArchetypeDefinition>;
