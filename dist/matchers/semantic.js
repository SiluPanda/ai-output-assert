"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeSemanticallySimilarTo = toBeSemanticallySimilarTo;
exports.toAnswerQuestion = toAnswerQuestion;
exports.toBeFactuallyConsistentWith = toBeFactuallyConsistentWith;
const tokenizer_1 = require("../utils/tokenizer");
const ngrams_1 = require("../utils/ngrams");
const cosine_similarity_1 = require("../utils/cosine-similarity");
const sentences_1 = require("../utils/sentences");
function ngramJaccardSimilarity(a, b, n = 3) {
    const tokensA = (0, tokenizer_1.tokenize)(a.toLowerCase());
    const tokensB = (0, tokenizer_1.tokenize)(b.toLowerCase());
    const ngramsA = new Set((0, ngrams_1.extractNgrams)(tokensA, n));
    const ngramsB = new Set((0, ngrams_1.extractNgrams)(tokensB, n));
    if (ngramsA.size === 0 && ngramsB.size === 0)
        return 1;
    if (ngramsA.size === 0 || ngramsB.size === 0)
        return 0;
    const intersection = new Set([...ngramsA].filter((x) => ngramsB.has(x)));
    const union = new Set([...ngramsA, ...ngramsB]);
    return intersection.size / union.size;
}
async function computeSimilarity(a, b, embedFn) {
    if (embedFn) {
        const [vecA, vecB] = await Promise.all([embedFn(a), embedFn(b)]);
        return (0, cosine_similarity_1.cosineSimilarity)(vecA, vecB);
    }
    return ngramJaccardSimilarity(a, b);
}
async function toBeSemanticallySimilarTo(received, expected, options = {}) {
    const threshold = options.threshold ?? 0.8;
    const similarity = await computeSimilarity(received, expected, options.embedFn);
    const pass = similarity >= threshold;
    return {
        pass,
        message: () => pass
            ? `Expected output not to be semantically similar to reference (similarity: ${similarity.toFixed(3)}, threshold: ${threshold})`
            : `Expected output to be semantically similar to reference, but similarity ${similarity.toFixed(3)} < threshold ${threshold}`,
        details: { similarity, threshold, method: options.embedFn ? 'embedding' : 'ngram-jaccard' },
    };
}
async function toAnswerQuestion(received, question, options = {}) {
    const threshold = 0.5;
    const similarity = await computeSimilarity(received, question, options.embedFn);
    const pass = similarity >= threshold;
    return {
        pass,
        message: () => pass
            ? `Expected output not to answer the question (similarity: ${similarity.toFixed(3)})`
            : `Expected output to answer the question, but semantic similarity ${similarity.toFixed(3)} < threshold ${threshold}`,
        details: { similarity, threshold, question },
    };
}
async function toBeFactuallyConsistentWith(received, reference, options = {}) {
    const threshold = 0.3;
    const sentences = (0, sentences_1.splitSentences)(received);
    if (sentences.length === 0) {
        return {
            pass: true,
            message: () => `Expected output to be factually inconsistent, but output has no sentences`,
            details: { sentences: 0, coverageScores: [] },
        };
    }
    const coverageScores = [];
    for (const sentence of sentences) {
        const score = await computeSimilarity(sentence, reference, options.embedFn);
        coverageScores.push(score);
    }
    const avgCoverage = coverageScores.reduce((a, b) => a + b, 0) / coverageScores.length;
    const pass = avgCoverage >= threshold;
    return {
        pass,
        message: () => pass
            ? `Expected output not to be factually consistent with reference (avg coverage: ${avgCoverage.toFixed(3)})`
            : `Expected output to be factually consistent with reference, but avg coverage ${avgCoverage.toFixed(3)} < threshold ${threshold}`,
        details: { avgCoverage, threshold, coverageScores, sentenceCount: sentences.length },
    };
}
//# sourceMappingURL=semantic.js.map