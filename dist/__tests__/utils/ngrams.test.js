"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const ngrams_1 = require("../../utils/ngrams");
(0, vitest_1.describe)('extractNgrams', () => {
    (0, vitest_1.it)('n=1 returns individual tokens', () => {
        (0, vitest_1.expect)((0, ngrams_1.extractNgrams)(['a', 'b', 'c'], 1)).toEqual(['a', 'b', 'c']);
    });
    (0, vitest_1.it)('n=2 returns bigrams', () => {
        (0, vitest_1.expect)((0, ngrams_1.extractNgrams)(['a', 'b', 'c'], 2)).toEqual(['a b', 'b c']);
    });
    (0, vitest_1.it)('n=3 returns trigrams', () => {
        (0, vitest_1.expect)((0, ngrams_1.extractNgrams)(['a', 'b', 'c', 'd'], 3)).toEqual(['a b c', 'b c d']);
    });
    (0, vitest_1.it)('n larger than token count returns []', () => {
        (0, vitest_1.expect)((0, ngrams_1.extractNgrams)(['a', 'b'], 5)).toEqual([]);
    });
    (0, vitest_1.it)('n=0 returns []', () => {
        (0, vitest_1.expect)((0, ngrams_1.extractNgrams)(['a', 'b', 'c'], 0)).toEqual([]);
    });
    (0, vitest_1.it)('empty tokens with n=1 returns []', () => {
        (0, vitest_1.expect)((0, ngrams_1.extractNgrams)([], 1)).toEqual([]);
    });
    (0, vitest_1.it)('exact length match returns one ngram', () => {
        (0, vitest_1.expect)((0, ngrams_1.extractNgrams)(['a', 'b', 'c'], 3)).toEqual(['a b c']);
    });
});
//# sourceMappingURL=ngrams.test.js.map