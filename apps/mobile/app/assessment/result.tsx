import { Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { ARCHETYPE_BY_CODE } from '@uniqcall/shared';
import type { VarkTag } from '@uniqcall/shared';
import { NeonButton } from '@/components/ui/neon-button';
import { GlassCard } from '@/components/ui/glass-card';
import { RadarChart } from '@/components/charts/radar-chart';
import { useAssessmentStore } from '@/lib/assessment-store';
import { ARCHETYPE_META, COGNITIVE_MODULES } from '@/lib/assessment-data';

const VARK_DISPLAY: Record<VarkTag, { label: string; color: string; icon: string }> = {
  V: { label: 'Visual', color: '#8B5CF6', icon: '👁️' },
  A: { label: 'Auditori', color: '#06B6D4', icon: '👂' },
  R: { label: 'Baca/Tulis', color: '#F59E0B', icon: '📖' },
  K: { label: 'Kinestetik', color: '#22C55E', icon: '✋' },
};

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const archetype = useAssessmentStore((s) => s.archetype);
  const cognitiveScores = useAssessmentStore((s) => s.cognitiveScores);
  const varkScores = useAssessmentStore((s) => s.varkScores);

  // Fallback if accessed directly without data
  if (!archetype || !cognitiveScores || !varkScores) {
    return (
      <SafeAreaView className="flex-1 bg-[#0A0E27] items-center justify-center px-6">
        <Text className="text-white text-lg text-center mb-4">
          Belum ada hasil assessment.
        </Text>
        <NeonButton
          title="Mulai Assessment"
          variant="primary"
          onPress={() => router.replace('/assessment')}
        />
      </SafeAreaView>
    );
  }

  const archetypeDef = ARCHETYPE_BY_CODE[archetype];
  const meta = ARCHETYPE_META[archetype];

  // Prepare radar chart data (scores are 1-4 averages)
  const radarData = COGNITIVE_MODULES.map((mod) => ({
    label: mod.label.split(' & ')[0],
    value: cognitiveScores[mod.key] ?? 0,
    max: 4,
  }));

  // VARK bars
  const varkEntries = (Object.entries(varkScores) as [VarkTag, number][]).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <View className="flex-1 bg-[#0A0E27]" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Archetype Reveal */}
        <Animated.View entering={ZoomIn.duration(600)} className="items-center mt-8 mb-2">
          <View
            className="w-32 h-32 rounded-full items-center justify-center mb-4 border-2"
            style={{
              backgroundColor: `${meta.color}20`,
              borderColor: meta.color,
              shadowColor: meta.color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 28,
              elevation: 14,
            }}
          >
            <Text className="text-6xl">{meta.emoji}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(300)} className="items-center mb-8">
          <Text
            className="text-sm font-bold uppercase tracking-widest mb-2"
            style={{ color: meta.color }}
          >
            Arketipemu
          </Text>
          <Text className="text-3xl font-extrabold text-white text-center mb-1">
            {archetypeDef.name_id}
          </Text>
          <Text className="text-base text-white/50 text-center">
            {archetypeDef.name_en}
          </Text>
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInDown.duration(400).delay(500)}>
          <GlassCard className="mb-6">
            <Text className="text-white/80 text-sm leading-6">{archetypeDef.description}</Text>
          </GlassCard>
        </Animated.View>

        {/* Cognitive Radar */}
        <Animated.View entering={FadeInDown.duration(400).delay(700)}>
          <GlassCard className="mb-6">
            <Text className="text-white/80 font-bold text-sm uppercase tracking-wider mb-4">
              Profil Kognitif
            </Text>
            <RadarChart data={radarData} fillColor={`${meta.color}40`} strokeColor={meta.color} />
          </GlassCard>
        </Animated.View>

        {/* VARK Profile */}
        <Animated.View entering={FadeInDown.duration(400).delay(900)}>
          <GlassCard className="mb-6">
            <Text className="text-white/80 font-bold text-sm uppercase tracking-wider mb-4">
              Gaya Belajar VARK
            </Text>
            <View className="gap-3">
              {varkEntries.map(([tag, pct]) => {
                const info = VARK_DISPLAY[tag];
                return (
                  <View key={tag}>
                    <View className="flex-row items-center justify-between mb-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-base">{info.icon}</Text>
                        <Text className="text-white/70 text-sm font-semibold">{info.label}</Text>
                      </View>
                      <Text className="text-white/50 text-sm font-bold">{pct}%</Text>
                    </View>
                    <View className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <View
                        className="h-3 rounded-full"
                        style={{
                          width: `${Math.max(pct, 2)}%`,
                          backgroundColor: info.color,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Traits */}
        <Animated.View entering={FadeInDown.duration(400).delay(1100)}>
          <GlassCard className="mb-6">
            <Text className="text-white/80 font-bold text-sm uppercase tracking-wider mb-3">
              Ciri Perilaku
            </Text>
            <View className="gap-2">
              {archetypeDef.behavior_traits.map((trait, idx) => (
                <View key={idx} className="flex-row items-start gap-2">
                  <Text className="text-[#22D3EE] text-sm">•</Text>
                  <Text className="text-white/60 text-sm flex-1 leading-5">{trait}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Recommended Majors */}
        <Animated.View entering={FadeInDown.duration(400).delay(1300)}>
          <GlassCard className="mb-8">
            <Text className="text-white/80 font-bold text-sm uppercase tracking-wider mb-3">
              Rekomendasi Jurusan
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {archetypeDef.recommended_majors.map((major) => (
                <View
                  key={major}
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: `${meta.color}20`, borderWidth: 1, borderColor: `${meta.color}50` }}
                >
                  <Text className="text-xs font-semibold" style={{ color: meta.color }}>
                    {major}
                  </Text>
                </View>
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={FadeInDown.duration(400).delay(1500)}>
          <NeonButton
            title="Lihat Dashboard"
            variant="success"
            onPress={() => router.replace('/(tabs)/home')}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}
