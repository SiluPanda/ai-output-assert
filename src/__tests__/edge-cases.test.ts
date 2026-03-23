import { describe, it, expect } from 'vitest';
import { toBeValidJSON, toBeValidMarkdown, toContainCodeBlock } from '../matchers/structural';
import { toHaveSentiment, toBeConcise } from '../matchers/tone';
import { toContainAllOf, toNotContain } from '../matchers/content';
import { toNotContainPII, toNotContainToxicContent } from '../matchers/safety';
import { toNotBeTruncated, toNotRepeat } from '../matchers/quality';

describe('edge cases — empty and whitespace input', () => {
  it('toBeValidJSON fails for empty string', () => {
    expect(toBeValidJSON('').pass).toBe(false);
  });
  it('toBeValidJSON fails for whitespace only', () => {
    expect(toBeValidJSON('   \n\t  ').pass).toBe(false);
  });
  it('toBeValidMarkdown passes for empty string', () => {
    // Empty string has no markdown issues
    expect(toBeValidMarkdown('').pass).toBe(true);
  });
  it('toBeConcise passes for empty string', () => {
    expect(toBeConcise('', 100).pass).toBe(true);
  });
  it('toNotContain passes for empty string', () => {
    expect(toNotContain('', 'forbidden').pass).toBe(true);
  });
});

describe('edge cases — Unicode and special characters', () => {
  it('toContainAllOf works with Unicode text', () => {
    expect(toContainAllOf('日本語のテスト', ['日本']).pass).toBe(true);
  });
  it('toHaveSentiment handles emoji-heavy text', () => {
    const r = toHaveSentiment('🎉🎊🥳 Celebration time! 🎉', 'neutral');
    // Should not crash; result is either pass or fail
    expect(typeof r.pass).toBe('boolean');
  });
  it('toBeValidJSON handles unicode content', () => {
    expect(toBeValidJSON('{"emoji":"🎉","japanese":"日本語"}').pass).toBe(true);
  });
});

describe('edge cases — large input', () => {
  it('toNotRepeat handles large input without error', () => {
    const large = 'This is sentence number one. '.repeat(1000);
    const r = toNotRepeat(large);
    expect(typeof r.pass).toBe('boolean');
  });
  it('toNotContainPII handles large input', () => {
    const large = 'Normal text without any personal info. '.repeat(500);
    const r = toNotContainPII(large);
    expect(r.pass).toBe(true);
  });
});

describe('edge cases — special content', () => {
  it('toNotContainToxicContent passes for clean text', () => {
    expect(toNotContainToxicContent('The weather is nice today.').pass).toBe(true);
  });
  it('toNotBeTruncated passes for complete sentence', () => {
    expect(toNotBeTruncated('This is a complete sentence.').pass).toBe(true);
  });
  it('toNotBeTruncated detects truncation', () => {
    expect(toNotBeTruncated('This sentence is clearly cut off mid').pass).toBe(false);
  });
  it('toContainCodeBlock handles inline backticks (not code blocks)', () => {
    expect(toContainCodeBlock('Use `console.log` for debugging.').pass).toBe(false);
  });
});
