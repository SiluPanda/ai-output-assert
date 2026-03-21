import { describe, it, expect } from 'vitest';
import { luhnCheck } from '../../utils/luhn';

describe('luhnCheck', () => {
  it('valid Visa card 4532015112830366 returns true', () => {
    expect(luhnCheck('4532015112830366')).toBe(true);
  });

  it('invalid card 1234567890123456 returns false', () => {
    expect(luhnCheck('1234567890123456')).toBe(false);
  });

  it('hyphens are stripped: 4532-0151-1283-0366 returns true', () => {
    expect(luhnCheck('4532-0151-1283-0366')).toBe(true);
  });

  it('empty string returns false', () => {
    expect(luhnCheck('')).toBe(false);
  });

  it('non-digit only string returns false', () => {
    expect(luhnCheck('abcd')).toBe(false);
  });

  it('spaces are stripped correctly', () => {
    expect(luhnCheck('4532 0151 1283 0366')).toBe(true);
  });
});
