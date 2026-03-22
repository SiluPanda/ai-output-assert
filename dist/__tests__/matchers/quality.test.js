"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const quality_1 = require("../../matchers/quality");
(0, vitest_1.describe)('toNotBeTruncated', () => {
    (0, vitest_1.it)('passes for a complete sentence', () => {
        (0, vitest_1.expect)((0, quality_1.toNotBeTruncated)('The answer is clear and well-defined.').pass).toBe(true);
    });
    (0, vitest_1.it)('passes ending with question mark', () => {
        (0, vitest_1.expect)((0, quality_1.toNotBeTruncated)('Is this correct?').pass).toBe(true);
    });
    (0, vitest_1.it)('passes ending with exclamation', () => {
        (0, vitest_1.expect)((0, quality_1.toNotBeTruncated)('Great job!').pass).toBe(true);
    });
    (0, vitest_1.it)('fails for sentence ending mid-word', () => {
        const r = (0, quality_1.toNotBeTruncated)('The answer is');
        (0, vitest_1.expect)(r.pass).toBe(false);
        (0, vitest_1.expect)(r.details.issues).toContain('Does not end with terminal punctuation');
    });
    (0, vitest_1.it)('fails for unclosed code fence', () => {
        const r = (0, quality_1.toNotBeTruncated)('Here is some code:\n```js\nconsole.log("hi")');
        (0, vitest_1.expect)(r.pass).toBe(false);
        (0, vitest_1.expect)(r.details.issues).toContain('Unclosed code fence');
    });
    (0, vitest_1.it)('passes for balanced code fence', () => {
        (0, vitest_1.expect)((0, quality_1.toNotBeTruncated)('Here is code:\n```js\nconsole.log("hi")\n```\nDone.').pass).toBe(true);
    });
});
(0, vitest_1.describe)('toNotBeHedged', () => {
    (0, vitest_1.it)('passes for confident statement', () => {
        const r = (0, quality_1.toNotBeHedged)('The capital of France is Paris. It is located in northern France.');
        (0, vitest_1.expect)(r.pass).toBe(true);
    });
    (0, vitest_1.it)('fails for heavily hedged text', () => {
        const text = "I think this might be correct. I believe it's possibly the right answer. Maybe it is, perhaps not. I'm not sure about this.";
        const r = (0, quality_1.toNotBeHedged)(text);
        (0, vitest_1.expect)(r.pass).toBe(false);
        (0, vitest_1.expect)(r.details.foundPhrases.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('respects custom threshold', () => {
        const text = 'I think this is correct. The sky is blue. Water is wet.';
        // With very low threshold of 0.01, should fail
        (0, vitest_1.expect)((0, quality_1.toNotBeHedged)(text, undefined, 0.01).pass).toBe(false);
        // With threshold of 1.0, should pass
        (0, vitest_1.expect)((0, quality_1.toNotBeHedged)(text, undefined, 1.0).pass).toBe(true);
    });
    (0, vitest_1.it)('accepts custom hedging phrases', () => {
        const r = (0, quality_1.toNotBeHedged)('Allegedly this is true. The fact is known.', ['allegedly'], 0.01);
        (0, vitest_1.expect)(r.pass).toBe(false);
        (0, vitest_1.expect)(r.details.foundPhrases).toContain('allegedly');
    });
});
(0, vitest_1.describe)('toBeCompleteJSON', () => {
    (0, vitest_1.it)('passes for valid complete JSON object', () => {
        (0, vitest_1.expect)((0, quality_1.toBeCompleteJSON)('{"name": "Alice", "age": 30}').pass).toBe(true);
    });
    (0, vitest_1.it)('passes for valid complete JSON array', () => {
        (0, vitest_1.expect)((0, quality_1.toBeCompleteJSON)('[1, 2, 3]').pass).toBe(true);
    });
    (0, vitest_1.it)('fails for truncated JSON object', () => {
        const r = (0, quality_1.toBeCompleteJSON)('{"name": "Alice", "age":');
        (0, vitest_1.expect)(r.pass).toBe(false);
        (0, vitest_1.expect)(r.details.truncated).toBe(true);
    });
    (0, vitest_1.it)('fails for truncated JSON array', () => {
        const r = (0, quality_1.toBeCompleteJSON)('[1, 2,');
        (0, vitest_1.expect)(r.pass).toBe(false);
        (0, vitest_1.expect)(r.details.truncated).toBe(true);
    });
    (0, vitest_1.it)('fails for non-JSON text', () => {
        const r = (0, quality_1.toBeCompleteJSON)('this is just text');
        (0, vitest_1.expect)(r.pass).toBe(false);
        (0, vitest_1.expect)(r.details.truncated).toBe(false);
    });
});
(0, vitest_1.describe)('toNotRepeat', () => {
    (0, vitest_1.it)('passes for normal prose', () => {
        const r = (0, quality_1.toNotRepeat)('The quick brown fox jumps over the lazy dog. It ran across the field and disappeared.');
        (0, vitest_1.expect)(r.pass).toBe(true);
    });
    (0, vitest_1.it)('fails when 4-gram repeats more than threshold times', () => {
        const repeated = 'the cat sat on the mat. '.repeat(5);
        const r = (0, quality_1.toNotRepeat)(repeated, { threshold: 2 });
        (0, vitest_1.expect)(r.pass).toBe(false);
        (0, vitest_1.expect)(r.details.repeated.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('respects custom windowSize', () => {
        const text = 'alpha beta alpha beta alpha beta alpha beta alpha beta';
        const r = (0, quality_1.toNotRepeat)(text, { windowSize: 2, threshold: 3 });
        (0, vitest_1.expect)(r.pass).toBe(false);
    });
    (0, vitest_1.it)('passes when repetition is below threshold', () => {
        const text = 'one two three four one two three four';
        // With threshold 5, should pass
        (0, vitest_1.expect)((0, quality_1.toNotRepeat)(text, { windowSize: 4, threshold: 5 }).pass).toBe(true);
    });
});
//# sourceMappingURL=quality.test.js.map