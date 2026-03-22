"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const format_1 = require("../../matchers/format");
(0, vitest_1.describe)('toStartWith', () => {
    (0, vitest_1.it)('passes when string starts with prefix', () => {
        const r = (0, format_1.toStartWith)('Hello world', 'Hello');
        (0, vitest_1.expect)(r.pass).toBe(true);
    });
    (0, vitest_1.it)('fails when string does not start with prefix', () => {
        const r = (0, format_1.toStartWith)('Hello world', 'world');
        (0, vitest_1.expect)(r.pass).toBe(false);
        (0, vitest_1.expect)(r.message()).toContain('start with');
    });
    (0, vitest_1.it)('passes for empty prefix', () => {
        (0, vitest_1.expect)((0, format_1.toStartWith)('anything', '').pass).toBe(true);
    });
});
(0, vitest_1.describe)('toEndWith', () => {
    (0, vitest_1.it)('passes when string ends with suffix', () => {
        const r = (0, format_1.toEndWith)('Hello world', 'world');
        (0, vitest_1.expect)(r.pass).toBe(true);
    });
    (0, vitest_1.it)('fails when string does not end with suffix', () => {
        const r = (0, format_1.toEndWith)('Hello world', 'Hello');
        (0, vitest_1.expect)(r.pass).toBe(false);
        (0, vitest_1.expect)(r.message()).toContain('end with');
    });
});
(0, vitest_1.describe)('toBeFormattedAs', () => {
    (0, vitest_1.it)('passes for valid JSON', () => {
        (0, vitest_1.expect)((0, format_1.toBeFormattedAs)('{"a":1}', 'json').pass).toBe(true);
    });
    (0, vitest_1.it)('fails for invalid JSON', () => {
        const r = (0, format_1.toBeFormattedAs)('not json at all', 'json');
        (0, vitest_1.expect)(r.pass).toBe(false);
    });
    (0, vitest_1.it)('passes for markdown with heading', () => {
        (0, vitest_1.expect)((0, format_1.toBeFormattedAs)('# Title\nSome text', 'markdown').pass).toBe(true);
    });
    (0, vitest_1.it)('passes for markdown with code fence', () => {
        (0, vitest_1.expect)((0, format_1.toBeFormattedAs)('```js\nconsole.log()\n```', 'markdown').pass).toBe(true);
    });
    (0, vitest_1.it)('fails for plain prose as markdown', () => {
        (0, vitest_1.expect)((0, format_1.toBeFormattedAs)('just plain text with no markdown', 'markdown').pass).toBe(false);
    });
    (0, vitest_1.it)('passes for list format', () => {
        const text = '- item one\n- item two\n- item three';
        (0, vitest_1.expect)((0, format_1.toBeFormattedAs)(text, 'list').pass).toBe(true);
    });
    (0, vitest_1.it)('fails for non-list text', () => {
        (0, vitest_1.expect)((0, format_1.toBeFormattedAs)('This is just a paragraph.', 'list').pass).toBe(false);
    });
    (0, vitest_1.it)('passes for CSV', () => {
        const csv = 'name,age,city\nAlice,30,NYC\nBob,25,LA';
        (0, vitest_1.expect)((0, format_1.toBeFormattedAs)(csv, 'csv').pass).toBe(true);
    });
    (0, vitest_1.it)('fails for inconsistent CSV', () => {
        (0, vitest_1.expect)((0, format_1.toBeFormattedAs)('a,b\nc', 'csv').pass).toBe(false);
    });
    (0, vitest_1.it)('passes for XML', () => {
        (0, vitest_1.expect)((0, format_1.toBeFormattedAs)('<root><item>value</item></root>', 'xml').pass).toBe(true);
    });
    (0, vitest_1.it)('fails for non-XML', () => {
        (0, vitest_1.expect)((0, format_1.toBeFormattedAs)('no tags here', 'xml').pass).toBe(false);
    });
    (0, vitest_1.it)('passes for YAML', () => {
        const yaml = 'name: Alice\nage: 30\ncity: NYC';
        (0, vitest_1.expect)((0, format_1.toBeFormattedAs)(yaml, 'yaml').pass).toBe(true);
    });
    (0, vitest_1.it)('passes for table format', () => {
        const table = '| Name | Age |\n|------|-----|\n| Alice | 30 |';
        (0, vitest_1.expect)((0, format_1.toBeFormattedAs)(table, 'table').pass).toBe(true);
    });
    (0, vitest_1.it)('fails for non-table', () => {
        (0, vitest_1.expect)((0, format_1.toBeFormattedAs)('just text', 'table').pass).toBe(false);
    });
});
(0, vitest_1.describe)('toHaveListItems', () => {
    (0, vitest_1.it)('passes when all items appear as list items', () => {
        const text = '- apples\n- bananas\n- cherries';
        const r = (0, format_1.toHaveListItems)(text, ['apples', 'bananas']);
        (0, vitest_1.expect)(r.pass).toBe(true);
    });
    (0, vitest_1.it)('fails when an item is missing from the list', () => {
        const text = '- apples\n- bananas';
        const r = (0, format_1.toHaveListItems)(text, ['apples', 'cherries']);
        (0, vitest_1.expect)(r.pass).toBe(false);
        (0, vitest_1.expect)(r.details.missing).toContain('cherries');
    });
    (0, vitest_1.it)('passes for numbered list', () => {
        const text = '1. first\n2. second\n3. third';
        (0, vitest_1.expect)((0, format_1.toHaveListItems)(text, ['first', 'second']).pass).toBe(true);
    });
    (0, vitest_1.it)('fails when item appears but not as list item', () => {
        const text = 'apples are good fruit. bananas too.';
        (0, vitest_1.expect)((0, format_1.toHaveListItems)(text, ['apples']).pass).toBe(false);
    });
});
//# sourceMappingURL=format.test.js.map