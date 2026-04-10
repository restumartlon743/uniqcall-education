import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  color = '#8B5CF6',
  height = 8,
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const animWidth = useSharedValue(0);

  useEffect(() => {
    animWidth.value = withDelay(200, withTiming(percentage, { duration: 800 }));
  }, [percentage]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${animWidth.value}%`,
  }));

  return (
    <View className={className}>
      {showLabel && (
        <View className="flex-row justify-between mb-1">
          <Text className="text-white/60 text-xs">{value} / {max}</Text>
          <Text className="text-white/60 text-xs">{percentage}%</Text>
        </View>
      )}
      <View
        className="rounded-full overflow-hidden bg-white/10"
        style={{ height }}
      >
        <Animated.View
          style={[barStyle, { height, backgroundColor: color, borderRadius: 999 }]}
        />
      </View>
    </View>
  );
}
