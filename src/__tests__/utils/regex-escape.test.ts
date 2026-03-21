import { describe, it, expect } from 'vitest';
import { escapeRegex } from '../../utils/regex-escape';

describe('escapeRegex', () => {
  it('escapes dot', () => {
    expect(escapeRegex('.')).toBe('\\.');
  });

  it('escapes asterisk', () => {
    expect(escapeRegex('*')).toBe('\\*');
  });

  it('escapes plus', () => {
    expect(escapeRegex('+')).toBe('\\+');
  });

  it('escapes question mark', () => {
    expect(escapeRegex('?')).toBe('\\?');
  });

  it('escapes caret', () => {
    expect(escapeRegex('^')).toBe('\\^');
  });

  it('escapes dollar', () => {
    expect(escapeRegex('$')).toBe('\\$');
  });

  it('escapes curly braces', () => {
    expect(escapeRegex('{}')).toBe('\\{\\}');
  });

  it('escapes parentheses', () => {
    expect(escapeRegex('()')).toBe('\\(\\)');
  });

  it('escapes pipe', () => {
    expect(escapeRegex('|')).toBe('\\|');
  });

  it('escapes square brackets', () => {
    expect(escapeRegex('[]')).toBe('\\[\\]');
  });

  it('escapes backslash', () => {
    expect(escapeRegex('\\')).toBe('\\\\');
  });

  it('escapes all special chars in a combined string', () => {
    const result = escapeRegex('.*+?^${}()|[]\\');
    expect(result).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
  });

  it('regular string is unchanged', () => {
    expect(escapeRegex('hello world')).toBe('hello world');
    expect(escapeRegex('abc123')).toBe('abc123');
  });
});
