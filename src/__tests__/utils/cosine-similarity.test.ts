import { describe, it, expect } from 'vitest';
import { cosineSimilarity } from '../../utils/cosine-similarity';

describe('cosineSimilarity', () => {
  it('identical vectors return 1.0', () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1.0, 10);
  });

  it('orthogonal vectors return 0.0', () => {
    expect(cosineSimilarity([1, 0, 0], [0, 1, 0])).toBeCloseTo(0.0, 10);
  });

  it('opposite vectors return -1.0', () => {
    expect(cosineSimilarity([1, 0, 0], [-1, 0, 0])).toBeCloseTo(-1.0, 10);
  });

  it('zero vector returns 0.0', () => {
    expect(cosineSimilarity([0, 0, 0], [1, 2, 3])).toBe(0);
    expect(cosineSimilarity([1, 2, 3], [0, 0, 0])).toBe(0);
    expect(cosineSimilarity([0, 0, 0], [0, 0, 0])).toBe(0);
  });

  it('dimension mismatch throws', () => {
    expect(() => cosineSimilarity([1, 2], [1, 2, 3])).toThrow('Dimension mismatch: 2 vs 3');
  });

  it('typical similarity between [1,2,3] and [1,2,4]', () => {
    const sim = cosineSimilarity([1, 2, 3], [1, 2, 4]);
    // Should be high but less than 1
    expect(sim).toBeGreaterThan(0.99);
    expect(sim).toBeLessThan(1.0);
  });
});
