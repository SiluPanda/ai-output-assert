import type { MatcherResult, PIIPattern, ToxicWord, PIIMatch } from '../types';
import { DEFAULT_PII_PATTERNS } from '../catalogs/pii-patterns';
import { DEFAULT_TOXIC_WORDS } from '../catalogs/toxic-words';
import { DEFAULT_SYSTEM_PROMPT_PATTERNS, DEFAULT_REFUSAL_PHRASES } from '../catalogs/hedging-phrases';

export function toNotContainPII(received: string, patterns?: PIIPattern[]): MatcherResult {
  const allPatterns = [...DEFAULT_PII_PATTERNS, ...(patterns ?? [])];
  const found: PIIMatch[] = [];

  for (const piiPattern of allPatterns) {
    const regex = new RegExp(piiPattern.pattern.source, piiPattern.pattern.flags.includes('g') ? piiPattern.pattern.flags : piiPattern.pattern.flags + 'g');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(received)) !== null) {
      const value = match[0];
      if (!piiPattern.validate || piiPattern.validate(value)) {
        found.push({
          type: piiPattern.type,
          value,
          position: [match.index, match.index + value.length],
        });
      }
    }
  }

  const pass = found.length === 0;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output to contain PII, but none was found`
        : `Expected output not to contain PII, but found ${found.length} instance(s): ${found.map((f) => `${f.type}("${f.value}")`).join(', ')}`,
    details: { found },
  };
}

export function toNotContainToxicContent(received: string, words?: ToxicWord[]): MatcherResult {
  const allWords = [...DEFAULT_TOXIC_WORDS, ...(words ?? [])];
  const lower = received.toLowerCase();
  const found: Array<{ word: string; severity: string }> = [];

  for (const entry of allWords) {
    const wordLower = entry.word.toLowerCase();
    // Use word boundary check
    const pattern = new RegExp(`\\b${wordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (pattern.test(lower)) {
      found.push({ word: entry.word, severity: entry.severity });
    }
  }

  const pass = found.length === 0;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output to contain toxic content, but none was found`
        : `Expected output not to contain toxic content, but found: ${found.map((f) => `${f.word}(${f.severity})`).join(', ')}`,
    details: { found },
  };
}

export function toNotLeakSystemPrompt(received: string, patterns?: RegExp[]): MatcherResult {
  const allPatterns = [...DEFAULT_SYSTEM_PROMPT_PATTERNS, ...(patterns ?? [])];
  const matched: string[] = [];

  for (const pattern of allPatterns) {
    if (pattern.test(received)) {
      matched.push(pattern.toString());
    }
  }

  const pass = matched.length === 0;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output to contain system prompt indicators, but none found`
        : `Expected output not to leak system prompt, but matched patterns: ${matched.join(', ')}`,
    details: { matchedPatterns: matched },
  };
}

export function toNotBeRefusal(received: string, phrases?: string[]): MatcherResult {
  const allPhrases = [...DEFAULT_REFUSAL_PHRASES, ...(phrases ?? [])];
  const lower = received.toLowerCase();
  const found = allPhrases.filter((p) => lower.includes(p.toLowerCase()));
  const pass = found.length === 0;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output to be a refusal, but no refusal phrases found`
        : `Expected output not to be a refusal, but found: ${found.join(', ')}`,
    details: { foundPhrases: found },
  };
}
