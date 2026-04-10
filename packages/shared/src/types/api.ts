import type {
  ArchetypeCode,
  AssessmentType,
  KnowledgeField,
  VarkTag,
} from './enums';
import type {
  Archetype,
  Badge,
  CareerRoadmap,
  CognitiveParams,
  DailyMission,
  LearningContent,
  Major,
  Profile,
  Student,
  StudentBadge,
  VarkProfile,
} from './database';

// ─── Generic API Response ────────────────────────────────────

export type ApiResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: string };

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  page_size: number;
};

// ─── Assessment API ──────────────────────────────────────────

export interface StartAssessmentRequest {
  type: AssessmentType;
}

export interface StartAssessmentResponse {
  session_id: string;
  type: AssessmentType;
  total_questions: number;
  first_question_id: string;
}

export interface SubmitAnswerRequest {
  session_id: string;
  question_id: string;
  answer: string;
  time_spent_seconds: number;
}

export interface SubmitAnswerResponse {
  next_question_id: string | null;
  progress: number;
  is_last: boolean;
}

export interface CompleteAssessmentRequest {
  session_id: string;
}

export interface CompleteAssessmentResponse {
  type: AssessmentType;
  results: CognitiveParams | VarkProfile;
  archetype?: Archetype;
}

// ─── Teacher API ─────────────────────────────────────────────

export interface ClassSummaryResponse {
  class_id: string;
  class_name: string;
  total_students: number;
  assessed_students: number;
  avg_mastery_level: number;
  avg_xp: number;
  archetype_distribution: Record<ArchetypeCode, number>;
  students_needing_attention: number;
  top_knowledge_field: KnowledgeField | null;
}

export interface StudentRosterItem {
  id: string;
  full_name: string;
  avatar_url: string | null;
  archetype_code: ArchetypeCode | null;
  archetype_name: string | null;
  mastery_level: number;
  total_xp: number;
  current_streak: number;
  vark_dominant: VarkTag | null;
  needs_attention: boolean;
  last_active_at: string | null;
}

export interface StudentDetailResponse {
  profile: Profile;
  student: Student;
  archetype: Archetype | null;
  cognitive_params: CognitiveParams | null;
  vark_profile: VarkProfile | null;
  recent_badges: StudentBadge[];
  recent_missions: DailyMission[];
  xp_history: Array<{ date: string; amount: number }>;
  streak_history: Array<{ date: string; active: boolean }>;
  suggested_interventions: string[];
}

// ─── Parent API ──────────────────────────────────────────────

export interface WeeklyHighlightsResponse {
  student_id: string;
  student_name: string;
  highlights: Array<{
    type: 'badge' | 'streak' | 'mission' | 'xp_milestone';
    title: string;
    description: string;
    earned_at: string;
  }>;
  week_start: string;
  week_end: string;
}

export interface GrowthSnapshotResponse {
  student_id: string;
  current_params: CognitiveParams;
  param_history: Array<{
    date: string;
    params: CognitiveParams;
  }>;
  mastery_level: number;
  total_xp: number;
  archetype: Archetype | null;
}

// ─── Career API ──────────────────────────────────────────────

export interface CareerRoadmapResponse {
  roadmap: CareerRoadmap;
  archetype: Archetype;
  majors: Array<Major & { relevance_score: number }>;
  quest_progress: number;
  total_quest_nodes: number;
}

// ─── Student Dashboard ──────────────────────────────────────

export interface StudentDashboardResponse {
  profile: Profile;
  student: Student;
  archetype: Archetype | null;
  today_missions: DailyMission[];
  recent_badges: Array<Badge & { earned_at: string }>;
  xp_today: number;
  level_progress: {
    current_level: number;
    current_xp: number;
    xp_for_next_level: number;
    title: string;
  };
}

// ─── Content API ─────────────────────────────────────────────

export interface AdaptiveContentResponse {
  content: LearningContent[];
  recommended_vark: VarkTag;
  total: number;
}
