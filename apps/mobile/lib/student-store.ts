import { create } from 'zustand';
import type { ArchetypeCode, VarkTag, BadgeCategory, QuestStatus, MissionStatus } from '@uniqcall/shared';
import type { CognitiveParams, VarkProfile } from '@uniqcall/shared';
import { BADGES, LEVELS, levelProgress, calculateLevel } from '@uniqcall/shared';

// ─── Interfaces ──────────────────────────────────────────────

export interface StudentProfile {
  id: string;
  fullName: string;
  school: string;
  className: string;
  avatarInitials: string;
  archetype: ArchetypeCode;
  cognitiveParams: CognitiveParams;
  varkProfile: VarkProfile;
  dominantVark: VarkTag;
}

export interface QuestStep {
  id: string;
  order: number;
  title: string;
  description: string;
  status: QuestStatus;
  xpReward: number;
}

export interface GroupMember {
  id: string;
  name: string;
  archetype: ArchetypeCode;
  archetypeEmoji: string;
  archetypeName: string;
  level: number;
  xp: number;
  isCurrentUser: boolean;
}

export interface Mission {
  id: string;
  title: string;
  xpReward: number;
  status: MissionStatus;
}

export interface GroupActivity {
  id: string;
  text: string;
  timeAgo: string;
}

export interface Article {
  id: string;
  title: string;
  category: 'jurusan' | 'karir' | 'tips' | 'inspirasi';
  categoryLabel: string;
  readingTime: number;
  thumbnailEmoji: string;
}

// ─── Store ───────────────────────────────────────────────────

interface StudentState {
  profile: StudentProfile | null;
  earnedBadges: string[];
  currentXP: number;
  level: number;
  streak: number;
  questSteps: QuestStep[];
  groupName: string;
  groupMembers: GroupMember[];
  groupActivities: GroupActivity[];
  dailyMissions: Mission[];
  articles: Article[];

  // Actions
  setProfile: (p: StudentProfile) => void;
  earnBadge: (badgeId: string) => void;
  addXP: (amount: number) => void;
  completeMission: (missionId: string) => void;
  completeQuestStep: (stepId: string) => void;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  profile: null,
  earnedBadges: [],
  currentXP: 0,
  level: 1,
  streak: 0,
  questSteps: [],
  groupName: '',
  groupMembers: [],
  groupActivities: [],
  dailyMissions: [],
  articles: [],

  setProfile: (p) => set({ profile: p }),

  earnBadge: (badgeId) => {
    const state = get();
    if (state.earnedBadges.includes(badgeId)) return;
    const badge = BADGES.find((b) => b.code === badgeId);
    const xpReward = badge?.xp_reward ?? 0;
    const newXP = state.currentXP + xpReward;
    set({
      earnedBadges: [...state.earnedBadges, badgeId],
      currentXP: newXP,
      level: calculateLevel(newXP),
    });
  },

  addXP: (amount) => {
    const newXP = get().currentXP + amount;
    set({
      currentXP: newXP,
      level: calculateLevel(newXP),
    });
  },

  completeMission: (missionId) => {
    set((state) => {
      const missions = state.dailyMissions.map((m) =>
        m.id === missionId ? { ...m, status: 'completed' as const } : m,
      );
      const mission = state.dailyMissions.find((m) => m.id === missionId);
      const xpReward = mission?.xpReward ?? 0;
      const newXP = state.currentXP + xpReward;
      return {
        dailyMissions: missions,
        currentXP: newXP,
        level: calculateLevel(newXP),
      };
    });
  },

  completeQuestStep: (stepId) => {
    set((state) => {
      const steps = state.questSteps.map((s) =>
        s.id === stepId ? { ...s, status: 'completed' as const } : s,
      );
      const step = state.questSteps.find((s) => s.id === stepId);
      const xpReward = step?.xpReward ?? 0;
      const newXP = state.currentXP + xpReward;
      return {
        questSteps: steps,
        currentXP: newXP,
        level: calculateLevel(newXP),
      };
    });
  },
}));

// ─── Initialize Mock Data ────────────────────────────────────

export function initializeMockData() {
  useStudentStore.setState({
    profile: {
      id: 'mock-student-001',
      fullName: 'Andi Pratama',
      school: 'SMA Negeri 1',
      className: 'Kelas 11 IPA 2',
      avatarInitials: 'AP',
      archetype: 'EXPLORER',
      cognitiveParams: {
        analytical: 72,
        creative: 65,
        linguistic: 58,
        kinesthetic: 80,
        social: 70,
        observation: 75,
        intuition: 68,
      },
      varkProfile: { V: 35, A: 20, R: 15, K: 30 },
      dominantVark: 'V',
    },
    currentXP: 2450,
    level: 7,
    streak: 7,
    earnedBadges: [
      'DEEP_DIVER',
      'LOGIC_MASTER',
      'VARK_EXPLORER',
      'FIRST_FLAME',
      'SEVEN_DAY_WARRIOR',
      'PATHFINDER',
      'TEAM_PLAYER',
    ],
    questSteps: [
      { id: 'q1', order: 1, title: 'Kenali Dirimu', description: 'Selesaikan asesmen kognitif dan VARK untuk mengenali potensimu.', status: 'completed', xpReward: 100 },
      { id: 'q2', order: 2, title: 'Jelajahi Minat', description: 'Eksplorasi bidang-bidang yang sesuai dengan arketipemu.', status: 'completed', xpReward: 100 },
      { id: 'q3', order: 3, title: 'Temukan Jurusan', description: 'Pelajari jurusan-jurusan yang cocok dengan profilmu.', status: 'in_progress', xpReward: 150 },
      { id: 'q4', order: 4, title: 'Riset Kampus', description: 'Cari tahu kampus terbaik untuk jurusan pilihanmu.', status: 'locked', xpReward: 150 },
      { id: 'q5', order: 5, title: 'Interview Profesional', description: 'Wawancara dengan profesional di bidang yang kamu minati.', status: 'locked', xpReward: 200 },
      { id: 'q6', order: 6, title: 'Portfolio Awal', description: 'Buat portfolio awal yang menunjukkan kemampuanmu.', status: 'locked', xpReward: 200 },
      { id: 'q7', order: 7, title: 'Simulasi Kuliah', description: 'Ikuti simulasi perkuliahan di jurusan pilihanmu.', status: 'locked', xpReward: 250 },
      { id: 'q8', order: 8, title: 'Rencana Aksi', description: 'Susun rencana aksi untuk mencapai tujuanmu.', status: 'locked', xpReward: 250 },
      { id: 'q9', order: 9, title: 'Review & Feedback', description: 'Dapatkan review dan feedback dari guru dan mentor.', status: 'locked', xpReward: 300 },
      { id: 'q10', order: 10, title: 'Siap Melangkah!', description: 'Kamu siap untuk memulai perjalanan masa depanmu!', status: 'locked', xpReward: 500 },
    ],
    groupName: 'Kelompok Inovator Digital',
    groupMembers: [
      { id: 'mock-student-001', name: 'Andi Pratama', archetype: 'EXPLORER', archetypeEmoji: '🧭', archetypeName: 'Sang Penjelajah', level: 7, xp: 2450, isCurrentUser: true },
      { id: 'mock-student-002', name: 'Sari Ningsih', archetype: 'CREATOR', archetypeEmoji: '🎨', archetypeName: 'Sang Pencipta', level: 5, xp: 1200, isCurrentUser: false },
      { id: 'mock-student-003', name: 'Ahmad Fauzi', archetype: 'ENGINEER', archetypeEmoji: '⚙️', archetypeName: 'Sang Teknokrat', level: 6, xp: 1800, isCurrentUser: false },
      { id: 'mock-student-004', name: 'Dina Kartika', archetype: 'STRATEGIST', archetypeEmoji: '🧩', archetypeName: 'Sang Perencana', level: 4, xp: 750, isCurrentUser: false },
      { id: 'mock-student-005', name: 'Budi Santoso', archetype: 'THINKER', archetypeEmoji: '🧠', archetypeName: 'Sang Pemikir', level: 5, xp: 1100, isCurrentUser: false },
    ],
    groupActivities: [
      { id: 'ga1', text: 'Ahmad menyelesaikan Quest 3 🎉', timeAgo: '2 jam lalu' },
      { id: 'ga2', text: 'Sari mendapat badge Peneliti 🏅', timeAgo: '4 jam lalu' },
      { id: 'ga3', text: 'Diskusi baru: Tips Jurusan Kedokteran', timeAgo: '6 jam lalu' },
      { id: 'ga4', text: 'Dina menaikkan level ke Achiever ⬆️', timeAgo: '1 hari lalu' },
      { id: 'ga5', text: 'Budi membaca 3 artikel hari ini 📚', timeAgo: '1 hari lalu' },
    ],
    dailyMissions: [
      { id: 'dm1', title: 'Selesaikan 1 Quest', xpReward: 50, status: 'in_progress' },
      { id: 'dm2', title: 'Baca 1 Artikel Karir', xpReward: 25, status: 'pending' },
      { id: 'dm3', title: 'Diskusi di Grup', xpReward: 30, status: 'pending' },
    ],
    articles: [
      { id: 'a1', title: 'Panduan Memilih Jurusan Teknik Informatika', category: 'jurusan', categoryLabel: 'Jurusan', readingTime: 5, thumbnailEmoji: '💻' },
      { id: 'a2', title: '5 Karir Masa Depan yang Menjanjikan', category: 'karir', categoryLabel: 'Karir', readingTime: 4, thumbnailEmoji: '🚀' },
      { id: 'a3', title: 'Tips Belajar Efektif Berdasarkan Tipe VARK', category: 'tips', categoryLabel: 'Tips Belajar', readingTime: 6, thumbnailEmoji: '🧠' },
      { id: 'a4', title: 'Mengenal Dunia Desain Grafis', category: 'karir', categoryLabel: 'Karir', readingTime: 4, thumbnailEmoji: '🎨' },
      { id: 'a5', title: 'Langkah Persiapan Masuk PTN', category: 'tips', categoryLabel: 'Tips Belajar', readingTime: 7, thumbnailEmoji: '🎓' },
      { id: 'a6', title: 'Skill yang Dicari di Dunia Kerja 2025', category: 'karir', categoryLabel: 'Karir', readingTime: 5, thumbnailEmoji: '💼' },
      { id: 'a7', title: 'Bagaimana Menemukan Passion?', category: 'inspirasi', categoryLabel: 'Inspirasi', readingTime: 3, thumbnailEmoji: '🔥' },
      { id: 'a8', title: 'Cerita Sukses Alumni: Dari SMA ke Startup', category: 'inspirasi', categoryLabel: 'Inspirasi', readingTime: 6, thumbnailEmoji: '⭐' },
    ],
  });
}
