"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCachedEmbedFn = createCachedEmbedFn;
function createCachedEmbedFn(embedFn) {
    const cache = new Map();
    return async (text) => {
        if (cache.has(text))
            return cache.get(text);
        const embedding = await embedFn(text);
        cache.set(text, embedding);
        return embedding;
    };
}
//# sourceMappingURL=embedding-cache.js.map