// ai-output-assert - Rich assertion library for LLM outputs as Jest/Vitest matchers
export type {
  MatcherResult,
  EmbedFn,
  Tone,
  ToneScores,
  Sentiment,
  OutputFormat,
  PIIPattern,
  ToxicWord,
  PIIMatch,
  AIAssertionOptions,
} from './types';

// Utilities
export { cosineSimilarity } from './utils/cosine-similarity';
export { tokenize } from './utils/tokenizer';
export { splitSentences } from './utils/sentences';
export { extractNgrams } from './utils/ngrams';
export { escapeRegex } from './utils/regex-escape';
export { luhnCheck } from './utils/luhn';
export { extractJSONFromCodeFence } from './utils/json-extract';
export { createCachedEmbedFn } from './utils/embedding-cache';

// Catalogs
export { DEFAULT_PII_PATTERNS } from './catalogs/pii-patterns';
export { DEFAULT_TOXIC_WORDS } from './catalogs/toxic-words';
export {
  DEFAULT_HEDGING_PHRASES,
  DEFAULT_REFUSAL_PHRASES,
  DEFAULT_SYSTEM_PROMPT_PATTERNS,
} from './catalogs/hedging-phrases';

// Setup
export { setupAIAssertions, getGlobalOptions } from './setup';

// Format matchers
export { toStartWith, toEndWith, toBeFormattedAs, toHaveListItems } from './matchers/format';

// Content matchers
export { toContainAllOf, toContainAnyOf, toNotContain, toMentionEntity } from './matchers/content';

// Tone matchers
export { toHaveSentiment, toHaveTone, toBeConcise, toNotBeVerbose } from './matchers/tone';

// Structural matchers
export {
  toBeValidJSON,
  toMatchSchema,
  toHaveJSONFields,
  toBeValidMarkdown,
  toContainCodeBlock,
} from './matchers/structural';

// Safety matchers
export {
  toNotContainPII,
  toNotContainToxicContent,
  toNotLeakSystemPrompt,
  toNotBeRefusal,
} from './matchers/safety';

// Quality matchers
export { toNotBeTruncated, toNotBeHedged, toBeCompleteJSON, toNotRepeat } from './matchers/quality';

// Semantic matchers
export {
  toBeSemanticallySimilarTo,
  toAnswerQuestion,
  toBeFactuallyConsistentWith,
} from './matchers/semantic';
