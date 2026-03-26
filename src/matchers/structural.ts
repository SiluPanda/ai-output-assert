import Ajv from 'ajv';
import type { MatcherResult } from '../types';
import { extractJSONFromCodeFence } from '../utils/json-extract';

const ajv = new Ajv({ allErrors: true });

function tryParseJSON(received: string): { value: unknown; error?: string } {
  const trimmed = received.trim();
  try {
    return { value: JSON.parse(trimmed) };
  } catch {
    // Try extracting from code fence
    const extracted = extractJSONFromCodeFence(trimmed);
    if (extracted) {
      try {
        return { value: JSON.parse(extracted) };
      } catch (e2) {
        return { value: undefined, error: (e2 as Error).message };
      }
    }
    return { value: undefined, error: `Not valid JSON: ${trimmed.slice(0, 60)}` };
  }
}

function getNestedValue(obj: unknown, path: string): boolean {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') return false;
    current = (current as Record<string, unknown>)[part];
  }
  return current !== undefined;
}

export function toBeValidJSON(received: string): MatcherResult {
  const { value, error } = tryParseJSON(received);
  const pass = value !== undefined;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output not to be valid JSON`
        : `Expected output to be valid JSON, but got error: ${error ?? 'unknown'}`,
    details: { error: error ?? null },
  };
}

export function toMatchSchema(received: string, schema: object): MatcherResult {
  const { value, error: parseError } = tryParseJSON(received);
  if (value === undefined) {
    return {
      pass: false,
      message: () => `Expected output to match schema, but it is not valid JSON: ${parseError}`,
      details: { parseError },
    };
  }

  let pass = false;
  let validationErrors: string[] = [];

  try {
    const validate = ajv.compile(schema);
    pass = validate(value) as boolean;
    validationErrors = (validate.errors ?? []).map((e) => `${e.instancePath} ${e.message}`);
  } catch (e) {
    // Schema compilation failed — treat as a non-match
    pass = false;
    validationErrors = [`Schema compilation error: ${(e as Error).message}`];
  }

  return {
    pass,
    message: () =>
      pass
        ? `Expected output not to match the provided schema`
        : `Expected output to match schema, but validation failed: ${validationErrors.join('; ')}`,
    details: { validationErrors },
  };
}

export function toHaveJSONFields(received: string, fields: string[]): MatcherResult {
  const { value, error } = tryParseJSON(received);
  if (value === undefined) {
    return {
      pass: false,
      message: () => `Expected output to have JSON fields, but it is not valid JSON: ${error}`,
      details: { fields, parseError: error },
    };
  }
  const missing = fields.filter((f) => !getNestedValue(value, f));
  const pass = missing.length === 0;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output not to have all JSON fields: ${fields.join(', ')}`
        : `Expected output to have JSON fields, but missing: ${missing.join(', ')}`,
    details: { fields, missing },
  };
}

export function toBeValidMarkdown(received: string): MatcherResult {
  const issues: string[] = [];

  // Check for unclosed code fences
  const codeFenceMatches = received.match(/```/g) ?? [];
  if (codeFenceMatches.length % 2 !== 0) {
    issues.push('Unclosed code fence (odd number of ```)');
  }

  // Check heading hierarchy (no skipping levels: h1 -> h3 without h2)
  const headings = [...received.matchAll(/^(#{1,6})\s/gm)].map((m) => m[1].length);
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] - headings[i - 1] > 1) {
      issues.push(`Heading hierarchy skip: h${headings[i - 1]} -> h${headings[i]}`);
      break;
    }
  }

  // Check for unbalanced brackets in links [text](url)
  const openBrackets = (received.match(/\[/g) ?? []).length;
  const closeBrackets = (received.match(/\]/g) ?? []).length;
  if (openBrackets !== closeBrackets) {
    issues.push(`Unbalanced brackets: ${openBrackets} [ vs ${closeBrackets} ]`);
  }

  const pass = issues.length === 0;
  return {
    pass,
    message: () =>
      pass
        ? `Expected output not to be valid markdown`
        : `Expected output to be valid markdown, but found issues: ${issues.join('; ')}`,
    details: { issues },
  };
}

export function toContainCodeBlock(received: string, language?: string): MatcherResult {
  let pass: boolean;
  let reason = '';

  if (language) {
    const pattern = new RegExp('```' + language + '\\s*\\n[\\s\\S]*?\\n```', 'i');
    pass = pattern.test(received);
    if (!pass) reason = `No code block with language "${language}" found`;
  } else {
    pass = /```[\s\S]*?```/.test(received);
    if (!pass) reason = 'No code block (```) found';
  }

  return {
    pass,
    message: () =>
      pass
        ? `Expected output not to contain a code block${language ? ` (${language})` : ''}`
        : `Expected output to contain a code block${language ? ` (${language})` : ''}: ${reason}`,
    details: { language: language ?? null, reason },
  };
}
