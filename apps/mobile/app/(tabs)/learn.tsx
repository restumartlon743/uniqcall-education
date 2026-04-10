import { useState } from 'react';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/components/ui/screen-wrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { useStudentStore } from '@/lib/student-store';
import type { Article } from '@/lib/student-store';

const FILTERS = [
  { key: 'semua', label: 'Semua' },
  { key: 'jurusan', label: 'Jurusan' },
  { key: 'karir', label: 'Karir' },
  { key: 'tips', label: 'Tips Belajar' },
  { key: 'inspirasi', label: 'Inspirasi' },
] as const;

const VARK_TIPS: Record<string, { label: string; tips: string }> = {
  V: {
    label: 'Visual Learner',
    tips: 'Gunakan diagram, mind map, dan video untuk memahami konsep. Warnai catatan dan buat sketsa visualisasi materi.',
  },
  A: {
    label: 'Auditori Learner',
    tips: 'Dengarkan podcast, diskusi kelompok, dan rekaman penjelasan. Coba jelaskan ulang materi dengan kata-katamu sendiri.',
  },
  R: {
    label: 'Baca/Tulis Learner',
    tips: 'Baca artikel dan buku, buat ringkasan tertulis, dan catat poin penting. Tuliskan ulang materi dalam bahasamu.',
  },
  K: {
    label: 'Kinestetik Learner',
    tips: 'Praktikkan langsung, buat proyek mini, dan gunakan simulasi. Pelajari dengan bergerak dan mencoba.',
  },
};

export default function LearnScreen() {
  const [activeFilter, setActiveFilter] = useState<string>('semua');
  const articles = useStudentStore((s) => s.articles);
  const profile = useStudentStore((s) => s.profile);

  const filteredArticles =
    activeFilter === 'semua'
      ? articles
      : articles.filter((a) => a.category === activeFilter);

  const varkTip = profile?.dominantVark
    ? VARK_TIPS[profile.dominantVark]
    : null;

  return (
    <ScreenWrapper scrollable>
      {/* ── Header ───────────────────────────────────────── */}
      <View className="mb-4">
        <Text className="text-2xl font-extrabold text-white">
          Ruang Belajar 📚
        </Text>
        <Text className="text-sm text-white/50 mt-1">
          Konten yang dipersonalisasi untukmu
        </Text>
      </View>

      {/* ── Filter Chips ─────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4 -mx-1"
      >
        <View className="flex-row gap-2 px-1">
          {FILTERS.map((f) => (
            <Pressable
              key={f.key}
              onPress={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-full border ${
                activeFilter === f.key
                  ? 'bg-[#8B5CF6] border-[#A855F7]'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  activeFilter === f.key ? 'text-white' : 'text-white/60'
                }`}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* ── VARK Learning Tip ────────────────────────────── */}
      {varkTip && (
        <View
          className="mb-4 rounded-2xl p-4 border border-[#22D3EE]/30"
          style={{
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            shadowColor: '#06B6D4',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center mb-2">
            <Text className="text-lg mr-2">💡</Text>
            <Text className="text-[#22D3EE] font-bold text-sm">
              Tips untuk {varkTip.label}
            </Text>
          </View>
          <Text className="text-white/70 text-xs leading-5">
            {varkTip.tips}
          </Text>
        </View>
      )}

      {/* ── Article Cards ────────────────────────────────── */}
      {filteredArticles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}

      {filteredArticles.length === 0 && (
        <View className="items-center py-12">
          <Text className="text-3xl mb-3">📭</Text>
          <Text className="text-white/40 text-sm">
            Belum ada artikel untuk kategori ini
          </Text>
        </View>
      )}
    </ScreenWrapper>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Pressable className="mb-3">
      <GlassCard>
        <View className="flex-row">
          {/* Thumbnail */}
          <View className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 items-center justify-center mr-3">
            <Text className="text-2xl">{article.thumbnailEmoji}</Text>
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text className="text-white font-semibold text-sm leading-5" numberOfLines={2}>
              {article.title}
            </Text>
            <View className="flex-row items-center mt-2 gap-2">
              <View className="bg-[#8B5CF6]/15 px-2 py-0.5 rounded-md">
                <Text className="text-[#A855F7] text-[10px] font-semibold">
                  {article.categoryLabel}
                </Text>
              </View>
              <Text className="text-white/40 text-[10px]">
                {article.readingTime} menit baca
              </Text>
            </View>
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}
