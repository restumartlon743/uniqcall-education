import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/glass-card';
import { useAssessmentStore } from '@/lib/assessment-store';
import { COGNITIVE_QUESTIONS, COGNITIVE_MODULES } from '@/lib/assessment-data';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const QUESTIONS_PER_MODULE = 5;
const TOTAL_QUESTIONS = COGNITIVE_QUESTIONS.length;
const AUTO_ADVANCE_MS = 500;
const MODULE_TRANSITION_MS = 2000;

export default function CognitiveScreen() {
  const router = useRouter();
  const setCognitiveAnswer = useAssessmentStore((s) => s.setCognitiveAnswer);
  const cognitiveAnswers = useAssessmentStore((s) => s.cognitiveAnswers);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionModuleIdx, setTransitionModuleIdx] = useState(0);

  const progressWidth = useSharedValue(0);

  const currentQuestion = COGNITIVE_QUESTIONS[currentIndex];
  const currentModuleIdx = Math.floor(currentIndex / QUESTIONS_PER_MODULE);
  const currentModule = COGNITIVE_MODULES[currentModuleIdx];
  const questionInModule = (currentIndex % QUESTIONS_PER_MODULE) + 1;

  useEffect(() => {
    progressWidth.value = withTiming(((currentIndex + 1) / TOTAL_QUESTIONS) * 100, {
      duration: 300,
    });
  }, [currentIndex, progressWidth]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const handleSelectOption = useCallback(
    (value: number) => {
      if (selectedOption !== null) return;
      setSelectedOption(value);
      setCognitiveAnswer(currentQuestion.id, value);

      setTimeout(() => {
        const nextIndex = currentIndex + 1;

        if (nextIndex >= TOTAL_QUESTIONS) {
          router.push('/assessment/vark');
          return;
        }

        const nextModuleIdx = Math.floor(nextIndex / QUESTIONS_PER_MODULE);
        if (nextModuleIdx !== currentModuleIdx) {
          setTransitionModuleIdx(nextModuleIdx);
          setShowTransition(true);
          setTimeout(() => {
            setShowTransition(false);
            setCurrentIndex(nextIndex);
            setSelectedOption(null);
          }, MODULE_TRANSITION_MS);
        } else {
          setCurrentIndex(nextIndex);
          setSelectedOption(null);
        }
      }, AUTO_ADVANCE_MS);
    },
    [currentIndex, currentModuleIdx, currentQuestion.id, selectedOption, setCognitiveAnswer, router],
  );

  // Module transition screen
  if (showTransition) {
    const mod = COGNITIVE_MODULES[transitionModuleIdx];
    return (
      <SafeAreaView className="flex-1 bg-[#0A0E27]">
        <Animated.View
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(300)}
          className="flex-1 items-center justify-center px-6"
        >
          <Text className="text-6xl mb-4">{mod.emoji}</Text>
          <Text className="text-white/50 text-sm font-semibold uppercase tracking-widest mb-2">
            Modul {transitionModuleIdx + 1} dari 7
          </Text>
          <Text className="text-2xl font-extrabold text-white text-center mb-2">
            {mod.label}
          </Text>
          <Text className="text-[#22D3EE] text-sm text-center">{mod.description}</Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0A0E27]">
      <View className="flex-1 px-5 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg">{currentModule.emoji}</Text>
            <Text className="text-white font-bold text-sm">{currentModule.label}</Text>
          </View>
          <Text className="text-white/40 text-xs">
            Modul {currentModuleIdx + 1}/7 • Soal {questionInModule}/5
          </Text>
        </View>

        {/* Progress bar */}
        <View className="h-2 bg-white/10 rounded-full mb-1">
          <Animated.View
            className="h-2 bg-[#8B5CF6] rounded-full"
            style={progressStyle}
          />
        </View>
        <Text className="text-white/30 text-xs text-right mb-6">
          {currentIndex + 1} / {TOTAL_QUESTIONS}
        </Text>

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
              return (
                <OptionCard
                  key={`${currentQuestion.id}-${idx}`}
                  label={option.label}
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

// ─── Option Card ──────────────────────────────────────────────

function OptionCard({
  label,
  index,
  isSelected,
  disabled,
  onPress,
}: {
  label: string;
  index: number;
  isSelected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const letters = ['A', 'B', 'C', 'D'];

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
                shadowColor: '#8B5CF6',
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
            ? 'bg-[#8B5CF6]/20 border-[#A855F7]'
            : 'bg-white/5 border-white/10'
        }`}
      >
        <View
          className={`w-8 h-8 rounded-full items-center justify-center mt-0.5 ${
            isSelected ? 'bg-[#8B5CF6]' : 'bg-white/10'
          }`}
        >
          <Text className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-white/50'}`}>
            {letters[index]}
          </Text>
        </View>
        <Text className={`flex-1 text-sm leading-5 ${isSelected ? 'text-white font-semibold' : 'text-white/70'}`}>
          {label}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}
