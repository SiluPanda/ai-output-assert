"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const tokenizer_1 = require("../../utils/tokenizer");
(0, vitest_1.describe)('tokenize', () => {
    (0, vitest_1.it)('empty string returns []', () => {
        (0, vitest_1.expect)((0, tokenizer_1.tokenize)('')).toEqual([]);
    });
    (0, vitest_1.it)('single word returns [word]', () => {
        (0, vitest_1.expect)((0, tokenizer_1.tokenize)('hello')).toEqual(['hello']);
    });
    (0, vitest_1.it)('multiple spaces are collapsed', () => {
        (0, vitest_1.expect)((0, tokenizer_1.tokenize)('hello   world')).toEqual(['hello', 'world']);
    });
    (0, vitest_1.it)('newlines are treated as whitespace', () => {
        (0, vitest_1.expect)((0, tokenizer_1.tokenize)('hello\nworld\nfoo')).toEqual(['hello', 'world', 'foo']);
    });
    (0, vitest_1.it)('tabs are treated as whitespace', () => {
        (0, vitest_1.expect)((0, tokenizer_1.tokenize)('hello\tworld')).toEqual(['hello', 'world']);
    });
    (0, vitest_1.it)('mixed whitespace is handled', () => {
        (0, vitest_1.expect)((0, tokenizer_1.tokenize)('  hello  \n  world  ')).toEqual(['hello', 'world']);
    });
});
//# sourceMappingURL=tokenizer.test.js.map