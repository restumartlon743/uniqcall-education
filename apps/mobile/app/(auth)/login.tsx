import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth-context";
import { NeonButton } from "@/components/ui/neon-button";

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A0E27]">
      <View className="flex-1 items-center justify-center px-8">
        {/* Neon glow accent line */}
        <View
          className="w-24 h-1 rounded-full bg-[#8B5CF6] mb-8"
          style={{
            shadowColor: "#8B5CF6",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 16,
            elevation: 10,
          }}
        />

        {/* Title */}
        <Text className="text-4xl font-extrabold text-white tracking-wider mb-2">
          Uniqcall
        </Text>
        <Text className="text-lg font-semibold text-[#A855F7] tracking-widest uppercase mb-4">
          Education
        </Text>

        {/* Subtitle */}
        <Text className="text-base text-[#22D3EE] text-center mb-12">
          Empowering Every Unique Mind
        </Text>

        {/* Character silhouettes placeholder */}
        <View className="flex-row gap-6 mb-16">
          <View className="w-20 h-28 rounded-2xl bg-white/5 border border-white/10 items-center justify-center">
            <View className="w-10 h-10 rounded-full bg-[#8B5CF6]/30 border border-[#8B5CF6]/50" />
            <View className="w-8 h-12 rounded-lg bg-[#8B5CF6]/20 mt-2" />
          </View>
          <View className="w-20 h-28 rounded-2xl bg-white/5 border border-white/10 items-center justify-center">
            <View className="w-10 h-10 rounded-full bg-[#06B6D4]/30 border border-[#06B6D4]/50" />
            <View className="w-8 h-12 rounded-lg bg-[#06B6D4]/20 mt-2" />
          </View>
          <View className="w-20 h-28 rounded-2xl bg-white/5 border border-white/10 items-center justify-center">
            <View className="w-10 h-10 rounded-full bg-[#F59E0B]/30 border border-[#F59E0B]/50" />
            <View className="w-8 h-12 rounded-lg bg-[#F59E0B]/20 mt-2" />
          </View>
        </View>

        {/* Sign in button */}
        {loading ? (
          <ActivityIndicator size="large" color="#8B5CF6" />
        ) : (
          <NeonButton
            title="Enter Your Dashboard"
            variant="primary"
            onPress={handleSignIn}
            className="w-full"
          />
        )}

        {error && (
          <Text className="text-[#EF4444] text-sm mt-4 text-center">
            {error}
          </Text>
        )}

        {/* Footer accent */}
        <View className="absolute bottom-8">
          <Text className="text-white/30 text-xs tracking-widest">
            SISTEM NAVIGASI MASA DEPAN SISWA
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
