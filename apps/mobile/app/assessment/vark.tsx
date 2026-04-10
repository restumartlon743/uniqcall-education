import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { VarkTag } from '@uniqcall/shared';
import { GlassCard } from '@/components/ui/glass-card';
import { useAssessmentStore } from '@/lib/assessment-store';
import { VARK_QUESTIONS } from '@/lib/assessment-data';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const TOTAL = VARK_QUESTIONS.length;
const AUTO_ADVANCE_MS = 500;

const VARK_ICON: Record<VarkTag, string> = { V: '👁️', A: '👂', R: '📖', K: '✋' };
const VARK_LABEL: Record<VarkTag, string> = {
  V: 'Visual',
  A: 'Auditori',
  R: 'Baca/Tulis',
  K: 'Kinestetik',
};
const VARK_COLOR: Record<VarkTag, string> = {
  V: '#8B5CF6',
  A: '#06B6D4',
  R: '#F59E0B',
  K: '#22C55E',
};

export default function VarkScreen() {
  const router = useRouter();
  const setVarkAnswer = useAssessmentStore((s) => s.setVarkAnswer);
  const calculateResults = useAssessmentStore((s) => s.calculateResults);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<VarkTag | null>(null);

  const progressWidth = useSharedValue(0);

  const currentQuestion = VARK_QUESTIONS[currentIndex];

  useEffect(() => {
    progressWidth.value = withTiming(((currentIndex + 1) / TOTAL) * 100, {
      duration: 300,
    });
  }, [currentIndex, progressWidth]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const handleSelectOption = useCallback(
    (tag: VarkTag) => {
      if (selectedOption !== null) return;
      setSelectedOption(tag);
      setVarkAnswer(currentQuestion.id, tag);

      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= TOTAL) {
          calculateResults();
          router.push('/assessment/result');
        } else {
          setCurrentIndex(nextIndex);
          setSelectedOption(null);
        }
      }, AUTO_ADVANCE_MS);
    },
    [currentIndex, currentQuestion.id, selectedOption, setVarkAnswer, calculateResults, router],
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0A0E27]">
      <View className="flex-1 px-5 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white font-bold text-base">Gaya Belajar VARK</Text>
          <Text className="text-white/40 text-xs">
            {currentIndex + 1} / {TOTAL}
          </Text>
        </View>

        {/* Progress bar */}
        <View className="h-2 bg-white/10 rounded-full mb-6">
          <Animated.View
            className="h-2 bg-[#06B6D4] rounded-full"
            style={progressStyle}
          />
        </View>

        {/* Question */}
        <Animated.View key={currentQuestion.id} entering={SlideInRight.duration(300)}>
          <GlassCard className="mb-6">
            <Text className="text-white text-lg font-semibold leading-7">
              {currentQuestion.question}
            </Text>
          </GlassCard>

          {/* Options */}
          <View className="gap-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option.value;
              const color = VARK_COLOR[option.value];
              return (
                <VarkOptionCard
                  key={`${currentQuestion.id}-${idx}`}
                  tag={option.value}
                  label={option.label}
                  icon={VARK_ICON[option.value]}
                  tagLabel={VARK_LABEL[option.value]}
                  color={color}
                  index={idx}
                  isSelected={isSelected}
                  disabled={selectedOption !== null}
                  onPress={() => handleSelectOption(option.value)}
                />
              );
            })}
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// ─── VARK Option Card ─────────────────────────────────────────

function VarkOptionCard({
  tag,
  label,
  icon,
  tagLabel,
  color,
  index,
  isSelected,
  disabled,
  onPress,
}: {
  tag: VarkTag;
  label: string;
  icon: string;
  tagLabel: string;
  color: string;
  index: number;
  isSelected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(index * 80)}>
      <AnimatedPressable
        style={[
          animatedStyle,
          isSelected
            ? {
                shadowColor: color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 16,
                elevation: 8,
              }
            : {},
        ]}
        onPressIn={() => {
          if (!disabled) scale.value = withSpring(0.97);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={onPress}
        disabled={disabled}
        className={`flex-row items-start gap-3 p-4 rounded-2xl border ${
          isSelected
            ? 'border-white/30 bg-white/10'
            : 'bg-white/5 border-white/10'
        }`}
      >
        <View
          className="w-10 h-10 rounded-full items-center justify-center mt-0.5"
          style={{ backgroundColor: isSelected ? color : `${color}33` }}
        >
          <Text className="text-lg">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text
            className="text-xs font-bold uppercase tracking-wider mb-1"
            style={{ color: isSelected ? color : `${color}99` }}
          >
            {tagLabel}
          </Text>
          <Text className={`text-sm leading-5 ${isSelected ? 'text-white font-semibold' : 'text-white/70'}`}>
            {label}
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}
