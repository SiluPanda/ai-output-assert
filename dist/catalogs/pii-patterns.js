"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PII_PATTERNS = void 0;
const luhn_1 = require("../utils/luhn");
exports.DEFAULT_PII_PATTERNS = [
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
        validate: (v) => (0, luhn_1.luhnCheck)(v.replace(/[\s-]/g, '')),
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
//# sourceMappingURL=pii-patterns.js.map