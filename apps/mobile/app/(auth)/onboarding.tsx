import { useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { NeonButton } from "@/components/ui/neon-button";
import { GlassCard } from "@/components/ui/glass-card";

export default function OnboardingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [schoolCode, setSchoolCode] = useState("");
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!schoolCode.trim() || !className.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Update user metadata to mark as onboarded
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          onboarded: true,
          school_code: schoolCode.trim(),
          class_name: className.trim(),
        },
      });

      if (updateError) throw updateError;

      router.replace("/assessment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A0E27]">
      <View className="flex-1 px-6 pt-12">
        {/* Header */}
        <Text className="text-3xl font-extrabold text-white mb-2">
          Welcome! 👋
        </Text>
        <Text className="text-base text-white/60 mb-8">
          Let&apos;s set up your profile, {user?.user_metadata?.full_name ?? "Student"}
        </Text>

        {/* Form */}
        <GlassCard className="mb-6">
          <Text className="text-white/80 text-sm font-semibold mb-2 uppercase tracking-wider">
            School Code
          </Text>
          <TextInput
            value={schoolCode}
            onChangeText={setSchoolCode}
            placeholder="Enter your school code"
            placeholderTextColor="rgba(255,255,255,0.3)"
            autoCapitalize="characters"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base"
          />
        </GlassCard>

        <GlassCard className="mb-8">
          <Text className="text-white/80 text-sm font-semibold mb-2 uppercase tracking-wider">
            Class
          </Text>
          <TextInput
            value={className}
            onChangeText={setClassName}
            placeholder="e.g. X-IPA-1"
            placeholderTextColor="rgba(255,255,255,0.3)"
            autoCapitalize="characters"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base"
          />
        </GlassCard>

        {error && (
          <Text className="text-[#EF4444] text-sm mb-4 text-center">
            {error}
          </Text>
        )}

        {/* Continue button */}
        {loading ? (
          <ActivityIndicator size="large" color="#8B5CF6" />
        ) : (
          <NeonButton
            title="Continue to Assessment"
            variant="primary"
            onPress={handleContinue}
          />
        )}

        {/* Progress dots */}
        <View className="flex-row items-center justify-center gap-2 mt-8">
          <View className="w-8 h-2 rounded-full bg-[#8B5CF6]" />
          <View className="w-2 h-2 rounded-full bg-white/20" />
          <View className="w-2 h-2 rounded-full bg-white/20" />
        </View>
      </View>
    </SafeAreaView>
  );
}
