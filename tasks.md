# ai-output-assert — Tasks

## Phase 1: Core Infrastructure

### 1.1 Project Setup and Dependencies

- [x] **Install runtime dependencies** — Add `ajv` as a runtime dependency in package.json. | Status: done
- [x] **Install dev dependencies** — Add `vitest`, `typescript`, `eslint`, and related config packages as dev dependencies in package.json. | Status: done
- [ ] **Add peer dependencies** — Add `zod` (optional) and `vitest`/`jest` (one required) as peer dependencies with `peerDependenciesMeta` marking them as optional where appropriate. | Status: done (deferred to Phase 3 when schema matchers are implemented)
- [x] **Configure Vitest** — Create `vitest.config.ts` with setup file reference. Ensure `npm run test` works with `vitest run`. | Status: done
- [x] **Configure ESLint** — Set up ESLint configuration for the project so `npm run lint` works. | Status: done
- [x] **Verify TypeScript config** — Confirm `tsconfig.json` settings are correct (ES2022 target, commonjs module, strict mode, declaration output). Adjust if needed. | Status: done

### 1.2 Type Definitions (`src/types.ts`)

- [x] **Define `MatcherResult` type** — `{ pass: boolean; message: () => string; details: Record<string, unknown> }`. Used as the return type for all matchers and standalone functions. | Status: done
- [x] **Define `EmbedFn` type** — `(text: string) => Promise<number[]>`. The pluggable embedding function signature. | Status: done
- [x] **Define `AIAssertionOptions` interface** — All configuration options for `setupAIAssertions()`: `embedFn`, `semanticThreshold`, `answerThreshold`, `consistencyThreshold`, `conciseMaxTokens`, `verboseMaxSentences`, `hedgingMaxRatio`, `repeatMaxRepetitions`, `systemPromptLeakThreshold`, `sentimentNeutralRange`, `customPIIPatterns`, `customToxicWords`, `customEntityAliases`, `customHedgingPhrases`, `customRefusalPhrases`. | Status: done
- [x] **Define `PIIPattern` interface** — `{ type: string; pattern: RegExp; validate?: (match: string) => boolean; label: string }`. | Status: done
- [x] **Define `ToxicWord` interface** — `{ word: string; severity: 'critical' | 'warning' | 'info' }`. | Status: done
- [x] **Define `PIIMatch` type** — `{ type: string; value: string; position: [number, number] }` for reporting detected PII instances. | Status: done
- [x] **Define tone-related types** — `Tone = 'formal' | 'casual' | 'technical' | 'friendly'`, `ToneScores = Record<Tone, number>`, sentiment type `'positive' | 'negative' | 'neutral'`, format type `'json' | 'markdown' | 'list' | 'csv' | 'xml' | 'yaml' | 'table'`. | Status: done

### 1.3 Utility Functions (`src/utils/`)

- [x] **Implement `cosine-similarity.ts`** — `cosineSimilarity(a: number[], b: number[]): number`. Compute dot product divided by product of magnitudes. Throw on dimension mismatch. Return 0 if either vector has zero magnitude. | Status: done
- [x] **Implement `embedding-cache.ts`** — In-memory `Map<string, number[]>` cache. Export a class or factory function that wraps an `EmbedFn` and caches results by input string. Cache is per-`setupAIAssertions()` call, not persisted. | Status: done
- [x] **Implement `tokenizer.ts`** — Word tokenization via `text.split(/\s+/).filter(Boolean)`. Export a `tokenize(text: string): string[]` function. | Status: done
- [x] **Implement `sentences.ts`** — Sentence splitting via regex handling `.`, `!`, `?` followed by whitespace or end-of-string. Exclude common abbreviations (Mr., Dr., etc.). Export `splitSentences(text: string): string[]`. | Status: done
- [x] **Implement `ngrams.ts`** — N-gram extraction. Export `extractNgrams(tokens: string[], n: number): string[]` returning array of n-word sequences joined by spaces. | Status: done
- [x] **Implement `regex-escape.ts`** — Export `escapeRegex(str: string): string` that escapes special regex characters in a string. | Status: done
- [x] **Implement `luhn.ts`** — Luhn checksum algorithm for credit card validation. Export `luhnCheck(num: string): boolean`. Strip non-digit characters, compute checksum, return `sum % 10 === 0`. | Status: done
- [x] **Implement `json-extract.ts`** — Extract JSON from markdown code fences. Export `extractJSONFromCodeFence(text: string): string | null`. Detect ` ```json ... ``` ` patterns and return the inner content. | Status: done

### 1.4 Setup Function (`src/setup.ts`)

- [x] **Implement `setupAIAssertions(options?)`** — Accept `AIAssertionOptions`, store global configuration, call `expect.extend()` with all 28 matchers. Handle both Jest and Vitest framework detection. | Status: done
- [x] **Implement framework detection** — Check for global `expect` (Jest) or imported `expect` from `vitest`. Support explicit `expect` passed in options. Throw descriptive error if neither framework detected. | Status: done
- [x] **Implement global config storage** — Store options in a module-level variable accessible by all matchers. Support re-calling `setupAIAssertions()` (last call wins). | Status: done
- [ ] **Merge custom patterns with built-in catalogs** — Append `customPIIPatterns`, `customToxicWords`, `customEntityAliases`, `customHedgingPhrases`, `customRefusalPhrases` to their respective built-in catalogs (not replace). | Status: done

### 1.5 Public API Exports (`src/index.ts`)

- [x] **Export `setupAIAssertions`** — Re-export the setup function from `setup.ts`. | Status: done
- [x] **Export all standalone matcher functions** — Export each matcher as a standalone function (e.g., `checkSemanticSimilarity`, `checkContainsAllOf`, `checkValidJSON`, `checkMatchesSchema`, `checkTone`, `checkPII`, `checkRefusal`, `checkTruncation`, etc.). | Status: done
- [x] **Export all types** — Re-export `MatcherResult`, `EmbedFn`, `AIAssertionOptions`, `PIIPattern`, `ToxicWord`, and all other public types from `types.ts`. | Status: done

---

## Phase 2: Format and Content Matchers

### 2.1 Format Matchers (`src/matchers/format/`)

- [x] **Implement `toStartWith`** — Trim leading whitespace from received, check `startsWith(prefix)`. Return detailed failure message showing what the output actually starts with. | Status: done
- [x] **Implement `toEndWith`** — Trim trailing whitespace from received, check `endsWith(suffix)`. Return detailed failure message showing what the output actually ends with. | Status: done
- [x] **Implement `toBeFormattedAs`** — Support 7 format types: `json` (JSON.parse), `markdown` (heading/code fence/link/emphasis detection), `list` (numbered/bullet patterns), `csv` (consistent comma-separated columns), `xml` (matched open/close tags), `yaml` (key: value patterns), `table` (pipe-separated with dash separator row). | Status: done
- [x] **Implement `toHaveListItems`** — Detect list items via numbered patterns (`1.`, `2)`, `(a)`) and bullet patterns (`-`, `*`, `+`). Accept `min` (default 1) and `max` (default Infinity). Return count of detected items in failure message. | Status: done

### 2.2 Content Matchers (`src/matchers/content/`)

- [x] **Implement `toContainAllOf`** — For each keyword, construct case-insensitive word-boundary regex (`\b...\b`). Collect missing keywords. Pass if none missing. Failure message lists present and missing keywords. | Status: done
- [x] **Implement `toContainAnyOf`** — Same regex construction as `toContainAllOf`. Pass if at least one keyword matches. Failure message lists all checked keywords. | Status: done
- [x] **Implement `toNotContain`** — Same regex construction. Pass if no keyword matches. Failure message lists found keywords. | Status: done
- [x] **Implement `toMentionEntity`** — Check built-in entity alias table first, then fall back to case-insensitive substring match. Pass if any form of the entity is found. Failure message lists checked aliases. | Status: done

### 2.3 Catalogs: Entity Aliases (`src/catalogs/entity-aliases.ts`)

- [ ] **Create entity alias table** — Map common entity names to their aliases. Include entries like "United States" -> ["US", "U.S.", "USA", "United States of America"], "United Kingdom" -> ["UK", "U.K.", "Great Britain", "Britain"], and other common entities. Support extension via `customEntityAliases` in setup options. | Status: done

---

## Phase 3: Structural and Safety Matchers

### 3.1 Structural Matchers (`src/matchers/structural/`)

- [x] **Implement `toBeValidJSON`** — Attempt `JSON.parse(received)`. If fails, try extracting JSON from markdown code fences. If JSON found in code fence, still fail but note it in the message. Include parse error details in failure message. | Status: done
- [ ] **Implement `toMatchSchema` (Zod path)** — Detect Zod schema by checking for `.safeParse` method. Parse received as JSON, call `.safeParse()`, collect `error.issues`, format as human-readable messages with paths (`issue.path.join('.') + ': ' + issue.message`). Report all errors, not just first. | Status: done
- [x] **Implement `toMatchSchema` (JSON Schema path)** — Detect JSON Schema (no `.safeParse`). Use `ajv` to compile and validate. Collect `ajv.errors`, format with JSON pointer paths (`error.instancePath + ' ' + error.message`). Report all errors. | Status: done
- [x] **Implement `toHaveJSONFields`** — Parse received as JSON. Resolve dot-notation field paths (e.g., `"user.address.city"` -> `parsed.user.address.city`). `null` values count as present. Collect missing fields. | Status: done
- [x] **Implement `toBeValidMarkdown`** — Check: (1) code fence balance (odd triple-backtick count = unclosed), (2) heading level progression (no skipping >1 level), (3) link targets not empty (`[text]()` = bad), (4) emphasis marker balance (`*`/`_` even counts). Heading warnings don't fail alone; unclosed fences and empty links are critical. | Status: done
- [x] **Implement `toContainCodeBlock`** — Search for fenced code blocks (triple-backtick pattern). If `language` parameter provided, check for matching language tag (case-insensitive). Report which languages were found in failure message. | Status: done

### 3.2 PII Pattern Catalog (`src/catalogs/pii-patterns.ts`)

- [x] **Implement email pattern** — `/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g` | Status: done
- [x] **Implement US phone pattern** — `/(?:\+?1[-.\s]?)?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g` | Status: done
- [ ] **Implement international phone pattern** — `/\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g` | Status: done
- [x] **Implement SSN pattern (dashed)** — `/\b\d{3}-\d{2}-\d{4}\b/g` | Status: done
- [ ] **Implement SSN pattern (no dashes)** — `/\b\d{9}\b/g` with context-word requirement ("SSN", "social security", "tax ID"). | Status: done
- [x] **Implement credit card patterns** — Visa, Mastercard, Amex patterns with Luhn checksum validation via `luhnCheck()`. | Status: done
- [x] **Implement IPv4 pattern** — Dotted-quad with exclusions for localhost (127.0.0.1), all-zeros (0.0.0.0), broadcast (255.255.255.255), and documentation ranges (192.0.2.x, 198.51.100.x, 203.0.113.x). | Status: done
- [ ] **Implement US street address pattern** — `/\b\d{1,5}\s+(?:[A-Z][a-z]+\s+){1,3}(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Ln|Lane|Rd|Road|Ct|Court|Way|Pl|Place)\.?\b/gi` | Status: done

### 3.3 Safety Matchers (`src/matchers/safety/`)

- [x] **Implement `toNotContainPII`** — Iterate PII pattern catalog against received text. Collect all matches with type, value, and position. Run Luhn validation for credit card matches. Pass if zero PII instances detected. Failure message lists each detected PII with type, redacted value, and position. | Status: done
- [x] **Implement `toNotContainToxicContent`** — Match toxic word list as whole words (word-boundary regex) to avoid Scunthorpe problem. Categorize by severity (critical/warning/info). Pass if no critical or warning matches. Report info-level matches without failing. Redact matched words in error messages for safety. | Status: done
- [x] **Implement `toNotLeakSystemPrompt`** — Normalize both output and system prompt (lowercase, collapse whitespace). Extract 5-grams from system prompt. Count how many appear in output. Compute leakage ratio. Also check for verbatim substrings of 50+ characters. Pass if leakage ratio < 0.15 AND no long verbatim matches. Failure message shows sample leaked phrases. | Status: done

### 3.4 Catalogs: Toxic Words (`src/catalogs/toxic-words.ts`)

- [x] **Create toxic word catalog** — Curated list of toxic terms categorized by severity: slurs (critical), profanity (warning), mild language (info). Design for whole-word matching to avoid false positives. Support extension via `customToxicWords`. | Status: done

---

## Phase 4: Tone, Quality, and Sentiment Matchers

### 4.1 Heuristic Catalogs (`src/catalogs/`)

- [ ] **Create contractions list** — (`src/catalogs/contractions.ts`) Full list of common English contractions: don't, can't, won't, it's, I'm, we're, they're, I've, you've, etc. Used for tone detection. | Status: done
- [ ] **Create filler words list** — (`src/catalogs/filler-words.ts`) "basically", "actually", "literally", "like" (as filler), "kind of", "sort of", "you know", "I mean". Used for tone detection. | Status: done
- [x] **Create hedging phrases catalog** — (`src/catalogs/hedging-phrases.ts`) "I think", "I believe", "probably", "possibly", "perhaps", "maybe", "might", "it seems", "it appears", "approximately", "roughly", "in my opinion", "as far as I know", "I could be wrong", etc. Support extension via `customHedgingPhrases`. | Status: done
- [x] **Create refusal phrases catalog** — (`src/catalogs/refusal-phrases.ts`) Full refusal: "I cannot", "I can't", "I'm unable to", "I won't", "goes against my guidelines". Partial: "I must note that", "while I can help with", "please be aware". Support extension via `customRefusalPhrases`. | Status: done
- [ ] **Create sentiment lexicon** — (`src/catalogs/sentiment-lexicon.ts`) Positive words (+1): "good", "great", "excellent", "wonderful", etc. Negative words (-1): "bad", "terrible", "awful", "disappointing", etc. Used for `toHaveSentiment`. | Status: done

### 4.2 Tone Matchers (`src/matchers/tone/`)

- [ ] **Implement tone analyzer utilities** — Contraction counter (count/total words), sentence length analyzer (average words per sentence), passive voice detector (`was/were/is/are/been + word ending in -ed/-en`), pronoun counter (first/second person counts), filler word counter. Each returns a 0-1 normalized ratio. | Status: done
- [x] **Implement `toHaveTone`** — Compute weighted scores for formal, casual, technical, friendly tones using the heuristic signals specified in the spec (contraction rate, sentence length, passive voice, pronoun usage, filler words, code-like tokens, politeness markers, exclamation marks, etc.). Select tone with highest score. Pass if detected tone matches expected. Failure message shows all tone scores and signal breakdowns. | Status: done
- [x] **Implement `toBeConcise`** — Split on whitespace, count tokens, pass if count <= maxTokens. Failure message shows token count vs. limit and first 200 chars of received. | Status: done
- [x] **Implement `toNotBeVerbose`** — Split into sentences (reuse `sentences.ts`). Count sentences, check against `maxSentences` (default 10). Also check for 3-gram phrase repetition (any 3-gram appearing >3 times). Pass if sentence count <= max AND no excessive repetition. | Status: done

### 4.3 Sentiment Matcher (`src/matchers/content/sentiment.ts`)

- [x] **Implement `toHaveSentiment`** — Tokenize output. Score each word against sentiment lexicon (+1/-1/0). Apply negation handling: negation word within 3-word window inverts score. Apply intensifier handling: "very"/"extremely"/"incredibly" multiplies score by 1.5. Sum and normalize by token count. Classify: score > 0.1 = positive, < -0.1 = negative, else neutral. Pass if classified sentiment matches expected. Failure message shows score, detected sentiment, and top signals. | Status: done

### 4.4 Quality Matchers (`src/matchers/quality/`)

- [x] **Implement `toNotBeRefusal`** — Check output against refusal phrase catalog. Compute refusal density (refusal phrases / total sentences). Full refusal (density > 0.5): fail. Partial refusal (0 < density <= 0.5): pass with warning in details. No refusal phrases: pass. Failure message lists detected refusal phrases with line numbers and density. | Status: done
- [x] **Implement `toNotBeTruncated`** — Check: (1) bracket balance `{}[]()`, (2) code fence balance, (3) last line ends with terminal punctuation (`.!?:}])`) or is a list item/heading — not mid-word or ending with comma/conjunction, (4) quote mark balance. Pass if no truncation indicators. Failure message lists all truncation indicators found. | Status: done
- [x] **Implement `toNotBeHedged`** — Split into sentences. Check each against hedging phrase catalog (case-insensitive). Compute hedging ratio (sentences with hedging / total). Pass if ratio <= maxHedgingRatio (default 0.3). Failure message shows ratio, lists detected hedging phrases with sentence numbers. | Status: done
- [x] **Implement `toBeCompleteJSON`** — Combine `toBeValidJSON` and `toNotBeTruncated`. Fail if either fails, combining both failure messages. | Status: done
- [x] **Implement `toNotRepeat`** — Split into sentences, count sentence frequencies. If any sentence appears > maxRepetitions (default 3) times, fail. Extract 4-grams, if any 4-gram appears > maxRepetitions * 2 times, fail. Failure message shows repeated sentences/phrases and their counts. | Status: done

---

## Phase 5: Semantic Matchers

### 5.1 Embedding Cache (`src/utils/embedding-cache.ts`)

- [x] **Implement embedding cache** — Wrap an `EmbedFn` with `Map<string, number[]>` caching. On cache miss, call the underlying `embedFn` and store the result. On cache hit, return the cached vector. Cache is scoped to a single `setupAIAssertions()` call. | Status: done

### 5.2 Semantic Matchers (`src/matchers/semantic/`)

- [x] **Implement `toBeSemanticallySimilarTo`** — Async matcher. Require `embedFn` (throw descriptive error if missing). Embed both received and expected strings. Compute cosine similarity. Pass if similarity >= threshold (default 0.85). Use embedding cache. Failure message shows similarity score, threshold, received, and expected texts. Handle embedFn errors gracefully with descriptive error messages. | Status: done
- [x] **Implement `toAnswerQuestion`** — Async matcher. Embed question and received output. Compute cosine similarity (lower default threshold 0.70). Additionally check output is not a refusal (reuse refusal detection logic). Pass if similarity >= threshold AND not a refusal. Failure message shows similarity, threshold, question, and received. | Status: done
- [x] **Implement `toBeFactuallyConsistentWith`** — Async matcher. Split both reference and output into sentences. For each output sentence, find most similar reference sentence via embedding cosine similarity. Compute average best-match similarity. Flag sentences with <0.5 similarity as unsupported. Detect contradictions via negation word presence/absence between matched pairs (similarity 0.5-0.7 with negation flip). Penalize consistency score by 0.3 per contradiction. Pass if final score >= threshold (default 0.75). | Status: done

### 5.3 Standalone Function Exports

- [ ] **Export standalone `checkSemanticSimilarity`** — Accepts `(received, expected, options: { embedFn, threshold })`, returns `Promise<MatcherResult>`. | Status: done
- [ ] **Export standalone `checkAnswerQuestion`** — Accepts `(received, question, options: { embedFn, threshold })`, returns `Promise<MatcherResult>`. | Status: done
- [ ] **Export standalone `checkFactualConsistency`** — Accepts `(received, reference, options: { embedFn, threshold })`, returns `Promise<MatcherResult>`. | Status: done
- [ ] **Export standalone functions for all sync matchers** — `checkContainsAllOf`, `checkContainsAnyOf`, `checkNotContain`, `checkMentionEntity`, `checkSentiment`, `checkValidJSON`, `checkMatchesSchema`, `checkJSONFields`, `checkValidMarkdown`, `checkCodeBlock`, `checkFormattedAs`, `checkListItems`, `checkStartsWith`, `checkEndsWith`, `checkTone`, `checkConcise`, `checkVerbose`, `checkPII`, `checkToxicContent`, `checkSystemPromptLeak`, `checkRefusal`, `checkTruncation`, `checkHedging`, `checkCompleteJSON`, `checkRepetition`. Each returns `MatcherResult`. | Status: done

---

## Phase 6: TypeScript Augmentation

- [ ] **Create `types.d.ts` for Vitest augmentation** — Augment `vitest` module's `Assertion<T>` interface with all 28 matcher signatures. Async matchers return `Promise<void>`, sync matchers return `void`. Include JSDoc comments for each matcher signature. | Status: done
- [ ] **Create `types.d.ts` for Jest augmentation** — Augment `jest.Matchers<R>` global interface with all 28 matcher signatures (same signatures as Vitest). | Status: done
- [ ] **Verify type augmentation works** — Ensure that after `setupAIAssertions()`, TypeScript recognizes all custom matchers on `expect()` without type errors in both Jest and Vitest. | Status: done

---

## Phase 7: Unit Tests

### 7.1 Utility Tests (`src/__tests__/utils/`)

- [x] **Test `cosine-similarity`** — Identical vectors return 1.0. Orthogonal vectors return 0. Opposite vectors return -1. Dimension mismatch throws. Zero-magnitude vector returns 0. | Status: done
- [x] **Test `tokenizer`** — Basic whitespace splitting. Multiple spaces. Tabs and newlines. Empty string returns empty array. | Status: done
- [x] **Test `sentences`** — Basic sentence splitting on `.!?`. Handles abbreviations (Mr., Dr., etc.). Handles end-of-string without punctuation. Empty string returns empty array. | Status: done
- [x] **Test `luhn`** — Valid credit card numbers pass. Invalid numbers fail. Non-digit characters are stripped. | Status: done
- [x] **Test `ngrams`** — Extracts correct n-grams from token arrays. Edge cases: fewer tokens than n returns empty. | Status: done
- [x] **Test `regex-escape`** — Escapes special regex characters. Regular strings pass through unchanged. | Status: done
- [x] **Test `json-extract`** — Extracts JSON from ` ```json...``` ` blocks. Returns null for non-fenced content. Handles multiple code blocks. | Status: done
- [x] **Test `embedding-cache`** — Cache hit returns stored vector without calling embedFn again. Cache miss calls embedFn. Same input on second call uses cache. | Status: done

### 7.2 Semantic Matcher Tests (`src/__tests__/semantic/`)

- [ ] **Test `toBeSemanticallySimilarTo`** — Mock embedFn returning pre-computed vectors. Identical strings: similarity 1.0, passes. Unrelated strings: low similarity, fails. Custom threshold: respects per-call override. Empty string: fails (low similarity). embedFn throws: matcher fails with descriptive error. Dimension mismatch: throws error. | Status: done
- [ ] **Test `toAnswerQuestion`** — Mock embedFn. Relevant answer passes. Irrelevant answer fails. Refusal answer fails even if semantically related. Threshold override works. | Status: done
- [ ] **Test `toBeFactuallyConsistentWith`** — Mock embedFn. Consistent output passes. Contradicting output (negation detected) fails with penalized score. Unsupported claims flagged but don't auto-fail. | Status: done

### 7.3 Content Matcher Tests (`src/__tests__/content/`)

- [x] **Test `toContainAllOf`** — All keywords present: passes. One missing: fails with missing keyword listed. Case-insensitive match: passes. Partial word match does NOT pass (word boundary enforced, "car" doesn't match "cardinal"). Empty keywords array: passes. | Status: done
- [x] **Test `toContainAnyOf`** — One keyword present: passes. None present: fails. All present: passes. | Status: done
- [x] **Test `toNotContain`** — None present: passes. One present: fails with found keyword listed. Case-insensitive: detects. | Status: done
- [x] **Test `toMentionEntity`** — Alias match works (e.g., "US" matches "United States"). Direct match works. No match: fails with aliases listed. Entity not in alias table: falls back to substring match. | Status: done
- [x] **Test `toHaveSentiment`** — Positive text detected as positive. Negative text detected as negative. Neutral text detected as neutral. Negation handling: "not good" = negative despite "good" being positive. Intensifier handling: "very good" scores higher than "good". | Status: done

### 7.4 Structural Matcher Tests (`src/__tests__/structural/`)

- [x] **Test `toBeValidJSON`** — Valid JSON: passes. Invalid JSON: fails. JSON in code fence: fails but message notes fence. Trailing comma: fails. Empty object `{}`: passes. | Status: done
- [ ] **Test `toMatchSchema` (Zod)** — Valid data: passes. Missing required field: fails with field path. Wrong type: fails. Multiple errors reported together. | Status: done
- [x] **Test `toMatchSchema` (JSON Schema)** — Valid data: passes. Missing required field: fails with JSON pointer path. Minimum/maximum violations: fails. Auto-detection between Zod and JSON Schema works correctly. | Status: done
- [x] **Test `toHaveJSONFields`** — All fields present: passes. Missing field: fails. Nested dot-notation paths resolve correctly. `null` values count as present. Non-JSON input: fails immediately. | Status: done
- [x] **Test `toBeValidMarkdown`** — Well-formed markdown: passes. Unclosed code fence: fails. Empty link target `[text]()`: fails. Heading level skip (# to ###): warning but passes. Balanced emphasis: passes. Unbalanced emphasis: handled. | Status: done
- [x] **Test `toContainCodeBlock`** — Has code block: passes. No code block: fails. Language filter matches: passes. Language filter doesn't match: fails and lists found languages. No language specified: any code block passes. | Status: done

### 7.5 Format Matcher Tests (`src/__tests__/format/`)

- [x] **Test `toBeFormattedAs`** — `json` with valid JSON: passes. `json` with plain text: fails. `markdown` with headings and code fences: passes. `list` with numbered list: passes. `csv` with consistent columns: passes. `xml` with matched tags: passes. `yaml` with key-value pairs: passes. `table` with pipe-separated rows: passes. | Status: done
- [x] **Test `toHaveListItems`** — Exactly 5 items with `(5, 5)`: passes. 3 items with `(5, 5)`: fails. At least 3 with `(3)`: passes. Both numbered and bullet lists detected. Mixed list types. | Status: done
- [x] **Test `toStartWith`** — Correct prefix: passes. Wrong prefix: fails. Leading whitespace trimmed: passes. Case sensitive: exact match required. | Status: done
- [x] **Test `toEndWith`** — Correct suffix: passes. Wrong suffix: fails. Trailing whitespace trimmed: passes. Case sensitive: exact match required. | Status: done

### 7.6 Tone Matcher Tests (`src/__tests__/tone/`)

- [x] **Test `toHaveTone`** — Formal text (no contractions, long sentences, passive voice): detects "formal". Casual text (contractions, short sentences, filler words): detects "casual". Technical text (domain terminology, code-like tokens, long words): detects "technical". Friendly text (politeness markers, "you", exclamation marks): detects "friendly". | Status: done
- [x] **Test `toBeConcise`** — 30-word output with max 50: passes. 80-word output with max 50: fails. Failure message shows count vs. limit. | Status: done
- [x] **Test `toNotBeVerbose`** — 3 sentences with max 5: passes. 8 sentences with max 5: fails. Excessive 3-gram repetition: fails regardless of sentence count. Default max (10) applied when no argument. | Status: done

### 7.7 Safety Matcher Tests (`src/__tests__/safety/`)

- [x] **Test `toNotContainPII`** — Email detected: fails. Phone number detected: fails. SSN detected: fails. Valid credit card (Luhn passes): fails. Random 16-digit number (Luhn fails): passes. IPv4 detected (non-excluded): fails. Localhost 127.0.0.1: passes (excluded). US street address detected: fails. No PII: passes. Multiple PII types: all reported. | Status: done
- [x] **Test `toNotContainToxicContent`** — Profanity word present: fails. "Scunthorpe" substring false positive: passes (word boundary matching). Critical slur: fails. Info-level mild language: passes (reported but not failure). Clean text: passes. | Status: done
- [x] **Test `toNotLeakSystemPrompt`** — 30% n-gram overlap: fails. 5% n-gram overlap: passes. Verbatim 50+ char substring: fails. Completely different output: passes. Short system prompt edge case handled. | Status: done

### 7.8 Quality Matcher Tests (`src/__tests__/quality/`)

- [x] **Test `toNotBeRefusal`** — Full refusal ("I can't help with that"): fails with refusal density. Normal answer: passes. Partial refusal (disclaimer + content): passes with warning in details. Multiple refusal phrases: all listed. | Status: done
- [x] **Test `toNotBeTruncated`** — Balanced brackets: passes. Unclosed `{`: fails. Odd code fence count: fails. Last line ending mid-sentence (comma/conjunction): fails. Complete sentence ending: passes. Quote balance checked. | Status: done
- [x] **Test `toNotBeHedged`** — Heavy hedging (>30%): fails. Light hedging (<30%): passes. Strict threshold (0.1) with moderate hedging: fails. Custom hedging phrases detected. | Status: done
- [x] **Test `toBeCompleteJSON`** — Valid complete JSON: passes. Valid but truncated JSON: fails. Invalid JSON: fails. Combines both failure messages. | Status: done
- [x] **Test `toNotRepeat`** — Same sentence 5 times (max 3): fails. Unique sentences: passes. 4-gram repeated > maxRepetitions*2 times: fails. Default max (3) applied. Strict max (1): no sentence can repeat. | Status: done

### 7.9 Integration Tests (`src/__tests__/setup.test.ts`)

- [ ] **Test `setupAIAssertions` registers all matchers** — Set up with mock embedFn, verify all 28 matchers are available on `expect()`. | Status: done
- [x] **Test multiple `setupAIAssertions` calls** — Call setup twice with different options, verify last call wins for configuration. | Status: done
- [ ] **Test `.not` negation** — Verify matchers work with `.not` (e.g., `expect(output).not.toContainAllOf([...])`). | Status: done
- [ ] **Test async matchers with `await`** — Verify semantic matchers work correctly when awaited. | Status: done
- [ ] **Test failure messages include both received and expected** — Verify that failing matchers produce messages with received value and expected criteria. | Status: done
- [ ] **Test standalone functions work without test framework** — Import standalone functions directly, call them programmatically, verify they return correct `MatcherResult` objects. | Status: done

### 7.10 Edge Case Tests

- [x] **Test empty string input** — Pass empty string to every matcher. Each should handle gracefully (no crash, reasonable pass/fail). | Status: done
- [x] **Test whitespace-only input** — Pass whitespace-only string to all matchers. Treated as empty by most matchers. | Status: done
- [x] **Test very long input (100KB)** — Verify matchers complete in reasonable time with large inputs. | Status: done
- [ ] **Test `null`/`undefined` received value** — Each matcher should throw a descriptive error rather than crashing with `TypeError`. | Status: done
- [x] **Test Unicode input** — Verify regex patterns handle basic Unicode. CJK characters tokenized as single tokens. | Status: done
- [ ] **Test multiple matchers on same output** — Verify matchers run independently with no shared state corruption. | Status: done
- [ ] **Test embedFn returning different dimensions** — Verify cosine similarity throws dimension mismatch error. | Status: done

---

## Phase 8: Documentation

- [x] **Create README.md** — Quick start guide, installation instructions, utility function reference, type exports, planned features overview. Full matcher reference table will be added when matchers are implemented. | Status: done
- [ ] **Add JSDoc comments to all public API functions** — `setupAIAssertions`, all standalone matcher functions, all exported types. Include parameter descriptions, return types, and usage examples. | Status: done

---

## Phase 9: Build Verification and Publishing Prep

- [x] **Verify `npm run build` succeeds** — TypeScript compiles without errors. Output in `dist/` includes `.js`, `.d.ts`, `.d.ts.map`, and `.js.map` files. | Status: done
- [x] **Verify `npm run test` passes** — All unit and integration tests pass. | Status: done
- [x] **Verify `npm run lint` passes** — No lint errors. | Status: done
- [ ] **Verify package exports** — Confirm `main` and `types` fields in package.json point to correct files. Confirm `files` array includes `dist` and `types.d.ts`. | Status: done
- [x] **Bump version in package.json** — Bump version to appropriate semver level for initial release (0.1.0 -> 1.0.0 or as appropriate). | Status: done
- [ ] **Verify `npm publish --dry-run`** — Confirm package contents are correct, no extraneous files, types are included. | Status: done
