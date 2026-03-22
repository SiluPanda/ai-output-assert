# ai-output-assert

Rich assertion library for LLM outputs -- 25+ matchers for Jest and Vitest.

[![npm version](https://img.shields.io/npm/v/ai-output-assert.svg)](https://www.npmjs.com/package/ai-output-assert)
[![license](https://img.shields.io/npm/l/ai-output-assert.svg)](https://github.com/SiluPanda/ai-output-assert/blob/master/LICENSE)
[![node](https://img.shields.io/node/v/ai-output-assert.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

`ai-output-assert` provides semantic matching, JSON schema validation, tone detection, PII scanning, format verification, safety checks, and output quality assertions -- all as Jest/Vitest custom matchers registered via `expect.extend()`. Every matcher is also available as a standalone function returning a typed `MatcherResult`, so you can use them in production code, CI scripts, and custom tooling without a test runner.

## Installation

```bash
npm install ai-output-assert
```

## Quick Start

### Register matchers with Jest or Vitest

Call `setupAIAssertions()` once in your test setup file (e.g., `vitest.setup.ts` or `jest.setup.ts`). This registers all 25+ matchers on `expect()`.

```ts
// vitest.setup.ts
import { setupAIAssertions } from 'ai-output-assert';

setupAIAssertions({
  embedFn: async (text) => await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  }).then(r => r.data[0].embedding),
});
```

Then write assertions in your tests:

```ts
import { describe, it, expect } from 'vitest';

describe('chatbot', () => {
  it('answers correctly and safely', async () => {
    const output = await chat('What is the capital of France?');

    // Semantic correctness
    await expect(output).toBeSemanticallySimilarTo('Paris is the capital of France');

    // Safety
    expect(output).toNotContainPII();
    expect(output).toNotContainToxicContent();
    expect(output).toNotBeRefusal();

    // Tone and quality
    expect(output).toHaveTone('formal');
    expect(output).toNotBeTruncated();
  });

  it('returns valid structured output', () => {
    const output = await chat('Return user data as JSON');

    expect(output).toBeValidJSON();
    expect(output).toMatchSchema({
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
      },
    });
    expect(output).toHaveJSONFields(['name', 'email']);
  });
});
```

### Use as standalone functions

Every matcher is exported as a standalone function that returns a `MatcherResult`. No test framework required.

```ts
import { toNotContainPII, toBeFormattedAs, toHaveSentiment } from 'ai-output-assert';

const result = toNotContainPII(llmOutput);
if (!result.pass) {
  console.error(result.message());
  console.log('Detected PII:', result.details.found);
}
```

## Features

- **25+ purpose-built matchers** across seven categories: semantic, content, structural, format, tone/style, safety, and quality
- **Semantic similarity** via pluggable embedding functions with cosine similarity, or built-in n-gram Jaccard fallback when no embeddings are configured
- **JSON Schema validation** powered by Ajv with detailed error paths
- **PII detection** for emails, SSNs, credit cards (Luhn-validated), phone numbers, and IP addresses
- **Tone and sentiment analysis** using heuristic scoring (contraction frequency, sentence length, vocabulary complexity, sentiment lexicon)
- **Toxic content detection** with a severity-tiered word catalog (critical, warning, info)
- **System prompt leak detection** via configurable regex patterns
- **Output quality checks** for truncation, excessive hedging, repetition, and refusal detection
- **Dual usage** -- every matcher works as a Jest/Vitest custom matcher and as a standalone function
- **Fully typed** -- ships with TypeScript declarations, all exports are typed
- **Zero external API calls** for non-semantic matchers -- heuristic matchers run in sub-millisecond time
- **Extensible catalogs** -- supply custom PII patterns, toxic words, hedging phrases, refusal phrases, and entity aliases

## API Reference

### `setupAIAssertions(options?)`

Registers all matchers globally via `expect.extend()`. Call once before your test suite runs.

```ts
import { setupAIAssertions } from 'ai-output-assert';

setupAIAssertions({
  embedFn: myEmbedFn,
  semanticThreshold: 0.85,
});
```

**Parameters:**

| Option | Type | Default | Description |
|---|---|---|---|
| `embedFn` | `EmbedFn` | `undefined` | Embedding function for semantic matchers. Signature: `(text: string) => Promise<number[]>` |
| `semanticThreshold` | `number` | `0.8` | Default cosine similarity threshold for `toBeSemanticallySimilarTo` |
| `answerThreshold` | `number` | `0.5` | Threshold for `toAnswerQuestion` |
| `consistencyThreshold` | `number` | `0.3` | Threshold for `toBeFactuallyConsistentWith` |
| `conciseMaxTokens` | `number` | `100` | Default max words for `toBeConcise` |
| `verboseMaxSentences` | `number` | `10` | Default max sentences for `toNotBeVerbose` |
| `hedgingMaxRatio` | `number` | `0.3` | Hedging phrase-to-sentence ratio threshold |
| `repeatMaxRepetitions` | `number` | `3` | Max allowed n-gram repetitions |
| `systemPromptLeakThreshold` | `number` | -- | Threshold for system prompt leak detection |
| `sentimentNeutralRange` | `[number, number]` | -- | Score range considered neutral |
| `customPIIPatterns` | `PIIPattern[]` | `[]` | Additional PII patterns (merged with defaults) |
| `customToxicWords` | `ToxicWord[]` | `[]` | Additional toxic words (merged with defaults) |
| `customEntityAliases` | `Record<string, string[]>` | -- | Entity alias mappings |
| `customHedgingPhrases` | `string[]` | `[]` | Additional hedging phrases (merged with defaults) |
| `customRefusalPhrases` | `string[]` | `[]` | Additional refusal phrases (merged with defaults) |

### `getGlobalOptions()`

Returns the current global `AIAssertionOptions` object set by `setupAIAssertions()`.

```ts
import { getGlobalOptions } from 'ai-output-assert';

const opts = getGlobalOptions();
console.log(opts.semanticThreshold);
```

---

### Semantic Matchers (async)

These matchers return a `Promise<MatcherResult>` and must be awaited in tests. When an `embedFn` is configured, they use cosine similarity over embedding vectors. Without an `embedFn`, they fall back to n-gram Jaccard similarity.

#### `toBeSemanticallySimilarTo(received, expected, options?)`

Asserts that the output is semantically similar to a reference string.

```ts
await expect(output).toBeSemanticallySimilarTo('Paris is the capital of France', 0.85);

// Standalone
const result = await toBeSemanticallySimilarTo(output, 'Paris is the capital', {
  threshold: 0.9,
  embedFn: myEmbedFn,
});
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `received` | `string` | required | The LLM output to test |
| `expected` | `string` | required | Reference text to compare against |
| `options.threshold` | `number` | `0.8` | Minimum cosine similarity (0.0 to 1.0) |
| `options.embedFn` | `EmbedFn` | global | Embedding function override |

**Returns:** `Promise<MatcherResult>` with `details: { similarity, threshold, method }` where `method` is `'embedding'` or `'ngram-jaccard'`.

#### `toAnswerQuestion(received, question, options?)`

Asserts that the output is a plausible answer to the given question. Uses a lower similarity threshold than `toBeSemanticallySimilarTo` because answers are related to questions, not identical.

```ts
await expect(output).toAnswerQuestion('What is the capital of France?');

// Standalone
const result = await toAnswerQuestion(output, 'What is the capital of France?', {
  embedFn: myEmbedFn,
});
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `received` | `string` | required | The LLM output |
| `question` | `string` | required | The question the output should answer |
| `options.embedFn` | `EmbedFn` | global | Embedding function override |

**Returns:** `Promise<MatcherResult>` with `details: { similarity, threshold, question }`. Threshold is fixed at `0.5`.

#### `toBeFactuallyConsistentWith(received, reference, options?)`

Asserts that the output does not contradict a reference text. Splits the output into sentences, computes similarity of each sentence against the full reference, and checks that the average coverage score meets the threshold.

```ts
await expect(output).toBeFactuallyConsistentWith(
  'Paris is the capital of France. France is in Western Europe.'
);
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `received` | `string` | required | The LLM output |
| `reference` | `string` | required | Authoritative reference text |
| `options.embedFn` | `EmbedFn` | global | Embedding function override |

**Returns:** `Promise<MatcherResult>` with `details: { avgCoverage, threshold, coverageScores, sentenceCount }`. Threshold is fixed at `0.3`.

---

### Content Matchers

All content matchers are synchronous.

#### `toContainAllOf(received, phrases)`

Asserts that the output contains every phrase in the array. Matching is case-insensitive.

```ts
expect(output).toContainAllOf(['Paris', 'capital', 'France']);
```

| Parameter | Type | Description |
|---|---|---|
| `received` | `string` | The LLM output |
| `phrases` | `string[]` | Phrases that must all be present |

**Returns:** `MatcherResult` with `details: { phrases, missing }`.

#### `toContainAnyOf(received, phrases)`

Asserts that the output contains at least one phrase from the array. Case-insensitive.

```ts
expect(output).toContainAnyOf(['Paris', 'Lyon', 'Marseille']);
```

| Parameter | Type | Description |
|---|---|---|
| `received` | `string` | The LLM output |
| `phrases` | `string[]` | At least one must be present |

**Returns:** `MatcherResult` with `details: { phrases, found }`.

#### `toNotContain(received, phrase)`

Asserts that the output does not contain the given phrase. Case-insensitive.

```ts
expect(output).toNotContain('Lyon');
```

| Parameter | Type | Description |
|---|---|---|
| `received` | `string` | The LLM output |
| `phrase` | `string` | Phrase that must be absent |

**Returns:** `MatcherResult` with `details: { phrase, found }`.

#### `toMentionEntity(received, entity, aliases?)`

Asserts that the output mentions a named entity or any of its aliases. Case-insensitive.

```ts
expect(output).toMentionEntity('United States', ['US', 'U.S.', 'USA']);
```

| Parameter | Type | Description |
|---|---|---|
| `received` | `string` | The LLM output |
| `entity` | `string` | Primary entity name |
| `aliases` | `string[]` | Optional alternative names |

**Returns:** `MatcherResult` with `details: { entity, aliases, foundTerm }`.

---

### Format Matchers

All format matchers are synchronous.

#### `toStartWith(received, prefix)`

Asserts that the output starts with the given prefix.

```ts
expect(output).toStartWith('Dear Customer');
```

**Returns:** `MatcherResult` with `details: { prefix, receivedStart }`.

#### `toEndWith(received, suffix)`

Asserts that the output ends with the given suffix.

```ts
expect(output).toEndWith('Best regards.');
```

**Returns:** `MatcherResult` with `details: { suffix, receivedEnd }`.

#### `toBeFormattedAs(received, format)`

Asserts that the output matches a specific format using heuristic detection.

```ts
expect(output).toBeFormattedAs('json');
expect(output).toBeFormattedAs('markdown');
expect(output).toBeFormattedAs('csv');
```

| Format | Detection Logic |
|---|---|
| `'json'` | Parses with `JSON.parse()` |
| `'markdown'` | Contains headings, bold, italic, code fences, lists, or blockquotes |
| `'list'` | At least 50% of non-empty lines are bullet/numbered items |
| `'csv'` | 2+ lines with consistent comma-separated column count (min 2 columns) |
| `'xml'` | Contains matched XML tag pairs |
| `'yaml'` | At least 50% of non-comment lines match `key: value` pattern |
| `'table'` | Contains pipe (`\|`) table patterns |

**Returns:** `MatcherResult` with `details: { format, reason }`.

#### `toHaveListItems(received, items)`

Asserts that specific items appear as list entries (on lines starting with `-`, `*`, or a number).

```ts
expect(output).toHaveListItems(['First step', 'Second step']);
```

**Returns:** `MatcherResult` with `details: { items, missing }`.

---

### Structural Matchers

All structural matchers are synchronous.

#### `toBeValidJSON(received)`

Asserts that the output is parseable JSON. Automatically extracts JSON from markdown code fences (` ```json ... ``` `).

```ts
expect(output).toBeValidJSON();
```

**Returns:** `MatcherResult` with `details: { error }`.

#### `toMatchSchema(received, schema)`

Validates parsed JSON against a JSON Schema using Ajv. The output is first parsed (with code fence extraction fallback), then validated. Reports all schema violations with JSON pointer paths.

```ts
expect(output).toMatchSchema({
  type: 'object',
  required: ['id', 'name'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string', minLength: 1 },
  },
});
```

| Parameter | Type | Description |
|---|---|---|
| `received` | `string` | The LLM output (must be valid JSON) |
| `schema` | `object` | A JSON Schema object (draft-07 compatible via Ajv) |

**Returns:** `MatcherResult` with `details: { validationErrors }`.

#### `toHaveJSONFields(received, fields)`

Asserts that the parsed JSON output contains all specified fields. Supports dot-notation for nested paths.

```ts
expect(output).toHaveJSONFields(['user.name', 'user.email', 'metadata.timestamp']);
```

| Parameter | Type | Description |
|---|---|---|
| `received` | `string` | The LLM output (must be valid JSON) |
| `fields` | `string[]` | Dot-notation field paths |

**Returns:** `MatcherResult` with `details: { fields, missing }`.

#### `toBeValidMarkdown(received)`

Checks markdown structural validity: balanced code fences, valid heading hierarchy (no level skipping), and balanced brackets.

```ts
expect(output).toBeValidMarkdown();
```

**Returns:** `MatcherResult` with `details: { issues }`.

#### `toContainCodeBlock(received, language?)`

Asserts that the output contains a fenced code block (` ``` `). Optionally checks for a specific language tag.

```ts
expect(output).toContainCodeBlock();
expect(output).toContainCodeBlock('typescript');
```

**Returns:** `MatcherResult` with `details: { language, reason }`.

---

### Tone and Style Matchers

All tone matchers are synchronous. They use heuristic analysis -- no LLM calls required.

#### `toHaveSentiment(received, expected)`

Classifies output sentiment using a lexicon-based approach. Positive and negative word counts are tallied, and the ratio determines the classification.

```ts
expect(output).toHaveSentiment('positive');
expect(output).toHaveSentiment('neutral');
```

| Sentiment | Rule |
|---|---|
| `'positive'` | Positive word ratio > 0.6 |
| `'negative'` | Positive word ratio < 0.4 |
| `'neutral'` | Between 0.4 and 0.6, or no sentiment words found |

**Returns:** `MatcherResult` with `details: { expected, detected, positiveCount, negativeCount }`.

#### `toHaveTone(received, expected)`

Detects output tone using multiple linguistic signals. Each tone type uses different heuristics.

```ts
expect(output).toHaveTone('formal');
expect(output).toHaveTone('technical');
```

| Tone | Key Signals |
|---|---|
| `'formal'` | Low contraction rate, longer average sentence length |
| `'casual'` | High contraction rate, informal vocabulary (gonna, wanna, tbh, lol) |
| `'technical'` | High long-word rate (>8 chars), presence of inline or fenced code |
| `'friendly'` | Exclamation marks, "you" frequency, positive word density |

**Returns:** `MatcherResult` with `details: { expected, detected, score, reason }`.

#### `toBeConcise(received, maxWords?)`

Asserts that the output contains at most `maxWords` words.

```ts
expect(output).toBeConcise();        // max 100 words
expect(output).toBeConcise(50);      // max 50 words
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `maxWords` | `number` | `100` | Maximum word count |

**Returns:** `MatcherResult` with `details: { wordCount, maxWords }`.

#### `toNotBeVerbose(received, options?)`

Asserts that the output is within both word and sentence limits.

```ts
expect(output).toNotBeVerbose();
expect(output).toNotBeVerbose({ maxWords: 150, maxSentences: 5 });
```

| Option | Type | Default | Description |
|---|---|---|---|
| `maxWords` | `number` | `200` | Maximum word count |
| `maxSentences` | `number` | `10` | Maximum sentence count |

**Returns:** `MatcherResult` with `details: { wordCount, sentenceCount, maxWords, maxSentences }`.

---

### Safety Matchers

All safety matchers are synchronous with zero external dependencies.

#### `toNotContainPII(received, patterns?)`

Scans output for personally identifiable information using regex patterns with optional validation functions (e.g., Luhn checksum for credit cards).

```ts
expect(output).toNotContainPII();
```

**Default PII patterns:**

| Type | Example Match | Validation |
|---|---|---|
| Email | `user@example.com` | Regex only |
| SSN | `123-45-6789` | 9-digit check |
| Credit card | `4111 1111 1111 1111` | Luhn checksum |
| Phone | `(555) 123-4567` | Regex only |
| IP address | `192.168.1.1` | Octet range 0-255 |

**Custom patterns:**

```ts
import type { PIIPattern } from 'ai-output-assert';

const customPatterns: PIIPattern[] = [
  {
    type: 'passport',
    pattern: /\b[A-Z]\d{8}\b/,
    label: 'Passport Number',
    validate: (v) => v.length === 9,
  },
];

expect(output).toNotContainPII(customPatterns);
```

**Returns:** `MatcherResult` with `details: { found }` where `found` is an array of `PIIMatch` objects containing `type`, `value`, and `position`.

#### `toNotContainToxicContent(received, words?)`

Checks output against a tiered toxic word catalog. Severity levels: `'critical'` (slurs), `'warning'` (profanity), `'info'` (mild language). Matching uses word boundaries to avoid false positives on substrings.

```ts
expect(output).toNotContainToxicContent();
```

**Custom words:**

```ts
import type { ToxicWord } from 'ai-output-assert';

expect(output).toNotContainToxicContent([
  { word: 'proprietary-term', severity: 'warning' },
]);
```

**Returns:** `MatcherResult` with `details: { found }` where each entry has `word` and `severity`.

#### `toNotLeakSystemPrompt(received, patterns?)`

Detects whether the LLM output leaks system prompt content. Matches against patterns like "you are a", "system prompt", "ignore previous instructions", etc.

```ts
expect(output).toNotLeakSystemPrompt();

// With custom patterns
expect(output).toNotLeakSystemPrompt([
  /your secret instructions/i,
  /confidential system/i,
]);
```

**Returns:** `MatcherResult` with `details: { matchedPatterns }`.

#### `toNotBeRefusal(received, phrases?)`

Asserts that the output is not a refusal. Checks against default refusal phrases like "I cannot", "As an AI", "I'm unable to", etc.

```ts
expect(output).toNotBeRefusal();
```

**Returns:** `MatcherResult` with `details: { foundPhrases }`.

---

### Quality Matchers

All quality matchers are synchronous.

#### `toNotBeTruncated(received)`

Checks for truncation signals: missing terminal punctuation, unclosed code fences, and hanging list items.

```ts
expect(output).toNotBeTruncated();
```

**Returns:** `MatcherResult` with `details: { issues }`.

#### `toNotBeHedged(received, phrases?, threshold?)`

Asserts that the output does not contain excessive hedging language. Computes the ratio of hedging phrases found to total sentences. Default hedging phrases include "I think", "probably", "perhaps", "maybe", "as far as I know", and others.

```ts
expect(output).toNotBeHedged();
expect(output).toNotBeHedged(['reportedly'], 0.2);
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `phrases` | `string[]` | `undefined` | Additional hedging phrases (merged with defaults) |
| `threshold` | `number` | `0.3` | Maximum hedging-phrase-to-sentence ratio |

**Returns:** `MatcherResult` with `details: { foundPhrases, ratio, threshold, sentenceCount }`.

#### `toBeCompleteJSON(received)`

Asserts that the output is complete, parseable JSON. If parsing fails, the failure message distinguishes between truncated JSON (starts with `{` or `[` but lacks a closing bracket) and other parse errors.

```ts
expect(output).toBeCompleteJSON();
```

**Returns:** `MatcherResult` with `details: { complete }` on success, or `details: { truncated, parseError }` on failure.

#### `toNotRepeat(received, options?)`

Detects repetitive content by extracting n-grams and checking if any n-gram appears more than the threshold number of times.

```ts
expect(output).toNotRepeat();
expect(output).toNotRepeat({ windowSize: 3, threshold: 2 });
```

| Option | Type | Default | Description |
|---|---|---|---|
| `windowSize` | `number` | `4` | N-gram size (number of tokens) |
| `threshold` | `number` | `3` | Maximum allowed occurrences of any n-gram |

**Returns:** `MatcherResult` with `details: { repeated, windowSize, threshold }` where `repeated` is an array of `{ ngram, count }`.

---

### Utility Functions

These low-level utilities are exported for advanced use cases.

#### `cosineSimilarity(a, b)`

Computes cosine similarity between two numeric vectors. Throws if dimensions do not match. Returns `0` if either vector has zero magnitude.

```ts
import { cosineSimilarity } from 'ai-output-assert';

const sim = cosineSimilarity([1, 0, 1], [1, 1, 0]); // 0.5
```

#### `createCachedEmbedFn(embedFn)`

Wraps an embedding function with an in-memory cache keyed by input text. Avoids redundant API calls when the same string is embedded multiple times.

```ts
import { createCachedEmbedFn } from 'ai-output-assert';

const cachedEmbed = createCachedEmbedFn(myEmbedFn);
setupAIAssertions({ embedFn: cachedEmbed });
```

#### `tokenize(text)`

Splits text into word tokens on whitespace. Returns an empty array for empty input.

```ts
import { tokenize } from 'ai-output-assert';
tokenize('Hello world'); // ['Hello', 'world']
```

#### `splitSentences(text)`

Splits text into sentences, handling common abbreviations (Mr., Dr., U.S., etc.) to avoid incorrect splits.

```ts
import { splitSentences } from 'ai-output-assert';
splitSentences('Dr. Smith went home. It was late.'); // ['Dr. Smith went home.', 'It was late.']
```

#### `extractNgrams(tokens, n)`

Extracts n-gram sequences from a token array. Returns an empty array if the token count is less than `n`.

```ts
import { extractNgrams } from 'ai-output-assert';
extractNgrams(['a', 'b', 'c', 'd'], 2); // ['a b', 'b c', 'c d']
```

#### `escapeRegex(str)`

Escapes special regex characters in a string for safe use in `new RegExp()`.

```ts
import { escapeRegex } from 'ai-output-assert';
escapeRegex('price is $10.00'); // 'price is \\$10\\.00'
```

#### `luhnCheck(num)`

Validates a number string using the Luhn algorithm. Used internally for credit card PII detection.

```ts
import { luhnCheck } from 'ai-output-assert';
luhnCheck('4111111111111111'); // true
```

#### `extractJSONFromCodeFence(text)`

Extracts JSON content from a markdown code fence. Returns `null` if no code fence is found.

```ts
import { extractJSONFromCodeFence } from 'ai-output-assert';
extractJSONFromCodeFence('```json\n{"key": "value"}\n```'); // '{"key": "value"}'
```

---

### Catalogs

Default catalogs are exported so you can inspect, extend, or replace them.

```ts
import {
  DEFAULT_PII_PATTERNS,
  DEFAULT_TOXIC_WORDS,
  DEFAULT_HEDGING_PHRASES,
  DEFAULT_REFUSAL_PHRASES,
  DEFAULT_SYSTEM_PROMPT_PATTERNS,
} from 'ai-output-assert';
```

| Catalog | Type | Description |
|---|---|---|
| `DEFAULT_PII_PATTERNS` | `PIIPattern[]` | Email, SSN, credit card, phone, IP address patterns |
| `DEFAULT_TOXIC_WORDS` | `ToxicWord[]` | Tiered toxic word list (critical/warning/info) |
| `DEFAULT_HEDGING_PHRASES` | `string[]` | Phrases indicating hedging ("I think", "probably", etc.) |
| `DEFAULT_REFUSAL_PHRASES` | `string[]` | Refusal indicators ("I cannot", "As an AI", etc.) |
| `DEFAULT_SYSTEM_PROMPT_PATTERNS` | `RegExp[]` | Patterns matching system prompt leakage |

## Configuration

### Embedding Function

Semantic matchers (`toBeSemanticallySimilarTo`, `toAnswerQuestion`, `toBeFactuallyConsistentWith`) require an embedding function to compute vector similarity. Without one, they fall back to n-gram Jaccard similarity, which works for basic cases but is less accurate.

Provide your embedding function at setup time or per-matcher call:

```ts
// Global setup
setupAIAssertions({
  embedFn: async (text) => {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  },
});

// Per-matcher override
const result = await toBeSemanticallySimilarTo(output, expected, {
  embedFn: differentEmbedFn,
  threshold: 0.9,
});
```

### Caching Embeddings

Wrap your embedding function with `createCachedEmbedFn` to avoid redundant API calls during test runs:

```ts
import { createCachedEmbedFn, setupAIAssertions } from 'ai-output-assert';

const cachedEmbed = createCachedEmbedFn(async (text) => {
  return await myEmbeddingAPI(text);
});

setupAIAssertions({ embedFn: cachedEmbed });
```

## Error Handling

Every matcher returns a `MatcherResult` with three fields:

```ts
interface MatcherResult {
  pass: boolean;
  message: () => string;
  details: Record<string, unknown>;
}
```

- **`pass`** -- `true` if the assertion succeeded, `false` otherwise.
- **`message`** -- A function returning a human-readable explanation. When `pass` is `false`, the message explains why the assertion failed with specific values (similarity scores, missing fields, detected PII, etc.). When `pass` is `true`, the message describes what would cause it to fail (used by `.not` assertions).
- **`details`** -- A structured object with matcher-specific data for programmatic inspection. Each matcher documents its `details` shape above.

Matchers that parse JSON (`toBeValidJSON`, `toMatchSchema`, `toHaveJSONFields`, `toBeCompleteJSON`) gracefully handle parse failures by returning `pass: false` with a descriptive error rather than throwing.

Semantic matchers throw if `embedFn` is provided and the embedding call itself throws. The error propagates to the test runner as a normal test failure.

`cosineSimilarity` throws a `Dimension mismatch` error if the two vectors have different lengths.

## Advanced Usage

### Multi-Dimension Quality Gates

Combine multiple matchers to build comprehensive quality gates:

```ts
async function validateOutput(output: string, schema: object): Promise<string[]> {
  const checks = [
    toNotBeRefusal(output),
    toNotBeTruncated(output),
    toNotContainPII(output),
    toNotContainToxicContent(output),
    toBeValidJSON(output),
    toMatchSchema(output, schema),
  ];

  return checks
    .filter((r) => !r.pass)
    .map((r) => r.message());
}
```

### Custom PII Patterns

Extend the default PII catalog with domain-specific patterns:

```ts
import { DEFAULT_PII_PATTERNS, toNotContainPII } from 'ai-output-assert';
import type { PIIPattern } from 'ai-output-assert';

const allPatterns: PIIPattern[] = [
  ...DEFAULT_PII_PATTERNS,
  {
    type: 'employee-id',
    pattern: /\bEMP-\d{6}\b/,
    label: 'Employee ID',
  },
  {
    type: 'medical-record',
    pattern: /\bMRN-\d{8}\b/,
    label: 'Medical Record Number',
    validate: (v) => v.length === 12,
  },
];

const result = toNotContainPII(output, allPatterns);
```

### Using Without a Test Framework

All matchers work as plain functions. Use them in production validation pipelines, CI scripts, or custom tooling:

```ts
import {
  toNotContainPII,
  toBeFormattedAs,
  toNotBeRefusal,
  toNotBeTruncated,
} from 'ai-output-assert';

function validateLLMResponse(output: string): { valid: boolean; errors: string[] } {
  const matchers = [
    toNotContainPII(output),
    toBeFormattedAs(output, 'json'),
    toNotBeRefusal(output),
    toNotBeTruncated(output),
  ];

  const errors = matchers.filter((r) => !r.pass).map((r) => r.message());
  return { valid: errors.length === 0, errors };
}
```

## TypeScript

The package ships with full TypeScript declarations. All types are exported from the package root:

```ts
import type {
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
} from 'ai-output-assert';
```

| Type | Definition |
|---|---|
| `MatcherResult` | `{ pass: boolean; message: () => string; details: Record<string, unknown> }` |
| `EmbedFn` | `(text: string) => Promise<number[]>` |
| `Tone` | `'formal' \| 'casual' \| 'technical' \| 'friendly'` |
| `ToneScores` | `Record<Tone, number>` |
| `Sentiment` | `'positive' \| 'negative' \| 'neutral'` |
| `OutputFormat` | `'json' \| 'markdown' \| 'list' \| 'csv' \| 'xml' \| 'yaml' \| 'table'` |
| `PIIPattern` | `{ type: string; pattern: RegExp; validate?: (match: string) => boolean; label: string }` |
| `ToxicWord` | `{ word: string; severity: 'critical' \| 'warning' \| 'info' }` |
| `PIIMatch` | `{ type: string; value: string; position: [number, number] }` |
| `AIAssertionOptions` | Configuration object for `setupAIAssertions()` -- see [API Reference](#setupaiassertionsoptions) |

## License

MIT
