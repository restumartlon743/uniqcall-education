import { useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StatCard } from '@/components/ui/stat-card';
import { BadgeCard } from '@/components/ui/badge-card';
import { MissionCard } from '@/components/ui/mission-card';
import { RadarChart } from '@/components/charts/radar-chart';
import { useStudentStore, initializeMockData } from '@/lib/student-store';
import { BADGES, LEVELS, levelProgress } from '@uniqcall/shared';

const ARCHETYPE_EMOJI: Record<string, string> = {
  THINKER: '🧠', ENGINEER: '⚙️', GUARDIAN: '🛡️', STRATEGIST: '🧩',
  CREATOR: '🎨', SHAPER: '🏛️', STORYTELLER: '✒️', PERFORMER: '🎭',
  HEALER: '💚', DIPLOMAT: '🤝', EXPLORER: '🧭', MENTOR: '👨‍🏫', VISIONARY: '🔮',
};

const ARCHETYPE_NAME_ID: Record<string, string> = {
  THINKER: 'Sang Pemikir', ENGINEER: 'Sang Teknokrat', GUARDIAN: 'Sang Penjaga',
  STRATEGIST: 'Sang Perencana', CREATOR: 'Sang Pencipta', SHAPER: 'Sang Arsitek',
  STORYTELLER: 'Sang Pendongeng', PERFORMER: 'Sang Performer', HEALER: 'Sang Penyembuh',
  DIPLOMAT: 'Sang Diplomat', EXPLORER: 'Sang Penjelajah', MENTOR: 'Sang Mentor',
  VISIONARY: 'Sang Visioner',
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

export default function HomeScreen() {
  useEffect(() => {
    initializeMockData();
  }, []);

  const profile = useStudentStore((s) => s.profile);
  const currentXP = useStudentStore((s) => s.currentXP);
  const level = useStudentStore((s) => s.level);
  const streak = useStudentStore((s) => s.streak);
  const earnedBadges = useStudentStore((s) => s.earnedBadges);
  const dailyMissions = useStudentStore((s) => s.dailyMissions);
  const questSteps = useStudentStore((s) => s.questSteps);
  const completeMission = useStudentStore((s) => s.completeMission);

  const progress = levelProgress(currentXP);
  const completedQuests = questSteps.filter((q) => q.status === 'completed').length;
  const questPercent = questSteps.length > 0 ? Math.round((completedQuests / questSteps.length) * 100) : 0;

  const cognitiveData = profile?.cognitiveParams
    ? [
        { label: 'Analitis', value: profile.cognitiveParams.analytical, max: 100 },
        { label: 'Kreatif', value: profile.cognitiveParams.creative, max: 100 },
        { label: 'Linguistik', value: profile.cognitiveParams.linguistic, max: 100 },
        { label: 'Kinestetik', value: profile.cognitiveParams.kinesthetic, max: 100 },
        { label: 'Sosial', value: profile.cognitiveParams.social, max: 100 },
        { label: 'Observasi', value: profile.cognitiveParams.observation, max: 100 },
        { label: 'Intuisi', value: profile.cognitiveParams.intuition, max: 100 },
      ]
    : [];

  return (
    <ScreenWrapper scrollable>
      {/* ── Header ─────────────────────────────────────────── */}
      <View className="mb-5">
        <Text className="text-2xl font-extrabold text-white">
          {getGreeting()}, {profile?.fullName?.split(' ')[0] ?? 'Siswa'}! 👋
        </Text>
        <View className="flex-row items-center mt-1.5">
          <Text className="text-lg mr-1.5">
            {ARCHETYPE_EMOJI[profile?.archetype ?? ''] ?? '🎓'}
          </Text>
          <Text className="text-[#22D3EE] font-semibold text-sm">
            {ARCHETYPE_NAME_ID[profile?.archetype ?? ''] ?? 'Belum Asesmen'}
          </Text>
        </View>
      </View>

      {/* ── XP & Level Bar ──────────────────────────────── */}
      <GlassCard className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <View className="bg-[#8B5CF6] w-7 h-7 rounded-lg items-center justify-center mr-2">
              <Text className="text-white text-xs font-bold">{progress.level}</Text>
            </View>
            <Text className="text-white font-bold text-sm">{progress.title}</Text>
          </View>
          <Text className="text-white/50 text-xs">
            {currentXP} / {currentXP + progress.xp_remaining} XP
          </Text>
        </View>
        <ProgressBar
          value={progress.xp_in_level}
          max={progress.xp_for_next || 1}
          color="#8B5CF6"
        />
        <View className="flex-row items-center mt-2.5">
          <Text className="text-lg mr-1">🔥</Text>
          <Text className="text-[#F59E0B] font-bold text-sm">
            {streak} Hari Berturut-turut
          </Text>
        </View>
      </GlassCard>

      {/* ── Radar Chart ────────────────────────────────── */}
      {cognitiveData.length > 0 && (
        <GlassCard className="mb-4">
          <Text className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-2">
            Profil Kognitif
          </Text>
          <RadarChart data={cognitiveData} />
        </GlassCard>
      )}

      {/* ── Quick Stats ────────────────────────────────── */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <View className="flex-row gap-3 mb-3">
            <StatCard
              label="Level"
              value={progress.title}
              icon="⚡"
              color="#8B5CF6"
            />
            <StatCard
              label="Total XP"
              value={currentXP.toLocaleString()}
              icon="✨"
              color="#F59E0B"
            />
          </View>
          <View className="flex-row gap-3">
            <StatCard
              label="Badge"
              value={`${earnedBadges.length}/${BADGES.length}`}
              icon="🏅"
              color="#06B6D4"
            />
            <StatCard
              label="Quest"
              value={`${questPercent}%`}
              icon="🗺️"
              color="#EC4899"
            />
          </View>
        </View>
      </View>

      {/* ── Recent Badges ──────────────────────────────── */}
      <GlassCard className="mb-4">
        <Text className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-3">
          Badge Terbaru
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
          <View className="flex-row gap-4 px-1">
            {BADGES.slice(0, 10).map((badge) => (
              <BadgeCard
                key={badge.code}
                badge={badge}
                earned={earnedBadges.includes(badge.code)}
                size="sm"
              />
            ))}
          </View>
        </ScrollView>
      </GlassCard>

      {/* ── Daily Missions ─────────────────────────────── */}
      <GlassCard className="mb-4">
        <Text className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-3">
          Misi Hari Ini
        </Text>
        {dailyMissions.map((mission) => (
          <MissionCard
            key={mission.id}
            title={mission.title}
            xpReward={mission.xpReward}
            status={mission.status}
            onToggle={() => {
              if (mission.status !== 'completed') {
                completeMission(mission.id);
              }
            }}
          />
        ))}
      </GlassCard>
    </ScreenWrapper>
  );
}
