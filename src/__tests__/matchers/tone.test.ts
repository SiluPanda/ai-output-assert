import { describe, it, expect } from 'vitest';
import { toHaveSentiment, toHaveTone, toBeConcise, toNotBeVerbose } from '../../matchers/tone';

describe('toHaveSentiment', () => {
  it('detects positive sentiment', () => {
    expect(toHaveSentiment('This is excellent, amazing, and wonderful!', 'positive').pass).toBe(true);
  });
  it('detects negative sentiment', () => {
    expect(toHaveSentiment('This is terrible, awful, and horrible.', 'negative').pass).toBe(true);
  });
  it('detects neutral sentiment', () => {
    expect(toHaveSentiment('The meeting is scheduled for Tuesday at 3pm.', 'neutral').pass).toBe(true);
  });
  it('fails for mismatched sentiment', () => {
    const r = toHaveSentiment('This is terrible and awful.', 'positive');
    expect(r.pass).toBe(false);
    expect(r.message()).toContain('positive');
  });
});

describe('toHaveTone', () => {
  it('detects formal tone', () => {
    const formal = 'The committee has determined that the proposed amendments to the regulatory framework shall be implemented in accordance with established protocols and procedures.';
    expect(toHaveTone(formal, 'formal').pass).toBe(true);
  });
  it('detects casual tone', () => {
    const casual = "Hey, I'm gonna check this out. Yeah, it's kinda cool stuff!";
    expect(toHaveTone(casual, 'casual').pass).toBe(true);
  });
  it('detects technical tone', () => {
    const technical = 'The implementation leverages polymorphic dispatching through vtable indirection, enabling subtype-specific `handleRequest` invocations.';
    expect(toHaveTone(technical, 'technical').pass).toBe(true);
  });
  it('detects friendly tone', () => {
    const friendly = "You're doing great! I'm happy to help you with this wonderful project!";
    expect(toHaveTone(friendly, 'friendly').pass).toBe(true);
  });
});

describe('toBeConcise', () => {
  it('passes when word count is within limit', () => {
    expect(toBeConcise('Short and sweet.', 100).pass).toBe(true);
  });
  it('fails when word count exceeds limit', () => {
    const long = 'word '.repeat(150);
    const r = toBeConcise(long, 100);
    expect(r.pass).toBe(false);
    expect(r.message()).toContain('100');
  });
  it('uses default limit of 100', () => {
    expect(toBeConcise('Short text.').pass).toBe(true);
  });
});

describe('toNotBeVerbose', () => {
  it('passes for short text', () => {
    expect(toNotBeVerbose('Short text.').pass).toBe(true);
  });
  it('fails for too many words', () => {
    const long = 'word '.repeat(250);
    expect(toNotBeVerbose(long, { maxWords: 200 }).pass).toBe(false);
  });
  it('fails for too many sentences', () => {
    const manySentences = Array(15).fill('This is a sentence.').join(' ');
    expect(toNotBeVerbose(manySentences, { maxSentences: 10 }).pass).toBe(false);
  });
  it('uses default limits', () => {
    expect(toNotBeVerbose('Short and sweet.').pass).toBe(true);
  });
});
