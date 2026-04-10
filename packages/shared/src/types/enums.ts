// ─── User & Auth ──────────────────────────────────────────────
export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

// ─── Assessment ───────────────────────────────────────────────
export type AssessmentType = 'cognitive' | 'vark';
export type AssessmentStatus = 'in_progress' | 'completed' | 'expired';

// ─── Content ──────────────────────────────────────────────────
export type ContentType = 'video' | 'audio' | 'text' | 'practice';
export type VarkTag = 'V' | 'A' | 'R' | 'K';

// ─── Archetype ────────────────────────────────────────────────
export type ArchetypeCluster =
  | 'LOGICAL_SYSTEMIC'
  | 'CREATIVE_EXPRESSIVE'
  | 'SOCIAL_HUMANITARIAN';

export type KnowledgeField =
  | 'ALAM'
  | 'SOSIAL'
  | 'HUMANIORA'
  | 'AGAMA'
  | 'SENI';

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
  | 'VISIONARY';

// ─── Cognitive ────────────────────────────────────────────────
export type CognitiveParam =
  | 'analytical'
  | 'creative'
  | 'linguistic'
  | 'kinesthetic'
  | 'social'
  | 'observation'
  | 'intuition';

// ─── Gamification ─────────────────────────────────────────────
export type BadgeCategory =
  | 'cognitive'
  | 'streak'
  | 'project'
  | 'peer'
  | 'career';

export type QuestStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';

// ─── Tasks ────────────────────────────────────────────────────
export type TaskType = 'individual' | 'group';
export type SubmissionStatus = 'submitted' | 'reviewed' | 'revision_needed';

// ─── Missions ─────────────────────────────────────────────────
export type MissionStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

// ─── Notifications ────────────────────────────────────────────
export type NotificationType =
  | 'alert'
  | 'badge'
  | 'high_five'
  | 'mission'
  | 'report';

// ─── Peer Groups ──────────────────────────────────────────────
export type GroupRole = 'leader' | 'executor' | 'creative' | 'presenter';

// ─── XP Sources ───────────────────────────────────────────────
export type XpSource = 'mission' | 'task' | 'badge' | 'assessment';
