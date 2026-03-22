"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const cosine_similarity_1 = require("../../utils/cosine-similarity");
(0, vitest_1.describe)('cosineSimilarity', () => {
    (0, vitest_1.it)('identical vectors return 1.0', () => {
        (0, vitest_1.expect)((0, cosine_similarity_1.cosineSimilarity)([1, 2, 3], [1, 2, 3])).toBeCloseTo(1.0, 10);
    });
    (0, vitest_1.it)('orthogonal vectors return 0.0', () => {
        (0, vitest_1.expect)((0, cosine_similarity_1.cosineSimilarity)([1, 0, 0], [0, 1, 0])).toBeCloseTo(0.0, 10);
    });
    (0, vitest_1.it)('opposite vectors return -1.0', () => {
        (0, vitest_1.expect)((0, cosine_similarity_1.cosineSimilarity)([1, 0, 0], [-1, 0, 0])).toBeCloseTo(-1.0, 10);
    });
    (0, vitest_1.it)('zero vector returns 0.0', () => {
        (0, vitest_1.expect)((0, cosine_similarity_1.cosineSimilarity)([0, 0, 0], [1, 2, 3])).toBe(0);
        (0, vitest_1.expect)((0, cosine_similarity_1.cosineSimilarity)([1, 2, 3], [0, 0, 0])).toBe(0);
        (0, vitest_1.expect)((0, cosine_similarity_1.cosineSimilarity)([0, 0, 0], [0, 0, 0])).toBe(0);
    });
    (0, vitest_1.it)('dimension mismatch throws', () => {
        (0, vitest_1.expect)(() => (0, cosine_similarity_1.cosineSimilarity)([1, 2], [1, 2, 3])).toThrow('Dimension mismatch: 2 vs 3');
    });
    (0, vitest_1.it)('typical similarity between [1,2,3] and [1,2,4]', () => {
        const sim = (0, cosine_similarity_1.cosineSimilarity)([1, 2, 3], [1, 2, 4]);
        // Should be high but less than 1
        (0, vitest_1.expect)(sim).toBeGreaterThan(0.99);
        (0, vitest_1.expect)(sim).toBeLessThan(1.0);
    });
});
//# sourceMappingURL=cosine-similarity.test.js.map