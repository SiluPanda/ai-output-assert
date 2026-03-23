import { describe, it, expect } from 'vitest';
import { toBeValidJSON, toMatchSchema, toHaveJSONFields, toBeValidMarkdown, toContainCodeBlock } from '../../matchers/structural';

describe('toBeValidJSON', () => {
  it('passes for valid JSON object', () => {
    expect(toBeValidJSON('{"name":"John","age":30}').pass).toBe(true);
  });
  it('passes for valid JSON array', () => {
    expect(toBeValidJSON('[1, 2, 3]').pass).toBe(true);
  });
  it('fails for invalid JSON', () => {
    const r = toBeValidJSON('not json');
    expect(r.pass).toBe(false);
    expect(r.message()).toContain('valid JSON');
  });
  it('passes for JSON in code fence', () => {
    expect(toBeValidJSON('```json\n{"a":1}\n```').pass).toBe(true);
  });
  it('fails for empty string', () => {
    expect(toBeValidJSON('').pass).toBe(false);
  });
  it('passes for string "null"', () => {
    expect(toBeValidJSON('null').pass).toBe(true);
  });
});

describe('toMatchSchema', () => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'number' },
    },
    required: ['name', 'age'],
  };

  it('passes for valid data matching schema', () => {
    expect(toMatchSchema('{"name":"John","age":30}', schema).pass).toBe(true);
  });
  it('fails when required field is missing', () => {
    const r = toMatchSchema('{"name":"John"}', schema);
    expect(r.pass).toBe(false);
    expect(r.message()).toContain('schema');
  });
  it('fails when field type is wrong', () => {
    const r = toMatchSchema('{"name":"John","age":"thirty"}', schema);
    expect(r.pass).toBe(false);
  });
  it('fails for non-JSON input', () => {
    const r = toMatchSchema('not json', schema);
    expect(r.pass).toBe(false);
    expect(r.message()).toContain('not valid JSON');
  });
});

describe('toHaveJSONFields', () => {
  it('passes when all fields are present', () => {
    expect(toHaveJSONFields('{"a":1,"b":2,"c":3}', ['a', 'b']).pass).toBe(true);
  });
  it('fails when a field is missing', () => {
    const r = toHaveJSONFields('{"a":1}', ['a', 'b']);
    expect(r.pass).toBe(false);
    expect(r.message()).toContain('missing');
    expect(r.message()).toContain('b');
  });
  it('supports nested field paths', () => {
    expect(toHaveJSONFields('{"user":{"name":"John","age":30}}', ['user.name', 'user.age']).pass).toBe(true);
  });
  it('fails for non-JSON input', () => {
    expect(toHaveJSONFields('not json', ['field']).pass).toBe(false);
  });
});

describe('toBeValidMarkdown', () => {
  it('passes for valid markdown', () => {
    const md = '# Title\n\nSome text.\n\n## Subtitle\n\nMore text.';
    expect(toBeValidMarkdown(md).pass).toBe(true);
  });
  it('fails for unclosed code fence', () => {
    const r = toBeValidMarkdown('```python\nprint("hi")\n');
    expect(r.pass).toBe(false);
    expect(r.message()).toContain('code fence');
  });
  it('fails for heading hierarchy skip', () => {
    const r = toBeValidMarkdown('# H1\n\n### H3\n');
    expect(r.pass).toBe(false);
    expect(r.message()).toContain('Heading hierarchy');
  });
  it('passes for plain text (no markdown features)', () => {
    expect(toBeValidMarkdown('Just plain text.').pass).toBe(true);
  });
  it('fails for unbalanced brackets', () => {
    const r = toBeValidMarkdown('A [link without closing bracket');
    expect(r.pass).toBe(false);
    expect(r.message()).toContain('bracket');
  });
});

describe('toContainCodeBlock', () => {
  it('passes when code block is present', () => {
    expect(toContainCodeBlock('Here:\n```\ncode\n```').pass).toBe(true);
  });
  it('fails when no code block', () => {
    const r = toContainCodeBlock('No code here');
    expect(r.pass).toBe(false);
  });
  it('passes for specific language', () => {
    expect(toContainCodeBlock('```python\nprint("hi")\n```', 'python').pass).toBe(true);
  });
  it('fails for wrong language', () => {
    expect(toContainCodeBlock('```javascript\nconsole.log()\n```', 'python').pass).toBe(false);
  });
  it('language match is case-insensitive', () => {
    expect(toContainCodeBlock('```Python\nprint("hi")\n```', 'python').pass).toBe(true);
  });
});
