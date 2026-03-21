import { describe, it, expect } from 'vitest';
import {
  toContainAllOf,
  toContainAnyOf,
  toNotContain,
  toMentionEntity,
} from '../../matchers/content';

describe('toContainAllOf', () => {
  it('passes when all phrases are present', () => {
    const r = toContainAllOf('The quick brown fox jumps over the lazy dog', ['quick', 'fox', 'dog']);
    expect(r.pass).toBe(true);
  });

  it('fails when any phrase is missing', () => {
    const r = toContainAllOf('The quick brown fox', ['quick', 'cat']);
    expect(r.pass).toBe(false);
    expect(r.details.missing).toContain('cat');
  });

  it('is case-insensitive', () => {
    expect(toContainAllOf('Hello World', ['hello', 'WORLD']).pass).toBe(true);
  });

  it('passes for empty phrases array', () => {
    expect(toContainAllOf('anything', []).pass).toBe(true);
  });
});

describe('toContainAnyOf', () => {
  it('passes when at least one phrase is present', () => {
    const r = toContainAnyOf('The quick brown fox', ['cat', 'fox', 'dog']);
    expect(r.pass).toBe(true);
    expect(r.details.found).toContain('fox');
  });

  it('fails when no phrases are present', () => {
    const r = toContainAnyOf('The quick brown fox', ['cat', 'elephant']);
    expect(r.pass).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(toContainAnyOf('Hello World', ['HELLO']).pass).toBe(true);
  });
});

describe('toNotContain', () => {
  it('passes when phrase is absent', () => {
    expect(toNotContain('The quick brown fox', 'cat').pass).toBe(true);
  });

  it('fails when phrase is present', () => {
    const r = toNotContain('The quick brown fox', 'fox');
    expect(r.pass).toBe(false);
    expect(r.message()).toContain('fox');
  });

  it('is case-insensitive', () => {
    expect(toNotContain('Hello World', 'hello').pass).toBe(false);
  });
});

describe('toMentionEntity', () => {
  it('passes when entity is mentioned', () => {
    expect(toMentionEntity('OpenAI released GPT-4', 'OpenAI').pass).toBe(true);
  });

  it('passes when alias is mentioned', () => {
    const r = toMentionEntity('The company released a model', 'OpenAI', ['The company', 'Altman']);
    expect(r.pass).toBe(true);
    expect(r.details.foundTerm).toBe('The company');
  });

  it('fails when neither entity nor alias is found', () => {
    const r = toMentionEntity('Anthropic released Claude', 'OpenAI', ['GPT']);
    expect(r.pass).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(toMentionEntity('openai is great', 'OpenAI').pass).toBe(true);
  });
});
