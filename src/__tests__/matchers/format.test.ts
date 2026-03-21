import { describe, it, expect } from 'vitest';
import { toStartWith, toEndWith, toBeFormattedAs, toHaveListItems } from '../../matchers/format';

describe('toStartWith', () => {
  it('passes when string starts with prefix', () => {
    const r = toStartWith('Hello world', 'Hello');
    expect(r.pass).toBe(true);
  });

  it('fails when string does not start with prefix', () => {
    const r = toStartWith('Hello world', 'world');
    expect(r.pass).toBe(false);
    expect(r.message()).toContain('start with');
  });

  it('passes for empty prefix', () => {
    expect(toStartWith('anything', '').pass).toBe(true);
  });
});

describe('toEndWith', () => {
  it('passes when string ends with suffix', () => {
    const r = toEndWith('Hello world', 'world');
    expect(r.pass).toBe(true);
  });

  it('fails when string does not end with suffix', () => {
    const r = toEndWith('Hello world', 'Hello');
    expect(r.pass).toBe(false);
    expect(r.message()).toContain('end with');
  });
});

describe('toBeFormattedAs', () => {
  it('passes for valid JSON', () => {
    expect(toBeFormattedAs('{"a":1}', 'json').pass).toBe(true);
  });

  it('fails for invalid JSON', () => {
    const r = toBeFormattedAs('not json at all', 'json');
    expect(r.pass).toBe(false);
  });

  it('passes for markdown with heading', () => {
    expect(toBeFormattedAs('# Title\nSome text', 'markdown').pass).toBe(true);
  });

  it('passes for markdown with code fence', () => {
    expect(toBeFormattedAs('```js\nconsole.log()\n```', 'markdown').pass).toBe(true);
  });

  it('fails for plain prose as markdown', () => {
    expect(toBeFormattedAs('just plain text with no markdown', 'markdown').pass).toBe(false);
  });

  it('passes for list format', () => {
    const text = '- item one\n- item two\n- item three';
    expect(toBeFormattedAs(text, 'list').pass).toBe(true);
  });

  it('fails for non-list text', () => {
    expect(toBeFormattedAs('This is just a paragraph.', 'list').pass).toBe(false);
  });

  it('passes for CSV', () => {
    const csv = 'name,age,city\nAlice,30,NYC\nBob,25,LA';
    expect(toBeFormattedAs(csv, 'csv').pass).toBe(true);
  });

  it('fails for inconsistent CSV', () => {
    expect(toBeFormattedAs('a,b\nc', 'csv').pass).toBe(false);
  });

  it('passes for XML', () => {
    expect(toBeFormattedAs('<root><item>value</item></root>', 'xml').pass).toBe(true);
  });

  it('fails for non-XML', () => {
    expect(toBeFormattedAs('no tags here', 'xml').pass).toBe(false);
  });

  it('passes for YAML', () => {
    const yaml = 'name: Alice\nage: 30\ncity: NYC';
    expect(toBeFormattedAs(yaml, 'yaml').pass).toBe(true);
  });

  it('passes for table format', () => {
    const table = '| Name | Age |\n|------|-----|\n| Alice | 30 |';
    expect(toBeFormattedAs(table, 'table').pass).toBe(true);
  });

  it('fails for non-table', () => {
    expect(toBeFormattedAs('just text', 'table').pass).toBe(false);
  });
});

describe('toHaveListItems', () => {
  it('passes when all items appear as list items', () => {
    const text = '- apples\n- bananas\n- cherries';
    const r = toHaveListItems(text, ['apples', 'bananas']);
    expect(r.pass).toBe(true);
  });

  it('fails when an item is missing from the list', () => {
    const text = '- apples\n- bananas';
    const r = toHaveListItems(text, ['apples', 'cherries']);
    expect(r.pass).toBe(false);
    expect(r.details.missing).toContain('cherries');
  });

  it('passes for numbered list', () => {
    const text = '1. first\n2. second\n3. third';
    expect(toHaveListItems(text, ['first', 'second']).pass).toBe(true);
  });

  it('fails when item appears but not as list item', () => {
    const text = 'apples are good fruit. bananas too.';
    expect(toHaveListItems(text, ['apples']).pass).toBe(false);
  });
});
