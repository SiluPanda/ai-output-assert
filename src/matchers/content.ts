import type { MatcherResult } from '../types';

export function toContainAllOf(received: string, phrases: string[]): MatcherResult {
  const lower = received.toLowerCase();
  const missing = phrases.filter((p) => !lower.includes(p.toLowerCase()));
  const pass = missing.length === 0;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output not to contain all of: ${phrases.join(', ')}`
        : `Expected output to contain all of: ${phrases.join(', ')}, but missing: ${missing.join(', ')}`,
    details: { phrases, missing },
  };
}

export function toContainAnyOf(received: string, phrases: string[]): MatcherResult {
  const lower = received.toLowerCase();
  const found = phrases.filter((p) => lower.includes(p.toLowerCase()));
  const pass = found.length > 0;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output not to contain any of: ${phrases.join(', ')}`
        : `Expected output to contain at least one of: ${phrases.join(', ')}, but none were found`,
    details: { phrases, found },
  };
}

export function toNotContain(received: string, phrase: string): MatcherResult {
  const pass = !received.toLowerCase().includes(phrase.toLowerCase());
  return {
    pass,
    message: () =>
      pass
        ? `Expected output to contain "${phrase}", but it did not`
        : `Expected output not to contain "${phrase}", but it was found`,
    details: { phrase, found: !pass },
  };
}

export function toMentionEntity(received: string, entity: string, aliases?: string[]): MatcherResult {
  const lower = received.toLowerCase();
  const terms = [entity, ...(aliases ?? [])];
  const found = terms.find((t) => lower.includes(t.toLowerCase()));
  const pass = found !== undefined;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output not to mention "${entity}" (or aliases)`
        : `Expected output to mention "${entity}"${aliases?.length ? ` or aliases [${aliases.join(', ')}]` : ''}, but none were found`,
    details: { entity, aliases, foundTerm: found ?? null },
  };
}
