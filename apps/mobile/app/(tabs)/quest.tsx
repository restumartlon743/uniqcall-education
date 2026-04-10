import { useState } from 'react';
import { Text, View, Modal, Pressable } from 'react-native';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { QuestNode } from '@/components/ui/quest-node';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useStudentStore } from '@/lib/student-store';
import type { QuestStep } from '@/lib/student-store';

export default function QuestScreen() {
  const questSteps = useStudentStore((s) => s.questSteps);
  const profile = useStudentStore((s) => s.profile);
  const completeQuestStep = useStudentStore((s) => s.completeQuestStep);

  const [selectedQuest, setSelectedQuest] = useState<QuestStep | null>(null);

  const completedCount = questSteps.filter((q) => q.status === 'completed').length;
  const totalXP = questSteps.reduce((sum, q) => sum + q.xpReward, 0);
  const earnedXP = questSteps
    .filter((q) => q.status === 'completed')
    .reduce((sum, q) => sum + q.xpReward, 0);

  return (
    <ScreenWrapper scrollable>
      {/* ── Header ───────────────────────────────────────── */}
      <View className="mb-5">
        <Text className="text-2xl font-extrabold text-white">
          Career Quest 🗺️
        </Text>
        <Text className="text-sm text-white/50 mt-1">
          Jalur karir untuk {profile?.fullName ?? 'kamu'}
        </Text>
      </View>

      {/* ── Progress Overview ────────────────────────────── */}
      <GlassCard className="mb-5">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white font-semibold text-sm">
            Progress Quest
          </Text>
          <Text className="text-white/50 text-xs">
            {completedCount}/{questSteps.length} selesai
          </Text>
        </View>
        <ProgressBar
          value={completedCount}
          max={questSteps.length}
          color="#8B5CF6"
        />
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-[#F59E0B] text-xs font-semibold">
            {earnedXP} / {totalXP} XP
          </Text>
          <Text className="text-white/40 text-xs">
            {Math.round((completedCount / (questSteps.length || 1)) * 100)}%
          </Text>
        </View>
      </GlassCard>

      {/* ── Journey Map ──────────────────────────────────── */}
      <View className="mb-4">
        {questSteps.map((step, index) => (
          <QuestNode
            key={step.id}
            title={step.title}
            description={step.description}
            status={step.status}
            xpReward={step.xpReward}
            order={step.order}
            isLast={index === questSteps.length - 1}
            onPress={() => setSelectedQuest(step)}
          />
        ))}
      </View>

      {/* ── Quest Detail Modal ───────────────────────────── */}
      <Modal
        visible={!!selectedQuest}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedQuest(null)}
      >
        <Pressable
          className="flex-1 bg-black/60 justify-end"
          onPress={() => setSelectedQuest(null)}
        >
          <Pressable
            onPress={() => {}}
            className="bg-[#151B3B] rounded-t-3xl border-t border-white/10 p-6 pb-10"
          >
            {selectedQuest && (
              <>
                <View className="w-10 h-1 rounded-full bg-white/20 self-center mb-5" />
                <View className="flex-row items-center mb-3">
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center mr-3 border-2 ${
                      selectedQuest.status === 'completed'
                        ? 'bg-[#8B5CF6] border-[#A855F7]'
                        : 'bg-[#8B5CF6]/30 border-[#A855F7]'
                    }`}
                  >
                    {selectedQuest.status === 'completed' ? (
                      <Text className="text-white font-bold">✓</Text>
                    ) : (
                      <Text className="text-white font-bold">{selectedQuest.order}</Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg">
                      {selectedQuest.title}
                    </Text>
                    <View className="bg-[#F59E0B]/15 px-2 py-0.5 rounded-md self-start mt-1">
                      <Text className="text-[#F59E0B] text-xs font-bold">
                        +{selectedQuest.xpReward} XP
                      </Text>
                    </View>
                  </View>
                </View>

                <Text className="text-white/60 text-sm leading-5 mb-5">
                  {selectedQuest.description}
                </Text>

                {selectedQuest.status === 'completed' ? (
                  <View className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl p-4 items-center">
                    <Text className="text-[#22C55E] font-bold text-sm">
                      ✅ Quest Selesai!
                    </Text>
                  </View>
                ) : selectedQuest.status === 'in_progress' ? (
                  <NeonButton
                    title="Lanjutkan Quest"
                    variant="primary"
                    onPress={() => setSelectedQuest(null)}
                  />
                ) : (
                  <View className="bg-white/5 border border-white/10 rounded-xl p-4 items-center">
                    <Text className="text-white/40 text-sm">
                      🔒 Selesaikan quest sebelumnya terlebih dahulu
                    </Text>
                  </View>
                )}
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenWrapper>
  );
}
