import { Text, View } from 'react-native';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useStudentStore } from '@/lib/student-store';
import { levelTitle } from '@uniqcall/shared';

export default function GroupScreen() {
  const groupName = useStudentStore((s) => s.groupName);
  const groupMembers = useStudentStore((s) => s.groupMembers);
  const groupActivities = useStudentStore((s) => s.groupActivities);

  const sortedByXP = [...groupMembers].sort((a, b) => b.xp - a.xp);

  return (
    <ScreenWrapper scrollable>
      {/* ── Header ───────────────────────────────────────── */}
      <View className="mb-5">
        <Text className="text-2xl font-extrabold text-white">
          Kelompok Belajar 👥
        </Text>
        <Text className="text-sm text-white/50 mt-1">
          {groupName || 'Belum ada kelompok'}
        </Text>
      </View>

      {/* ── Group Info ───────────────────────────────────── */}
      <GlassCard className="mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-white font-bold text-base">
              {groupName}
            </Text>
            <Text className="text-white/50 text-xs mt-0.5">
              {groupMembers.length} anggota
            </Text>
          </View>
          <View className="bg-[#8B5CF6]/15 px-3 py-1.5 rounded-lg">
            <Text className="text-[#A855F7] text-xs font-bold">Aktif</Text>
          </View>
        </View>

        {/* Archetype distribution mini bar */}
        <View className="flex-row gap-1">
          {groupMembers.map((m) => (
            <View
              key={m.id}
              className="flex-1 h-2 rounded-full"
              style={{
                backgroundColor:
                  m.archetype === 'EXPLORER' ? '#06B6D4'
                  : m.archetype === 'CREATOR' ? '#EC4899'
                  : m.archetype === 'ENGINEER' ? '#F59E0B'
                  : m.archetype === 'STRATEGIST' ? '#8B5CF6'
                  : '#22D3EE',
              }}
            />
          ))}
        </View>
      </GlassCard>

      {/* ── Members List ─────────────────────────────────── */}
      <GlassCard className="mb-4">
        <Text className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-3">
          Anggota
        </Text>
        {groupMembers.map((member, index) => (
          <View
            key={member.id}
            className={`flex-row items-center py-3 ${
              index < groupMembers.length - 1 ? 'border-b border-white/5' : ''
            } ${member.isCurrentUser ? 'bg-[#8B5CF6]/5 -mx-4 px-4 rounded-lg' : ''}`}
          >
            {/* Avatar */}
            <View
              className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                member.isCurrentUser
                  ? 'bg-[#8B5CF6]/20 border-2 border-[#A855F7]'
                  : 'bg-white/10 border border-white/10'
              }`}
            >
              <Text className="text-base">
                {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </Text>
            </View>

            {/* Info */}
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="text-white font-semibold text-sm">
                  {member.name}
                </Text>
                {member.isCurrentUser && (
                  <Text className="text-[#22D3EE] text-[10px] ml-2 font-bold">(Kamu)</Text>
                )}
              </View>
              <View className="flex-row items-center mt-0.5">
                <Text className="text-xs mr-1">{member.archetypeEmoji}</Text>
                <Text className="text-white/50 text-xs">{member.archetypeName}</Text>
              </View>
            </View>

            {/* Level badge */}
            <View className="bg-[#8B5CF6]/15 px-2 py-1 rounded-md">
              <Text className="text-[#A855F7] text-[10px] font-bold">
                Lv.{member.level}
              </Text>
            </View>
          </View>
        ))}
      </GlassCard>

      {/* ── Activity Feed ────────────────────────────────── */}
      <GlassCard className="mb-4">
        <Text className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-3">
          Aktivitas Terbaru
        </Text>
        {groupActivities.map((activity, index) => (
          <View
            key={activity.id}
            className={`flex-row items-start py-2.5 ${
              index < groupActivities.length - 1 ? 'border-b border-white/5' : ''
            }`}
          >
            <View className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mt-1.5 mr-3" />
            <View className="flex-1">
              <Text className="text-white/80 text-sm">{activity.text}</Text>
              <Text className="text-white/30 text-xs mt-0.5">{activity.timeAgo}</Text>
            </View>
          </View>
        ))}
      </GlassCard>

      {/* ── Leaderboard ──────────────────────────────────── */}
      <GlassCard className="mb-4">
        <Text className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-3">
          Papan Peringkat 🏆
        </Text>
        {sortedByXP.map((member, index) => {
          const medals = ['🥇', '🥈', '🥉'];
          const medal = index < 3 ? medals[index] : `${index + 1}`;

          return (
            <View
              key={member.id}
              className={`flex-row items-center py-2.5 ${
                index < sortedByXP.length - 1 ? 'border-b border-white/5' : ''
              } ${member.isCurrentUser ? 'bg-[#8B5CF6]/5 -mx-4 px-4 rounded-lg' : ''}`}
            >
              <Text className="w-8 text-center text-sm">
                {medal}
              </Text>
              <Text
                className={`flex-1 text-sm font-medium ${
                  member.isCurrentUser ? 'text-[#22D3EE]' : 'text-white'
                }`}
              >
                {member.name}
              </Text>
              <Text className="text-[#F59E0B] text-xs font-bold">
                {member.xp.toLocaleString()} XP
              </Text>
            </View>
          );
        })}
      </GlassCard>
    </ScreenWrapper>
  );
}
