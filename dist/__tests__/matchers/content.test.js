"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const content_1 = require("../../matchers/content");
(0, vitest_1.describe)('toContainAllOf', () => {
    (0, vitest_1.it)('passes when all phrases are present', () => {
        const r = (0, content_1.toContainAllOf)('The quick brown fox jumps over the lazy dog', ['quick', 'fox', 'dog']);
        (0, vitest_1.expect)(r.pass).toBe(true);
    });
    (0, vitest_1.it)('fails when any phrase is missing', () => {
        const r = (0, content_1.toContainAllOf)('The quick brown fox', ['quick', 'cat']);
        (0, vitest_1.expect)(r.pass).toBe(false);
        (0, vitest_1.expect)(r.details.missing).toContain('cat');
    });
    (0, vitest_1.it)('is case-insensitive', () => {
        (0, vitest_1.expect)((0, content_1.toContainAllOf)('Hello World', ['hello', 'WORLD']).pass).toBe(true);
    });
    (0, vitest_1.it)('passes for empty phrases array', () => {
        (0, vitest_1.expect)((0, content_1.toContainAllOf)('anything', []).pass).toBe(true);
    });
});
(0, vitest_1.describe)('toContainAnyOf', () => {
    (0, vitest_1.it)('passes when at least one phrase is present', () => {
        const r = (0, content_1.toContainAnyOf)('The quick brown fox', ['cat', 'fox', 'dog']);
        (0, vitest_1.expect)(r.pass).toBe(true);
        (0, vitest_1.expect)(r.details.found).toContain('fox');
    });
    (0, vitest_1.it)('fails when no phrases are present', () => {
        const r = (0, content_1.toContainAnyOf)('The quick brown fox', ['cat', 'elephant']);
        (0, vitest_1.expect)(r.pass).toBe(false);
    });
    (0, vitest_1.it)('is case-insensitive', () => {
        (0, vitest_1.expect)((0, content_1.toContainAnyOf)('Hello World', ['HELLO']).pass).toBe(true);
    });
});
(0, vitest_1.describe)('toNotContain', () => {
    (0, vitest_1.it)('passes when phrase is absent', () => {
        (0, vitest_1.expect)((0, content_1.toNotContain)('The quick brown fox', 'cat').pass).toBe(true);
    });
    (0, vitest_1.it)('fails when phrase is present', () => {
        const r = (0, content_1.toNotContain)('The quick brown fox', 'fox');
        (0, vitest_1.expect)(r.pass).toBe(false);
        (0, vitest_1.expect)(r.message()).toContain('fox');
    });
    (0, vitest_1.it)('is case-insensitive', () => {
        (0, vitest_1.expect)((0, content_1.toNotContain)('Hello World', 'hello').pass).toBe(false);
    });
});
(0, vitest_1.describe)('toMentionEntity', () => {
    (0, vitest_1.it)('passes when entity is mentioned', () => {
        (0, vitest_1.expect)((0, content_1.toMentionEntity)('OpenAI released GPT-4', 'OpenAI').pass).toBe(true);
    });
    (0, vitest_1.it)('passes when alias is mentioned', () => {
        const r = (0, content_1.toMentionEntity)('The company released a model', 'OpenAI', ['The company', 'Altman']);
        (0, vitest_1.expect)(r.pass).toBe(true);
        (0, vitest_1.expect)(r.details.foundTerm).toBe('The company');
    });
    (0, vitest_1.it)('fails when neither entity nor alias is found', () => {
        const r = (0, content_1.toMentionEntity)('Anthropic released Claude', 'OpenAI', ['GPT']);
        (0, vitest_1.expect)(r.pass).toBe(false);
    });
    (0, vitest_1.it)('is case-insensitive', () => {
        (0, vitest_1.expect)((0, content_1.toMentionEntity)('openai is great', 'OpenAI').pass).toBe(true);
    });
});
//# sourceMappingURL=content.test.js.map