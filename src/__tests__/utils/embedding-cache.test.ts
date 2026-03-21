import { describe, it, expect, vi } from 'vitest';
import { createCachedEmbedFn } from '../../utils/embedding-cache';

describe('createCachedEmbedFn', () => {
  it('calls underlying fn once for same input', async () => {
    const mockEmbed = vi.fn().mockResolvedValue([1, 2, 3]);
    const cached = createCachedEmbedFn(mockEmbed);

    await cached('hello');
    await cached('hello');

    expect(mockEmbed).toHaveBeenCalledTimes(1);
  });

  it('returns cached result on second call', async () => {
    const mockEmbed = vi.fn().mockResolvedValue([0.1, 0.2, 0.3]);
    const cached = createCachedEmbedFn(mockEmbed);

    const first = await cached('test');
    const second = await cached('test');

    expect(first).toEqual([0.1, 0.2, 0.3]);
    expect(second).toEqual([0.1, 0.2, 0.3]);
    expect(second).toBe(first); // same reference from cache
  });

  it('different inputs are both cached separately', async () => {
    let callCount = 0;
    const mockEmbed = vi.fn().mockImplementation(async (text: string) => {
      callCount++;
      return text === 'hello' ? [1, 0, 0] : [0, 1, 0];
    });
    const cached = createCachedEmbedFn(mockEmbed);

    const a1 = await cached('hello');
    const b1 = await cached('world');
    const a2 = await cached('hello');
    const b2 = await cached('world');

    expect(mockEmbed).toHaveBeenCalledTimes(2);
    expect(callCount).toBe(2);
    expect(a1).toEqual([1, 0, 0]);
    expect(b1).toEqual([0, 1, 0]);
    expect(a2).toBe(a1);
    expect(b2).toBe(b1);
  });
});
