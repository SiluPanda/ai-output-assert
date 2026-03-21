# ai-output-assert

Rich assertion library for LLM outputs as Jest/Vitest matchers.

Validate, inspect, and assert on AI/LLM outputs with type-safe utility functions and (coming soon) custom test matchers. Covers semantic similarity, PII detection, tone analysis, format validation, and more.

## Installation

```bash
npm install ai-output-assert
```

## Quick Start

```ts
import {
  cosineSimilarity,
  tokenize,
  splitSentences,
  extractNgrams,
  luhnCheck,
  extractJSONFromCodeFence,
  createCachedEmbedFn,
  escapeRegex,
} from 'ai-output-assert';

// Compute cosine similarity between two embedding vectors
const similarity = cosineSimilarity([1, 0, 0], [0, 1, 0]); // 0

// Tokenize text into words
const tokens = tokenize('Hello world from LLM'); // ['Hello', 'world', 'from', 'LLM']

// Split text into sentences (abbreviation-aware)
const sentences = splitSentences('Dr. Smith arrived. He said hello.');
// ['Dr. Smith arrived.', 'He said hello.']

// Extract n-grams from a token array
const bigrams = extractNgrams(['the', 'quick', 'brown', 'fox'], 2);
// ['the quick', 'quick brown', 'brown fox']

// Validate a number with the Luhn algorithm (e.g. credit card check)
luhnCheck('4539578763621486'); // true

// Extract JSON from a markdown code fence
const json = extractJSONFromCodeFence('```json\n{"key": "value"}\n```');
// '{"key": "value"}'

// Wrap an embedding function with an in-memory cache
const cachedEmbed = createCachedEmbedFn(async (text) => {
  // call your embedding API here
  return [0.1, 0.2, 0.3];
});

// Escape special regex characters in a string
escapeRegex('price is $9.99'); // 'price is \\$9\\.99'
```

## Exports

### Utility Functions

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

### Types

| Type | Description |
|---|---|
| `MatcherResult` | Return type for all matchers: `{ pass, message, details }` |
| `EmbedFn` | Pluggable embedding function signature: `(text: string) => Promise<number[]>` |
| `Tone` | `'formal' \| 'casual' \| 'technical' \| 'friendly'` |
| `ToneScores` | `Record<Tone, number>` |
| `Sentiment` | `'positive' \| 'negative' \| 'neutral'` |
| `OutputFormat` | `'json' \| 'markdown' \| 'list' \| 'csv' \| 'xml' \| 'yaml' \| 'table'` |
| `PIIPattern` | PII detection pattern: `{ type, pattern, validate?, label }` |
| `ToxicWord` | Toxic word entry: `{ word, severity }` |
| `PIIMatch` | Detected PII instance: `{ type, value, position }` |
| `AIAssertionOptions` | Configuration for `setupAIAssertions()` |

## Planned Features

- **`setupAIAssertions(options?)`** -- Register all matchers with Jest or Vitest via `expect.extend()`
- **Semantic matchers** -- `toBeSemanticallySimilarTo`, `toAnswerQuestion`, `toBeFactuallyConsistentWith`
- **Content matchers** -- `toContainAllOf`, `toContainAnyOf`, `toNotContain`, `toMentionEntity`, `toHaveSentiment`
- **Format matchers** -- `toStartWith`, `toEndWith`, `toBeFormattedAs`, `toHaveListItems`
- **Structural matchers** -- `toBeValidJSON`, `toMatchSchema`, `toHaveJSONFields`, `toBeValidMarkdown`, `toContainCodeBlock`
- **Tone matchers** -- `toHaveTone`, `toBeConcise`, `toNotBeVerbose`
- **Safety matchers** -- `toNotContainPII`, `toNotContainToxicContent`, `toNotLeakSystemPrompt`
- **Quality matchers** -- `toNotBeRefusal`, `toNotBeTruncated`, `toNotBeHedged`, `toBeCompleteJSON`, `toNotRepeat`

## License

MIT
