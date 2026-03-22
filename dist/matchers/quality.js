"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNotBeTruncated = toNotBeTruncated;
exports.toNotBeHedged = toNotBeHedged;
exports.toBeCompleteJSON = toBeCompleteJSON;
exports.toNotRepeat = toNotRepeat;
const tokenizer_1 = require("../utils/tokenizer");
const sentences_1 = require("../utils/sentences");
const ngrams_1 = require("../utils/ngrams");
const hedging_phrases_1 = require("../catalogs/hedging-phrases");
function toNotBeTruncated(received) {
    const issues = [];
    const trimmed = received.trim();
    // Check ends with sentence-terminal punctuation
    if (trimmed.length > 0 && !/[.!?'")\]>]$/.test(trimmed)) {
        issues.push('Does not end with terminal punctuation');
    }
    // Check for unclosed code fences
    const codeFences = (trimmed.match(/```/g) ?? []).length;
    if (codeFences % 2 !== 0) {
        issues.push('Unclosed code fence');
    }
    // Check for hanging list items (list item with no content after bullet)
    const hangingList = /^[-*]\s*$|^\d+[.)]\s*$/m.test(trimmed);
    if (hangingList) {
        issues.push('Hanging list item with no content');
    }
    const pass = issues.length === 0;
    return {
        pass,
        message: () => pass
            ? `Expected output to appear truncated, but it looks complete`
            : `Expected output not to be truncated, but found issues: ${issues.join('; ')}`,
        details: { issues },
    };
}
function toNotBeHedged(received, phrases, threshold = 0.3) {
    const allPhrases = [...hedging_phrases_1.DEFAULT_HEDGING_PHRASES, ...(phrases ?? [])];
    const lower = received.toLowerCase();
    const sentences = (0, sentences_1.splitSentences)(received);
    const sentenceCount = Math.max(sentences.length, 1);
    const foundPhrases = [];
    for (const phrase of allPhrases) {
        if (lower.includes(phrase.toLowerCase())) {
            foundPhrases.push(phrase);
        }
    }
    const ratio = foundPhrases.length / sentenceCount;
    const pass = ratio < threshold;
    return {
        pass,
        message: () => pass
            ? `Expected output to be hedged, but hedging ratio ${ratio.toFixed(2)} < threshold ${threshold}`
            : `Expected output not to be hedged, but hedging ratio ${ratio.toFixed(2)} >= threshold ${threshold} (phrases: ${foundPhrases.join(', ')})`,
        details: { foundPhrases, ratio, threshold, sentenceCount },
    };
}
function toBeCompleteJSON(received) {
    const trimmed = received.trim();
    try {
        JSON.parse(trimmed);
        return {
            pass: true,
            message: () => `Expected output not to be complete JSON`,
            details: { complete: true },
        };
    }
    catch (parseError) {
        // Check if it looks like truncated JSON
        const looksLikeJSON = trimmed.startsWith('{') || trimmed.startsWith('[');
        const properlyTerminated = (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
            (trimmed.startsWith('[') && trimmed.endsWith(']'));
        const truncated = looksLikeJSON && !properlyTerminated;
        return {
            pass: false,
            message: () => truncated
                ? `Expected output to be complete JSON, but it appears truncated (starts with ${trimmed[0]} but does not end with matching bracket)`
                : `Expected output to be complete JSON, but it is not valid JSON: ${parseError.message}`,
            details: { truncated, parseError: parseError.message },
        };
    }
}
function toNotRepeat(received, options = {}) {
    const windowSize = options.windowSize ?? 4;
    const threshold = options.threshold ?? 3;
    const tokens = (0, tokenizer_1.tokenize)(received.toLowerCase());
    const ngrams = (0, ngrams_1.extractNgrams)(tokens, windowSize);
    const counts = new Map();
    for (const ng of ngrams) {
        counts.set(ng, (counts.get(ng) ?? 0) + 1);
    }
    const repeated = [];
    for (const [ngram, count] of counts.entries()) {
        if (count > threshold) {
            repeated.push({ ngram, count });
        }
    }
    const pass = repeated.length === 0;
    return {
        pass,
        message: () => pass
            ? `Expected output to have repetitions, but none exceeded threshold ${threshold}`
            : `Expected output not to repeat, but found ${repeated.length} repeated ${windowSize}-gram(s): ${repeated.map((r) => `"${r.ngram}" (${r.count}x)`).join(', ')}`,
        details: { repeated, windowSize, threshold },
    };
}
//# sourceMappingURL=quality.js.map