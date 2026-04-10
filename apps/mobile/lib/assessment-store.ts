import { create } from 'zustand';
import type { CognitiveParam, VarkTag, ArchetypeCode } from '@uniqcall/shared';
import type { CognitiveParams, VarkProfile } from '@uniqcall/shared';
import { classifyArchetype, scoreVark } from '@uniqcall/shared';
import { COGNITIVE_QUESTIONS } from './assessment-data';

interface AssessmentState {
  cognitiveAnswers: Record<string, number>;
  varkAnswers: Record<string, VarkTag>;
  cognitiveScores: Record<CognitiveParam, number> | null;
  varkScores: VarkProfile | null;
  archetype: ArchetypeCode | null;

  setCognitiveAnswer: (questionId: string, score: number) => void;
  setVarkAnswer: (questionId: string, tag: VarkTag) => void;
  calculateResults: () => void;
  reset: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  cognitiveAnswers: {},
  varkAnswers: {},
  cognitiveScores: null,
  varkScores: null,
  archetype: null,

  setCognitiveAnswer: (questionId, score) => {
    set((state) => ({
      cognitiveAnswers: { ...state.cognitiveAnswers, [questionId]: score },
    }));
  },

  setVarkAnswer: (questionId, tag) => {
    set((state) => ({
      varkAnswers: { ...state.varkAnswers, [questionId]: tag },
    }));
  },

  calculateResults: () => {
    const state = get();

    // Group cognitive answers by module and compute averages
    const moduleTotals: Record<string, { sum: number; count: number }> = {};
    for (const question of COGNITIVE_QUESTIONS) {
      const score = state.cognitiveAnswers[question.id];
      if (score === undefined) continue;
      if (!moduleTotals[question.module]) {
        moduleTotals[question.module] = { sum: 0, count: 0 };
      }
      moduleTotals[question.module].sum += score;
      moduleTotals[question.module].count += 1;
    }

    const cognitiveScores: Record<string, number> = {};
    for (const [mod, { sum, count }] of Object.entries(moduleTotals)) {
      cognitiveScores[mod] = count > 0 ? sum / count : 0;
    }

    // Build CognitiveParams for archetype classifier
    const cognitiveParams: CognitiveParams = {
      analytical: cognitiveScores['analytical'] ?? 0,
      creative: cognitiveScores['creative'] ?? 0,
      linguistic: cognitiveScores['linguistic'] ?? 0,
      kinesthetic: cognitiveScores['kinesthetic'] ?? 0,
      social: cognitiveScores['social'] ?? 0,
      observation: cognitiveScores['observation'] ?? 0,
      intuition: cognitiveScores['intuition'] ?? 0,
    };

    const archetype = classifyArchetype(cognitiveParams);

    // Calculate VARK scores
    const varkAnswerArray = Object.entries(state.varkAnswers).map(
      ([questionId, tag]) => ({
        question_id: questionId,
        selected_tags: [tag] as VarkTag[],
      }),
    );
    const varkScores = scoreVark(varkAnswerArray);

    set({
      cognitiveScores: cognitiveScores as Record<CognitiveParam, number>,
      varkScores,
      archetype,
    });
  },

  reset: () => {
    set({
      cognitiveAnswers: {},
      varkAnswers: {},
      cognitiveScores: null,
      varkScores: null,
      archetype: null,
    });
  },
}));
