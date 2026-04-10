import { View, Text, Pressable } from 'react-native';
import type { QuestStatus } from '@uniqcall/shared';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface QuestNodeProps {
  title: string;
  description: string;
  status: QuestStatus;
  xpReward: number;
  order: number;
  isLast?: boolean;
  onPress?: () => void;
}

export function QuestNode({
  title,
  description,
  status,
  xpReward,
  order,
  isLast = false,
  onPress,
}: QuestNodeProps) {
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    if (status === 'in_progress') {
      glowOpacity.value = withRepeat(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    }
  }, [status]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const isCompleted = status === 'completed';
  const isCurrent = status === 'in_progress';
  const isLocked = status === 'locked' || status === 'unlocked';

  return (
    <View className="flex-row mb-0">
      {/* Left: Node + Line */}
      <View className="items-center w-12">
        {/* Node circle */}
        <View className="relative">
          {isCurrent && (
            <Animated.View
              style={[
                glowStyle,
                {
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  right: -4,
                  bottom: -4,
                  borderRadius: 999,
                  borderWidth: 2,
                  borderColor: '#A855F7',
                  shadowColor: '#8B5CF6',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 12,
                  elevation: 8,
                },
              ]}
            />
          )}
          <View
            className={`w-10 h-10 rounded-full items-center justify-center border-2 ${
              isCompleted
                ? 'bg-[#8B5CF6] border-[#A855F7]'
                : isCurrent
                ? 'bg-[#8B5CF6]/30 border-[#A855F7]'
                : 'bg-white/5 border-white/20'
            }`}
          >
            {isCompleted ? (
              <Text className="text-white font-bold text-sm">✓</Text>
            ) : (
              <Text className={`font-bold text-sm ${isLocked ? 'text-white/30' : 'text-white'}`}>
                {order}
              </Text>
            )}
          </View>
        </View>

        {/* Connecting line */}
        {!isLast && (
          <View
            className={`w-0.5 flex-1 min-h-[20px] ${
              isCompleted ? 'bg-[#8B5CF6]' : 'bg-white/15'
            }`}
            style={{ marginTop: 2, marginBottom: 2 }}
          />
        )}
      </View>

      {/* Right: Content */}
      <Pressable
        onPress={!isLocked ? onPress : undefined}
        className={`flex-1 ml-3 mb-4 rounded-xl p-3.5 border ${
          isCompleted
            ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30'
            : isCurrent
            ? 'bg-white/8 border-[#A855F7]/40'
            : 'bg-white/3 border-white/8'
        }`}
      >
        <View className="flex-row items-center justify-between mb-1">
          <Text
            className={`font-bold text-sm flex-1 ${
              isLocked ? 'text-white/30' : 'text-white'
            }`}
          >
            {title}
          </Text>
          <View className="bg-[#F59E0B]/15 px-2 py-0.5 rounded-md ml-2">
            <Text className="text-[#F59E0B] text-[10px] font-bold">+{xpReward} XP</Text>
          </View>
        </View>
        <Text
          className={`text-xs ${isLocked ? 'text-white/20' : 'text-white/50'}`}
          numberOfLines={2}
        >
          {description}
        </Text>
        {isCurrent && (
          <View className="mt-2 bg-[#8B5CF6] self-start px-3 py-1.5 rounded-lg">
            <Text className="text-white text-xs font-bold">Lanjutkan →</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}
