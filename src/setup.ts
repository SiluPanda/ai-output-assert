import type { AIAssertionOptions, MatcherResult } from './types';
import { toStartWith, toEndWith, toBeFormattedAs, toHaveListItems } from './matchers/format';
import { toContainAllOf, toContainAnyOf, toNotContain, toMentionEntity } from './matchers/content';
import { toHaveSentiment, toHaveTone, toBeConcise, toNotBeVerbose } from './matchers/tone';
import {
  toBeValidJSON,
  toMatchSchema,
  toHaveJSONFields,
  toBeValidMarkdown,
  toContainCodeBlock,
} from './matchers/structural';
import {
  toNotContainPII,
  toNotContainToxicContent,
  toNotLeakSystemPrompt,
  toNotBeRefusal,
} from './matchers/safety';
import {
  toNotBeTruncated,
  toNotBeHedged,
  toBeCompleteJSON,
  toNotRepeat,
} from './matchers/quality';
import {
  toBeSemanticallySimilarTo,
  toAnswerQuestion,
  toBeFactuallyConsistentWith,
} from './matchers/semantic';

let globalOptions: AIAssertionOptions = {};

export function setupAIAssertions(options?: AIAssertionOptions): void {
  globalOptions = { ...globalOptions, ...options };

  const expectFn =
    typeof (globalThis as Record<string, unknown>).expect !== 'undefined'
      ? (globalThis as Record<string, unknown>).expect
      : null;

  if (expectFn && typeof (expectFn as { extend?: unknown }).extend === 'function') {
    (expectFn as { extend: (matchers: Record<string, unknown>) => void }).extend(
      buildMatchers(globalOptions),
    );
  }
}

export function getGlobalOptions(): AIAssertionOptions {
  return globalOptions;
}

function wrapSync(fn: (...args: unknown[]) => MatcherResult) {
  return function (this: { isNot: boolean }, received: string, ...args: unknown[]) {
    const result = fn(received, ...args);
    return {
      pass: result.pass,
      message: result.message,
    };
  };
}

function wrapAsync(fn: (...args: unknown[]) => Promise<MatcherResult>) {
  return async function (this: { isNot: boolean }, received: string, ...args: unknown[]) {
    const result = await fn(received, ...args);
    return {
      pass: result.pass,
      message: result.message,
    };
  };
}

function buildMatchers(opts: AIAssertionOptions): Record<string, Function> {
  return {
    // format
    toStartWith: wrapSync((r, prefix) => toStartWith(r as string, prefix as string)),
    toEndWith: wrapSync((r, suffix) => toEndWith(r as string, suffix as string)),
    toBeFormattedAs: wrapSync((r, fmt) =>
      toBeFormattedAs(r as string, fmt as Parameters<typeof toBeFormattedAs>[1]),
    ),
    toHaveListItems: wrapSync((r, items) => toHaveListItems(r as string, items as string[])),

    // content
    toContainAllOf: wrapSync((r, phrases) => toContainAllOf(r as string, phrases as string[])),
    toContainAnyOf: wrapSync((r, phrases) => toContainAnyOf(r as string, phrases as string[])),
    toNotContain: wrapSync((r, phrase) => toNotContain(r as string, phrase as string)),
    toMentionEntity: wrapSync((r, entity, aliases) =>
      toMentionEntity(r as string, entity as string, aliases as string[] | undefined),
    ),

    // tone
    toHaveSentiment: wrapSync((r, sentiment) =>
      toHaveSentiment(r as string, sentiment as Parameters<typeof toHaveSentiment>[1]),
    ),
    toHaveTone: wrapSync((r, tone) =>
      toHaveTone(r as string, tone as Parameters<typeof toHaveTone>[1]),
    ),
    toBeConcise: wrapSync((r, maxWords) =>
      toBeConcise(r as string, maxWords as number | undefined),
    ),
    toNotBeVerbose: wrapSync((r, options) =>
      toNotBeVerbose(r as string, options as Parameters<typeof toNotBeVerbose>[1]),
    ),

    // structural
    toBeValidJSON: wrapSync((r) => toBeValidJSON(r as string)),
    toMatchSchema: wrapSync((r, schema) => toMatchSchema(r as string, schema as object)),
    toHaveJSONFields: wrapSync((r, fields) => toHaveJSONFields(r as string, fields as string[])),
    toBeValidMarkdown: wrapSync((r) => toBeValidMarkdown(r as string)),
    toContainCodeBlock: wrapSync((r, lang) =>
      toContainCodeBlock(r as string, lang as string | undefined),
    ),

    // safety
    toNotContainPII: wrapSync((r, patterns) =>
      toNotContainPII(
        r as string,
        patterns as Parameters<typeof toNotContainPII>[1],
      ),
    ),
    toNotContainToxicContent: wrapSync((r, words) =>
      toNotContainToxicContent(
        r as string,
        words as Parameters<typeof toNotContainToxicContent>[1],
      ),
    ),
    toNotLeakSystemPrompt: wrapSync((r, patterns) =>
      toNotLeakSystemPrompt(r as string, patterns as RegExp[] | undefined),
    ),
    toNotBeRefusal: wrapSync((r, phrases) =>
      toNotBeRefusal(r as string, phrases as string[] | undefined),
    ),

    // quality
    toNotBeTruncated: wrapSync((r) => toNotBeTruncated(r as string)),
    toNotBeHedged: wrapSync((r, phrases, threshold) =>
      toNotBeHedged(r as string, phrases as string[] | undefined, threshold as number | undefined),
    ),
    toBeCompleteJSON: wrapSync((r) => toBeCompleteJSON(r as string)),
    toNotRepeat: wrapSync((r, options) =>
      toNotRepeat(r as string, options as Parameters<typeof toNotRepeat>[1]),
    ),

    // semantic (async)
    toBeSemanticallySimilarTo: wrapAsync((r, expected, options) =>
      toBeSemanticallySimilarTo(
        r as string,
        expected as string,
        {
          ...(opts.embedFn ? { embedFn: opts.embedFn } : {}),
          ...(opts.semanticThreshold ? { threshold: opts.semanticThreshold } : {}),
          ...(options as object ?? {}),
        },
      ),
    ),
    toAnswerQuestion: wrapAsync((r, question, options) =>
      toAnswerQuestion(r as string, question as string, {
        ...(opts.embedFn ? { embedFn: opts.embedFn } : {}),
        ...(options as object ?? {}),
      }),
    ),
    toBeFactuallyConsistentWith: wrapAsync((r, reference, options) =>
      toBeFactuallyConsistentWith(r as string, reference as string, {
        ...(opts.embedFn ? { embedFn: opts.embedFn } : {}),
        ...(options as object ?? {}),
      }),
    ),
  };
}
