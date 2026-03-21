import type { EmbedFn } from '../types';

export function createCachedEmbedFn(embedFn: EmbedFn): EmbedFn {
  const cache = new Map<string, number[]>();
  return async (text: string) => {
    if (cache.has(text)) return cache.get(text)!;
    const embedding = await embedFn(text);
    cache.set(text, embedding);
    return embedding;
  };
}
