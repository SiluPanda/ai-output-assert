import { describe, it, expect } from 'vitest';
import { splitSentences } from '../../utils/sentences';

describe('splitSentences', () => {
  it('"Hello world. How are you?" splits into 2 sentences', () => {
    const result = splitSentences('Hello world. How are you?');
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('Hello world.');
    expect(result[1]).toBe('How are you?');
  });

  it('"Dr. Smith went home. Good." splits into 2 sentences, not 3', () => {
    const result = splitSentences('Dr. Smith went home. Good.');
    expect(result).toHaveLength(2);
    expect(result[0]).toContain('Dr.');
    expect(result[0]).toContain('Smith went home.');
  });

  it('empty string returns []', () => {
    expect(splitSentences('')).toEqual([]);
  });

  it('whitespace-only string returns []', () => {
    expect(splitSentences('   ')).toEqual([]);
  });

  it('single sentence without period returns 1 sentence', () => {
    const result = splitSentences('This is a single sentence');
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('This is a single sentence');
  });

  it('single sentence with period returns 1 sentence', () => {
    const result = splitSentences('This is a single sentence.');
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('This is a single sentence.');
  });

  it('exclamation and question marks split correctly', () => {
    const result = splitSentences('Hello! How are you? Fine.');
    expect(result).toHaveLength(3);
  });
});
