import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type NeonButtonVariant = "primary" | "secondary" | "success";

interface NeonButtonProps {
  title: string;
  variant?: NeonButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

const variantStyles: Record<NeonButtonVariant, string> = {
  primary: "bg-[#8B5CF6] border-[#A855F7]",
  secondary: "bg-[#06B6D4] border-[#22D3EE]",
  success: "bg-[#F59E0B] border-[#FBBF24]",
};

const variantShadow: Record<NeonButtonVariant, string> = {
  primary: "#8B5CF6",
  secondary: "#06B6D4",
  success: "#F59E0B",
};

export function NeonButton({
  title,
  variant = "primary",
  onPress,
  disabled = false,
  className,
}: NeonButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        {
          shadowColor: variantShadow[variant],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 12,
          elevation: 8,
        },
      ]}
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
      disabled={disabled}
      className={`rounded-xl border-2 px-6 py-4 items-center ${variantStyles[variant]} ${
        disabled ? "opacity-50" : ""
      } ${className ?? ""}`}
    >
      <Text className="text-white font-bold text-lg">{title}</Text>
    </AnimatedPressable>
  );
}
