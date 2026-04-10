import { View, Text, Pressable } from 'react-native';
import type { MissionStatus } from '@uniqcall/shared';

interface MissionCardProps {
  title: string;
  xpReward: number;
  status: MissionStatus;
  onToggle?: () => void;
}

export function MissionCard({ title, xpReward, status, onToggle }: MissionCardProps) {
  const isCompleted = status === 'completed';

  return (
    <Pressable
      onPress={onToggle}
      className={`flex-row items-center bg-white/5 border rounded-xl p-3.5 mb-2 ${
        isCompleted ? 'border-[#22C55E]/30' : 'border-white/10'
      }`}
    >
      {/* Checkbox */}
      <View
        className={`w-6 h-6 rounded-lg border-2 items-center justify-center mr-3 ${
          isCompleted
            ? 'bg-[#22C55E] border-[#22C55E]'
            : 'border-white/30 bg-transparent'
        }`}
      >
        {isCompleted && <Text className="text-white text-xs font-bold">✓</Text>}
      </View>

      {/* Title */}
      <Text
        className={`flex-1 text-sm font-medium ${
          isCompleted ? 'text-white/40 line-through' : 'text-white'
        }`}
      >
        {title}
      </Text>

      {/* XP Reward */}
      <View className="bg-[#F59E0B]/15 px-2.5 py-1 rounded-lg">
        <Text className="text-[#F59E0B] text-xs font-bold">+{xpReward} XP</Text>
      </View>
    </Pressable>
  );
}
