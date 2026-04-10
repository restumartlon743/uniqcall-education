import { View, Text } from 'react-native';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  color = '#8B5CF6',
  className,
}: StatCardProps) {
  return (
    <View
      className={`bg-white/5 border border-white/10 rounded-xl p-3 flex-1 ${className ?? ''}`}
      style={{
        shadowColor: color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <Text className="text-xl mb-1">{icon}</Text>
      <Text
        className="text-lg font-bold"
        style={{ color }}
      >
        {value}
      </Text>
      <Text className="text-white/50 text-xs mt-0.5">{label}</Text>
    </View>
  );
}
