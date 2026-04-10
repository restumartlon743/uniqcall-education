import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NeonButton } from '@/components/ui/neon-button';
import { GlassCard } from '@/components/ui/glass-card';
import { useAssessmentStore } from '@/lib/assessment-store';

export default function AssessmentIntroScreen() {
  const router = useRouter();
  const reset = useAssessmentStore((s) => s.reset);

  const handleStart = () => {
    reset();
    router.push('/assessment/cognitive');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A0E27]">
      <View className="flex-1 px-6 justify-center">
        {/* Hero */}
        <Animated.View entering={FadeInUp.duration(600)} className="items-center mb-10">
          <View
            className="w-28 h-28 rounded-full bg-[#8B5CF6]/20 border-2 border-[#8B5CF6] items-center justify-center mb-6"
            style={{
              shadowColor: '#8B5CF6',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Text className="text-5xl">🧠</Text>
          </View>

          <Text className="text-3xl font-extrabold text-white text-center mb-2">
            Kenali Potensi Unikmu!
          </Text>
          <Text className="text-base text-[#22D3EE] text-center">
            Temukan arketipe unik dan gaya belajar terbaikmu
          </Text>
        </Animated.View>

        {/* Section 1: Cognitive */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <GlassCard className="mb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-[#8B5CF6]/20 items-center justify-center">
                <Text className="text-xl">🧩</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-base">Tes Kognitif</Text>
                <Text className="text-white/50 text-sm">7 modul • 35 pertanyaan • ~15 menit</Text>
              </View>
            </View>
            <Text className="text-white/40 text-xs mt-3">
              Ukur 7 parameter kognitifmu: logika, kreativitas, komunikasi, kepemimpinan, observasi, kinestetik, dan intuisi.
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Section 2: VARK */}
        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
          <GlassCard className="mb-8">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-[#06B6D4]/20 items-center justify-center">
                <Text className="text-xl">📝</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-base">Tes Gaya Belajar VARK</Text>
                <Text className="text-white/50 text-sm">16 pertanyaan • ~5 menit</Text>
              </View>
            </View>
            <Text className="text-white/40 text-xs mt-3">
              Kenali gaya belajar dominanmu: Visual, Auditori, Baca/Tulis, atau Kinestetik.
            </Text>
          </GlassCard>
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={FadeInDown.duration(500).delay(600)}>
          <NeonButton title="Mulai Assessment" variant="primary" onPress={handleStart} />
          <Text className="text-white/30 text-xs text-center mt-4">
            Kamu bisa berhenti dan lanjutkan kapan saja
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
