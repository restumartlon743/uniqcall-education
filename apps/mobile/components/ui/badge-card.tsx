import { View, Text, Pressable } from 'react-native';
import type { BadgeDefinition } from '@uniqcall/shared';

interface BadgeCardProps {
  badge: BadgeDefinition;
  earned: boolean;
  size?: 'sm' | 'md';
  onPress?: () => void;
}

const categoryEmoji: Record<string, string> = {
  cognitive: '🧠',
  streak: '🔥',
  project: '🏗️',
  peer: '🤝',
  career: '🗺️',
};

export function BadgeCard({ badge, earned, size = 'md', onPress }: BadgeCardProps) {
  const iconSize = size === 'sm' ? 'w-12 h-12' : 'w-16 h-16';
  const emoji = categoryEmoji[badge.category] ?? '🏅';

  return (
    <Pressable onPress={onPress} className="items-center">
      <View
        className={`${iconSize} rounded-full items-center justify-center ${
          earned ? 'bg-[#8B5CF6]/20 border-2 border-[#A855F7]' : 'bg-white/5 border border-white/10'
        }`}
        style={
          earned
            ? {
                shadowColor: '#A855F7',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 10,
                elevation: 6,
              }
            : undefined
        }
      >
        {earned ? (
          <Text className={size === 'sm' ? 'text-lg' : 'text-2xl'}>{emoji}</Text>
        ) : (
          <Text className={`${size === 'sm' ? 'text-lg' : 'text-2xl'} opacity-30`}>🔒</Text>
        )}
      </View>
      <Text
        className={`text-center mt-1.5 ${
          earned ? 'text-white/80' : 'text-white/30'
        } ${size === 'sm' ? 'text-[10px] w-14' : 'text-xs w-18'}`}
        numberOfLines={2}
      >
        {badge.name}
      </Text>
    </Pressable>
  );
}
