import { describe, it, expect, beforeEach } from 'vitest';
import { setupAIAssertions, getGlobalOptions } from '../setup';
import type { AIAssertionOptions } from '../types';

describe('setupAIAssertions', () => {
  beforeEach(() => {
    // Reset global options before each test
    setupAIAssertions({});
  });

  it('sets global options when called with options', () => {
    const options: AIAssertionOptions = {
      semanticThreshold: 0.9,
      hedgingMaxRatio: 0.2,
    };
    setupAIAssertions(options);
    const stored = getGlobalOptions();
    expect(stored.semanticThreshold).toBe(0.9);
    expect(stored.hedgingMaxRatio).toBe(0.2);
  });

  it('merges options rather than replacing', () => {
    setupAIAssertions({ semanticThreshold: 0.8 });
    setupAIAssertions({ hedgingMaxRatio: 0.1 });
    const stored = getGlobalOptions();
    expect(stored.semanticThreshold).toBe(0.8);
    expect(stored.hedgingMaxRatio).toBe(0.1);
  });

  it('can be called with no arguments', () => {
    expect(() => setupAIAssertions()).not.toThrow();
  });

  it('can be called with empty options', () => {
    expect(() => setupAIAssertions({})).not.toThrow();
  });

  it('stores embedFn reference', () => {
    const mockEmbed = async (text: string) => {
      void text;
      return [0.1, 0.2, 0.3];
    };
    setupAIAssertions({ embedFn: mockEmbed });
    expect(getGlobalOptions().embedFn).toBe(mockEmbed);
  });
});

describe('getGlobalOptions', () => {
  it('returns an object', () => {
    const opts = getGlobalOptions();
    expect(typeof opts).toBe('object');
    expect(opts).not.toBeNull();
  });
});
