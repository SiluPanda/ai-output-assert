import { describe, it, expect } from 'vitest';
import { extractJSONFromCodeFence } from '../../utils/json-extract';

describe('extractJSONFromCodeFence', () => {
  it('extracts JSON from ```json fence', () => {
    const text = '```json\n{"name": "Alice"}\n```';
    expect(extractJSONFromCodeFence(text)).toBe('{"name": "Alice"}');
  });

  it('extracts content from plain ``` fence', () => {
    const text = '```\n{"name": "Alice"}\n```';
    expect(extractJSONFromCodeFence(text)).toBe('{"name": "Alice"}');
  });

  it('returns null when no code fence', () => {
    expect(extractJSONFromCodeFence('just some text')).toBeNull();
    expect(extractJSONFromCodeFence('')).toBeNull();
  });

  it('preserves nested content', () => {
    const json = '{\n  "user": {\n    "name": "Alice",\n    "age": 30\n  }\n}';
    const text = '```json\n' + json + '\n```';
    expect(extractJSONFromCodeFence(text)).toBe(json);
  });

  it('trims whitespace from extracted content', () => {
    const text = '```json\n  {"key": "value"}  \n```';
    expect(extractJSONFromCodeFence(text)).toBe('{"key": "value"}');
  });

  it('handles uppercase JSON tag', () => {
    const text = '```JSON\n{"x": 1}\n```';
    expect(extractJSONFromCodeFence(text)).toBe('{"x": 1}');
  });
});
