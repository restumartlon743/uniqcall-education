import { Text, View, Switch, Pressable } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StatCard } from '@/components/ui/stat-card';
import { BadgeCard } from '@/components/ui/badge-card';
import { RadarChart } from '@/components/charts/radar-chart';
import { useStudentStore } from '@/lib/student-store';
import { BADGES, levelProgress } from '@uniqcall/shared';

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

const VARK_LABEL: Record<string, string> = {
  V: 'Visual', A: 'Auditori', R: 'Baca/Tulis', K: 'Kinestetik',
};

const BADGE_CATEGORIES = [
  { key: 'cognitive', label: 'Assessment' },
  { key: 'streak', label: 'Streak' },
  { key: 'project', label: 'Proyek' },
  { key: 'peer', label: 'Sosial' },
  { key: 'career', label: 'Karir' },
] as const;

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const profile = useStudentStore((s) => s.profile);
  const currentXP = useStudentStore((s) => s.currentXP);
  const earnedBadges = useStudentStore((s) => s.earnedBadges);
  const questSteps = useStudentStore((s) => s.questSteps);
  const streak = useStudentStore((s) => s.streak);

  const progress = levelProgress(currentXP);
  const completedQuests = questSteps.filter((q) => q.status === 'completed').length;

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
      {/* ── Profile Header ───────────────────────────────── */}
      <GlassCard className="mb-4">
        <View className="items-center py-4">
          {/* Avatar */}
          <View
            className="w-20 h-20 rounded-full bg-[#8B5CF6]/20 border-2 border-[#A855F7] items-center justify-center mb-3"
            style={{
              shadowColor: '#8B5CF6',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Text className="text-white font-bold text-xl">
              {profile?.avatarInitials ?? '??'}
            </Text>
          </View>

          <Text className="text-white font-bold text-lg">
            {profile?.fullName ?? 'Siswa'}
          </Text>
          <Text className="text-white/40 text-xs mt-0.5">
            {profile?.school} • {profile?.className}
          </Text>

          {/* Archetype badge */}
          <View className="flex-row items-center mt-2 bg-[#8B5CF6]/10 px-3 py-1.5 rounded-full">
            <Text className="text-base mr-1.5">
              {ARCHETYPE_EMOJI[profile?.archetype ?? ''] ?? '🎓'}
            </Text>
            <Text className="text-[#A855F7] font-semibold text-sm">
              {ARCHETYPE_NAME_ID[profile?.archetype ?? ''] ?? 'Belum Asesmen'}
            </Text>
          </View>

          {/* Level + XP bar */}
          <View className="w-full mt-4">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center">
                <View className="bg-[#8B5CF6] w-6 h-6 rounded-md items-center justify-center mr-2">
                  <Text className="text-white text-[10px] font-bold">{progress.level}</Text>
                </View>
                <Text className="text-white font-semibold text-xs">{progress.title}</Text>
              </View>
              <Text className="text-white/40 text-xs">
                {currentXP} XP
              </Text>
            </View>
            <ProgressBar
              value={progress.xp_in_level}
              max={progress.xp_for_next || 1}
              color="#8B5CF6"
            />
          </View>
        </View>
      </GlassCard>

      {/* ── Stats Overview ───────────────────────────────── */}
      <View className="flex-row gap-3 mb-4">
        <StatCard label="Quest Selesai" value={completedQuests} icon="🗺️" color="#8B5CF6" />
        <StatCard label="Badge" value={earnedBadges.length} icon="🏅" color="#06B6D4" />
      </View>
      <View className="flex-row gap-3 mb-4">
        <StatCard label="Hari Aktif" value={streak} icon="🔥" color="#F59E0B" />
        <StatCard label="Artikel Dibaca" value={5} icon="📚" color="#EC4899" />
      </View>

      {/* ── Badge Collection ─────────────────────────────── */}
      <GlassCard className="mb-4">
        <Text className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-3">
          Koleksi Badge 🏅
        </Text>
        {BADGE_CATEGORIES.map((cat) => {
          const categoryBadges = BADGES.filter((b) => b.category === cat.key);
          return (
            <View key={cat.key} className="mb-4">
              <Text className="text-white/50 text-xs font-semibold mb-2 uppercase">
                {cat.label}
              </Text>
              <View className="flex-row flex-wrap gap-4">
                {categoryBadges.map((badge) => (
                  <BadgeCard
                    key={badge.code}
                    badge={badge}
                    earned={earnedBadges.includes(badge.code)}
                    size="sm"
                  />
                ))}
              </View>
            </View>
          );
        })}
      </GlassCard>

      {/* ── Assessment Results ───────────────────────────── */}
      <GlassCard className="mb-4">
        <Text className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-3">
          Hasil Asesmen
        </Text>
        {cognitiveData.length > 0 && (
          <RadarChart data={cognitiveData} size={220} />
        )}
        {profile?.dominantVark && (
          <View className="flex-row items-center justify-center mt-3 bg-[#06B6D4]/10 px-3 py-2 rounded-lg">
            <Text className="text-[#22D3EE] text-sm font-semibold">
              Tipe VARK: {VARK_LABEL[profile.dominantVark] ?? profile.dominantVark}
            </Text>
          </View>
        )}
      </GlassCard>

      {/* ── Settings ─────────────────────────────────────── */}
      <GlassCard className="mb-6">
        <Text className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-3">
          Pengaturan
        </Text>

        {/* Notification toggle */}
        <View className="flex-row items-center justify-between py-3 border-b border-white/5">
          <Text className="text-white text-sm">Notifikasi</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#1E293B', true: '#8B5CF6' }}
            thumbColor="#ffffff"
          />
        </View>

        {/* Theme preference */}
        <View className="flex-row items-center justify-between py-3 border-b border-white/5">
          <Text className="text-white text-sm">Tema</Text>
          <View className="flex-row items-center">
            <Text className="text-white/40 text-xs mr-2">Dark Mode</Text>
            <Text className="text-xs">🔒</Text>
          </View>
        </View>

        {/* About */}
        <Pressable className="py-3 border-b border-white/5">
          <Text className="text-white text-sm">Tentang Uniqcall</Text>
        </Pressable>

        {/* Version */}
        <View className="py-3">
          <Text className="text-white/30 text-xs">Versi 0.1.0</Text>
        </View>
      </GlassCard>

      {/* ── Sign Out ─────────────────────────────────────── */}
      <NeonButton
        title="Keluar"
        variant="secondary"
        onPress={signOut}
        className="mb-4"
      />
    </ScreenWrapper>
  );
}
