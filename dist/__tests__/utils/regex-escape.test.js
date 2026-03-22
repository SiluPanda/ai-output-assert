"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const regex_escape_1 = require("../../utils/regex-escape");
(0, vitest_1.describe)('escapeRegex', () => {
    (0, vitest_1.it)('escapes dot', () => {
        (0, vitest_1.expect)((0, regex_escape_1.escapeRegex)('.')).toBe('\\.');
    });
    (0, vitest_1.it)('escapes asterisk', () => {
        (0, vitest_1.expect)((0, regex_escape_1.escapeRegex)('*')).toBe('\\*');
    });
    (0, vitest_1.it)('escapes plus', () => {
        (0, vitest_1.expect)((0, regex_escape_1.escapeRegex)('+')).toBe('\\+');
    });
    (0, vitest_1.it)('escapes question mark', () => {
        (0, vitest_1.expect)((0, regex_escape_1.escapeRegex)('?')).toBe('\\?');
    });
    (0, vitest_1.it)('escapes caret', () => {
        (0, vitest_1.expect)((0, regex_escape_1.escapeRegex)('^')).toBe('\\^');
    });
    (0, vitest_1.it)('escapes dollar', () => {
        (0, vitest_1.expect)((0, regex_escape_1.escapeRegex)('$')).toBe('\\$');
    });
    (0, vitest_1.it)('escapes curly braces', () => {
        (0, vitest_1.expect)((0, regex_escape_1.escapeRegex)('{}')).toBe('\\{\\}');
    });
    (0, vitest_1.it)('escapes parentheses', () => {
        (0, vitest_1.expect)((0, regex_escape_1.escapeRegex)('()')).toBe('\\(\\)');
    });
    (0, vitest_1.it)('escapes pipe', () => {
        (0, vitest_1.expect)((0, regex_escape_1.escapeRegex)('|')).toBe('\\|');
    });
    (0, vitest_1.it)('escapes square brackets', () => {
        (0, vitest_1.expect)((0, regex_escape_1.escapeRegex)('[]')).toBe('\\[\\]');
    });
    (0, vitest_1.it)('escapes backslash', () => {
        (0, vitest_1.expect)((0, regex_escape_1.escapeRegex)('\\')).toBe('\\\\');
    });
    (0, vitest_1.it)('escapes all special chars in a combined string', () => {
        const result = (0, regex_escape_1.escapeRegex)('.*+?^${}()|[]\\');
        (0, vitest_1.expect)(result).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });
    (0, vitest_1.it)('regular string is unchanged', () => {
        (0, vitest_1.expect)((0, regex_escape_1.escapeRegex)('hello world')).toBe('hello world');
        (0, vitest_1.expect)((0, regex_escape_1.escapeRegex)('abc123')).toBe('abc123');
    });
});
//# sourceMappingURL=regex-escape.test.js.map