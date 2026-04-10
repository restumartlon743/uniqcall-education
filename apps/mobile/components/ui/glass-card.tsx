import type { ReactNode } from "react";
import { View } from "react-native";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <View
      className={`bg-white/5 border border-white/10 rounded-2xl p-4 ${className ?? ""}`}
      style={{
        shadowColor: "#8B5CF6",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      {children}
    </View>
  );
}
