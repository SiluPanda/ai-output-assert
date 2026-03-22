"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const setup_1 = require("../setup");
(0, vitest_1.describe)('setupAIAssertions', () => {
    (0, vitest_1.beforeEach)(() => {
        // Reset global options before each test
        (0, setup_1.setupAIAssertions)({});
    });
    (0, vitest_1.it)('sets global options when called with options', () => {
        const options = {
            semanticThreshold: 0.9,
            hedgingMaxRatio: 0.2,
        };
        (0, setup_1.setupAIAssertions)(options);
        const stored = (0, setup_1.getGlobalOptions)();
        (0, vitest_1.expect)(stored.semanticThreshold).toBe(0.9);
        (0, vitest_1.expect)(stored.hedgingMaxRatio).toBe(0.2);
    });
    (0, vitest_1.it)('merges options rather than replacing', () => {
        (0, setup_1.setupAIAssertions)({ semanticThreshold: 0.8 });
        (0, setup_1.setupAIAssertions)({ hedgingMaxRatio: 0.1 });
        const stored = (0, setup_1.getGlobalOptions)();
        (0, vitest_1.expect)(stored.semanticThreshold).toBe(0.8);
        (0, vitest_1.expect)(stored.hedgingMaxRatio).toBe(0.1);
    });
    (0, vitest_1.it)('can be called with no arguments', () => {
        (0, vitest_1.expect)(() => (0, setup_1.setupAIAssertions)()).not.toThrow();
    });
    (0, vitest_1.it)('can be called with empty options', () => {
        (0, vitest_1.expect)(() => (0, setup_1.setupAIAssertions)({})).not.toThrow();
    });
    (0, vitest_1.it)('stores embedFn reference', () => {
        const mockEmbed = async (text) => {
            void text;
            return [0.1, 0.2, 0.3];
        };
        (0, setup_1.setupAIAssertions)({ embedFn: mockEmbed });
        (0, vitest_1.expect)((0, setup_1.getGlobalOptions)().embedFn).toBe(mockEmbed);
    });
});
(0, vitest_1.describe)('getGlobalOptions', () => {
    (0, vitest_1.it)('returns an object', () => {
        const opts = (0, setup_1.getGlobalOptions)();
        (0, vitest_1.expect)(typeof opts).toBe('object');
        (0, vitest_1.expect)(opts).not.toBeNull();
    });
});
//# sourceMappingURL=setup.test.js.map