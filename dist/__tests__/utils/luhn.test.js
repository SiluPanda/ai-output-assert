"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const luhn_1 = require("../../utils/luhn");
(0, vitest_1.describe)('luhnCheck', () => {
    (0, vitest_1.it)('valid Visa card 4532015112830366 returns true', () => {
        (0, vitest_1.expect)((0, luhn_1.luhnCheck)('4532015112830366')).toBe(true);
    });
    (0, vitest_1.it)('invalid card 1234567890123456 returns false', () => {
        (0, vitest_1.expect)((0, luhn_1.luhnCheck)('1234567890123456')).toBe(false);
    });
    (0, vitest_1.it)('hyphens are stripped: 4532-0151-1283-0366 returns true', () => {
        (0, vitest_1.expect)((0, luhn_1.luhnCheck)('4532-0151-1283-0366')).toBe(true);
    });
    (0, vitest_1.it)('empty string returns false', () => {
        (0, vitest_1.expect)((0, luhn_1.luhnCheck)('')).toBe(false);
    });
    (0, vitest_1.it)('non-digit only string returns false', () => {
        (0, vitest_1.expect)((0, luhn_1.luhnCheck)('abcd')).toBe(false);
    });
    (0, vitest_1.it)('spaces are stripped correctly', () => {
        (0, vitest_1.expect)((0, luhn_1.luhnCheck)('4532 0151 1283 0366')).toBe(true);
    });
});
//# sourceMappingURL=luhn.test.js.map