"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const sentences_1 = require("../../utils/sentences");
(0, vitest_1.describe)('splitSentences', () => {
    (0, vitest_1.it)('"Hello world. How are you?" splits into 2 sentences', () => {
        const result = (0, sentences_1.splitSentences)('Hello world. How are you?');
        (0, vitest_1.expect)(result).toHaveLength(2);
        (0, vitest_1.expect)(result[0]).toBe('Hello world.');
        (0, vitest_1.expect)(result[1]).toBe('How are you?');
    });
    (0, vitest_1.it)('"Dr. Smith went home. Good." splits into 2 sentences, not 3', () => {
        const result = (0, sentences_1.splitSentences)('Dr. Smith went home. Good.');
        (0, vitest_1.expect)(result).toHaveLength(2);
        (0, vitest_1.expect)(result[0]).toContain('Dr.');
        (0, vitest_1.expect)(result[0]).toContain('Smith went home.');
    });
    (0, vitest_1.it)('empty string returns []', () => {
        (0, vitest_1.expect)((0, sentences_1.splitSentences)('')).toEqual([]);
    });
    (0, vitest_1.it)('whitespace-only string returns []', () => {
        (0, vitest_1.expect)((0, sentences_1.splitSentences)('   ')).toEqual([]);
    });
    (0, vitest_1.it)('single sentence without period returns 1 sentence', () => {
        const result = (0, sentences_1.splitSentences)('This is a single sentence');
        (0, vitest_1.expect)(result).toHaveLength(1);
        (0, vitest_1.expect)(result[0]).toBe('This is a single sentence');
    });
    (0, vitest_1.it)('single sentence with period returns 1 sentence', () => {
        const result = (0, sentences_1.splitSentences)('This is a single sentence.');
        (0, vitest_1.expect)(result).toHaveLength(1);
        (0, vitest_1.expect)(result[0]).toBe('This is a single sentence.');
    });
    (0, vitest_1.it)('exclamation and question marks split correctly', () => {
        const result = (0, sentences_1.splitSentences)('Hello! How are you? Fine.');
        (0, vitest_1.expect)(result).toHaveLength(3);
    });
});
//# sourceMappingURL=sentences.test.js.map