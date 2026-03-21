import { describe, it, expect } from 'vitest';
import { extractNgrams } from '../../utils/ngrams';

describe('extractNgrams', () => {
  it('n=1 returns individual tokens', () => {
    expect(extractNgrams(['a', 'b', 'c'], 1)).toEqual(['a', 'b', 'c']);
  });

  it('n=2 returns bigrams', () => {
    expect(extractNgrams(['a', 'b', 'c'], 2)).toEqual(['a b', 'b c']);
  });

  it('n=3 returns trigrams', () => {
    expect(extractNgrams(['a', 'b', 'c', 'd'], 3)).toEqual(['a b c', 'b c d']);
  });

  it('n larger than token count returns []', () => {
    expect(extractNgrams(['a', 'b'], 5)).toEqual([]);
  });

  it('n=0 returns []', () => {
    expect(extractNgrams(['a', 'b', 'c'], 0)).toEqual([]);
  });

  it('empty tokens with n=1 returns []', () => {
    expect(extractNgrams([], 1)).toEqual([]);
  });

  it('exact length match returns one ngram', () => {
    expect(extractNgrams(['a', 'b', 'c'], 3)).toEqual(['a b c']);
  });
});
