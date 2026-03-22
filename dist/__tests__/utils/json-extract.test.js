"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const json_extract_1 = require("../../utils/json-extract");
(0, vitest_1.describe)('extractJSONFromCodeFence', () => {
    (0, vitest_1.it)('extracts JSON from ```json fence', () => {
        const text = '```json\n{"name": "Alice"}\n```';
        (0, vitest_1.expect)((0, json_extract_1.extractJSONFromCodeFence)(text)).toBe('{"name": "Alice"}');
    });
    (0, vitest_1.it)('extracts content from plain ``` fence', () => {
        const text = '```\n{"name": "Alice"}\n```';
        (0, vitest_1.expect)((0, json_extract_1.extractJSONFromCodeFence)(text)).toBe('{"name": "Alice"}');
    });
    (0, vitest_1.it)('returns null when no code fence', () => {
        (0, vitest_1.expect)((0, json_extract_1.extractJSONFromCodeFence)('just some text')).toBeNull();
        (0, vitest_1.expect)((0, json_extract_1.extractJSONFromCodeFence)('')).toBeNull();
    });
    (0, vitest_1.it)('preserves nested content', () => {
        const json = '{\n  "user": {\n    "name": "Alice",\n    "age": 30\n  }\n}';
        const text = '```json\n' + json + '\n```';
        (0, vitest_1.expect)((0, json_extract_1.extractJSONFromCodeFence)(text)).toBe(json);
    });
    (0, vitest_1.it)('trims whitespace from extracted content', () => {
        const text = '```json\n  {"key": "value"}  \n```';
        (0, vitest_1.expect)((0, json_extract_1.extractJSONFromCodeFence)(text)).toBe('{"key": "value"}');
    });
    (0, vitest_1.it)('handles uppercase JSON tag', () => {
        const text = '```JSON\n{"x": 1}\n```';
        (0, vitest_1.expect)((0, json_extract_1.extractJSONFromCodeFence)(text)).toBe('{"x": 1}');
    });
});
//# sourceMappingURL=json-extract.test.js.map