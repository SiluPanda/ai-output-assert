import type { MatcherResult, EmbedFn } from '../types';
import { tokenize } from '../utils/tokenizer';
import { extractNgrams } from '../utils/ngrams';
import { cosineSimilarity } from '../utils/cosine-similarity';
import { splitSentences } from '../utils/sentences';

function ngramJaccardSimilarity(a: string, b: string, n = 3): number {
  const tokensA = tokenize(a.toLowerCase());
  const tokensB = tokenize(b.toLowerCase());
  const ngramsA = new Set(extractNgrams(tokensA, n));
  const ngramsB = new Set(extractNgrams(tokensB, n));
  if (ngramsA.size === 0 && ngramsB.size === 0) return 1;
  if (ngramsA.size === 0 || ngramsB.size === 0) return 0;
  const intersection = new Set([...ngramsA].filter((x) => ngramsB.has(x)));
  const union = new Set([...ngramsA, ...ngramsB]);
  return intersection.size / union.size;
}

async function computeSimilarity(
  a: string,
  b: string,
  embedFn?: EmbedFn,
): Promise<number> {
  if (embedFn) {
    const [vecA, vecB] = await Promise.all([embedFn(a), embedFn(b)]);
    return cosineSimilarity(vecA, vecB);
  }
  return ngramJaccardSimilarity(a, b);
}

export async function toBeSemanticallySimilarTo(
  received: string,
  expected: string,
  options: { threshold?: number; embedFn?: EmbedFn } = {},
): Promise<MatcherResult> {
  const threshold = options.threshold ?? 0.8;
  const similarity = await computeSimilarity(received, expected, options.embedFn);
  const pass = similarity >= threshold;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output not to be semantically similar to reference (similarity: ${similarity.toFixed(3)}, threshold: ${threshold})`
        : `Expected output to be semantically similar to reference, but similarity ${similarity.toFixed(3)} < threshold ${threshold}`,
    details: { similarity, threshold, method: options.embedFn ? 'embedding' : 'ngram-jaccard' },
  };
}

export async function toAnswerQuestion(
  received: string,
  question: string,
  options: { embedFn?: EmbedFn } = {},
): Promise<MatcherResult> {
  const threshold = 0.5;
  const similarity = await computeSimilarity(received, question, options.embedFn);
  const pass = similarity >= threshold;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output not to answer the question (similarity: ${similarity.toFixed(3)})`
        : `Expected output to answer the question, but semantic similarity ${similarity.toFixed(3)} < threshold ${threshold}`,
    details: { similarity, threshold, question },
  };
}

export async function toBeFactuallyConsistentWith(
  received: string,
  reference: string,
  options: { embedFn?: EmbedFn } = {},
): Promise<MatcherResult> {
  const threshold = 0.3;
  const sentences = splitSentences(received);
  if (sentences.length === 0) {
    return {
      pass: true,
      message: () => `Expected output to be factually inconsistent, but output has no sentences`,
      details: { sentences: 0, coverageScores: [] },
    };
  }

  const coverageScores: number[] = [];
  for (const sentence of sentences) {
    const score = await computeSimilarity(sentence, reference, options.embedFn);
    coverageScores.push(score);
  }

  const avgCoverage = coverageScores.reduce((a, b) => a + b, 0) / coverageScores.length;
  const pass = avgCoverage >= threshold;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output not to be factually consistent with reference (avg coverage: ${avgCoverage.toFixed(3)})`
        : `Expected output to be factually consistent with reference, but avg coverage ${avgCoverage.toFixed(3)} < threshold ${threshold}`,
    details: { avgCoverage, threshold, coverageScores, sentenceCount: sentences.length },
  };
}
