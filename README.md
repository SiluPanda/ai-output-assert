# ai-output-assert

Rich assertion library for LLM outputs as Jest/Vitest matchers.

Validate, inspect, and assert on AI/LLM outputs with type-safe standalone functions and Jest/Vitest custom matchers. Covers semantic similarity, PII detection, tone analysis, format validation, safety checks, and more.

## Installation

```bash
npm install ai-output-assert
```

## Quick Start

### Option 1: setupAIAssertions() — Register matchers with Jest/Vitest

Call `setupAIAssertions()` once in your test setup file (e.g. `vitest.setup.ts`). It automatically registers all matchers via `expect.extend()`.

```ts
import { setupAIAssertions } from 'ai-output-assert';

setupAIAssertions({
  semanticThreshold: 0.85,
  embedFn: async (text) => await myEmbeddingAPI(text),
});
```

Then use matchers in tests:

```ts
expect(llmOutput).toBeFormattedAs('json');
expect(llmOutput).toNotContainPII();
expect(llmOutput).toHaveSentiment('positive');
await expect(llmOutput).toBeSemanticallySimilarTo('expected answer');
```

### Option 2: Standalone functions

All matchers are also exported as standalone functions returning `MatcherResult`:

```ts
import { toBeFormattedAs, toNotContainPII, toHaveSentiment } from 'ai-output-assert';

const result = toBeFormattedAs('{"key": "value"}', 'json');
// { pass: true, message: () => '...', details: { format: 'json', reason: '' } }
```

## setupAIAssertions(options?)

Registers all matchers globally via `expect.extend()`. Call once before your test suite.

```ts
import { setupAIAssertions } from 'ai-output-assert';
import type { AIAssertionOptions } from 'ai-output-assert';

const options: AIAssertionOptions = {
  embedFn: myEmbedFn,           // Optional: enables embedding-based semantic matchers
  semanticThreshold: 0.85,      // Default: 0.8
  answerThreshold: 0.5,         // Default: 0.5
  consistencyThreshold: 0.3,    // Default: 0.3
  hedgingMaxRatio: 0.2,         // Default: 0.3
  repeatMaxRepetitions: 3,      // Default: 3
  customPIIPatterns: [],        // Merged with defaults
  customToxicWords: [],         // Merged with defaults
  customHedgingPhrases: [],     // Merged with defaults
  customRefusalPhrases: [],     // Merged with defaults
};

setupAIAssertions(options);
```

## Matchers

### Format matchers

| Matcher | Description |
|---|---|
| `toStartWith(prefix)` | Output starts with the given prefix |
| `toEndWith(suffix)` | Output ends with the given suffix |
| `toBeFormattedAs(format)` | Output matches a format: `'json' \| 'markdown' \| 'list' \| 'csv' \| 'xml' \| 'yaml' \| 'table'` |
| `toHaveListItems(items)` | Output contains all given items as list bullets/numbers |

### Content matchers

| Matcher | Description |
|---|---|
| `toContainAllOf(phrases)` | Output contains every phrase in the array (case-insensitive) |
| `toContainAnyOf(phrases)` | Output contains at least one phrase (case-insensitive) |
| `toNotContain(phrase)` | Output does not contain the phrase |
| `toMentionEntity(entity, aliases?)` | Output mentions the entity or any of its aliases |

### Tone matchers

| Matcher | Description |
|---|---|
| `toHaveSentiment(sentiment)` | Output sentiment is `'positive' \| 'negative' \| 'neutral'` |
| `toHaveTone(tone)` | Output tone is `'formal' \| 'casual' \| 'technical' \| 'friendly'` |
| `toBeConcise(maxWords?)` | Output is at most `maxWords` words (default: 100) |
| `toNotBeVerbose(options?)` | Output is within `maxWords` and `maxSentences` limits (defaults: 200 words, 10 sentences) |

### Structural matchers

| Matcher | Description |
|---|---|
| `toBeValidJSON()` | Output is parseable JSON (also accepts JSON in a code fence) |
| `toMatchSchema(schema)` | Output is valid JSON matching an Ajv JSON Schema |
| `toHaveJSONFields(fields)` | JSON output contains all specified field paths (dot notation: `'a.b.c'`) |
| `toBeValidMarkdown()` | No unclosed code fences, balanced brackets, valid heading hierarchy |
| `toContainCodeBlock(language?)` | Output contains a fenced code block, optionally with a specific language |

### Safety matchers

| Matcher | Description |
|---|---|
| `toNotContainPII(patterns?)` | No PII detected: email, SSN, credit card (Luhn-validated), phone, IP address |
| `toNotContainToxicContent(words?)` | No toxic words (critical slurs, warning profanity, info-level mild words) |
| `toNotLeakSystemPrompt(patterns?)` | No system prompt indicator patterns |
| `toNotBeRefusal(phrases?)` | Output does not contain refusal phrases like "I cannot", "As an AI" |

### Quality matchers

| Matcher | Description |
|---|---|
| `toNotBeTruncated()` | Ends with terminal punctuation, no unclosed code fences, no hanging list items |
| `toNotBeHedged(phrases?, threshold?)` | Hedging phrase ratio below threshold (default: 0.3 per sentence) |
| `toBeCompleteJSON()` | JSON parses successfully; if it fails, reports whether it looks truncated |
| `toNotRepeat(options?)` | No n-gram (default: 4-gram) appears more than threshold times (default: 3) |

### Semantic matchers (async)

These return a Promise and require `await` in tests.

| Matcher | Description |
|---|---|
| `toBeSemanticallySimilarTo(expected, options?)` | Similarity >= threshold (default: 0.8). Uses embeddings if `embedFn` provided, else n-gram Jaccard |
| `toAnswerQuestion(question, options?)` | Semantic similarity to question >= 0.5 |
| `toBeFactuallyConsistentWith(reference, options?)` | Each sentence has coverage in the reference (avg >= 0.3) |

## Catalogs

The library ships with default catalogs you can import and extend:

```ts
import {
  DEFAULT_PII_PATTERNS,
  DEFAULT_TOXIC_WORDS,
  DEFAULT_HEDGING_PHRASES,
  DEFAULT_REFUSAL_PHRASES,
  DEFAULT_SYSTEM_PROMPT_PATTERNS,
} from 'ai-output-assert';
```

## Utility functions

| Function | Description |
|---|---|
| `cosineSimilarity(a, b)` | Cosine similarity between two numeric vectors |
| `tokenize(text)` | Split text into word tokens on whitespace |
| `splitSentences(text)` | Split text into sentences, handling abbreviations |
| `extractNgrams(tokens, n)` | Extract n-gram sequences from a token array |
| `luhnCheck(num)` | Luhn checksum validation (credit cards, etc.) |
| `extractJSONFromCodeFence(text)` | Extract JSON content from markdown code fences |
| `createCachedEmbedFn(embedFn)` | Wrap an embedding function with in-memory caching |
| `escapeRegex(str)` | Escape special regex characters in a string |

## Types

| Type | Description |
|---|---|
| `MatcherResult` | Return type for all matchers: `{ pass, message, details }` |
| `EmbedFn` | Pluggable embedding function: `(text: string) => Promise<number[]>` |
| `Tone` | `'formal' \| 'casual' \| 'technical' \| 'friendly'` |
| `ToneScores` | `Record<Tone, number>` |
| `Sentiment` | `'positive' \| 'negative' \| 'neutral'` |
| `OutputFormat` | `'json' \| 'markdown' \| 'list' \| 'csv' \| 'xml' \| 'yaml' \| 'table'` |
| `PIIPattern` | PII detection pattern: `{ type, pattern, validate?, label }` |
| `ToxicWord` | Toxic word entry: `{ word, severity }` |
| `PIIMatch` | Detected PII: `{ type, value, position }` |
| `AIAssertionOptions` | Configuration for `setupAIAssertions()` |

## License

MIT
