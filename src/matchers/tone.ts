import type { MatcherResult, Sentiment, Tone } from '../types';
import { tokenize } from '../utils/tokenizer';
import { splitSentences } from '../utils/sentences';

const POSITIVE_WORDS = new Set([
  'good', 'great', 'excellent', 'amazing', 'happy', 'love', 'wonderful', 'fantastic',
  'positive', 'best', 'better', 'improve', 'superb', 'outstanding', 'brilliant',
  'perfect', 'awesome', 'delightful', 'enjoy', 'glad', 'pleased', 'helpful',
  'beautiful', 'success', 'successful', 'well', 'nice', 'clear', 'easy',
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'awful', 'horrible', 'poor', 'worst', 'hate', 'negative',
  'fail', 'wrong', 'problem', 'broken', 'error', 'issue', 'painful', 'difficult',
  'ugly', 'boring', 'useless', 'ineffective', 'disappointing', 'frustrated',
  'confusing', 'complicated', 'failure', 'crash', 'bug', 'defect',
]);

const INFORMAL_WORDS = new Set([
  'gonna', 'wanna', 'gotta', 'kinda', 'sorta', 'yeah', 'yep', 'nope',
  'hey', 'ok', 'okay', 'cool', 'stuff', 'thing', 'things', 'got', 'get',
  'cause', 'cuz', 'tbh', 'imo', 'lol', 'btw', 'fyi',
]);

const CONTRACTIONS = /\b(?:I'm|I've|I'll|I'd|you're|you've|you'll|you'd|he's|she's|it's|we're|we've|we'll|they're|they've|don't|doesn't|didn't|can't|couldn't|won't|wouldn't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't)\b/gi;

export function toHaveSentiment(received: string, expected: Sentiment): MatcherResult {
  const tokens = tokenize(received.toLowerCase());
  let posCount = 0;
  let negCount = 0;
  for (const t of tokens) {
    const word = t.replace(/[^a-z]/g, '');
    if (POSITIVE_WORDS.has(word)) posCount++;
    if (NEGATIVE_WORDS.has(word)) negCount++;
  }
  const total = posCount + negCount;
  let detected: Sentiment;
  if (total === 0) {
    detected = 'neutral';
  } else {
    const ratio = posCount / total;
    detected = ratio > 0.6 ? 'positive' : ratio < 0.4 ? 'negative' : 'neutral';
  }
  const pass = detected === expected;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output not to have ${expected} sentiment`
        : `Expected ${expected} sentiment, but detected ${detected} (positive: ${posCount}, negative: ${negCount})`,
    details: { expected, detected, positiveCount: posCount, negativeCount: negCount },
  };
}

export function toHaveTone(received: string, expected: Tone): MatcherResult {
  const tokens = tokenize(received);
  const sentences = splitSentences(received);
  const wordCount = tokens.length;

  let detected: Tone;
  let score = 0;
  let reason = '';

  if (expected === 'formal') {
    const contractionCount = (received.match(CONTRACTIONS) ?? []).length;
    const contractionRate = wordCount > 0 ? contractionCount / wordCount : 0;
    const avgSentenceLen = sentences.length > 0 ? wordCount / sentences.length : 0;
    score = (1 - contractionRate) * 0.5 + (Math.min(avgSentenceLen, 20) / 20) * 0.5;
    detected = score >= 0.6 ? 'formal' : 'casual';
    reason = `contraction rate: ${contractionRate.toFixed(2)}, avg sentence len: ${avgSentenceLen.toFixed(1)}`;
  } else if (expected === 'casual') {
    const contractionCount = (received.match(CONTRACTIONS) ?? []).length;
    const contractionRate = wordCount > 0 ? contractionCount / wordCount : 0;
    const informalCount = tokens.filter((t) => INFORMAL_WORDS.has(t.toLowerCase())).length;
    const informalRate = wordCount > 0 ? informalCount / wordCount : 0;
    score = contractionRate * 0.5 + informalRate * 10 * 0.5;
    detected = score >= 0.1 ? 'casual' : 'formal';
    reason = `contraction rate: ${contractionRate.toFixed(2)}, informal word rate: ${informalRate.toFixed(2)}`;
  } else if (expected === 'technical') {
    const longWords = tokens.filter((t) => t.replace(/[^a-zA-Z]/g, '').length > 8).length;
    const longWordRate = wordCount > 0 ? longWords / wordCount : 0;
    const hasCode = /`[^`]+`|```[\s\S]*?```/.test(received);
    score = longWordRate * 0.7 + (hasCode ? 0.3 : 0);
    detected = score >= 0.15 ? 'technical' : 'formal';
    reason = `long word rate: ${longWordRate.toFixed(2)}, has code: ${hasCode}`;
  } else {
    // friendly
    const exclamations = (received.match(/!/g) ?? []).length;
    const youCount = tokens.filter((t) => t.toLowerCase() === 'you').length;
    const positiveCount = tokens.filter((t) => POSITIVE_WORDS.has(t.toLowerCase().replace(/[^a-z]/g, ''))).length;
    score = (exclamations * 0.1 + (youCount / Math.max(wordCount, 1)) * 5 + (positiveCount / Math.max(wordCount, 1)) * 3);
    detected = score >= 0.15 ? 'friendly' : 'formal';
    reason = `exclamations: ${exclamations}, you-frequency: ${(youCount / Math.max(wordCount, 1)).toFixed(2)}, positive rate: ${(positiveCount / Math.max(wordCount, 1)).toFixed(2)}`;
  }

  const pass = detected === expected;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output not to have ${expected} tone`
        : `Expected ${expected} tone, but detected ${detected} (${reason})`,
    details: { expected, detected, score, reason },
  };
}

export function toBeConcise(received: string, maxWords = 100): MatcherResult {
  const wordCount = tokenize(received).length;
  const pass = wordCount <= maxWords;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output not to be concise (max ${maxWords} words), but it had only ${wordCount} words`
        : `Expected output to be concise (max ${maxWords} words), but it had ${wordCount} words`,
    details: { wordCount, maxWords },
  };
}

export function toNotBeVerbose(
  received: string,
  options: { maxWords?: number; maxSentences?: number } = {},
): MatcherResult {
  const maxWords = options.maxWords ?? 200;
  const maxSentences = options.maxSentences ?? 10;
  const wordCount = tokenize(received).length;
  const sentenceCount = splitSentences(received).length;
  const tooManyWords = wordCount > maxWords;
  const tooManySentences = sentenceCount > maxSentences;
  const pass = !tooManyWords && !tooManySentences;
  const reasons: string[] = [];
  if (tooManyWords) reasons.push(`${wordCount} words (max ${maxWords})`);
  if (tooManySentences) reasons.push(`${sentenceCount} sentences (max ${maxSentences})`);
  return {
    pass,
    message: () =>
      pass
        ? `Expected output to be verbose, but it was within limits`
        : `Expected output not to be verbose, but: ${reasons.join(', ')}`,
    details: { wordCount, sentenceCount, maxWords, maxSentences },
  };
}
