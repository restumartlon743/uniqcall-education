import type { ArchetypeCode } from '../types/enums';
import type { CognitiveParams } from '../types/database';
import { ARCHETYPES } from '../constants/archetypes';

/**
 * Classifies a student into one of the 13 archetypes based on their
 * cognitive parameter scores. Uses weighted Euclidean distance to find
 * the closest matching archetype definition.
 */
export function classifyArchetype(params: CognitiveParams): ArchetypeCode {
  const normalized = normalizeParams(params);

  let bestCode: ArchetypeCode = 'THINKER';
  let bestDistance = Infinity;

  for (const archetype of ARCHETYPES) {
    const distance = weightedDistance(normalized, archetype.dominant_params);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestCode = archetype.code;
    }
  }

  return bestCode;
}

/**
 * Normalizes raw cognitive parameter scores so they sum to 100.
 * If all values are zero, returns equal distribution.
 */
export function normalizeParams(params: CognitiveParams): CognitiveParams {
  const total =
    params.analytical +
    params.creative +
    params.linguistic +
    params.kinesthetic +
    params.social +
    params.observation +
    params.intuition;

  if (total === 0) {
    const equal = 100 / 7;
    return {
      analytical: equal,
      creative: equal,
      linguistic: equal,
      kinesthetic: equal,
      social: equal,
      observation: equal,
      intuition: equal,
    };
  }

  const scale = 100 / total;
  return {
    analytical: params.analytical * scale,
    creative: params.creative * scale,
    linguistic: params.linguistic * scale,
    kinesthetic: params.kinesthetic * scale,
    social: params.social * scale,
    observation: params.observation * scale,
    intuition: params.intuition * scale,
  };
}

/**
 * Computes weighted Euclidean distance between two cognitive param profiles.
 * Higher dominant params in the archetype carry more weight to ensure
 * distinctive archetypes are favored when scores are close.
 */
function weightedDistance(a: CognitiveParams, b: CognitiveParams): number {
  const keys: (keyof CognitiveParams)[] = [
    'analytical',
    'creative',
    'linguistic',
    'kinesthetic',
    'social',
    'observation',
    'intuition',
  ];

  let sum = 0;
  for (const key of keys) {
    // Weight by the archetype's expected value — dominant params matter more
    const weight = 1 + b[key] / 50;
    const diff = a[key] - b[key];
    sum += weight * diff * diff;
  }

  return Math.sqrt(sum);
}
