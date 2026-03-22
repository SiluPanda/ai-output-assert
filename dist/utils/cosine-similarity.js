"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosineSimilarity = cosineSimilarity;
function cosineSimilarity(a, b) {
    if (a.length !== b.length) {
        throw new Error(`Dimension mismatch: ${a.length} vs ${b.length}`);
    }
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0)
        return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
//# sourceMappingURL=cosine-similarity.js.map