import type { ReactNode } from "react";
import { SafeAreaView, ScrollView } from "react-native";

interface ScreenWrapperProps {
  children: ReactNode;
  scrollable?: boolean;
  className?: string;
}

export function ScreenWrapper({
  children,
  scrollable = false,
  className,
}: ScreenWrapperProps) {
  if (scrollable) {
    return (
      <SafeAreaView className="flex-1 bg-[#0A0E27]">
        <ScrollView
          className="flex-1 px-4 pt-4"
          contentContainerClassName="pb-8"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 bg-[#0A0E27] px-4 pt-4 ${className ?? ""}`}>
      {children}
    </SafeAreaView>
  );
}
