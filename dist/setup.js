"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAIAssertions = setupAIAssertions;
exports.getGlobalOptions = getGlobalOptions;
const format_1 = require("./matchers/format");
const content_1 = require("./matchers/content");
const tone_1 = require("./matchers/tone");
const structural_1 = require("./matchers/structural");
const safety_1 = require("./matchers/safety");
const quality_1 = require("./matchers/quality");
const semantic_1 = require("./matchers/semantic");
let globalOptions = {};
function setupAIAssertions(options) {
    globalOptions = { ...globalOptions, ...options };
    const expectFn = typeof globalThis.expect !== 'undefined'
        ? globalThis.expect
        : null;
    if (expectFn && typeof expectFn.extend === 'function') {
        expectFn.extend(buildMatchers(globalOptions));
    }
}
function getGlobalOptions() {
    return globalOptions;
}
function wrapSync(fn) {
    return function (received, ...args) {
        const result = fn(received, ...args);
        return {
            pass: result.pass,
            message: result.message,
        };
    };
}
function wrapAsync(fn) {
    return async function (received, ...args) {
        const result = await fn(received, ...args);
        return {
            pass: result.pass,
            message: result.message,
        };
    };
}
function buildMatchers(opts) {
    return {
        // format
        toStartWith: wrapSync((r, prefix) => (0, format_1.toStartWith)(r, prefix)),
        toEndWith: wrapSync((r, suffix) => (0, format_1.toEndWith)(r, suffix)),
        toBeFormattedAs: wrapSync((r, fmt) => (0, format_1.toBeFormattedAs)(r, fmt)),
        toHaveListItems: wrapSync((r, items) => (0, format_1.toHaveListItems)(r, items)),
        // content
        toContainAllOf: wrapSync((r, phrases) => (0, content_1.toContainAllOf)(r, phrases)),
        toContainAnyOf: wrapSync((r, phrases) => (0, content_1.toContainAnyOf)(r, phrases)),
        toNotContain: wrapSync((r, phrase) => (0, content_1.toNotContain)(r, phrase)),
        toMentionEntity: wrapSync((r, entity, aliases) => (0, content_1.toMentionEntity)(r, entity, aliases)),
        // tone
        toHaveSentiment: wrapSync((r, sentiment) => (0, tone_1.toHaveSentiment)(r, sentiment)),
        toHaveTone: wrapSync((r, tone) => (0, tone_1.toHaveTone)(r, tone)),
        toBeConcise: wrapSync((r, maxWords) => (0, tone_1.toBeConcise)(r, maxWords)),
        toNotBeVerbose: wrapSync((r, options) => (0, tone_1.toNotBeVerbose)(r, options)),
        // structural
        toBeValidJSON: wrapSync((r) => (0, structural_1.toBeValidJSON)(r)),
        toMatchSchema: wrapSync((r, schema) => (0, structural_1.toMatchSchema)(r, schema)),
        toHaveJSONFields: wrapSync((r, fields) => (0, structural_1.toHaveJSONFields)(r, fields)),
        toBeValidMarkdown: wrapSync((r) => (0, structural_1.toBeValidMarkdown)(r)),
        toContainCodeBlock: wrapSync((r, lang) => (0, structural_1.toContainCodeBlock)(r, lang)),
        // safety
        toNotContainPII: wrapSync((r, patterns) => (0, safety_1.toNotContainPII)(r, patterns)),
        toNotContainToxicContent: wrapSync((r, words) => (0, safety_1.toNotContainToxicContent)(r, words)),
        toNotLeakSystemPrompt: wrapSync((r, patterns) => (0, safety_1.toNotLeakSystemPrompt)(r, patterns)),
        toNotBeRefusal: wrapSync((r, phrases) => (0, safety_1.toNotBeRefusal)(r, phrases)),
        // quality
        toNotBeTruncated: wrapSync((r) => (0, quality_1.toNotBeTruncated)(r)),
        toNotBeHedged: wrapSync((r, phrases, threshold) => (0, quality_1.toNotBeHedged)(r, phrases, threshold)),
        toBeCompleteJSON: wrapSync((r) => (0, quality_1.toBeCompleteJSON)(r)),
        toNotRepeat: wrapSync((r, options) => (0, quality_1.toNotRepeat)(r, options)),
        // semantic (async)
        toBeSemanticallySimilarTo: wrapAsync((r, expected, options) => (0, semantic_1.toBeSemanticallySimilarTo)(r, expected, {
            ...(opts.embedFn ? { embedFn: opts.embedFn } : {}),
            ...(opts.semanticThreshold ? { threshold: opts.semanticThreshold } : {}),
            ...(options ?? {}),
        })),
        toAnswerQuestion: wrapAsync((r, question, options) => (0, semantic_1.toAnswerQuestion)(r, question, {
            ...(opts.embedFn ? { embedFn: opts.embedFn } : {}),
            ...(options ?? {}),
        })),
        toBeFactuallyConsistentWith: wrapAsync((r, reference, options) => (0, semantic_1.toBeFactuallyConsistentWith)(r, reference, {
            ...(opts.embedFn ? { embedFn: opts.embedFn } : {}),
            ...(options ?? {}),
        })),
    };
}
//# sourceMappingURL=setup.js.map