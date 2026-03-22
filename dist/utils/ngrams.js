"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNgrams = extractNgrams;
function extractNgrams(tokens, n) {
    if (n <= 0 || tokens.length < n)
        return [];
    const result = [];
    for (let i = 0; i <= tokens.length - n; i++) {
        result.push(tokens.slice(i, i + n).join(' '));
    }
    return result;
}
//# sourceMappingURL=ngrams.js.map