"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('types', () => {
    (0, vitest_1.it)('MatcherResult has pass, message fn, details', () => {
        const result = {
            pass: true,
            message: () => 'ok',
            details: { score: 0.9 },
        };
        (0, vitest_1.expectTypeOf)(result.pass).toBeBoolean();
        (0, vitest_1.expectTypeOf)(result.message).toBeFunction();
        (0, vitest_1.expectTypeOf)(result.details).toMatchTypeOf();
    });
    (0, vitest_1.it)('AIAssertionOptions all fields are optional', () => {
        // Should compile with empty object
        const opts = {};
        (0, vitest_1.expectTypeOf)(opts).toMatchTypeOf();
    });
    (0, vitest_1.it)('PIIMatch position is a tuple [number, number]', () => {
        const match = {
            type: 'email',
            value: 'test@example.com',
            position: [0, 16],
        };
        (0, vitest_1.expectTypeOf)(match.position).toMatchTypeOf();
    });
    (0, vitest_1.it)('ToxicWord severity union is exhaustive', () => {
        const critical = { word: 'slur', severity: 'critical' };
        const warning = { word: 'profanity', severity: 'warning' };
        const info = { word: 'mild', severity: 'info' };
        (0, vitest_1.expectTypeOf)(critical.severity).toMatchTypeOf();
        (0, vitest_1.expectTypeOf)(warning.severity).toMatchTypeOf();
        (0, vitest_1.expectTypeOf)(info.severity).toMatchTypeOf();
    });
    (0, vitest_1.it)('Tone union has 4 values', () => {
        const tones = ['formal', 'casual', 'technical', 'friendly'];
        (0, vitest_1.expectTypeOf)(tones).toMatchTypeOf();
        // All 4 values are valid
        const formal = 'formal';
        const casual = 'casual';
        const technical = 'technical';
        const friendly = 'friendly';
        (0, vitest_1.expectTypeOf)(formal).toMatchTypeOf();
        (0, vitest_1.expectTypeOf)(casual).toMatchTypeOf();
        (0, vitest_1.expectTypeOf)(technical).toMatchTypeOf();
        (0, vitest_1.expectTypeOf)(friendly).toMatchTypeOf();
    });
});
//# sourceMappingURL=types.test.js.map