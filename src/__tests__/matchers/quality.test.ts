import { describe, it, expect } from 'vitest';
import {
  toNotBeTruncated,
  toNotBeHedged,
  toBeCompleteJSON,
  toNotRepeat,
} from '../../matchers/quality';

describe('toNotBeTruncated', () => {
  it('passes for a complete sentence', () => {
    expect(toNotBeTruncated('The answer is clear and well-defined.').pass).toBe(true);
  });

  it('passes ending with question mark', () => {
    expect(toNotBeTruncated('Is this correct?').pass).toBe(true);
  });

  it('passes ending with exclamation', () => {
    expect(toNotBeTruncated('Great job!').pass).toBe(true);
  });

  it('fails for sentence ending mid-word', () => {
    const r = toNotBeTruncated('The answer is');
    expect(r.pass).toBe(false);
    expect(r.details.issues).toContain('Does not end with terminal punctuation');
  });

  it('fails for unclosed code fence', () => {
    const r = toNotBeTruncated('Here is some code:\n```js\nconsole.log("hi")');
    expect(r.pass).toBe(false);
    expect(r.details.issues).toContain('Unclosed code fence');
  });

  it('passes for balanced code fence', () => {
    expect(
      toNotBeTruncated('Here is code:\n```js\nconsole.log("hi")\n```\nDone.').pass,
    ).toBe(true);
  });
});

describe('toNotBeHedged', () => {
  it('passes for confident statement', () => {
    const r = toNotBeHedged('The capital of France is Paris. It is located in northern France.');
    expect(r.pass).toBe(true);
  });

  it('fails for heavily hedged text', () => {
    const text =
      "I think this might be correct. I believe it's possibly the right answer. Maybe it is, perhaps not. I'm not sure about this.";
    const r = toNotBeHedged(text);
    expect(r.pass).toBe(false);
    expect((r.details.foundPhrases as string[]).length).toBeGreaterThan(0);
  });

  it('respects custom threshold', () => {
    const text = 'I think this is correct. The sky is blue. Water is wet.';
    // With very low threshold of 0.01, should fail
    expect(toNotBeHedged(text, undefined, 0.01).pass).toBe(false);
    // With threshold of 1.0, should pass
    expect(toNotBeHedged(text, undefined, 1.0).pass).toBe(true);
  });

  it('accepts custom hedging phrases', () => {
    const r = toNotBeHedged('Allegedly this is true. The fact is known.', ['allegedly'], 0.01);
    expect(r.pass).toBe(false);
    expect(r.details.foundPhrases as string[]).toContain('allegedly');
  });
});

describe('toBeCompleteJSON', () => {
  it('passes for valid complete JSON object', () => {
    expect(toBeCompleteJSON('{"name": "Alice", "age": 30}').pass).toBe(true);
  });

  it('passes for valid complete JSON array', () => {
    expect(toBeCompleteJSON('[1, 2, 3]').pass).toBe(true);
  });

  it('fails for truncated JSON object', () => {
    const r = toBeCompleteJSON('{"name": "Alice", "age":');
    expect(r.pass).toBe(false);
    expect(r.details.truncated).toBe(true);
  });

  it('fails for truncated JSON array', () => {
    const r = toBeCompleteJSON('[1, 2,');
    expect(r.pass).toBe(false);
    expect(r.details.truncated).toBe(true);
  });

  it('fails for non-JSON text', () => {
    const r = toBeCompleteJSON('this is just text');
    expect(r.pass).toBe(false);
    expect(r.details.truncated).toBe(false);
  });
});

describe('toNotRepeat', () => {
  it('passes for normal prose', () => {
    const r = toNotRepeat(
      'The quick brown fox jumps over the lazy dog. It ran across the field and disappeared.',
    );
    expect(r.pass).toBe(true);
  });

  it('fails when 4-gram repeats more than threshold times', () => {
    const repeated = 'the cat sat on the mat. '.repeat(5);
    const r = toNotRepeat(repeated, { threshold: 2 });
    expect(r.pass).toBe(false);
    expect((r.details.repeated as unknown[]).length).toBeGreaterThan(0);
  });

  it('respects custom windowSize', () => {
    const text = 'alpha beta alpha beta alpha beta alpha beta alpha beta';
    const r = toNotRepeat(text, { windowSize: 2, threshold: 3 });
    expect(r.pass).toBe(false);
  });

  it('passes when repetition is below threshold', () => {
    const text = 'one two three four one two three four';
    // With threshold 5, should pass
    expect(toNotRepeat(text, { windowSize: 4, threshold: 5 }).pass).toBe(true);
  });
});
