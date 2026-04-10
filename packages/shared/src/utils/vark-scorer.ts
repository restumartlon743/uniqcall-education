import type { VarkTag } from '../types/enums';
import type { VarkProfile } from '../types/database';

export interface VarkAnswer {
  question_id: string;
  selected_tags: VarkTag[];
}

/**
 * Scores VARK assessment answers into a percentage profile.
 * Each answer can map to one or more VARK tags (multimodal).
 * Returns percentages for each style that sum to 100.
 */
export function scoreVark(answers: VarkAnswer[]): VarkProfile {
  const counts: Record<VarkTag, number> = { V: 0, A: 0, R: 0, K: 0 };

  for (const answer of answers) {
    for (const tag of answer.selected_tags) {
      counts[tag]++;
    }
  }

  const total = counts.V + counts.A + counts.R + counts.K;

  if (total === 0) {
    return { V: 25, A: 25, R: 25, K: 25 };
  }

  return {
    V: Math.round((counts.V / total) * 100),
    A: Math.round((counts.A / total) * 100),
    R: Math.round((counts.R / total) * 100),
    K: Math.round((counts.K / total) * 100),
  };
}

/**
 * Returns the dominant VARK style(s). If multiple styles tie,
 * all tied styles are returned (multimodal learner).
 */
export function dominantVarkStyles(profile: VarkProfile): VarkTag[] {
  const entries: [VarkTag, number][] = [
    ['V', profile.V],
    ['A', profile.A],
    ['R', profile.R],
    ['K', profile.K],
  ];

  const maxScore = Math.max(...entries.map(([, v]) => v));
  return entries.filter(([, v]) => v === maxScore).map(([tag]) => tag);
}
