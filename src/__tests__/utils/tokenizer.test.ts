import { describe, it, expect } from 'vitest';
import { tokenize } from '../../utils/tokenizer';

describe('tokenize', () => {
  it('empty string returns []', () => {
    expect(tokenize('')).toEqual([]);
  });

  it('single word returns [word]', () => {
    expect(tokenize('hello')).toEqual(['hello']);
  });

  it('multiple spaces are collapsed', () => {
    expect(tokenize('hello   world')).toEqual(['hello', 'world']);
  });

  it('newlines are treated as whitespace', () => {
    expect(tokenize('hello\nworld\nfoo')).toEqual(['hello', 'world', 'foo']);
  });

  it('tabs are treated as whitespace', () => {
    expect(tokenize('hello\tworld')).toEqual(['hello', 'world']);
  });

  it('mixed whitespace is handled', () => {
    expect(tokenize('  hello  \n  world  ')).toEqual(['hello', 'world']);
  });
});
