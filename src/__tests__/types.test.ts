import { describe, it, expectTypeOf } from 'vitest';
import type {
  MatcherResult,
  AIAssertionOptions,
  PIIMatch,
  ToxicWord,
  Tone,
} from '../types';

describe('types', () => {
  it('MatcherResult has pass, message fn, details', () => {
    const result: MatcherResult = {
      pass: true,
      message: () => 'ok',
      details: { score: 0.9 },
    };
    expectTypeOf(result.pass).toBeBoolean();
    expectTypeOf(result.message).toBeFunction();
    expectTypeOf(result.details).toMatchTypeOf<Record<string, unknown>>();
  });

  it('AIAssertionOptions all fields are optional', () => {
    // Should compile with empty object
    const opts: AIAssertionOptions = {};
    expectTypeOf(opts).toMatchTypeOf<AIAssertionOptions>();
  });

  it('PIIMatch position is a tuple [number, number]', () => {
    const match: PIIMatch = {
      type: 'email',
      value: 'test@example.com',
      position: [0, 16],
    };
    expectTypeOf(match.position).toMatchTypeOf<[number, number]>();
  });

  it('ToxicWord severity union is exhaustive', () => {
    const critical: ToxicWord = { word: 'slur', severity: 'critical' };
    const warning: ToxicWord = { word: 'profanity', severity: 'warning' };
    const info: ToxicWord = { word: 'mild', severity: 'info' };
    expectTypeOf(critical.severity).toMatchTypeOf<'critical' | 'warning' | 'info'>();
    expectTypeOf(warning.severity).toMatchTypeOf<'critical' | 'warning' | 'info'>();
    expectTypeOf(info.severity).toMatchTypeOf<'critical' | 'warning' | 'info'>();
  });

  it('Tone union has 4 values', () => {
    const tones: Tone[] = ['formal', 'casual', 'technical', 'friendly'];
    expectTypeOf(tones).toMatchTypeOf<Tone[]>();
    // All 4 values are valid
    const formal: Tone = 'formal';
    const casual: Tone = 'casual';
    const technical: Tone = 'technical';
    const friendly: Tone = 'friendly';
    expectTypeOf(formal).toMatchTypeOf<Tone>();
    expectTypeOf(casual).toMatchTypeOf<Tone>();
    expectTypeOf(technical).toMatchTypeOf<Tone>();
    expectTypeOf(friendly).toMatchTypeOf<Tone>();
  });
});
