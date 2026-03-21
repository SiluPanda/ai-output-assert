import { luhnCheck } from '../utils/luhn';
import type { PIIPattern } from '../types';

export const DEFAULT_PII_PATTERNS: PIIPattern[] = [
  {
    type: 'email',
    pattern: /[\w.+-]+@[\w-]+\.[\w.]+/,
    label: 'Email Address',
  },
  {
    type: 'ssn',
    pattern: /\b\d{3}-\d{2}-\d{4}\b/,
    label: 'SSN',
    validate: (v) => v.replace(/-/g, '').length === 9,
  },
  {
    type: 'credit-card',
    pattern: /\b(?:\d{4}[\s-]?){3}\d{4}\b/,
    label: 'Credit Card',
    validate: (v) => luhnCheck(v.replace(/[\s-]/g, '')),
  },
  {
    type: 'phone',
    pattern: /\b(?:\+1[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}\b/,
    label: 'Phone Number',
  },
  {
    type: 'ip-address',
    pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/,
    label: 'IP Address',
    validate: (v) => v.split('.').every((n) => parseInt(n, 10) <= 255),
  },
];
