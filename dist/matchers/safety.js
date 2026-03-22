"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNotContainPII = toNotContainPII;
exports.toNotContainToxicContent = toNotContainToxicContent;
exports.toNotLeakSystemPrompt = toNotLeakSystemPrompt;
exports.toNotBeRefusal = toNotBeRefusal;
const pii_patterns_1 = require("../catalogs/pii-patterns");
const toxic_words_1 = require("../catalogs/toxic-words");
const hedging_phrases_1 = require("../catalogs/hedging-phrases");
function toNotContainPII(received, patterns) {
    const allPatterns = [...pii_patterns_1.DEFAULT_PII_PATTERNS, ...(patterns ?? [])];
    const found = [];
    for (const piiPattern of allPatterns) {
        const regex = new RegExp(piiPattern.pattern.source, piiPattern.pattern.flags.includes('g') ? piiPattern.pattern.flags : piiPattern.pattern.flags + 'g');
        let match;
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
        message: () => pass
            ? `Expected output to contain PII, but none was found`
            : `Expected output not to contain PII, but found ${found.length} instance(s): ${found.map((f) => `${f.type}("${f.value}")`).join(', ')}`,
        details: { found },
    };
}
function toNotContainToxicContent(received, words) {
    const allWords = [...toxic_words_1.DEFAULT_TOXIC_WORDS, ...(words ?? [])];
    const lower = received.toLowerCase();
    const found = [];
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
        message: () => pass
            ? `Expected output to contain toxic content, but none was found`
            : `Expected output not to contain toxic content, but found: ${found.map((f) => `${f.word}(${f.severity})`).join(', ')}`,
        details: { found },
    };
}
function toNotLeakSystemPrompt(received, patterns) {
    const allPatterns = [...hedging_phrases_1.DEFAULT_SYSTEM_PROMPT_PATTERNS, ...(patterns ?? [])];
    const matched = [];
    for (const pattern of allPatterns) {
        if (pattern.test(received)) {
            matched.push(pattern.toString());
        }
    }
    const pass = matched.length === 0;
    return {
        pass,
        message: () => pass
            ? `Expected output to contain system prompt indicators, but none found`
            : `Expected output not to leak system prompt, but matched patterns: ${matched.join(', ')}`,
        details: { matchedPatterns: matched },
    };
}
function toNotBeRefusal(received, phrases) {
    const allPhrases = [...hedging_phrases_1.DEFAULT_REFUSAL_PHRASES, ...(phrases ?? [])];
    const lower = received.toLowerCase();
    const found = allPhrases.filter((p) => lower.includes(p.toLowerCase()));
    const pass = found.length === 0;
    return {
        pass,
        message: () => pass
            ? `Expected output to be a refusal, but no refusal phrases found`
            : `Expected output not to be a refusal, but found: ${found.join(', ')}`,
        details: { foundPhrases: found },
    };
}
//# sourceMappingURL=safety.js.map