"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const embedding_cache_1 = require("../../utils/embedding-cache");
(0, vitest_1.describe)('createCachedEmbedFn', () => {
    (0, vitest_1.it)('calls underlying fn once for same input', async () => {
        const mockEmbed = vitest_1.vi.fn().mockResolvedValue([1, 2, 3]);
        const cached = (0, embedding_cache_1.createCachedEmbedFn)(mockEmbed);
        await cached('hello');
        await cached('hello');
        (0, vitest_1.expect)(mockEmbed).toHaveBeenCalledTimes(1);
    });
    (0, vitest_1.it)('returns cached result on second call', async () => {
        const mockEmbed = vitest_1.vi.fn().mockResolvedValue([0.1, 0.2, 0.3]);
        const cached = (0, embedding_cache_1.createCachedEmbedFn)(mockEmbed);
        const first = await cached('test');
        const second = await cached('test');
        (0, vitest_1.expect)(first).toEqual([0.1, 0.2, 0.3]);
        (0, vitest_1.expect)(second).toEqual([0.1, 0.2, 0.3]);
        (0, vitest_1.expect)(second).toBe(first); // same reference from cache
    });
    (0, vitest_1.it)('different inputs are both cached separately', async () => {
        let callCount = 0;
        const mockEmbed = vitest_1.vi.fn().mockImplementation(async (text) => {
            callCount++;
            return text === 'hello' ? [1, 0, 0] : [0, 1, 0];
        });
        const cached = (0, embedding_cache_1.createCachedEmbedFn)(mockEmbed);
        const a1 = await cached('hello');
        const b1 = await cached('world');
        const a2 = await cached('hello');
        const b2 = await cached('world');
        (0, vitest_1.expect)(mockEmbed).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(callCount).toBe(2);
        (0, vitest_1.expect)(a1).toEqual([1, 0, 0]);
        (0, vitest_1.expect)(b1).toEqual([0, 1, 0]);
        (0, vitest_1.expect)(a2).toBe(a1);
        (0, vitest_1.expect)(b2).toBe(b1);
    });
});
//# sourceMappingURL=embedding-cache.test.js.map