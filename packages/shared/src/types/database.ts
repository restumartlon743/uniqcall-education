import type {
  ArchetypeCluster,
  ArchetypeCode,
  AssessmentStatus,
  AssessmentType,
  BadgeCategory,
  CognitiveParam,
  ContentType,
  GroupRole,
  KnowledgeField,
  MissionStatus,
  NotificationType,
  QuestStatus,
  SubmissionStatus,
  TaskType,
  UserRole,
  VarkTag,
  XpSource,
} from './enums';

// ─── JSONB Typed Interfaces ──────────────────────────────────

export interface CognitiveParams {
  analytical: number;
  creative: number;
  linguistic: number;
  kinesthetic: number;
  social: number;
  observation: number;
  intuition: number;
}

export interface VarkProfile {
  V: number;
  A: number;
  R: number;
  K: number;
}

export interface VarkAdaptations {
  V: string;
  A: string;
  R: string;
  K: string;
}

export interface QuestionOption {
  key: string;
  text: string;
  media_url?: string;
}

export interface BadgeTriggerCondition {
  type: string;
  value?: number;
  module?: number;
}

export interface AvatarConfig {
  model: string;
  color_primary: string;
  color_secondary: string;
  accessories?: string[];
}

export interface RecommendedMajor {
  major_id: string;
  name: string;
  relevance_score: number;
}

export interface RecommendedProfession {
  name: string;
  description: string;
}

export interface NotificationData {
  entity_type?: string;
  entity_id?: string;
  [key: string]: unknown;
}

// ─── Core Tables ─────────────────────────────────────────────

export interface School {
  id: string;
  name: string;
  address: string | null;
  logo_url: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  avatar_url: string | null;
  school_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  class_id: string | null;
  archetype_id: string | null;
  vark_profile: VarkProfile | null;
  cognitive_params: CognitiveParams | null;
  mastery_level: number;
  total_xp: number;
  current_streak: number;
  best_streak: number;
  onboarding_completed: boolean;
}

export interface Teacher {
  id: string;
  specialization: string | null;
  employee_id: string | null;
}

export interface Parent {
  id: string;
  phone: string | null;
}

export interface ParentStudent {
  parent_id: string;
  student_id: string;
}

export interface Class {
  id: string;
  school_id: string;
  name: string;
  grade: number | null;
  academic_year: string | null;
  teacher_id: string | null;
  created_at: string;
}

export interface Archetype {
  id: string;
  code: ArchetypeCode;
  name_en: string;
  name_id: string;
  cluster: ArchetypeCluster;
  dominant_params: CognitiveParams;
  description: string | null;
  behavior_traits: string[];
  recommended_majors: string[];
  recommended_professions: string[];
  knowledge_field: KnowledgeField | null;
  avatar_config: AvatarConfig | null;
}

// ─── Assessment Tables ───────────────────────────────────────

export interface AssessmentSession {
  id: string;
  student_id: string;
  type: AssessmentType;
  status: AssessmentStatus;
  started_at: string;
  completed_at: string | null;
  current_module: number;
}

export interface AssessmentResponse {
  id: string;
  session_id: string;
  question_id: string;
  answer: unknown;
  score: number | null;
  time_spent_seconds: number | null;
  created_at: string;
}

export interface AssessmentQuestion {
  id: string;
  type: AssessmentType;
  module: number | null;
  parameter: CognitiveParam | null;
  question_text: string;
  question_media_url: string | null;
  options: QuestionOption[];
  correct_answer: unknown | null;
  difficulty: number;
  order_index: number | null;
}

export interface AssessmentResult {
  id: string;
  student_id: string;
  session_id: string;
  type: AssessmentType;
  results: CognitiveParams | VarkProfile;
  archetype_id: string | null;
  created_at: string;
}

// ─── Learning & Content Tables ───────────────────────────────

export interface LearningContent {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  content_type: ContentType;
  vark_tag: VarkTag | null;
  content_url: string | null;
  content_body: string | null;
  knowledge_field: KnowledgeField | null;
  difficulty: number;
  xp_reward: number;
  created_at: string;
}

export interface DailyMission {
  id: string;
  student_id: string;
  content_id: string;
  date: string;
  status: MissionStatus;
  xp_earned: number;
  completed_at: string | null;
}

export interface Task {
  id: string;
  teacher_id: string;
  class_id: string;
  title: string;
  description: string | null;
  task_type: TaskType;
  target_archetype: ArchetypeCode | null;
  vark_adaptations: VarkAdaptations | null;
  due_date: string | null;
  xp_reward: number;
  knowledge_field: KnowledgeField | null;
  created_at: string;
}

export interface TaskSubmission {
  id: string;
  task_id: string;
  student_id: string;
  group_id: string | null;
  content: string | null;
  attachment_urls: string[];
  score: number | null;
  feedback: string | null;
  status: SubmissionStatus;
  submitted_at: string;
  reviewed_at: string | null;
}

// ─── Social / Group Tables ───────────────────────────────────

export interface PeerGroup {
  id: string;
  class_id: string;
  name: string;
  synergy_score: number | null;
  created_at: string;
}

export interface PeerGroupMember {
  group_id: string;
  student_id: string;
  role_in_group: GroupRole | null;
}

export interface HighFive {
  id: string;
  from_user_id: string;
  to_student_id: string;
  message: string | null;
  created_at: string;
}

export interface GroupMessage {
  id: string;
  group_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

// ─── Gamification Tables ─────────────────────────────────────

export interface Badge {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  category: BadgeCategory;
  xp_reward: number;
  trigger_condition: BadgeTriggerCondition | null;
}

export interface StudentBadge {
  id: string;
  student_id: string;
  badge_id: string;
  earned_at: string;
}

export interface XpTransaction {
  id: string;
  student_id: string;
  amount: number;
  source: XpSource;
  source_id: string | null;
  created_at: string;
}

export interface CareerQuestNode {
  id: string;
  knowledge_field: KnowledgeField;
  order_index: number;
  title: string;
  description: string | null;
  unlock_level: number;
  xp_reward: number;
}

export interface StudentQuestProgress {
  student_id: string;
  node_id: string;
  status: QuestStatus;
  completed_at: string | null;
}

// ─── Career Tables ───────────────────────────────────────────

export interface Major {
  id: string;
  name: string;
  description: string | null;
  knowledge_field: KnowledgeField;
  universities: string[];
  career_prospects: string[];
}

export interface ArchetypeMajor {
  archetype_id: string;
  major_id: string;
  relevance_score: number;
}

export interface CareerRoadmap {
  id: string;
  student_id: string;
  archetype_id: string;
  recommended_fields: string[];
  recommended_majors: RecommendedMajor[];
  recommended_professions: RecommendedProfession[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Notification & Communication ────────────────────────────

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  data: NotificationData | null;
  read: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  student_id: string;
  content: string;
  read: boolean;
  created_at: string;
}
